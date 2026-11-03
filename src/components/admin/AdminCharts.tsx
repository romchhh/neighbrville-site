import styles from "./AdminCharts.module.css";

type Point = { label: string; value: number };

export function AreaChart({ data }: { data: Point[] }) {
  const width = 640;
  const height = 220;
  const padding = 24;
  if (data.length === 0) {
    return <p className={styles.empty}>No data yet</p>;
  }

  const max = Math.max(...data.map((point) => point.value), 1);
  const min = 0;
  const range = max - min || 1;
  const divisor = Math.max(data.length - 1, 1);

  const points = data.map((point, index) => {
    const x = padding + (index / divisor) * (width - padding * 2);
    const y =
      height - padding - ((point.value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const area = `${padding},${height - padding} ${points.join(" ")} ${width - padding},${height - padding}`;
  const line = points.join(" ");

  return (
    <div className={styles.chart}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={styles.svg}
        role="img"
        aria-label="Visits chart"
      >
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(43, 26, 18, 0.35)" />
            <stop offset="100%" stopColor="rgba(43, 26, 18, 0)" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((lineIndex) => {
          const y = padding + (lineIndex / 3) * (height - padding * 2);
          return (
            <line
              key={lineIndex}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              className={styles.gridLine}
            />
          );
        })}
        <polygon points={area} fill="url(#areaFill)" />
        <polyline points={line} className={styles.line} />
        {data.map((point, index) => {
          const x = padding + (index / divisor) * (width - padding * 2);
          const y =
            height -
            padding -
            ((point.value - min) / range) * (height - padding * 2);
          return (
            <circle
              key={point.label}
              cx={x}
              cy={y}
              r="5"
              className={styles.dot}
            />
          );
        })}
      </svg>
      <div className={styles.labels}>
        {data.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  );
}

export function DonutChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    return <p className={styles.empty}>No events yet</p>;
  }

  const colors = ["#2b1a12", "#8b6b55", "#c4a484", "#5cff9a"];

  const segments = data.reduce<
    Array<{
      label: string;
      value: number;
      percent: number;
      color: string;
      offset: number;
    }>
  >((acc, item, index) => {
    const percent = (item.value / total) * 100;
    const offset = acc.reduce((sum, segment) => sum + segment.percent, 0);
    acc.push({
      ...item,
      percent,
      color: colors[index % colors.length],
      offset,
    });
    return acc;
  }, []);

  const gradient = `conic-gradient(${segments
    .map(
      (segment) =>
        `${segment.color} ${segment.offset}% ${segment.offset + segment.percent}%`,
    )
    .join(", ")})`;

  return (
    <div className={styles.donutWrap}>
      <div className={styles.donut} style={{ background: gradient }}>
        <div className={styles.donutHole}>
          <strong>{total}</strong>
          <span>events</span>
        </div>
      </div>
      <div className={styles.legend}>
        {segments.map((segment) => (
          <div key={segment.label} className={styles.legendItem}>
            <span style={{ background: segment.color }} />
            <span>{segment.label}</span>
            <strong>{segment.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
