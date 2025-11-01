"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import type { ExtraProps } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Renders markdown content with support for:
 * - Headings (# ## ###)
 * - Bullet points (- *)
 * - Line breaks (preserved)
 * - Bold (**text**)
 * - Italic (*text*)
 * - And other standard markdown features
 */
export default function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  const components: Components = useMemo(() => ({
    // Style headings - responsive sizes
    h1: ({ ...props }) => (
      <h1 className="text-lg md:text-xl font-bold mt-3 mb-2 text-slate-900" {...props} />
    ),
    h2: ({ ...props }) => (
      <h2 className="text-base md:text-lg font-semibold mt-3 mb-2 text-slate-900" {...props} />
    ),
    h3: ({ ...props }) => (
      <h3 className="text-sm md:text-base font-semibold mt-2 mb-1 text-slate-900" {...props} />
    ),
    // Style paragraphs with proper spacing
    p: ({ ...props }) => (
      <p className="mb-2 last:mb-0 text-slate-700" {...props} />
    ),
    // Style lists with better spacing
    ul: ({ ...props }) => (
      <ul className="list-disc list-outside mb-2 space-y-1 ml-4 pl-2" {...props} />
    ),
    ol: ({ ...props }) => (
      <ol className="list-decimal list-outside mb-2 space-y-1 ml-4 pl-2" {...props} />
    ),
    li: ({ ...props }) => (
      <li className="pl-1 text-slate-700" {...props} />
    ),
    // Style inline elements
    strong: ({ ...props }) => (
      <strong className="font-semibold text-slate-900" {...props} />
    ),
    em: ({ ...props }) => (
      <em className="italic" {...props} />
    ),
    // Style code blocks
    code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement> & ExtraProps) => {
      const isInline = !className || !className.includes("language-");
      return isInline ? (
        <code
          className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono"
          {...(props as React.HTMLAttributes<HTMLElement>)}
        >
          {children}
        </code>
      ) : (
        <code
          className="block bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto"
          {...(props as React.HTMLAttributes<HTMLElement>)}
        >
          {children}
        </code>
      );
    },
    // Preserve line breaks
    br: ({ ...props }) => <br {...props} />,
  }), []);

  const markdownContent = useMemo(() => {
    if (!content || typeof content !== "string") {
      return "";
    }
    // Simple HTML entity unescaping (common cases)
    let processed = content.trim();
    // Only run this on client side
    if (typeof window !== "undefined" && (processed.includes("&lt;") || processed.includes("&gt;") || processed.includes("&amp;"))) {
      const textarea = document.createElement("textarea");
      textarea.innerHTML = processed;
      processed = textarea.value;
    }
    return processed;
  }, [content]);

  if (!markdownContent) {
    return null;
  }

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        components={components}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
}

