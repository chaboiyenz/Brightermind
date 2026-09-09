"use client";

import { useState } from "react";
import type { Severity } from "@/app/screening/gad7/gad7Data";

// Ordered lowest -> highest so the bars read as a ladder.
const SEVERITY_ORDER: readonly Severity[] = ["minimal", "mild", "moderate", "severe"];

const SEVERITY_LABEL: Record<Severity, string> = {
  minimal: "Minimal",
  mild: "Mild",
  moderate: "Moderate",
  severe: "Severe",
};

// Severity is ordinal, so it gets a single-hue sequential ramp (brand teal,
// light -> dark from tailwind.config.ts) rather than one hue per band, and
// deliberately not brick/red at the top, matching the GAD-7 result card's
// "calm, non-alarming" rule. Each bar is also direct-labelled and named on
// the axis, so identity never rests on color alone.
const SEVERITY_FILL: Record<Severity, string> = {
  minimal: "#A8C9C0", // brand-200
  mild: "#549384", // brand-400
  moderate: "#255950", // brand-700
  severe: "#132C27", // brand-900
};

const CHART = {
  width: 480,
  height: 240,
  paddingTop: 24,
  paddingBottom: 36,
  paddingX: 16,
  barGap: 24,
  barRadius: 4,
} as const;

const DIMMED_OPACITY = 0.55;

interface SeverityDistributionChartProps {
  severityCounts: Record<Severity, number>;
}

/**
 * Client component (module 15: "chart library needs client-side rendering").
 * No chart library is installed in apps/web yet and adding one is a decision
 * for the team (recharts vs visx per the migration plan), so this prototype
 * draws four bars in plain SVG. Swapping to a library later only touches this
 * file; the page passes the same AnalyticsSummary.severityCounts either way.
 */
export function SeverityDistributionChart({ severityCounts }: SeverityDistributionChartProps) {
  const [hovered, setHovered] = useState<Severity | null>(null);

  const total = SEVERITY_ORDER.reduce((sum, key) => sum + severityCounts[key], 0);
  const maxCount = Math.max(1, ...SEVERITY_ORDER.map((key) => severityCounts[key]));
  const plotHeight = CHART.height - CHART.paddingTop - CHART.paddingBottom;
  const plotWidth = CHART.width - CHART.paddingX * 2;
  const slotWidth = plotWidth / SEVERITY_ORDER.length;
  const barWidth = slotWidth - CHART.barGap;
  const baselineY = CHART.paddingTop + plotHeight;

  return (
    <figure className="flex flex-col gap-3">
      <svg
        viewBox={`0 0 ${CHART.width} ${CHART.height}`}
        className="w-full max-w-xl"
        role="img"
        aria-label={`Screening severity distribution across ${total} students`}
      >
        <line
          x1={CHART.paddingX}
          x2={CHART.width - CHART.paddingX}
          y1={baselineY}
          y2={baselineY}
          stroke="#E4E1D9" // stone-200
          strokeWidth={1}
        />
        {SEVERITY_ORDER.map((key, index) => {
          const count = severityCounts[key];
          const barHeight = (count / maxCount) * plotHeight;
          const x = CHART.paddingX + index * slotWidth + CHART.barGap / 2;
          const y = baselineY - barHeight;
          const isDimmed = hovered !== null && hovered !== key;
          const opacity = isDimmed ? DIMMED_OPACITY : 1;
          const share = total === 0 ? 0 : Math.round((count / total) * 100);
          return (
            <g
              key={key}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(key)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
              aria-label={`${SEVERITY_LABEL[key]}: ${count} students, ${share}%`}
              className="outline-none"
            >
              {/* Hit target: the whole column, wider than the bar itself */}
              <rect
                x={x - CHART.barGap / 2}
                y={CHART.paddingTop}
                width={slotWidth}
                height={plotHeight}
                fill="transparent"
              />
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={CHART.barRadius}
                fill={SEVERITY_FILL[key]}
                opacity={opacity}
                style={{ transition: "opacity 0.15s ease" }}
              />
              {/* Square off the bottom corners so the bar sits flat on the baseline */}
              {barHeight > CHART.barRadius && (
                <rect
                  x={x}
                  y={baselineY - CHART.barRadius}
                  width={barWidth}
                  height={CHART.barRadius}
                  fill={SEVERITY_FILL[key]}
                  opacity={opacity}
                />
              )}
              <text
                x={x + barWidth / 2}
                y={y - 6}
                textAnchor="middle"
                className="fill-stone-800 text-xs font-medium"
              >
                {hovered === key ? `${count} (${share}%)` : count}
              </text>
              <text
                x={x + barWidth / 2}
                y={baselineY + 20}
                textAnchor="middle"
                className="fill-stone-600 text-xs"
              >
                {SEVERITY_LABEL[key]}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="text-xs text-stone-600">
        Most recent GAD-7 result per student. Hover or focus a bar to see its share of
        the total.
      </figcaption>
    </figure>
  );
}
