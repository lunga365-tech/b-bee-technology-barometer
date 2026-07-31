# B-BBEE Technology Adoption Barometer — TODO

## Database & Backend
- [x] Define full database schema (organisations, tai_scores, compliance_reports, fronting_alerts, charter_reports, registrations)
- [x] Run schema migration
- [x] Seed demonstration dataset (10 maritime entities)
- [x] tRPC router: organisations (list, get, register, admin CRUD)
- [x] tRPC router: TAI scores (sector baseline, per-entity, dimension breakdown)
- [x] tRPC router: compliance (scorecard progress, ESD, digital skills weighting)
- [x] tRPC router: fronting alerts (anomaly detection, flag/resolve)
- [x] tRPC router: charter council reports (generate, list, export)
- [x] tRPC router: regulatory feedback (aggregated MOU monitoring data)
- [x] tRPC router: admin (manage orgs, review reports, export data)
- [x] Vitest tests for all routers

## Public Landing Page
- [x] Hero section with platform purpose and article context
- [x] TAI sector overview cards (4 dimensions with baseline scores)
- [x] Entity classification breakdown (60% Emerging, 20% Established, 20% Leading)
- [x] "Register Your Organisation" CTA button
- [x] Target sector callout (SAASOA, SAAFF, SAMSA, TETA-accredited providers)
- [x] Navigation header with all platform sections
- [x] Footer with article citation and platform info

## TAI Dashboard
- [x] Sector baseline score cards: Digital Infrastructure (32), Skills Readiness (28), Transformation (45), Innovation Culture (22)
- [x] Entity classification donut/pie chart (60/20/20)
- [x] Demonstration dataset banner
- [x] Per-entity TAI score table with bar charts
- [x] Per-entity radar chart
- [x] Dimension filter and entity filter controls

## B-BBEE Scorecard Compliance Dashboard
- [x] 25% Digital Skills Weighting progress tracker
- [x] Equitable access bonus points progress
- [x] Technology-inclusive ESD provisions progress
- [x] Fronting Prevention Module — anomaly alerts on dashboard
- [x] Live compliance status per entity

## Fronting Prevention Module
- [x] Anomaly detection logic (training expenditure vs learner outcomes gap)
- [x] Alert indicators on compliance dashboard
- [x] Alert detail view with resolution workflow

## Charter Council Reporting
- [x] Automated sectoral transformation report for Integrated Transport Sector B-BBEE Charter Council
- [x] Report generation and download
- [x] Historical report archive

## Organisation Registration
- [x] Registration form (org name, type, SAMSA/SETA number, contact details)
- [x] Confirmation flow
- [x] Admin review queue

## Regulatory Feedback Loop Page
- [x] March 2024 MOU reference (B-BBEE Commission + PRSA)
- [x] Real-time aggregated monitoring data
- [x] Joint monitoring dashboard

## Cross-Sector Transferability Section
- [x] ICT Sector applicability
- [x] Construction Sector applicability
- [x] Financial Sector applicability
- [x] TAI modular design explanation

## Admin Dashboard (owner-only)
- [x] Manage registered organisations
- [x] Review submitted reports
- [x] Export data (CSV/JSON)
- [x] User management
- [x] Alert management

## Infrastructure
- [ ] Custom domain DNS: b-beetechnologybarometer.co.za
- [x] Checkpoint saved
- [x] Published to permanent URL
