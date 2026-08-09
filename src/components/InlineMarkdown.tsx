import { Fragment, type ReactNode } from "react";

/**
 * Renders inline markdown emphasis (`*text*` and `**text**`) as bold,
 * React-style, without `dangerouslySetInnerHTML`. Data is trusted.
 */
export function InlineMarkdown({ text }: { text: string }): ReactNode {
  if (!text) return null;

  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return (
    <>
      {tokens.map((token, i) => {
        if (token.startsWith("**") && token.endsWith("**") && token.length > 4) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {token.slice(2, -2)}
            </strong>
          );
        }
        if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {token.slice(1, -1)}
            </strong>
          );
        }
        return <Fragment key={i}>{token}</Fragment>;
      })}
    </>
  );
}
