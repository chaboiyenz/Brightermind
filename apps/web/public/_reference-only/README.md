# _reference-only

Assets copied from `.references/_asset-audit/` that are **not** production-ready —
either flagged in the audit report as needing recreation in the current
brand style, or identified as stock imagery pending a sourcing decision.
Nothing under this folder should be referenced by a component; it exists so
the original can be viewed/traced without digging back into `.references/`.

Once a file here gets a decision (recreate, replace, or adopt as-is), move
the result to the right place in `public/` and delete the entry here.

## home-page-media/

Three animated Freepik Storyset SVGs from the v1 home (`home-img.svg`) and
about (`appointment-img.svg`, `about-img.svg`) hero sections. See
`.references/_asset-audit/REPORT.md` rows 49-51 — all three are tagged
`stock (Freepik Storyset, CSS-animated)` in the Stock vs custom column, so
per the asset-import rule they're parked here rather than dropped into
`public/` as final assets, even though the report's free-text note calls two
of them "reusable as-is." They also don't have an obvious home in the
current hero: `HeroSection.tsx`'s graphic is a deliberate decorative
brand/clay/sage SVG (see its own docblock), not an illustration slot — see
the asset-import report for that conflict.
