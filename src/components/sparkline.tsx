export function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(1, ...values);

  return (
    <div className="flex h-10 items-end gap-1">
      {values.map((v, i) => {
        const isLast = i === values.length - 1;
        const height = Math.max(4, (v / max) * 100);
        return (
          <div key={i} className="group relative h-full flex-1">
            <span className="pointer-events-none absolute -top-6 left-1/2 z-10 -translate-x-1/2 rounded-md bg-foreground px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-background opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
              {Math.round(v)}
            </span>
            <div
              className="absolute bottom-0 w-full rounded-full transition-all"
              style={{
                height: `${height}%`,
                backgroundColor: isLast ? color : `${color}26`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
