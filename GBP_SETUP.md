---
title: Google Business Profile — Setup Package
status: action-required (Mike, dashboard)
created: 2026-06-16
phase: 2 (SITE_IMPROVEMENT_PLAN.md)
---

# Google Business Profile — Paste-Ready Setup

Do this in the GBP dashboard (business.google.com). Every value below must match
the site + schema **byte-for-byte** (entity unification). After setup, the NAP
audit at the bottom must pass.

## 1. Business name
```
Leverage AI LLC
```
(Short/display name "Leverage AI" is fine where GBP allows it. Do NOT add keywords
to the name field — it's a suspension risk.)

## 2. Categories (1 primary + 5 secondary)

| Slot | Exact GBP category string |
|------|---------------------------|
| **Primary** | `Internet marketing service` |
| Secondary | `Marketing agency` |
| Secondary | `Web designer` |
| Secondary | `Search engine optimization service` |
| Secondary | `Software company` |
| Secondary | `Business to business service` |

Rationale: primary = broadest match for the core offering (triggers Local Pack for
"digital marketing / SEO agency" queries); secondaries expand into web design, SEO,
software, and B2B buyer queries. Don't fill all 10 slots — tight relevance wins.

## 3. Owner / contact name
```
Mike Schlottig
```

## 4. Description (paste as-is)
```
Leverage AI is a solo-operated AI-first digital strategy studio in Grants Pass, Oregon, serving businesses along the I-5 corridor and beyond. Founded by Mike Schlottig, Leverage AI specializes in AI search optimization (GEO), ensuring your brand is cited by ChatGPT, Perplexity, and Google AI Overviews — alongside web design, SEO, lead generation, and custom business software. No contracts. Results-driven. Mon–Sat 10am–8pm PT.
```

## 5. Address + hours + service area
```
744 NW Bellevue Place
Grants Pass, OR 97526
(541) 450-2082
```
- Hours: **Mon–Sat 10:00 AM – 8:00 PM** (closed Sunday)
- Service area: Oregon + ~100 mi radius (Grants Pass, Medford, Ashland, Roseburg, Eugene)
- Website: `https://leverageai.network`

## 6. Photos (upload 5+)
Profiles with 10+ photos consistently outrank thinner ones (Google Vision reads them).
- Headshot (use the same `headshot-hat.jpg` as the site → face consistency)
- Workspace / desk with monitors
- Work-in-progress screen (Wrangler deploy, schema test, dashboard)
- Exterior / Southern Oregon environment (local signal)
- Logo (`leverageai-logo.webp`)

## 7. NAP audit (must pass after setup)
This exact string must be identical on: site footer, JSON-LD schema, GBP, and any
directory (Yelp/BBB/Nextdoor). One character off breaks entity matching.
```
Leverage AI LLC · 744 NW Bellevue Place · Grants Pass, OR 97526 · (541) 450-2082 · leverageai.network
```
- Note: Nextdoor profile is under "jon-schlottig" — that URL is fine (it's in `sameAs`),
  but set the Nextdoor **display name** to "Mike Schlottig" if possible.
- Email going forward: `mike@leverageai.network` (branded) — create the mailbox so it receives.
