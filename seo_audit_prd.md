# SEO Audit Platform — Product Requirements Document
### Version 1.0 | 2025 Standards Aligned

---

> **AI IMPLEMENTATION DIRECTIVE**
> This document is the single source of truth. After completing each Section, Feature, or Task block, return to the corresponding **✅ Validation Gate** and confirm all checklist items before proceeding. Never skip ahead. If a gate fails, fix before continuing. Treat every `> ⚠️ CONSTRAINT` as a hard rule, not a suggestion.

---

## Table of Contents

1. [Executive Overview](#1-executive-overview)
2. [Frameworks & Specs](#2-frameworks--specs)
3. [Constraints, Parameters, Types & Tests](#3-constraints-parameters-types--tests)
4. [Sections, Features, Tasks & Sub-tasks](#4-sections-features-tasks--sub-tasks)
5. [Data Flow Documentation](#5-data-flow-documentation)
6. [User Experience Documentation](#6-user-experience-documentation)
7. [What Does Done Look Like?](#7-what-does-done-look-like)
8. [Suggested Component Libraries](#8-suggested-component-libraries)
9. [Architecture Reasoning Document](#9-architecture-reasoning-document)

---

## 1. Executive Overview

### 1.1 Product Vision

**SEO Audit Platform** is a professional-grade, full-stack web application that enables digital marketers, SEO practitioners, and agency teams to conduct comprehensive, standards-compliant website audits aligned with 2025 best practices. It delivers actionable, prioritized reports covering all seven audit dimensions: technical infrastructure, on-page optimization, off-page authority, performance metrics, user experience, competitive intelligence, and reporting.

The platform transforms raw audit data into structured, executive-ready reports — surfacing the highest-ROI actions first via the ICE scoring framework (Impact, Confidence, Ease), and maintaining persistent audit history for trend analysis and before/after comparison.

### 1.2 Business Goals

| Goal | Metric |
|------|--------|
| Full 7-dimension audit in < 5 minutes | Timed from URL submission to report render |
| Report export in PDF and shareable link | Both formats available on every completed audit |
| Audit history with trend tracking | Min 90 days of data per domain |
| ICE-prioritized action plan | All recommendations scored and sorted |
| AI-visibility checks (GEO/AEO) | Covers emerging AI summary optimization |

### 1.3 Target Users

- **SEO Practitioners** — need fast, technical depth and export capability
- **Digital Marketing Managers** — need executive summaries and trend graphs
- **Agency Account Managers** — need white-label-ready, client-presentable reports
- **Developers** — need specific, actionable technical fixes with code-level guidance

### 1.4 Product Scope (v1.0)

**In scope:**
- Domain-level audit initiation and management
- 7-dimension audit analysis engine
- ICE-scored recommendations engine
- Core Web Vitals integration (PageSpeed Insights API)
- Structured data validation
- Backlink profile summary (via configurable API adapter)
- Audit report generation with PDF export
- Historical audit comparison (diff view)
- User authentication and multi-domain workspace

**Out of scope (v1.0):**
- Real-time rank tracking
- Automated recurring audits (v2)
- White-label theming (v2)
- AI-generated content recommendations (v2)

---

## 2. Frameworks & Specs

### 2.1 Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND         React 19 (App Router / RSC where viable)  │
│                   Tailwind CSS v4                           │
│                   Radix UI primitives                       │
│                   TanStack Query v5                         │
│                   TanStack Router v1                        │
│                   Recharts (data visualization)            │
├─────────────────────────────────────────────────────────────┤
│  MIDDLEWARE       Astro 5 (SSR mode, Node adapter)          │
│  & API            Astro API Routes (/api/*)                 │
│                   Zod (schema validation, shared types)     │
│                   oslo (auth utilities)                     │
│                   Arctic (OAuth)                            │
├─────────────────────────────────────────────────────────────┤
│  DATABASE         Turso (LibSQL / SQLite at edge)           │
│                   Drizzle ORM                               │
│                   Drizzle Kit (migrations)                  │
├─────────────────────────────────────────────────────────────┤
│  EXTERNAL APIs    Google PageSpeed Insights API v5          │
│                   Google Search Console API (optional)      │
│                   Backlink API adapter (pluggable)          │
├─────────────────────────────────────────────────────────────┤
│  TOOLING          Vite (via Astro), Biome (lint/format),    │
│                   Vitest (unit), Playwright (e2e)           │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Astro Configuration

Astro acts as the unified server layer. It handles:
- SSR page rendering for initial load performance
- All `/api/*` route handlers (audit engine, auth, exports)
- Session management (cookie-based, httpOnly)
- Edge-compatible middleware (auth guards, rate limiting)

```typescript
// astro.config.mjs
export default defineConfig({
  output: 'server',         // Full SSR — no static generation
  adapter: node({ mode: 'standalone' }),
  integrations: [
    react(),                // React 19 islands
    tailwind(),
  ],
  vite: {
    ssr: { noExternal: ['@libsql/client'] }
  }
});
```

> ⚠️ **CONSTRAINT**: All database access MUST occur exclusively in Astro API routes or `.server.ts` files. Never expose DB credentials or query logic to client-side React components.

### 2.3 Database Schema (Drizzle / Turso)

```typescript
// src/db/schema.ts — canonical schema, source of truth

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// ── Users ──────────────────────────────────────────────────
export const users = sqliteTable('users', {
  id:           text('id').primaryKey(),           // nanoid
  email:        text('email').notNull().unique(),
  passwordHash: text('password_hash'),             // null if OAuth
  provider:     text('provider').default('email'), // 'email'|'google'|'github'
  createdAt:    integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt:    integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// ── Sessions ───────────────────────────────────────────────
export const sessions = sqliteTable('sessions', {
  id:        text('id').primaryKey(),
  userId:    text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

// ── Domains ────────────────────────────────────────────────
export const domains = sqliteTable('domains', {
  id:        text('id').primaryKey(),
  userId:    text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  url:       text('url').notNull(),                // normalized: https://example.com
  label:     text('label'),                        // user-defined alias
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// ── Audits ─────────────────────────────────────────────────
export const audits = sqliteTable('audits', {
  id:          text('id').primaryKey(),
  domainId:    text('domain_id').notNull().references(() => domains.id, { onDelete: 'cascade' }),
  userId:      text('user_id').notNull().references(() => users.id),
  status:      text('status').notNull().default('pending'), // 'pending'|'running'|'complete'|'failed'
  score:       real('score'),                               // 0-100 composite
  startedAt:   integer('started_at', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  errorMsg:    text('error_msg'),
});

// ── Audit Dimensions ───────────────────────────────────────
export const auditDimensions = sqliteTable('audit_dimensions', {
  id:          text('id').primaryKey(),
  auditId:     text('audit_id').notNull().references(() => audits.id, { onDelete: 'cascade' }),
  dimension:   text('dimension').notNull(), // 'technical'|'onpage'|'offpage'|'performance'|'ux'|'competitive'|'reporting'
  score:       real('score'),               // 0-100
  issueCount:  integer('issue_count').default(0),
  rawData:     text('raw_data'),            // JSON blob of full analysis
  createdAt:   integer('created_at', { mode: 'timestamp' }).notNull(),
});

// ── Recommendations ────────────────────────────────────────
export const recommendations = sqliteTable('recommendations', {
  id:           text('id').primaryKey(),
  auditId:      text('audit_id').notNull().references(() => audits.id, { onDelete: 'cascade' }),
  dimension:    text('dimension').notNull(),
  severity:     text('severity').notNull(), // 'critical'|'high'|'medium'|'low'
  category:     text('category').notNull(), // e.g. 'Core Web Vitals'
  title:        text('title').notNull(),
  description:  text('description').notNull(),
  impact:       integer('impact').notNull(),   // ICE: 1-10
  confidence:   integer('confidence').notNull(),
  ease:         integer('ease').notNull(),
  iceScore:     real('ice_score').notNull(),   // (impact+confidence+ease)/3
  steps:        text('steps'),                  // JSON array of action strings
  effort:       text('effort'),                // 'hours'|'days'|'weeks'
  kpi:          text('kpi'),                   // expected outcome metric
  status:       text('status').default('open'), // 'open'|'in_progress'|'resolved'|'dismissed'
  createdAt:    integer('created_at', { mode: 'timestamp' }).notNull(),
});

// ── Audit Page Samples ─────────────────────────────────────
export const auditPages = sqliteTable('audit_pages', {
  id:          text('id').primaryKey(),
  auditId:     text('audit_id').notNull().references(() => audits.id, { onDelete: 'cascade' }),
  url:         text('url').notNull(),
  statusCode:  integer('status_code'),
  title:       text('title'),
  metaDesc:    text('meta_desc'),
  h1:          text('h1'),
  wordCount:   integer('word_count'),
  lcp:         real('lcp'),
  inp:         real('inp'),
  cls:         real('cls'),
  issues:      text('issues'),    // JSON array
  createdAt:   integer('created_at', { mode: 'timestamp' }).notNull(),
});
```

### 2.4 Shared Type Contracts (Zod)

```typescript
// src/lib/schemas.ts — shared between frontend and API routes

import { z } from 'zod';

export const AuditDimension = z.enum([
  'technical', 'onpage', 'offpage', 'performance', 'ux', 'competitive', 'reporting'
]);

export const Severity = z.enum(['critical', 'high', 'medium', 'low']);

export const AuditStatus = z.enum(['pending', 'running', 'complete', 'failed']);

export const CoreWebVitalsSchema = z.object({
  lcp: z.object({ value: z.number(), rating: z.enum(['good', 'needs-improvement', 'poor']) }),
  inp: z.object({ value: z.number(), rating: z.enum(['good', 'needs-improvement', 'poor']) }),
  cls: z.object({ value: z.number(), rating: z.enum(['good', 'needs-improvement', 'poor']) }),
  fcp: z.object({ value: z.number(), rating: z.enum(['good', 'needs-improvement', 'poor']) }),
  ttfb: z.object({ value: z.number(), rating: z.enum(['good', 'needs-improvement', 'poor']) }),
});

// CWV thresholds per Google 2025 spec
export const CWV_THRESHOLDS = {
  lcp:  { good: 2500,  poor: 4000  },  // ms
  inp:  { good: 200,   poor: 500   },  // ms (replaced FID March 2024)
  cls:  { good: 0.1,   poor: 0.25  },  // unitless
  fcp:  { good: 1800,  poor: 3000  },  // ms
  ttfb: { good: 800,   poor: 1800  },  // ms
} as const;

export const RecommendationSchema = z.object({
  id:          z.string(),
  dimension:   AuditDimension,
  severity:    Severity,
  category:    z.string(),
  title:       z.string(),
  description: z.string(),
  impact:      z.number().int().min(1).max(10),
  confidence:  z.number().int().min(1).max(10),
  ease:        z.number().int().min(1).max(10),
  iceScore:    z.number(),
  steps:       z.array(z.string()),
  effort:      z.enum(['hours', 'days', 'weeks']),
  kpi:         z.string(),
  status:      z.enum(['open', 'in_progress', 'resolved', 'dismissed']),
});

export const AuditResultSchema = z.object({
  auditId:         z.string(),
  domainUrl:       z.string().url(),
  compositeScore:  z.number().min(0).max(100),
  status:          AuditStatus,
  dimensions:      z.record(AuditDimension, z.object({
    score:      z.number(),
    issueCount: z.number(),
    rawData:    z.unknown(),
  })),
  recommendations: z.array(RecommendationSchema),
  completedAt:     z.string().datetime().optional(),
});

export type AuditResult        = z.infer<typeof AuditResultSchema>;
export type Recommendation     = z.infer<typeof RecommendationSchema>;
export type CoreWebVitals      = z.infer<typeof CoreWebVitalsSchema>;
```

### 2.5 API Route Contracts

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Issue session |
| POST | `/api/auth/logout` | Required | Destroy session |
| GET | `/api/domains` | Required | List user domains |
| POST | `/api/domains` | Required | Add domain |
| DELETE | `/api/domains/:id` | Required | Remove domain |
| POST | `/api/audits` | Required | Initiate new audit |
| GET | `/api/audits/:id` | Required | Poll audit status |
| GET | `/api/audits/:id/report` | Required | Fetch full report data |
| GET | `/api/domains/:id/history` | Required | List audit history |
| POST | `/api/audits/:id/export` | Required | Generate PDF export |
| PATCH | `/api/recommendations/:id` | Required | Update rec status |

---

## 3. Constraints, Parameters, Types & Tests

### 3.1 Hard Constraints

> ⚠️ **CONSTRAINT — Security**: All auth cookies must be `httpOnly`, `SameSite=Strict`, `Secure`. Sessions expire in 30 days, with sliding renewal on activity.

> ⚠️ **CONSTRAINT — Database**: Never construct raw SQL strings. Use Drizzle query builder exclusively. All inputs validated through Zod before any DB write.

> ⚠️ **CONSTRAINT — API Keys**: All third-party API keys (`GOOGLE_PSI_API_KEY`, etc.) stored in environment variables only. Never in source, DB, or client bundle. Accessed server-side only.

> ⚠️ **CONSTRAINT — Audit Concurrency**: Max 3 concurrent audit runs per user at one time. Enforce at API route level with DB check before queuing.

> ⚠️ **CONSTRAINT — URL Normalization**: All domain URLs must be normalized before storage: lowercase, trailing slash stripped, `http://` upgraded to `https://`. Use a shared `normalizeUrl()` utility.

> ⚠️ **CONSTRAINT — CWV Thresholds**: Core Web Vitals ratings must use Google's official 75th percentile thresholds: LCP <2.5s good / >4s poor; INP <200ms good / >500ms poor; CLS <0.1 good / >0.25 poor. Source: `CWV_THRESHOLDS` constant in `schemas.ts`.

> ⚠️ **CONSTRAINT — ICE Scoring**: ICE score = `(impact + confidence + ease) / 3`. All three components must be integers 1–10, scored by the recommendation engine. Never manually override without audit log entry.

> ⚠️ **CONSTRAINT — Error Handling**: Every API route must return structured error responses: `{ error: string, code: string, details?: unknown }`. Never leak stack traces to client.

### 3.2 Environment Parameters

```bash
# .env (server-side only, never committed)
DATABASE_URL=libsql://your-db.turso.io
DATABASE_AUTH_TOKEN=your-turso-token

GOOGLE_PSI_API_KEY=          # PageSpeed Insights v5
GOOGLE_CLIENT_ID=            # OAuth (optional)
GOOGLE_CLIENT_SECRET=

SESSION_SECRET=              # 32+ char random string for cookie signing

APP_URL=https://yourdomain.com
NODE_ENV=production
```

### 3.3 Type Reference Map

```typescript
// All types derive from Zod schemas — import from src/lib/schemas.ts

type AuditDimension   = 'technical' | 'onpage' | 'offpage' | 
                        'performance' | 'ux' | 'competitive' | 'reporting';
type Severity         = 'critical' | 'high' | 'medium' | 'low';
type AuditStatus      = 'pending' | 'running' | 'complete' | 'failed';
type Effort           = 'hours' | 'days' | 'weeks';
type RecStatus        = 'open' | 'in_progress' | 'resolved' | 'dismissed';
type CWVRating        = 'good' | 'needs-improvement' | 'poor';

// Scoring: all dimension scores are 0–100 floats
// Composite score: weighted average (see Section 4.2.3)
// ICE: (impact + confidence + ease) / 3, expressed as float 1.0–10.0
```

### 3.4 Validation Gates (AI Implementation Checkpoints)

**These gates are mandatory. Do not skip.**

---
#### ✅ Gate 1 — Project Setup
- [ ] Astro 5 project initializes with `output: 'server'`
- [ ] Drizzle + Turso client connects successfully
- [ ] `npm run db:migrate` runs clean with zero errors
- [ ] `src/lib/schemas.ts` exports all Zod types
- [ ] Environment variables load correctly in dev and are absent from client bundle (check Vite build output)
- [ ] Biome lints with zero errors on fresh project

---
#### ✅ Gate 2 — Authentication
- [ ] Register → Login → access protected route → Logout flow works end-to-end
- [ ] Session cookie is `httpOnly`, `SameSite=Strict`
- [ ] Expired sessions redirect to `/login`
- [ ] Accessing `/api/*` without session returns `401 { error, code }`
- [ ] Passwords hashed with `Argon2id` (min 19MB memory cost)

---
#### ✅ Gate 3 — Audit Engine
- [ ] POST `/api/audits` creates DB record with status `pending`
- [ ] Audit transitions through `pending → running → complete`
- [ ] Failed audits set `status: 'failed'` and persist `error_msg`
- [ ] All 7 dimension analyzers produce a numeric score and issue count
- [ ] CWV ratings match `CWV_THRESHOLDS` constants exactly
- [ ] ICE scores are computed correctly for all recommendations
- [ ] `normalizeUrl()` passes all edge case tests (see Section 3.5)

---
#### ✅ Gate 4 — Frontend Data Flow
- [ ] TanStack Query polls `/api/audits/:id` while status is `running` (1s interval, stops on `complete`/`failed`)
- [ ] All API responses parsed through Zod before use — no raw `JSON.parse`
- [ ] No DB or API keys present in browser network tab
- [ ] Loading, empty, error, and populated states handled for every data-dependent component
- [ ] React 19 `useOptimistic` used for recommendation status updates

---
#### ✅ Gate 5 — Report & Export
- [ ] Report renders all 7 dimension scores
- [ ] Recommendations sorted by `iceScore` descending
- [ ] PDF export produces valid, downloadable file
- [ ] Shareable link loads report for unauthenticated viewers (read-only)
- [ ] Historical diff view correctly compares two audit records

---
#### ✅ Gate 6 — Quality & Performance
- [ ] Lighthouse score for app shell ≥ 90 performance
- [ ] All Vitest unit tests pass (`npm run test`)
- [ ] All Playwright e2e tests pass (`npm run test:e2e`)
- [ ] Zero TypeScript errors (`tsc --noEmit`)
- [ ] Zero Biome lint errors
- [ ] All Zod validations tested with valid and invalid inputs

---

### 3.5 Unit Test Specifications

```typescript
// src/lib/__tests__/normalize.test.ts
describe('normalizeUrl', () => {
  it('upgrades http to https');         // http://example.com → https://example.com
  it('strips trailing slash');           // https://example.com/ → https://example.com
  it('lowercases domain');              // https://EXAMPLE.COM → https://example.com
  it('strips www when configured');     // optional, configurable
  it('throws on invalid URL');
  it('preserves path when present');    // https://example.com/blog stays
});

// src/lib/__tests__/ice.test.ts
describe('calculateICE', () => {
  it('averages three integers');        // (8+7+6)/3 = 7.0
  it('handles min values');             // (1+1+1)/3 = 1.0
  it('handles max values');             // (10+10+10)/3 = 10.0
  it('throws on out-of-range input');   // ice(11, 5, 5) throws ZodError
});

// src/lib/__tests__/cwv.test.ts
describe('rateCWV', () => {
  it('rates LCP 2000ms as good');
  it('rates LCP 3500ms as needs-improvement');
  it('rates LCP 5000ms as poor');
  it('rates INP 150ms as good');        // INP replaces FID (March 2024)
  it('rates INP 350ms as needs-improvement');
  it('rates INP 600ms as poor');
  it('rates CLS 0.05 as good');
  it('rates CLS 0.15 as needs-improvement');
  it('rates CLS 0.30 as poor');
});
```

---

## 4. Sections, Features, Tasks & Sub-tasks

### Section A — Infrastructure & Project Setup

#### Feature A1: Project Scaffolding
**Description**: Initialize full monorepo structure with all tooling configured.

**Tasks & Sub-tasks:**

**A1.1 — Initialize Astro project**
- Sub-task: `npm create astro@latest` with `server` output mode
- Sub-task: Install React 19 integration (`@astrojs/react`)
- Sub-task: Configure `tsconfig.json` with strict mode, path aliases (`@/` → `src/`)
- Sub-task: Install and configure Biome for lint + format
- Sub-task: Configure Vitest with jsdom environment

**A1.2 — Database setup**
- Sub-task: Install `@libsql/client`, `drizzle-orm`, `drizzle-kit`
- Sub-task: Create `src/db/client.ts` — singleton Turso client
- Sub-task: Create `src/db/schema.ts` — full schema from Section 2.3
- Sub-task: Create `drizzle.config.ts`
- Sub-task: Write and run initial migration (`npm run db:migrate`)
- Sub-task: Seed script for development data

**A1.3 — Shared utilities**
- Sub-task: `src/lib/schemas.ts` — all Zod schemas and types
- Sub-task: `src/lib/normalize.ts` — URL normalization with tests
- Sub-task: `src/lib/ice.ts` — ICE score calculator with tests
- Sub-task: `src/lib/cwv.ts` — CWV rating engine with tests
- Sub-task: `src/lib/errors.ts` — typed API error factory

> ✅ **Run Gate 1 before proceeding to Feature A2**

---

#### Feature A2: Authentication System
**Description**: Email/password auth with session management. Optional OAuth.

**Reference**: oslo (session), Arctic (OAuth), Argon2id (hashing)

**Tasks & Sub-tasks:**

**A2.1 — Session management**
- Sub-task: `src/lib/auth/session.ts` — create, validate, refresh, destroy session
- Sub-task: Middleware `src/middleware/auth.ts` — attach `Locals.user` from session cookie
- Sub-task: Cookie config: `httpOnly: true`, `SameSite: 'Strict'`, `Secure: true`, `maxAge: 30 days`

**A2.2 — Registration endpoint**
- Sub-task: `POST /api/auth/register` — Zod validate body → hash password (Argon2id) → insert user + session → set cookie
- Sub-task: Return `409` on duplicate email with clear error code

**A2.3 — Login endpoint**
- Sub-task: `POST /api/auth/login` — validate credentials → verify hash → create session → set cookie
- Sub-task: Return `401` on wrong credentials (constant-time comparison, no timing leaks)

**A2.4 — Auth guard**
- Sub-task: Astro middleware checks all `/api/*` and protected page routes
- Sub-task: Redirect to `/login` for pages; return `401 JSON` for API routes

> ✅ **Run Gate 2 before proceeding to Feature A3**

---

### Section B — Audit Engine

#### Feature B1: Audit Orchestrator
**Description**: Core orchestration service that manages the lifecycle of a full 7-dimension audit.

**Tasks & Sub-tasks:**

**B1.1 — Audit initiation API**
- Sub-task: `POST /api/audits` — validate domain ownership → create audit record `status: pending` → kick off async analysis chain → return `{ auditId, status }`
- Sub-task: Enforce max-3-concurrent constraint via DB count query
- Sub-task: Update status to `running` immediately before first analyzer runs

**B1.2 — Audit status polling API**
- Sub-task: `GET /api/audits/:id` — return `{ id, status, score, completedAt, errorMsg }`
- Sub-task: Include dimension progress array for granular loading UI feedback

**B1.3 — Async analysis pipeline**
- Sub-task: Sequential async pipeline: `technical → performance → onpage → ux → offpage → competitive → reporting`
- Sub-task: Each analyzer writes its dimension record atomically on completion
- Sub-task: If any critical analyzer throws, mark audit `failed` with `error_msg`; non-critical can degrade gracefully

**B1.4 — Recommendation aggregator**
- Sub-task: After all analyzers complete, aggregate recommendations from all dimension results
- Sub-task: Calculate ICE scores using `src/lib/ice.ts`
- Sub-task: Batch-insert all recommendations into DB
- Sub-task: Calculate composite score (weighted average per Section B1.5)

**B1.5 — Composite Scoring**
```
Composite Score = weighted average of dimension scores:
  Technical    × 0.25
  Performance  × 0.20   (Core Web Vitals heavily weighted)
  On-Page      × 0.20
  UX           × 0.15
  Off-Page     × 0.10
  Competitive  × 0.05
  Reporting    × 0.05
```
Sub-task: Implement as pure function in `src/lib/scoring.ts` with full unit test coverage.

---

#### Feature B2: Technical SEO Analyzer
**Description**: Crawlability, architecture, mobile, schema, and security checks.

**Reference**: Google Search Central crawlability docs; The HOTH Technical SEO Checklist 2025

**Tasks & Sub-tasks:**

**B2.1 — Crawlability checks**
- Sub-task: Fetch and parse `robots.txt` — flag critical CSS/JS blocks
- Sub-task: Detect `noindex` meta tags and HTTP headers on key pages
- Sub-task: Check for XML sitemap presence and validity (submit URL patterns)
- Sub-task: Detect redirect chains (>2 hops = issue; >3 hops = critical)
- Sub-task: Check canonical tags for self-referencing and cross-domain conflicts

**B2.2 — Architecture checks**
- Sub-task: Validate URL structure (hyphens vs underscores, lowercase, no session params)
- Sub-task: Estimate crawl depth for sampled pages (>3 clicks from home = issue)
- Sub-task: Detect duplicate content indicators (pagination without canonicals)

**B2.3 — Mobile optimization checks**
- Sub-task: Detect viewport meta tag presence and configuration
- Sub-task: Flag font sizes < 14px (extracted from CSS sample)
- Sub-task: Flag tap targets < 48px (static analysis heuristic)
- Sub-task: Confirm mobile-first rendering signals

**B2.4 — Structured data validation**
- Sub-task: Fetch page HTML, extract `application/ld+json` and microdata
- Sub-task: Validate schema types against Schema.org spec (Article, Product, LocalBusiness, BreadcrumbList, FAQPage)
- Sub-task: Flag missing recommended schema for detected page types
- Sub-task: Validate JSON-LD syntax (valid JSON + required `@context`, `@type`)

**B2.5 — Security checks**
- Sub-task: Confirm HTTPS across all sampled URLs
- Sub-task: Check HSTS header presence
- Sub-task: Detect mixed content (HTTP resources on HTTPS pages — flag as critical)

**Scoring algorithm**: Start at 100. Deduct points per severity: Critical -15, High -8, Medium -4, Low -1. Floor at 0.

---

#### Feature B3: Performance Analyzer (Core Web Vitals)
**Description**: Integrate Google PageSpeed Insights API v5 for field and lab data.

**Reference**: Google PageSpeed Insights API v5 docs; NitroPack CWV Guide 2025; `CWV_THRESHOLDS` constants

**Tasks & Sub-tasks:**

**B3.1 — PSI API integration**
- Sub-task: `src/lib/psi.ts` — typed PSI API client (mobile + desktop calls)
- Sub-task: Extract field data (CrUX 28-day p75) and lab data (Lighthouse)
- Sub-task: Map to `CoreWebVitalsSchema` — rate each metric using `src/lib/cwv.ts`
- Sub-task: Cache PSI results for 24 hours per URL to conserve API quota

**B3.2 — CWV scoring**
- Sub-task: LCP <2.5s = pass; 2.5-4s = warning; >4s = critical
- Sub-task: INP <200ms = pass; 200-500ms = warning; >500ms = critical (**INP replaced FID in March 2024**)
- Sub-task: CLS <0.1 = pass; 0.1-0.25 = warning; >0.25 = critical
- Sub-task: Requires **75th percentile** field data for official CWV assessment

**B3.3 — Performance recommendations**
- Sub-task: Parse Lighthouse audit opportunities → map to typed recommendations
- Sub-task: Extract specific: image compression, render-blocking resources, unused JS/CSS, server response time
- Sub-task: Generate actionable steps per recommendation (e.g., "Convert `hero.jpg` (2.3MB) to WebP — estimated savings: 1.8MB, LCP improvement: ~0.8s")

---

#### Feature B4: On-Page SEO Analyzer
**Description**: Meta elements, content quality, heading structure, keyword relevance.

**Reference**: Backlinko On-Page SEO Definitive Guide 2025; Semrush Audit standards

**Tasks & Sub-tasks:**

**B4.1 — Meta element analysis**
- Sub-task: Fetch and parse page `<head>` elements
- Sub-task: Title tag: check presence, length (50-60 chars optimal), uniqueness, keyword inclusion
- Sub-task: Meta description: check presence, length (150-160 chars optimal), uniqueness, CTA quality
- Sub-task: OG tags: `og:title`, `og:description`, `og:image` presence check

**B4.2 — Heading structure**
- Sub-task: Extract all headings (H1-H6) from page content
- Sub-task: Validate exactly one H1 per page
- Sub-task: Check heading hierarchy (no skipping H2→H4)
- Sub-task: Flag missing H1 as `critical`; multiple H1s as `high`

**B4.3 — Content quality signals**
- Sub-task: Estimate word count (≥800 for informational pages recommended)
- Sub-task: Check for thin content (<300 words) — flag as `high`
- Sub-task: Detect keyword stuffing heuristic (keyword density >3% = flag)
- Sub-task: Check for duplicate title/meta across crawled pages

**B4.4 — Image optimization**
- Sub-task: Extract all `<img>` tags — check `alt` attribute presence and quality
- Sub-task: Flag missing alt on non-decorative images as `high` (accessibility + SEO)
- Sub-task: Detect oversized images (>500KB) as `medium`

---

#### Feature B5: Performance UX Analyzer
**Description**: Navigation, readability, CTA quality, and accessibility signals.

**Reference**: SEO.com Mobile SEO 2025; Backlinko UX factors

**Tasks & Sub-tasks:**

**B5.1 — Navigation analysis**
- Sub-task: Detect primary nav element and count items (flag >8 as `medium`)
- Sub-task: Check for breadcrumb schema markup
- Sub-task: Validate footer nav presence for secondary links

**B5.2 — Readability analysis**
- Sub-task: Heuristic paragraph length analysis (>5 sentences = flag)
- Sub-task: Check for subheading density (every 300 words should have a heading)
- Sub-task: Detect wall-of-text patterns

**B5.3 — Accessibility signals**
- Sub-task: Check color contrast ratio (AA standard ≥ 4.5:1 for normal text)
- Sub-task: Validate descriptive link text (flag "click here", "read more" as `medium`)
- Sub-task: Check for ARIA landmark usage
- Sub-task: Confirm keyboard navigation indicators (`outline: none` without replacement = `high`)

---

#### Feature B6: Off-Page & Backlink Analyzer
**Description**: Pluggable backlink API adapter for backlink profile summary.

**Reference**: Backlinko Domain Authority Guide 2025; Semrush backlink analysis

**Tasks & Sub-tasks:**

**B6.1 — Backlink API adapter pattern**
- Sub-task: Define `BacklinkAdapter` interface: `{ getReferringDomains, getTotalBacklinks, getTopBacklinks, getAnchorTextDistribution }`
- Sub-task: Implement `MozAdapter` and `SemrushAdapter` (API-key gated)
- Sub-task: Fallback `NullAdapter` returns `null` data with explanatory note when no API key configured

**B6.2 — Profile health scoring**
- Sub-task: Anchor text diversity check (>60% branded/generic = healthy; >30% exact-match = flag)
- Sub-task: Referring domain growth trend (requires historical data from audit history)
- Sub-task: High-authority domain ratio (% of links from DA 50+ domains)

---

#### Feature B7: Competitive Snapshot Analyzer
**Description**: Basic competitive positioning using SERP data patterns.

**Reference**: Backlinko SEO Competitor Analysis guide; Semrush Domain Overview

**Tasks & Sub-tasks:**

**B7.1 — Competitive data (configurable)**
- Sub-task: Accept competitor URLs in audit request body (optional, max 3)
- Sub-task: Run lightweight tech/performance checks on competitor domains
- Sub-task: Generate CWV comparison table

**B7.2 — Keyword gap placeholder**
- Sub-task: Identify keyword gap opportunity surface area (requires external API; scaffold with adapter pattern)
- Sub-task: Document configuration instructions for Semrush/Ahrefs API key integration

---

### Section C — Reporting Engine

#### Feature C1: Report Generation
**Description**: Transform audit DB data into structured, readable report.

**Reference**: Semrush audit report structure; Section 7.1-7.3 of SEO Standards doc

**Tasks & Sub-tasks:**

**C1.1 — Report data API**
- Sub-task: `GET /api/audits/:id/report` — joins audit + dimensions + recommendations + pages
- Sub-task: Returns `AuditResultSchema`-validated response
- Sub-task: Includes executive summary string (generated from score + critical issue count)

**C1.2 — ICE-sorted action plan**
- Sub-task: Recommendations returned sorted by `iceScore` descending
- Sub-task: Grouped by dimension and severity for tabbed UI navigation
- Sub-task: Include "Quick Wins" section: High ICE + effort = 'hours'

**C1.3 — Historical comparison API**
- Sub-task: `GET /api/domains/:id/history` — return list of audit summaries (score, date, issue count)
- Sub-task: `GET /api/audits/diff?a=:id1&b=:id2` — returns score deltas and recommendation changes per dimension

---

#### Feature C2: PDF Export
**Description**: Generate downloadable, professional-grade PDF report.

**Tasks & Sub-tasks:**

**C2.1 — PDF generation**
- Sub-task: Use `@react-pdf/renderer` on server (Astro API route) — renders report JSX to PDF buffer
- Sub-task: Endpoint: `POST /api/audits/:id/export` → returns `application/pdf`
- Sub-task: Include: executive summary, dimension scores table, top 10 recommendations, CWV details, action timeline

**C2.2 — Shareable link**
- Sub-task: Generate signed URL token for read-only report access (stored in DB with expiry)
- Sub-task: `/report/share/:token` — public page, no auth required, renders full report in read-only mode

---

### Section D — Frontend Application

#### Feature D1: App Shell & Navigation
**Tasks & Sub-tasks:**

**D1.1 — Layout**
- Sub-task: Persistent sidebar with domain switcher, navigation links, user menu
- Sub-task: Breadcrumb component auto-populated from TanStack Router match
- Sub-task: Toast notification system (Sonner)
- Sub-task: Command palette (Cmdk) for quick actions

**D1.2 — Page routes (TanStack Router)**
```
/login           — Auth page
/register        — Registration
/dashboard       — Overview: recent audits, domain scores
/domains         — Domain management
/domains/:id     — Domain audit history + trend charts
/audit/:id       — Live audit progress + full report
/audit/:id/recommendations — Filtered rec list with status management
/report/share/:token — Public read-only report
/settings        — Account & API key configuration
```

---

#### Feature D2: Dashboard
**Tasks & Sub-tasks:**

**D2.1 — Domain overview cards**
- Sub-task: Score gauge (Radix Progress + custom arc SVG)
- Sub-task: CWV status badges (pass/needs-improvement/poor)
- Sub-task: Last audit date and quick "Re-audit" CTA

**D2.2 — Trend charts**
- Sub-task: Recharts `LineChart` — composite score over last 10 audits per domain
- Sub-task: Dimension radar chart — `RadarChart` component showing all 7 dimensions

---

#### Feature D3: Audit Progress & Report View
**Tasks & Sub-tasks:**

**D3.1 — Audit progress view**
- Sub-task: Polling with TanStack Query (`refetchInterval: 1000`, halts on complete/failed)
- Sub-task: Per-dimension progress indicators (✓ complete, ⟳ running, ○ pending)
- Sub-task: Animate completion with Framer Motion (subtle, not distracting)

**D3.2 — Report view**
- Sub-task: Executive summary panel with composite score donut chart
- Sub-task: Dimension breakdown tabs with score badges
- Sub-task: Recommendations table: sortable by ICE score, severity, dimension; filterable
- Sub-task: CWV detail panel with metric gauges and field vs lab data toggle
- Sub-task: Quick Wins callout section (top 5 by ICE score with effort = 'hours')

**D3.3 — Recommendation management**
- Sub-task: Status update (open → in_progress → resolved) via `useOptimistic` + PATCH endpoint
- Sub-task: Dismissal with optional reason
- Sub-task: Filter presets: "My Quick Wins", "Critical Only", "By Dimension"

---

## 5. Data Flow Documentation

### 5.1 Audit Initiation Flow

```
User submits URL
      │
      ▼
React Form → POST /api/audits
      │
      ▼
Astro API Route
  ├─ Auth check (Locals.user)
  ├─ Zod validate body
  ├─ normalizeUrl(url)
  ├─ Check domain ownership (DB query)
  ├─ Check concurrent audit limit (<= 3)
  ├─ INSERT audit (status: 'pending')
  │
  ▼
Async pipeline starts (non-blocking response sent)
  ├─ UPDATE status → 'running'
  │
  ├─ B2: Technical Analyzer
  │    └─ fetch robots.txt, sitemap, page HTML
  │    └─ INSERT audit_dimensions (dimension: 'technical')
  │
  ├─ B3: Performance Analyzer  
  │    └─ Google PSI API call (mobile + desktop)
  │    └─ INSERT audit_dimensions (dimension: 'performance')
  │
  ├─ B4: On-Page Analyzer
  │    └─ parse fetched HTML, head, content
  │    └─ INSERT audit_dimensions (dimension: 'onpage')
  │
  ├─ B5: UX Analyzer
  │    └─ accessibility + nav + readability heuristics
  │    └─ INSERT audit_dimensions (dimension: 'ux')
  │
  ├─ B6: Off-Page Analyzer
  │    └─ Backlink adapter call (or null)
  │    └─ INSERT audit_dimensions (dimension: 'offpage')
  │
  ├─ B7: Competitive Analyzer (if competitors provided)
  │    └─ INSERT audit_dimensions (dimension: 'competitive')
  │
  ├─ C1: Recommendation Aggregator
  │    └─ collect all dimension rawData
  │    └─ score ICE for each recommendation
  │    └─ BATCH INSERT recommendations
  │
  ├─ B1.5: Composite Score calculation
  │    └─ weighted average of dimension scores
  │
  └─ UPDATE audit (status: 'complete', score, completedAt)
      OR
      UPDATE audit (status: 'failed', errorMsg)
```

### 5.2 Frontend Polling & Render Flow

```
/audit/:id page mounts
      │
      ▼
TanStack Query: useQuery({
  queryKey: ['audit', id],
  queryFn: () => GET /api/audits/:id,
  refetchInterval: (data) => 
    data?.status === 'complete' || data?.status === 'failed' 
      ? false : 1000
})
      │
      ├─ status: 'running' → show progress UI
      │
      └─ status: 'complete'
              │
              ▼
         useQuery: GET /api/audits/:id/report
              │
              ▼
         Parse through AuditResultSchema (Zod)
              │
              ▼
         Render report components
```

### 5.3 Authentication Flow

```
Login form submit
      │
      ▼
POST /api/auth/login
  ├─ Zod validate {email, password}
  ├─ SELECT user by email
  ├─ verify(password, passwordHash) — Argon2id
  ├─ if invalid → 401 {error, code: 'INVALID_CREDENTIALS'}
  ├─ if valid → generateSessionId() → INSERT session
  └─ Set-Cookie: session=<token>; HttpOnly; SameSite=Strict; Secure

      │
      ▼
All subsequent requests:
  Astro middleware reads cookie
  → SELECT session WHERE id = token AND expiresAt > now()
  → Attach user to Locals.user
  → Slide expiry forward
```

### 5.4 Data Mutation Flow (Recommendation Status)

```
User clicks status badge in UI
      │
      ▼
useOptimistic → instantly update local state (React 19)
      │
      ▼
PATCH /api/recommendations/:id
  {status: 'in_progress'}
      │
      ├─ Auth check + ownership check
      ├─ Zod validate body
      └─ UPDATE recommendations SET status = ...
              │
              ▼
      TanStack Query invalidates ['audit', auditId, 'report']
      → refetch report data in background
      → optimistic state confirmed or rolled back
```

---

## 6. User Experience Documentation

### 6.1 User Journey Map

```
NEW USER
────────
1. Land on marketing page → CTA "Start Free Audit"
2. Register (email + password, single form, no friction)
3. Add first domain (URL input + optional label)
4. Click "Run Audit" → immediate feedback "Audit started"
5. Watch progress screen (per-dimension status indicators)
6. View report → Executive summary loads first (above fold)
7. Navigate dimension tabs → CWV detail → Recommendations
8. Sort recommendations by ICE score → See "Quick Wins" callout
9. Export PDF → share with client/team
10. Return tomorrow → dashboard shows score trend

RETURNING USER
──────────────
1. Login → dashboard shows all domains with current scores
2. See score delta badges (↑3pts, ↓1pt) since last audit
3. One-click "Re-audit" from domain card
4. Compare new vs previous audit (diff view)
5. Update resolved recommendations → score re-calculates
```

### 6.2 Information Architecture

```
Navigation Structure:
├── Dashboard (/)
│    ├── Domain cards (score, CWV status, last audit date)
│    └── Recent activity feed
│
├── Domains (/domains)
│    ├── Domain list with scores
│    ├── Add domain
│    └── Domain detail (/domains/:id)
│         ├── Audit history timeline
│         ├── Score trend chart (Recharts)
│         └── Dimension radar chart
│
├── Audit View (/audit/:id)
│    ├── Progress screen (while running)
│    └── Report view (when complete)
│         ├── Executive Summary (tab 0)
│         ├── Technical (tab 1)
│         ├── Performance / CWV (tab 2)
│         ├── On-Page (tab 3)
│         ├── UX (tab 4)
│         ├── Off-Page (tab 5)
│         ├── Competitive (tab 6)
│         └── Action Plan (tab 7) — ICE-sorted, full list
│
└── Settings (/settings)
     ├── Account details
     ├── API key configuration (PSI, backlink tools)
     └── Notification preferences
```

### 6.3 Component State Matrix

| Component | Empty State | Loading State | Error State | Populated State |
|-----------|-------------|---------------|-------------|-----------------|
| Domain List | "Add your first domain" CTA | Skeleton cards | Error banner + retry | Domain cards grid |
| Audit Progress | N/A | Dimension step list | Failed banner with error | Redirects to report |
| Report | N/A | Skeleton panels | Error with retry | Full report |
| Rec Table | "No recs found" | Skeleton rows | Error | Sortable table |
| CWV Gauges | N/A | Pulsing rings | "Data unavailable" | Color-coded gauges |
| Score Chart | "Run more audits" | Skeleton line | Error | Trend line |

### 6.4 Responsive Design Breakpoints

```
Mobile  (<768px):   Single column, stacked tabs become accordion
Tablet  (768-1024): Sidebar collapses to icon-only, 2-col report grid
Desktop (>1024):    Full sidebar, 3-col dashboard cards, side-by-side report panels
```

---

## 7. What Does Done Look Like?

### 7.1 Functional Definition of Done (per feature)

A feature is **done** when:

1. **Tests pass**: All unit tests (Vitest) and e2e tests (Playwright) for the feature pass with zero failures
2. **TypeScript clean**: `tsc --noEmit` returns zero errors
3. **Lint clean**: `biome check .` returns zero errors
4. **Validation Gate passed**: The corresponding Gate checklist is fully checked
5. **API contracts honored**: All responses match Zod schemas; all inputs validated
6. **Error states handled**: Loading, empty, and error states render correctly in UI
7. **No regressions**: All previously passing tests still pass

### 7.2 Definition of Done — Full Product v1.0

The product is **shippable** when:

#### Core Functionality
- [ ] User can register, login, and logout
- [ ] User can add and manage multiple domains
- [ ] Full 7-dimension audit completes successfully for any valid public URL
- [ ] Audit handles failure gracefully (network errors, private sites, rate limits)
- [ ] All 7 dimension analyzers produce scores and recommendations
- [ ] ICE scores calculated correctly for all recommendations
- [ ] CWV ratings use official Google thresholds (INP, not FID)

#### Report Quality
- [ ] Executive summary is human-readable and accurate
- [ ] Recommendations are specific, actionable, and include implementation steps
- [ ] Quick Wins section isolates high-ICE, low-effort items
- [ ] PDF export is professional and complete
- [ ] Shareable read-only link works without authentication

#### Data Integrity
- [ ] All Zod schema validations enforced end-to-end
- [ ] No raw SQL strings in codebase
- [ ] No API keys or secrets in client bundle (verified via build output inspection)
- [ ] Session management secure (httpOnly, SameSite, Secure)
- [ ] URL normalization consistent (all test cases pass)

#### Performance & Quality
- [ ] App shell Lighthouse score ≥ 90
- [ ] Audit initiation response < 200ms (async pipeline, not blocking)
- [ ] Report render < 1s from complete status
- [ ] Zero accessibility violations (axe-core scan, AA level)
- [ ] All Vitest unit tests pass
- [ ] All Playwright e2e tests pass

#### SEO Standards Compliance
- [ ] CWV thresholds match Google's official 2025 spec (LCP/INP/CLS)
- [ ] INP metric used (not deprecated FID)
- [ ] Schema.org structured data check covers all major types
- [ ] E-E-A-T signals included in on-page analysis
- [ ] AI visibility / GEO factors flagged in on-page recommendations

---

## 8. Suggested Component Libraries

### 8.1 UI Primitives — **Radix UI** (via shadcn/ui)
**Why**: Unstyled, fully accessible primitives (WCAG 2.1 AA) for all interactive components. Keyboard navigation, focus management, and ARIA roles handled out of the box. Composable without fighting CSS. shadcn/ui provides copy-paste Tailwind-styled components built on Radix — no dependency lock-in, full ownership of code.

Used for: Dialog, Tabs, Dropdown, Tooltip, Popover, Select, Progress, Badge, Command (palette), Sheet (mobile nav)

### 8.2 Data Visualization — **Recharts**
**Why**: Built natively for React, declarative API, fully SSR-compatible, well-maintained. Sufficient for all required chart types: line (score trends), radar (dimension overview), radial bar (CWV gauges), bar (comparison charts). Lighter than D3 for this use case.

Used for: Score trend LineChart, dimension RadarChart, CWV RadialBarChart, audit history BarChart

### 8.3 Server State — **TanStack Query v5**
**Why**: Purpose-built for server state management, provides polling, caching, background refetch, optimistic updates, and mutation handling. The polling pattern for live audit status is trivially expressed. Integrates with React 19's concurrent features.

Used for: Audit polling, report data fetching, domain list, recommendation mutations

### 8.4 Routing — **TanStack Router v1**
**Why**: Fully type-safe routing with built-in search param handling, loader patterns, and route-level code splitting. Works with Astro's React islands via standalone deployment. File-based routes for clarity.

Used for: All React SPA navigation within the authenticated app shell

### 8.5 Forms — **React Hook Form + Zod**
**Why**: `react-hook-form` provides uncontrolled form performance. Combined with `@hookform/resolvers/zod`, validation schemas are shared between server and client — single source of truth. No extra dependencies.

Used for: Domain add form, audit initiation form, settings, auth forms

### 8.6 Animations — **Framer Motion** (targeted use)
**Why**: Used only for the audit progress flow and score reveal animation — these are high-value UX moments. Not used globally. Framer Motion's layout animations and presence animations handle these cases elegantly with minimal bundle cost when tree-shaken.

Used for: Audit progress step transitions, report score reveal, notification toasts

### 8.7 Notifications — **Sonner**
**Why**: Minimal, beautiful, accessible toast library built for modern React. ~2KB, no config needed. Used for: audit started, export complete, error notifications.

### 8.8 PDF Generation — **@react-pdf/renderer**
**Why**: Allows building PDFs using React component syntax. Server-side rendering in Astro API route produces buffer. Avoids headless browser dependency. Sufficient for structured report layout.

### 8.9 Icons — **Lucide React**
**Why**: MIT licensed, tree-shakeable, consistent design language, well-maintained. Every icon is an SVG component.

---

## 9. Architecture Reasoning Document

### 9.1 Why Astro for Middleware + API?

Astro in SSR mode occupies a precise architectural niche: it's a **request/response server** that can render React for initial page delivery, handle API routes with full Node.js access, and run middleware — all in a single deployable unit. This eliminates the need for a separate Express/Fastify backend, reducing operational surface area.

The key insight: for an audit platform, **initial page load speed matters for the product's own credibility** — we're auditing others' performance while our own app must be fast. Astro's partial hydration (islands architecture) means only the interactive React components hydrate in the browser; server-rendered pages arrive as fast HTML. The audit dashboard is mostly data display — mostly HTML with targeted React islands for charts and interactive tables.

Astro API routes have direct access to `Locals` (set by middleware) and run in the same process as DB clients — no HTTP round-trip between frontend server and API server.

### 9.2 Why Turso (LibSQL)?

Turso is SQLite at the edge with HTTP-based access. For an audit platform, the **data model is fundamentally relational** — users own domains, domains have audits, audits have dimensions and recommendations. SQL is the right tool.

SQLite's simplicity means zero operational complexity (no Postgres cluster to manage), and Turso's global edge replicas deliver low-latency reads. The audit engine writes sequentially (one dimension at a time), which plays to SQLite's single-writer strength. For v1.0 scale (hundreds to low thousands of concurrent users), this is ideal. Drizzle ORM adds type safety without the abstraction overhead of Prisma.

### 9.3 Why React 19 Islands (not full SPA)?

The public-facing pages (landing, shared reports) should be fast, SEO-friendly HTML. The authenticated app is an interactive dashboard. Astro's islands model handles both: static shells with React hydrated only where needed. React 19's `useOptimistic` and `use()` hook specifically benefit the recommendation status update pattern — instant local feedback, async server confirmation.

### 9.4 Why ICE Scoring as the Core Framework?

The audit document explicitly states: *"The ICE framework (Impact, Confidence, Ease) provides numerical prioritization: score each recommendation 1-10 for business impact, confidence in success, and implementation ease, then calculate averages to identify highest-priority items."* ICE is the bridge between technical findings and business decisions. It's the mechanism that makes the report actionable rather than merely comprehensive. Without it, a 47-item recommendation list is overwhelming; with ICE scoring and Quick Wins filtering, it becomes a 5-item sprint backlog.

### 9.5 Why Sequential Analyzer Pipeline?

The audit pipeline is sequential intentionally. Performance analysis (PSI API) is the slowest and most likely to fail. Technical analysis (robots.txt, sitemap) gates subsequent analyzers that rely on crawled HTML. Running all analyzers in parallel risks rate-limiting the PSI API and creates race conditions in the DB writes. Sequential execution with per-dimension DB writes means each completed dimension is immediately visible to the polling frontend — progressive disclosure of results feels faster to the user even if total wall time is similar.

### 9.6 Audit Data as Blobs + Structured Columns

Dimension raw data is stored as a JSON blob in `raw_data` while key metrics (score, issueCount) are structured columns. This balances query efficiency (scoring, filtering by structured columns) with flexibility (new analyzer outputs don't require schema migrations). The blob is never returned to the frontend directly — it's transformed by the report API into the typed `AuditResultSchema`. This separation of storage format from API contract provides evolution safety.

### 9.7 Pluggable Adapter Pattern for Third-Party APIs

Backlink data, rank tracking, and keyword analysis all require paid third-party API keys that not every user will have. The adapter pattern means the application degrades gracefully: without a configured API key, the off-page dimension renders a scaffolded section with configuration instructions rather than failing. Users can progressively enhance their audits as they connect tools. This also future-proofs the platform for v2 integrations.

---

*End of Product Requirements Document*

---

**Document Control**
- Version: 1.0
- SEO Standards Reference: Backlinko, Semrush, Google Search Central (2025)
- CWV Reference: Google PageSpeed Insights v5, NitroPack 2025 Guide
- ICE Framework Reference: Semrush SEO Audit Guide 2025
- Last Updated: 2025
