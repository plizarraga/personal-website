export type JsonLd = Record<string, unknown>;

/** Serializes JSON-LD for a `<script>` tag, escaping `<` so the content cannot close the tag. */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
