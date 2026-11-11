---
title: Replacing a state machine with a guarded AI agent
summary: I rewrote a WhatsApp booking bot from a state machine to an agent with guarded tools. What it cost in latency and tokens, and what broke.
published: '2026-11-11'
caseStudy: ai-appointment-agent
tags:
  - AI agents
  - Vercel AI SDK
  - TypeScript
  - Cloudflare Workers
  - LLM evals
---

I am building a WhatsApp agent for a dental clinic. It answers questions about the clinic and books, moves, and cancels appointments. The first version was a state machine where the model never touched a tool. Two days later I replaced it with an agent loop. This post covers why, what "guarded" means in the code, what it cost in latency and tokens, and the mistakes it led to.

The repository is private because it holds the clinic's data, so the code below is translated from the original and the numbers come from the project's decision records and benchmark runs.

## Version 1: the code decides, the model only reads

Anthropic's guide "Building effective agents" separates *workflows*, where code orchestrates the model, from *agents*, where the model directs its own process, and recommends starting with the simplest thing that works. For a bot that books real appointments, I chose a workflow:

- The model only classified and extracted, with structured output and a closed schema. It never received tools, SQL, or data access.
- The code decided the next state and ran every action, only after the contact confirmed, with an atomic write.
- Every data access was filtered by the phone number from the signed webhook.

The tradeoffs were clear when I wrote them down:

| | Agent with tools | State machine |
| --- | --- | --- |
| Who picks the next step | The model | The code |
| Testing | Hard, not deterministic | Fixed, reproducible cases |
| Attack surface | A prompt injection can trigger tools | The model runs nothing |
| Model calls per turn | Several | One or two |

It was predictable and cheap: one or two model calls per turn, and no tool a prompt injection could reach.

## What broke it

Every new situation in a conversation needed new code. The first states were the expected ones (booking, cancelling), and soon there were states for saying goodbye, abandoning a flow halfway, and urgent requests. Booking alone had its own edge cases: options still pending from an earlier message, choosing a location, a contact who answers "the cheaper one" instead of picking from the list. Each fix was another branch.

At the same time the product changed. It stopped being a dental clinic bot and became a customer-service agent for any small business, with a panel where staff take over what the agent cannot solve. Adapting a state machine to a new business means writing new states. I wanted a new business to be mostly data: services, schedules, knowledge, and tone.

## Three options

| Option | Who decides | Result |
| --- | --- | --- |
| State machine | The code | Predictable and cheap; rigid with mixed conversations |
| Agent with free tools | The model | Natural, but the rules live in the prompt, and an injection can trigger effects |
| Agent with guarded tools | The model leads, the code enforces | Natural, and effects stay under the code's control |

I picked the third. The model leads the conversation and chooses actions from a closed catalog of tools. Anything with an effect or a risk is enforced by code.

## What "guarded" means in code

**Identity never comes from the model.** Each tool receives a context that the code builds from the signed webhook. Tool input schemas are strict, so an undeclared argument such as `identity` rejects the call.

```ts
/**
 * What the code hands to every tool.
 * It never comes from the model's arguments.
 */
interface ToolContext {
  /** The contact, set by the code from the signed webhook. */
  identity: string;
  /**
   * This turn's id. Offers store it, so a confirmation
   * must arrive in a later turn.
   */
  turn: string;
  now: Date;
  signal: AbortSignal;
  requestHandoff(reason?: string, message?: string): void;
}

/**
 * What a tool with an effect must declare:
 * which offer it validates and how it is confirmed.
 */
interface ToolEffect {
  validates: string;
  confirmedBy: string;
}
```

**Effects only act on what the code offered.** A booking tool can only book a time slot from the current offer in this conversation, and only after the contact confirmed it in a later message. The code checks both, and the write is atomic. The catalog refuses to start if a tool with an effect does not say what it validates:

```ts
const { effect } = tool;
if (effect && !(effect.validates.trim() && effect.confirmedBy.trim())) {
  throw new Error(
    `Tool "${name}": declare what its effect validates and how it is confirmed`,
  );
}
```

**Policies run before the model.** The message limit, conduct, handoff to a person, pausing a conversation, and a global shutdown are decided in code without asking the model.

**Guards run after the model.** A reply is blocked if it states a price that is not in the business data, repeats an earlier message word for word, shows internal notes, or leaks the prompt.

**Every turn has limits:** 5 steps of the tool loop, 12,000 tokens, and 30 seconds.

The loop, the output guards, the first benchmark, and the removal of the state machine all landed on the same day. The state machine had lasted two days.

## What it cost

I measured three setups with the same 6 messages (18 turns), through OpenRouter, with `google/gemini-3.1-flash-lite` as the fast classifier and `openai/gpt-4.1-mini` as the main model. "Loop only" is a reference agent with no classifier; "full engine" is the real one, with the classifier and the policies in front of the loop.

| Per turn | State machine | Loop only | Full engine |
| --- | --- | --- | --- |
| p50 latency (ms) | 2,187 | 2,139 | 2,844 |
| p95 latency (ms) | 2,975 | 3,165 | 6,096 |
| Model calls | 1.8 | 1.8 | 2.8 |
| Input tokens | 3,225 | 1,109 | 2,137 |
| Output tokens | 81 | 60 | 91 |

The full engine was 1.3 times slower than the state machine at p50, and used about two thirds of its input tokens. With only 18 turns, p95 moves a lot between runs, so I read it as a warning, not a fact.

Most of the extra latency came from one place. The classifier that runs before the loop took 1,102 ms, about 39% of p50 latency and 43% of input tokens. Once the model leads the conversation, the classifier no longer routes anything; it only detects aggression, threats, and requests for a person. I kept it anyway:

- Replacing it with keywords would be faster, but it loses aggression and threat detection.
- Running it in parallel with the loop saves the time, but the loop could act before the code knows how the contact is behaving, which breaks the rule that policies come first.

One more second per turn is hard to notice on WhatsApp. If it starts to matter in production, the next thing to try is running both in parallel, with the tools that have effects waiting for the classifier's answer.

The numbers expire with every model change, so they get measured again at the end of each phase.

## What I got wrong

**A token limit that cut turns in half.** The first limit was 6,000 tokens per turn. Each call to the model resends the whole prompt, about 2,000 input tokens with the booking tools, so 6,000 tokens fit about 3 of the 5 allowed steps. Moving an appointment takes more: look up the contact's appointments, offer new times, move. The move was saved in the database, and then the turn ran out of tokens before the reply, so the contact got a generic fallback message. Between 85% and 90% of those input tokens came from the provider's cache, but the limit counted them in full.

The eval for moving an appointment passed 0 of 8 runs. Switching to `anthropic/claude-haiku-5.5` also gave 0 of 8, so it was not the model. Raising the limit to 12,000 got 1 of 8. Rewriting the prompt got 3 and 4 of 8. A separate tool for offering new times, which requires the id of the appointment being moved, got 7 and 6 of 8. A hint inside the tool result did not help, and I reverted it.

**A guard that blocked a normal verb.** The prompt-leak guard blocked any reply that contained a tool name as a word. One tool was called `reservar`, which is the Spanish verb "to book". Every reply that asked "do you want to book the 10:00 slot?" was blocked, and the contact got the fallback message in the middle of a booking. The evals caught it: two booking cases passed 7 of 10 and 9 of 10 runs, and every failure was that guard. Now the guard only checks compound names with an underscore, such as `consultar_disponibilidad` ("check availability").

**Booking through the model was fragile.** The booking engine worked from end to end in staging, but the conversation around it did not. Three separate bugs came from the same place. The history the model receives is plain text, so the ids of the offered time slots do not reach the next turn, and the model has to pick the right tool, carry the offer over, and not look it up again. Each fix added a prompt rule or more state, and the next case failed again.

So I made another decision: booking moves out of the model. Each time slot becomes a row in a WhatsApp list message, and tapping it books the appointment in code, without calling the model. The model keeps the conversation and can only look things up and ask the code to send an offer. That decision is recorded and planned; it is not built yet.

## What I would do again

I would start with the state machine again. It was cheap to build, it showed exactly where the rigid parts hurt, and its guards, conduct policy, and per-conversation queue moved to the new version almost unchanged.

The lesson is not "agents beat state machines". The model is good at understanding mixed, messy messages. Code is better at anything that writes to the database. The agent now leads the conversation, and the steps with real effects are going back to deterministic code.
