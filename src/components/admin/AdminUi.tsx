import styles from "./AdminUi.module.css";

type StatCardProps = {
  label: string;
  value: string;
  delta: string;
  hint: string;
  trend?: "up" | "down" | "neutral";
};

export function StatCard({
  label,
  value,
  delta,
  hint,
  trend = "neutral",
}: StatCardProps) {
  return (
    <article className={styles.statCard}>
      <p className={styles.statLabel}>{label}</p>
      <div className={styles.statRow}>
        <strong className={styles.statValue}>{value}</strong>
        <span className={`${styles.statDelta} ${styles[`trend_${trend}`]}`}>
          {delta}
        </span>
      </div>
      <p className={styles.statHint}>{hint}</p>
    </article>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={styles.pageHeader}>
      <div>
        <h2 className={styles.pageHeaderTitle}>{title}</h2>
        <p className={styles.pageHeaderLead}>{description}</p>
      </div>
      {action ? <div className={styles.pageHeaderAction}>{action}</div> : null}
    </div>
  );
}

export function AdminCard({
  title,
  subtitle,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`${styles.card} ${className ?? ""}`}>
      {title ? (
        <header className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>{title}</h3>
            {subtitle ? <p className={styles.cardSubtitle}>{subtitle}</p> : null}
          </div>
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`${styles.badge} ${styles[`badge_${status}`] ?? ""}`}>
      {statusLabel(status)}
    </span>
  );
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    new: "Incomplete",
    completed: "Complete",
    neighbr: "Neighbr",
    partner: "Partner",
  };
  return map[status] ?? status;
}

type BtnProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
};

export function GhostButton({
  children,
  onClick,
  disabled,
  type = "button",
}: BtnProps) {
  return (
    <button
      type={type}
      className={styles.ghostBtn}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: BtnProps) {
  return (
    <button
      type={type}
      className={styles.primaryBtn}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function DangerButton({
  children,
  onClick,
  disabled,
  type = "button",
}: BtnProps) {
  return (
    <button
      type={type}
      className={styles.dangerBtn}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function DeleteIconButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v6M14 11v6" />
      </svg>
    </button>
  );
}

export function CopyIconButton({
  label,
  onClick,
  disabled,
  copied,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  copied?: boolean;
}) {
  return (
    <button
      type="button"
      className={styles.iconBtn}
      aria-label={copied ? "Copied" : label}
      title={copied ? "Copied" : label}
      onClick={onClick}
      disabled={disabled}
    >
      {copied ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
      )}
    </button>
  );
}
