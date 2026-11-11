// Checks the Markdown source of every post in src/content/posts against README "Post format": rules the built HTML
// can no longer show, such as a code block without a language. Exits 1 on any failure.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Longest line inside a code block, so it fits a desktop page without scrolling. */
const MAX_CODE_LINE = 80;

const dir = new URL('../src/content/posts/', import.meta.url).pathname;
const failures = [];

for (const file of readdirSync(dir).filter((name) => name.endsWith('.md'))) {
  const lines = readFileSync(join(dir, file), 'utf8').split('\n');
  let inCode = false;

  lines.forEach((line, index) => {
    const where = `src/content/posts/${file}:${index + 1}`;
    const fence = line.match(/^```(\S*)/);
    if (fence) {
      if (!inCode && !fence[1]) failures.push(`${where}: code block needs a language, such as \`\`\`ts, or \`\`\`text for output`);
      inCode = !inCode;
      return;
    }
    if (inCode && line.length > MAX_CODE_LINE) failures.push(`${where}: code line is ${line.length} characters, over ${MAX_CODE_LINE}`);
    if (!inCode && /^# /.test(line)) failures.push(`${where}: a post has no \`#\` heading; the title comes from the frontmatter`);
  });

  if (inCode) failures.push(`src/content/posts/${file}: a code block is never closed`);
}

if (failures.length) {
  console.error(`check-posts: ${failures.length} problem(s)\n\n${failures.map((failure) => `  - ${failure}`).join('\n')}`);
  process.exit(1);
}
console.log('check-posts: every post OK');
