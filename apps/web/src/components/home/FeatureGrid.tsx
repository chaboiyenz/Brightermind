import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, cn } from "@/components/ui";
import {
  FEATURE_HIGHLIGHTS,
  type FeatureHighlight,
  type FeatureTone,
} from "./homeContent";

const TONE_CLASSES: Record<FeatureTone, string> = {
  brand: "bg-brand-100 text-brand-700",
  clay: "bg-clay-100 text-clay-600",
  sage: "bg-sage-100 text-sage-600",
};

export function FeatureGrid() {
  return (
    <section
      aria-labelledby="features-heading"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20"
    >
      <div className="mb-10 max-w-2xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-600">
          What is inside
        </p>
        <h2
          id="features-heading"
          className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl"
        >
          Everything in one calm place
        </h2>
        <p className="mt-3 text-base text-stone-700 sm:text-lg">
          Small, steady tools for the weeks that feel heavy, and a way to reach
          a professional when you need more than an app.
        </p>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURE_HIGHLIGHTS.map((feature) => (
          <li key={feature.href}>
            <FeatureCard feature={feature} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function FeatureCard({ feature }: { feature: FeatureHighlight }) {
  const Icon = feature.icon;

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader className="mb-4 flex-col items-start gap-4">
        <span
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-md",
            TONE_CLASSES[feature.tone]
          )}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" />
        </span>
        <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4 text-base leading-relaxed">
        <p>{feature.description}</p>
        <Link
          href={feature.href}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Explore
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </CardContent>
    </Card>
  );
}
