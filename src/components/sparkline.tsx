export function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(1, ...values);

  return (
    <div className="flex h-10 items-end gap-1">
      {values.map((v, i) => {
        const isLast = i === values.length - 1;
        const height = Math.max(4, (v / max) * 100);
        return (
          <div
            key={i}
            className="flex-1 rounded-full transition-all"
            style={{
              height: `${height}%`,
              backgroundColor: isLast ? color : `${color}26`,
            }}
          />
        );
      })}
    </div>
  );
}
