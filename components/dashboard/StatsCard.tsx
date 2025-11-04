import React from "react";

export default function StatsCard({
  title,
  value,
  subtitle,
  className = "",
}: {
  title: string;
  value: number | string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div
      className={`cc-card p-6 transition-shadow hover:shadow-lg ${className}`}
    >
      <div className="text-sm font-medium text-(--cc-text-muted)">{title}</div>
      <div className="mt-2 text-3xl font-bold text-(--cc-text)">{value}</div>
      {subtitle && (
        <div className="mt-1 text-xs text-(--cc-text-muted)">{subtitle}</div>
      )}
    </div>
  );
}
