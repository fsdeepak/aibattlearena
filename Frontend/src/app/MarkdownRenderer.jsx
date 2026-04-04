import { useState } from "react";

/** Minimal syntax highlighter for JS code */
function highlightJS(code) {
  const keywords = /\b(function|return|const|let|var|if|else|for|while|new|typeof|undefined|null|true|false|class|extends|import|export|default|async|await|of|in|do|break|continue|switch|case|throw|try|catch|finally)\b/g;
  const strings  = /(["'`])(?:(?=(\\?))\2.)*?\1/g;
  const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
  const numbers  = /\b(\d+\.?\d*)\b/g;
  const fnCalls  = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g;

  // Escape HTML first
  let result = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Apply in order (comments > strings > keywords > numbers > fns)
  const placeholders = [];
  const ph = (html) => { const i = placeholders.length; placeholders.push(html); return `\x00PH${i}\x00`; };

  // Comments
  result = result.replace(comments, (m) => ph(`<span class="cm">${m}</span>`));
  // Strings
  result = result.replace(strings, (m) => ph(`<span class="str">${m}</span>`));
  // Keywords
  result = result.replace(keywords, (m) => ph(`<span class="kw">${m}</span>`));
  // Numbers
  result = result.replace(numbers, (m) => ph(`<span class="nm">${m}</span>`));
  // Function calls
  result = result.replace(fnCalls, (_, name) => {
    if (["function","return","if","while","for","typeof"].includes(name)) return _;
    return ph(`<span class="fn">${name}</span>`) + "";
  });

  // Restore placeholders
  placeholders.forEach((html, i) => { result = result.replace(`\x00PH${i}\x00`, html); });
  return result;
}

function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const highlighted = lang === "javascript" || lang === "js"
    ? highlightJS(code)
    : code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return (
    <div className="code-block-wrap">
      <div className="code-block-header">
        <span className="code-lang-tag">{lang || "code"}</span>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre
        className="code-block-body"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  );
}

/**
 * Very lightweight markdown-to-JSX renderer.
 * Handles: headings, bold, italic, code blocks, inline code, lists, paragraphs.
 */
export function MarkdownRenderer({ content }) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements = [];
  let i = 0;
  let key = 0;

  function parseInline(text) {
    // Bold **text**
    text = text.replace(/\*\*(.+?)\*\*/g, (_, t) => `<strong>${t}</strong>`);
    // Italic *text*
    text = text.replace(/\*(.+?)\*/g, (_, t) => `<em>${t}</em>`);
    // Inline code `code`
    text = text.replace(/`([^`]+)`/g, (_, c) =>
      `<code>${c.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>`
    );
    return text;
  }

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim().toLowerCase();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(<CodeBlock key={key++} lang={lang} code={codeLines.join("\n")} />);
      i++;
      continue;
    }

    // Headings
    const hMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (hMatch) {
      const level = hMatch[1].length;
      const text = hMatch[2];
      const Tag = `h${Math.min(level + 1, 6)}`;
      elements.push(
        <Tag key={key++} dangerouslySetInnerHTML={{ __html: parseInline(text) }} />
      );
      i++;
      continue;
    }

    // Unordered list item
    if (/^[-*]\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(
          <li key={i} dangerouslySetInnerHTML={{ __html: parseInline(lines[i].slice(2)) }} />
        );
        i++;
      }
      elements.push(<ul key={key++}>{items}</ul>);
      continue;
    }

    // Blank line
    if (line.trim() === "") { i++; continue; }

    // Paragraph
    const paraLines = [];
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#") && !lines[i].startsWith("```") && !/^[-*]\s/.test(lines[i])) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length) {
      elements.push(
        <p key={key++} dangerouslySetInnerHTML={{ __html: parseInline(paraLines.join(" ")) }} />
      );
    }
  }

  return <div className="md-content">{elements}</div>;
}
