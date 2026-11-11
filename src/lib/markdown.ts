/** Markdown list items, one per string. */
export function bulletList(items: string[]): string[] {
  return items.map((item) => `- ${item}`);
}
