type BadgeKey = "Popular" | "Top Rated" | "New" | "Best Value" | "Low Stock";

const badgeStyles: Record<BadgeKey, string> = {
  Popular: "bg-orange-50 text-orange-700 [&_.dot]:bg-orange-500",
  "Top Rated": "bg-success-soft text-green-700 [&_.dot]:bg-success",
  New: "bg-primary-light text-primary-dark [&_.dot]:bg-primary",
  "Best Value": "bg-violet-50 text-violet-700 [&_.dot]:bg-violet-500",
  "Low Stock": "bg-destructive-soft text-destructive [&_.dot]:bg-destructive",
};

export function Badge({ text }: { text: string }) {
  const isSave = /^Save\s/i.test(text);
  const cls = isSave
    ? "bg-success-soft text-green-700 [&_.dot]:bg-success"
    : (badgeStyles[text as BadgeKey] ??
      "bg-muted text-muted-foreground [&_.dot]:bg-muted-foreground");
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] font-bold tracking-wide ${cls}`}
    >
      <span className="dot inline-block h-[5px] w-[5px] rounded-full" />
      {text}
    </span>
  );
}
