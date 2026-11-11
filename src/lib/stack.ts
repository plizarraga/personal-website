/** A stack entry this long is an explanation, not a technology name. */
const MAX_TECH_NAME_LENGTH = 24;

/** Plain technology names from a case study stack, skipping long explanatory entries such as a list of model providers. */
export function techNames(stack: string[]): string[] {
  return stack.filter((item) => item.length < MAX_TECH_NAME_LENGTH);
}
