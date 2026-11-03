export type JoinRole = "neighbr" | "partner";
export type JoinStep = "waitlist" | "profile";

export const INTERESTS = [
  "Clay & Ceramics",
  "Culinary & Food Culture",
  "Movement & Dance",
  "Music & Performance",
  "Visual Arts & Illustration",
  "Outdoors & Nature",
  "Repair & Sustainability",
] as const;

export const LANGUAGES = [
  "English",
  "Spanish",
  "Portuguese",
  "French",
  "German",
] as const;

export const CATEGORIES = INTERESTS;

export function isValidEmail(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export function shareJoinInvite(role: JoinRole) {
  const url = window.location.href;
  const text =
    role === "neighbr"
      ? "Join me on NeighbrVille — find your people, feel at home."
      : "I’m joining NeighbrVille as a founding host/partner. Come build with us.";

  if (navigator.share) {
    void navigator.share({ title: "NeighbrVille", text, url }).catch(() => {});
    return;
  }
  if (navigator.clipboard) {
    void navigator.clipboard.writeText(url);
  }
}

function readScrollInset(node: HTMLElement) {
  const root = getComputedStyle(document.documentElement);
  const nodeStyle = getComputedStyle(node);

  const paddingTop = Number.parseFloat(root.scrollPaddingTop);
  const marginTop = Number.parseFloat(nodeStyle.scrollMarginTop);

  return {
    paddingTop: Number.isFinite(paddingTop) ? paddingTop : 0,
    marginTop: Number.isFinite(marginTop) ? marginTop : 0,
  };
}

/** Scroll a join target into view with header / scroll-margin aware alignment. */
export function scrollToJoinPanel(
  node: HTMLElement | null,
  options?: {
    focus?: boolean;
    align?: "form" | "panel-top" | "nearest";
    behavior?: ScrollBehavior;
  },
) {
  if (!node) return;

  const align = options?.align ?? "form";
  const behavior = options?.behavior ?? "smooth";

  const run = () => {
    if (align === "nearest") {
      node.scrollIntoView({ block: "nearest", behavior });
    } else {
      const { paddingTop, marginTop } = readScrollInset(node);
      const rect = node.getBoundingClientRect();
      const top = rect.top + window.scrollY - paddingTop - marginTop;
      window.scrollTo({ top: Math.max(0, top), behavior });
    }

    if (!options?.focus) return;

    const focusable = node.querySelector<HTMLElement>(
      'input:not([type="hidden"]), textarea, select, button[type="submit"]',
    );
    focusable?.focus({ preventScroll: true });
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(run);
  });
}
