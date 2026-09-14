// Real Philippine crisis/psychological support hotlines, restoring v1 parity
// (v1 shipped 8 entries; no copy of that dataset survived into this repo — no
// seeded DB, no audit capture — so this list was rebuilt from scratch via web
// search against each organization's own site or multiple independent news
// sources on 2026-09-10). Per the same ground rule as the old placeholder:
// flag, do not silently invent. Each entry's `source` is where the number was
// confirmed; none of these has been independently re-verified by a human
// against the live number (e.g. by calling it), so treat this as
// "web-sourced, pending human re-verification" rather than production-final.
export interface Hotline {
  readonly name: string;
  readonly number: string;
  readonly telHref: string;
  readonly description: string;
  readonly source: string;
}

export const HOTLINES: readonly Hotline[] = [
  {
    name: "NCMH Crisis Hotline",
    number: "1553",
    telHref: "tel:1553",
    description:
      "National Center for Mental Health crisis line — 24/7 support for suicidal thoughts, depression, and other mental health emergencies nationwide.",
    source: "ncmh.gov.ph/contact-us",
  },
  {
    name: "Hopeline PH",
    number: "0917-558-4673",
    telHref: "tel:+639175584673",
    description:
      "Natasha Goulbourn Foundation's 24/7 suicide prevention and crisis support helpline.",
    source: "Natasha Goulbourn Foundation (Hopeline PH)",
  },
  {
    name: "In Touch Community Services Crisis Line",
    number: "0917-800-1123",
    telHref: "tel:+639178001123",
    description:
      "Free, confidential 24/7 crisis counseling and referral service.",
    source: "In Touch Community Services",
  },
  {
    name: "Tawag Paglaum – Centro Bisaya",
    number: "0939-937-5433",
    telHref: "tel:+639399375433",
    description:
      "24/7 crisis and suicide-prevention line serving Cebu and Central Visayas.",
    source: "Tawag Paglaum – Centro Bisaya",
  },
  {
    name: "DOH Substance Abuse Helpline",
    number: "1550",
    telHref: "tel:1550",
    description:
      "Department of Health helpline for substance abuse assessment, intervention, and treatment referrals. Weekdays, 8am–5pm.",
    source: "doh.gov.ph press release: \"DOH launches Substance Abuse 1550 Helpline\"",
  },
  {
    name: "Bantay Bata 163",
    number: "163",
    telHref: "tel:163",
    description:
      "ABS-CBN Foundation's child protection helpline for reporting abuse, exploitation, or neglect, and connecting children and families to support.",
    source: "ABS-CBN Foundation (Bantay Bata 163)",
  },
  {
    name: "PNP Women and Children Protection Center (Aleng Pulis)",
    number: "0919-777-7377",
    telHref: "tel:+639197777377",
    description:
      "PNP's lead unit for violence against women and children — reporting and referral hotline.",
    source: "wcpc.pnp.gov.ph (site fetch blocked at verification time; corroborated via PNP WCPC official Facebook page)",
  },
  {
    name: "National Emergency Hotline",
    number: "911",
    telHref: "tel:911",
    description:
      "General emergency line for immediate danger — police, fire, and medical dispatch nationwide.",
    source: "Emergency 911 National Office",
  },
] as const;

// Primary entry shown on the home banner and other space-constrained spots.
export const PRIMARY_HOTLINE: Hotline = HOTLINES[0];
