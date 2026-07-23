interface Props {
  masteredRatio: number;
  last7: { date: string; acc: number }[];
}

export default function ProgressCharts({ masteredRatio, last7 }: Props) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const off = c * (1 - masteredRatio);
  const max = Math.max(1, ...last7.map((d) => d.acc));

  return (
    <div className="charts">
      <div className="chart">
        <svg viewBox="0 0 140 140" width="150" height="150" role="img" aria-label="已掌握比例">
          <circle cx="70" cy="70" r={r} fill="none" stroke="#e5e7eb" strokeWidth="14" />
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke="#2563eb"
            strokeWidth="14"
            strokeDasharray={c}
            strokeDashoffset={off}
            transform="rotate(-90 70 70)"
            strokeLinecap="round"
          />
          <text x="70" y="66" textAnchor="middle" fontSize="22" fontWeight="700" fill="#111">
            {Math.round(masteredRatio * 100)}%
          </text>
          <text x="70" y="86" textAnchor="middle" fontSize="11" fill="#666">
            已掌握
          </text>
        </svg>
      </div>

      <div className="chart bars" aria-label="近7天正确率">
        {last7.map((d, i) => (
          <div className="bar-col" key={i}>
            <div
              className="bar"
              style={{ height: `${(d.acc / max) * 100}%`, background: d.acc >= 60 ? '#2563eb' : '#f59e0b' }}
            />
            <span className="bar-lb">{d.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
