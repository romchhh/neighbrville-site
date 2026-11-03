import type { ReactNode } from "react";

const HEADING_IDS: Record<string, string> = {
  "SUMMARY OF KEY POINTS": "summary",
  "TABLE OF CONTENTS": "toc",
  "1. WHAT INFORMATION DO WE COLLECT?": "infocollect",
  "Personal information you disclose to us": "personalinfo",
  "Google API": "googleapi",
  "2. HOW DO WE PROCESS YOUR INFORMATION?": "infouse",
  "3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?":
    "legalbases",
  "4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?": "whoshare",
  "5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?": "cookies",
  "Google Analytics": "google-analytics",
  "6. HOW DO WE HANDLE YOUR SOCIAL LOGINS?": "sociallogins",
  "7. HOW LONG DO WE KEEP YOUR INFORMATION?": "inforetain",
  "8. DO WE COLLECT INFORMATION FROM MINORS?": "infominors",
  "9. WHAT ARE YOUR PRIVACY RIGHTS?": "privacyrights",
  "Account Information": "accountinfo",
  "10. CONTROLS FOR DO-NOT-TRACK FEATURES": "DNT",
  "11. DO WE MAKE UPDATES TO THIS NOTICE?": "inforevise",
  "12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?": "contact",
  "13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?":
    "request",
};

function slugify(text: string) {
  return (
    HEADING_IDS[text] ??
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text))) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    const href = match[2].trim();
    const label = match[1];
    const external = href.startsWith("http") || href.startsWith("mailto:");
    nodes.push(
      <a
        key={`a-${key++}`}
        href={href}
        className="underline decoration-white/50 underline-offset-[3px] transition-opacity hover:opacity-80"
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {label}
      </a>,
    );
    last = match.index + match[0].length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function PrivacyMarkdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (!listItems.length) return;
    blocks.push(
      <ul
        key={`ul-${key++}`}
        className="my-4 list-disc space-y-2 pl-5 marker:text-white"
      >
        {listItems.map((item, index) => (
          <li
            key={`li-${key}-${index}`}
            className="font-inter text-[15px] leading-[1.45] text-white sm:text-[16px]"
          >
            {renderInline(item)}
          </li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    if (trimmed.startsWith("- ")) {
      listItems.push(trimmed.slice(2).trim());
      continue;
    }

    flushList();

    if (trimmed.startsWith("# ")) {
      const text = trimmed.slice(2).trim();
      blocks.push(
        <h1
          key={`h1-${key++}`}
          className="font-playfair text-[clamp(2.4rem,7vw,64px)] font-normal uppercase leading-[0.9] tracking-[-0.045em] text-white"
        >
          {text}
        </h1>,
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      const text = trimmed.slice(3).trim();
      const id = slugify(text);
      blocks.push(
        <h2
          key={`h2-${key++}`}
          id={id}
          className="scroll-mt-[calc(var(--header-space)+1rem)] pt-10 font-playfair text-[clamp(1.45rem,3.5vw,28px)] font-normal uppercase leading-[1.05] tracking-[-0.04em] text-white first:pt-0"
        >
          {text}
        </h2>,
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      const text = trimmed.slice(4).trim();
      const id = slugify(text);
      blocks.push(
        <h3
          key={`h3-${key++}`}
          id={id}
          className="scroll-mt-[calc(var(--header-space)+1rem)] pt-6 font-inter text-[13px] font-medium uppercase tracking-[0.03em] text-white"
        >
          {text}
        </h3>,
      );
      continue;
    }

    if (trimmed.startsWith("Last updated")) {
      blocks.push(
        <p
          key={`meta-${key++}`}
          className="mt-4 font-inter text-[12px] uppercase tracking-[0.04em] text-white"
        >
          {trimmed}
        </p>,
      );
      continue;
    }

    if (trimmed.startsWith("In Short:")) {
      blocks.push(
        <p
          key={`short-${key++}`}
          className="mt-3 font-inter text-[15px] italic leading-[1.45] text-white sm:text-[16px]"
        >
          {renderInline(trimmed)}
        </p>,
      );
      continue;
    }

    blocks.push(
      <p
        key={`p-${key++}`}
        className="mt-3 font-inter text-[15px] leading-[1.45] text-white sm:text-[16px]"
      >
        {renderInline(trimmed)}
      </p>,
    );
  }

  flushList();
  return <div className="privacy-doc w-full">{blocks}</div>;
}
