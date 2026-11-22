import React from 'react';
import { getFontCss } from '../data/siteContent';

interface RichTextRendererProps {
  text?: string;
  inline?: boolean;
  className?: string;
}

function sanitizeHref(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#')
  ) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function parseInlineTokens(text: string, keyPrefix: string): React.ReactNode[] {
  const tokenRegex =
    /(\*\*[^*]+\*\*|\*[^*\n]+\*|__[^_]+__|\[color=(#[0-9a-fA-F]{3,8})\]([\s\S]*?)\[\/color\]|\[font=([a-zA-Z0-9_-]+)\]([\s\S]*?)\[\/font\]|\[size=(sm|md|lg|xl)\]([\s\S]*?)\[\/size\]|\[link=([^\]]+)\]([\s\S]*?)\[\/link\])/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const full = match[0];
    const key = `${keyPrefix}-${idx++}`;

    if (full.startsWith('**') && full.endsWith('**')) {
      nodes.push(
        <strong key={key} className="font-extrabold">
          {parseInlineTokens(full.slice(2, -2), key)}
        </strong>
      );
    } else if (full.startsWith('__') && full.endsWith('__')) {
      nodes.push(
        <u key={key} className="underline underline-offset-4">
          {parseInlineTokens(full.slice(2, -2), key)}
        </u>
      );
    } else if (full.startsWith('*') && full.endsWith('*')) {
      nodes.push(
        <em key={key} className="italic">
          {parseInlineTokens(full.slice(1, -1), key)}
        </em>
      );
    } else if (match[2] && match[3] !== undefined) {
      nodes.push(
        <span key={key} style={{ color: match[2] }}>
          {parseInlineTokens(match[3], key)}
        </span>
      );
    } else if (match[4] && match[5] !== undefined) {
      const cssFamily = getFontCss(match[4]);
      nodes.push(
        <span key={key} style={cssFamily ? { fontFamily: cssFamily } : undefined}>
          {parseInlineTokens(match[5], key)}
        </span>
      );
    } else if (match[6] && match[7] !== undefined) {
      const sizeClass =
        match[6] === 'sm'
          ? 'text-xs'
          : match[6] === 'lg'
            ? 'text-lg'
            : match[6] === 'xl'
              ? 'text-xl font-bold'
              : 'text-base';
      nodes.push(
        <span key={key} className={sizeClass}>
          {parseInlineTokens(match[7], key)}
        </span>
      );
    } else if (match[8] && match[9] !== undefined) {
      const safeHref = sanitizeHref(match[8]);
      if (safeHref) {
        nodes.push(
          <a
            key={key}
            href={safeHref}
            target={safeHref.startsWith('http') ? '_blank' : undefined}
            rel={safeHref.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="text-pink-600 underline font-semibold hover:text-purple-700"
          >
            {parseInlineTokens(match[9], key)}
          </a>
        );
      } else {
        nodes.push(parseInlineTokens(match[9], key));
      }
    } else {
      nodes.push(full);
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export default function RichTextRenderer({ text = '', inline = false, className = '' }: RichTextRendererProps) {
  if (!text) return null;

  if (inline) {
    return <span className={className}>{parseInlineTokens(text, 'inline')}</span>;
  }

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = (keyBase: string) => {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul key={`list-${keyBase}`} className="list-disc pl-5 space-y-1.5 my-2">
        {listBuffer.map((item, i) => (
          <li key={`li-${keyBase}-${i}`}>{parseInlineTokens(item, `li-${keyBase}-${i}`)}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  lines.forEach((rawLine, lineIdx) => {
    const trimmed = rawLine.trim();

    if (trimmed === '---') {
      flushList(String(lineIdx));
      elements.push(<hr key={`hr-${lineIdx}`} className="my-4 border-pink-200" />);
      return;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      listBuffer.push(trimmed.slice(2));
      return;
    }

    flushList(String(lineIdx));

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h4 key={`h-${lineIdx}`} className="text-lg sm:text-xl font-black tracking-tight mt-3 mb-1">
          {parseInlineTokens(trimmed.slice(3), `h-${lineIdx}`)}
        </h4>
      );
      return;
    }

    if (!trimmed) {
      elements.push(<div key={`sp-${lineIdx}`} className="h-2" />);
      return;
    }

    elements.push(
      <p key={`p-${lineIdx}`} className="leading-relaxed">
        {parseInlineTokens(rawLine, `p-${lineIdx}`)}
      </p>
    );
  });

  flushList('end');

  return <div className={`space-y-1.5 ${className}`}>{elements}</div>;
}
