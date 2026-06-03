import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const theme: Record<string, React.CSSProperties> = {
  'code[class*="language-"]': {
    color: "#e8e8e8",
    background: "#080808",
    fontFamily: "var(--font-mono)",
    fontSize: "0.78rem",
    lineHeight: "1.55",
  },
  'pre[class*="language-"]': {
    color: "#e8e8e8",
    background: "#080808",
    fontFamily: "var(--font-mono)",
    fontSize: "0.78rem",
    margin: 0,
    padding: "16px",
    overflow: "auto",
  },
  property: { color: "#e8e8e8" },
  string: { color: "#e8ff47" },
  number: { color: "#ff9f43" },
  boolean: { color: "#ff4757" },
  null: { color: "#888888" },
  punctuation: { color: "#444444" },
  operator: { color: "#444444" },
  comment: { color: "#444444", fontStyle: "italic" },
};

export function CodeBlock({ value, language = "json" }: { value: string; language?: string }) {
  return (
    <SyntaxHighlighter
      language={language}
      style={theme}
      showLineNumbers
      lineNumberStyle={{
        color: "#444444",
        fontSize: "0.7rem",
        paddingRight: "12px",
        minWidth: "2.2em",
      }}
      wrapLongLines={false}
    >
      {value}
    </SyntaxHighlighter>
  );
}
