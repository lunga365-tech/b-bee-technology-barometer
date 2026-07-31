import { Link } from "wouter";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { ArrowRight, BarChart3, Shield, FileText, TrendingUp, Globe, Users, CheckCircle, AlertTriangle, Building2, Eye } from "lucide-react";

const TAI_DIMENSIONS = [
  { label: "Digital Infrastructure", score: 32, color: "oklch(42% 0.11 200)" },
  { label: "Skills Readiness", score: 28, color: "oklch(52% 0.16 55)" },
  { label: "Transformation Metrics", score: 45, color: "oklch(42% 0.09 145)" },
  { label: "Innovation Culture", score: 22, color: "oklch(45% 0.12 280)" },
];

const FEATURES = [
  {
    icon: BarChart3,
    title: "Technology Adoption Index",
    desc: "Real-time TAI scores across four dimensions: Digital Infrastructure, Skills Readiness, Transformation Metrics, and Innovation Culture.",
    href: "/dashboard",
    accent: "oklch(42% 0.11 200)",
  },
  {
    icon: Shield,
    title: "B-BBEE Compliance Dashboard",
    desc: "Live progress against the proposed 25% Digital Skills Weighting, equitable access bonus points, and technology-inclusive ESD provisions.",
    href: "/compliance",
    accent: "oklch(62% 0.18 55)",
  },
  {
    icon: AlertTriangle,
    title: "Fronting Prevention Module",
    desc: "Automated anomaly detection flagging discrepancies between reported training expenditure and verifiable learner outcomes.",
    href: "/compliance",
    accent: "oklch(55% 0.22 25)",
  },
  {
    icon: FileText,
    title: "Charter Council Reporting",
    desc: "Automated reports for the Integrated Transport Sector B-BBEE Charter Council, aligned with sector code obligations.",
    href: "/charter",
    accent: "oklch(42% 0.09 145)",
  },
  {
    icon: TrendingUp,
    title: "Regulatory Feedback Loop",
    desc: "Real-time aggregated data supporting the B-BBEE Commission and PRSA joint monitoring obligations under the March 2024 MOU.",
    href: "/regulatory",
    accent: "oklch(45% 0.12 280)",
  },
  {
    icon: Globe,
    title: "Cross-Sector Transferability",
    desc: "Applicability of the TAI framework beyond maritime to ICT, Construction, and Financial sectors.",
    href: "/cross-sector",
    accent: "oklch(42% 0.11 200)",
  },
];

const STAKEHOLDERS = [
  { label: "SAASOA", desc: "South African Association of Ship Operators & Agents" },
  { label: "SAAFF", desc: "South African Association of Freight Forwarders" },
  { label: "SAMSA", desc: "South African Maritime Safety Authority registered operators" },
  { label: "TETA", desc: "Transport Education & Training Authority accredited providers" },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { data: orgs } = trpc.organisations.list.useQuery();
  const stats = { total: orgs?.length ?? 10 };

  const avgTAI = ((32 + 28 + 45 + 22) / 4).toFixed(1);

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Roboto', system-ui, sans-serif" }}>
      {/* ── Top utility bar ── */}
      <div style={{ background: "oklch(13% 0.04 240)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container flex items-center justify-between py-1.5">
          <div className="flex items-center gap-3 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            <span>B-BBEE Act 53 of 2003</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Maritime Sector Code</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">Integrated Transport Sector B-BBEE Charter Council</span>
          </div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            {isAuthenticated ? null : (
              <button onClick={() => startLogin()} style={{ color: "rgba(255,255,255,0.75)" }} className="hover:text-white transition-colors">
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Header ── */}
      <header style={{ background: "oklch(17% 0.05 240)" }} className="sticky top-0 z-50 shadow-lg">
        <div style={{ height: "3px", background: "oklch(42% 0.11 200)" }} />
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center justify-center w-10 h-10 rounded select-none"
              style={{ background: "oklch(42% 0.11 200)" }}>
              <span className="text-white font-bold text-sm leading-none" style={{ fontFamily: "Merriweather, Georgia, serif" }}>B</span>
              <span className="font-bold text-xs leading-none" style={{ color: "oklch(62% 0.18 55)" }}>TAB</span>
            </div>
            <div>
              <div className="text-white font-bold text-base leading-tight" style={{ fontFamily: "Merriweather, Georgia, serif" }}>B-BBEE Technology</div>
              <div className="text-xs tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>Adoption Barometer</div>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { href: "/dashboard", label: "TAI Dashboard" },
              { href: "/companies", label: "Companies" },
              { href: "/compliance", label: "Compliance" },
              { href: "/charter", label: "Charter Council" },
              { href: "/regulatory", label: "Regulatory Feedback" },
              { href: "/cross-sector", label: "Cross-Sector" },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="px-3 py-2 text-sm font-medium rounded transition-colors"
                style={{ color: "rgba(255,255,255,0.72)" }}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {!isAuthenticated && (
              <button onClick={() => startLogin()}
                className="hidden sm:block px-4 py-2 text-sm font-medium rounded text-white transition-colors"
                style={{ background: "oklch(62% 0.18 55)" }}>
                Sign In
              </button>
            )}
            <Link href="/register"
              className="px-4 py-2 text-sm font-medium rounded transition-colors"
              style={{ border: "1px solid oklch(58% 0.14 200)", color: "oklch(68% 0.12 200)" }}>
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ background: "linear-gradient(135deg, oklch(17% 0.05 240) 0%, oklch(22% 0.07 200) 50%, oklch(17% 0.05 240) 100%)" }}
        className="relative overflow-hidden">
        {/* Decorative teal stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: "oklch(42% 0.11 200)" }} />
        <div className="container py-20 lg:py-28">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium uppercase tracking-widest mb-6"
              style={{ background: "rgba(255,255,255,0.08)", color: "oklch(68% 0.12 200)", border: "1px solid rgba(255,255,255,0.12)" }}>
              Research Platform · Maritime Sector · South Africa
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "Merriweather, Georgia, serif" }}>
              B-BBEE Technology<br />
              <span style={{ color: "oklch(62% 0.18 55)" }}>Adoption Barometer</span>
            </h1>
            <p className="text-lg mb-8 leading-relaxed max-w-2xl" style={{ color: "rgba(255,255,255,0.7)" }}>
              A real-time compliance monitoring and digital transformation tracking platform operationalising
              the Technology Adoption Index for the South African maritime sector, aligned with the B-BBEE
              Commission and Ports Regulator of South Africa joint monitoring mandate.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded text-white font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: "oklch(62% 0.18 55)" }}>
                Register Your Organisation
                <ArrowRight size={16} />
              </Link>
              <Link href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm transition-all hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.85)" }}>
                View TAI Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* TAI Score strip */}
        <div style={{ background: "rgba(0,0,0,0.3)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="container py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TAI_DIMENSIONS.map(d => (
                <div key={d.label} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.5)" }}>{d.label}</span>
                    <span className="text-sm font-bold text-white">{d.score}<span className="text-xs font-normal" style={{ color: "rgba(255,255,255,0.4)" }}>/100</span></span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${d.score}%`, background: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Sector Stats Bar ── */}
      <section style={{ background: "oklch(42% 0.11 200)" }}>
        <div className="container py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            <div>
              <div className="text-2xl font-bold" style={{ fontFamily: "Merriweather, Georgia, serif" }}>{avgTAI}</div>
              <div className="text-xs uppercase tracking-wide opacity-80 mt-0.5">Sector TAI Average</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ fontFamily: "Merriweather, Georgia, serif" }}>{stats?.total ?? 10}</div>
              <div className="text-xs uppercase tracking-wide opacity-80 mt-0.5">Registered Entities</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ fontFamily: "Merriweather, Georgia, serif" }}>60%</div>
              <div className="text-xs uppercase tracking-wide opacity-80 mt-0.5">Emerging Classification</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ fontFamily: "Merriweather, Georgia, serif" }}>25%</div>
              <div className="text-xs uppercase tracking-wide opacity-80 mt-0.5">Proposed Digital Skills Weighting</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Platform Features ── */}
      <section className="py-16" style={{ background: "oklch(98% 0.005 240)" }}>
        <div className="container">
          <div className="mb-10">
            <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "oklch(42% 0.11 200)" }}>Platform Capabilities</div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "Merriweather, Georgia, serif", color: "oklch(17% 0.05 240)" }}>
              Comprehensive B-BBEE Technology Monitoring
            </h2>
            <div className="mt-2 w-12 h-0.5" style={{ background: "oklch(62% 0.18 55)" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <Link key={f.href + f.title} href={f.href}
                className="group block bg-white rounded p-5 transition-all hover:shadow-md"
                style={{ border: "1px solid oklch(88% 0.01 240)", borderTop: `3px solid ${f.accent}` }}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: `color-mix(in oklch, ${f.accent} 12%, white)` }}>
                    <f.icon size={18} style={{ color: f.accent }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1" style={{ color: "oklch(17% 0.05 240)" }}>{f.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "oklch(45% 0.03 240)" }}>{f.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs font-medium transition-colors group-hover:opacity-80"
                  style={{ color: f.accent }}>
                  Learn more <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Target Stakeholders ── */}
      <section className="py-14 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "oklch(42% 0.11 200)" }}>Target Stakeholders</div>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "Merriweather, Georgia, serif", color: "oklch(17% 0.05 240)" }}>
                Built for Maritime Sector Organisations
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "oklch(40% 0.03 240)" }}>
                The Barometer is designed specifically for organisations operating within the South African maritime
                sector, providing a structured pathway for B-BBEE compliance reporting, digital transformation
                tracking, and regulatory engagement.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STAKEHOLDERS.map(s => (
                  <div key={s.label} className="flex items-start gap-2 p-3 rounded"
                    style={{ background: "oklch(97% 0.01 240)", border: "1px solid oklch(88% 0.01 240)" }}>
                    <CheckCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: "oklch(42% 0.11 200)" }} />
                    <div>
                      <div className="text-xs font-semibold" style={{ color: "oklch(17% 0.05 240)" }}>{s.label}</div>
                      <div className="text-xs" style={{ color: "oklch(50% 0.03 240)" }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {/* Entity classification */}
              <div className="p-5 rounded" style={{ background: "oklch(17% 0.05 240)" }}>
                <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Entity Classification Breakdown
                </div>
                {[
                  { label: "Emerging", pct: 60, color: "oklch(62% 0.18 55)" },
                  { label: "Established", pct: 20, color: "oklch(42% 0.11 200)" },
                  { label: "Leading", pct: 20, color: "oklch(42% 0.09 145)" },
                ].map(c => (
                  <div key={c.label} className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-white">{c.label}</span>
                      <span className="text-xs font-bold text-white">{c.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                      <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.color }} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Regulatory alignment */}
              <div className="p-4 rounded" style={{ border: "1px solid oklch(88% 0.01 240)", borderLeft: "3px solid oklch(62% 0.18 55)" }}>
                <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "oklch(62% 0.18 55)" }}>
                  Regulatory Alignment
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "oklch(40% 0.03 240)" }}>
                  Aligned with the March 2024 Memorandum of Understanding between the B-BBEE Commission
                  and the Ports Regulator of South Africa, establishing joint monitoring obligations for
                  digital transformation compliance in the maritime sector.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Role Access Banner ── */}
      <section className="py-12" style={{ background: "oklch(97% 0.01 240)", borderTop: "3px solid oklch(42% 0.11 200)" }}>
        <div className="container">
          <div className="text-center mb-8">
            <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "oklch(42% 0.11 200)" }}>Platform Access</div>
            <h2 className="text-xl font-bold" style={{ fontFamily: "Merriweather, Georgia, serif", color: "oklch(17% 0.05 240)" }}>
              Designed for Every Stakeholder Role
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Building2,
                role: "Organisation",
                desc: "Register your maritime entity, submit compliance reports, and track your TAI score in real time.",
                color: "oklch(42% 0.11 200)",
                cta: "Register Your Organisation",
                href: "/register",
              },
              {
                icon: Eye,
                role: "Examiner",
                desc: "View all registered companies, their TAI scores, and compliance data. Full read access to the sector-wide dataset.",
                color: "oklch(45% 0.12 280)",
                cta: "View Company Directory",
                href: "/companies",
              },
              {
                icon: Users,
                role: "Verifier",
                desc: "Verify compliance reports, resolve fronting alerts, and provide official verification sign-off for registered entities.",
                color: "oklch(42% 0.09 145)",
                cta: "Sign In to Verify",
                href: "#",
                onClick: true,
              },
            ].map(r => (
              <div key={r.role} className="bg-white rounded p-5"
                style={{ border: "1px solid oklch(88% 0.01 240)", borderTop: `3px solid ${r.color}` }}>
                <div className="w-10 h-10 rounded flex items-center justify-center mb-3"
                  style={{ background: `color-mix(in oklch, ${r.color} 12%, white)` }}>
                  <r.icon size={20} style={{ color: r.color }} />
                </div>
                <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: r.color }}>{r.role}</div>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "oklch(40% 0.03 240)" }}>{r.desc}</p>
                {r.onClick ? (
                  <button onClick={() => startLogin()}
                    className="inline-flex items-center gap-1 text-xs font-medium transition-colors"
                    style={{ color: r.color }}>
                    {r.cta} <ArrowRight size={11} />
                  </button>
                ) : (
                  <Link href={r.href}
                    className="inline-flex items-center gap-1 text-xs font-medium transition-colors"
                    style={{ color: r.color }}>
                    {r.cta} <ArrowRight size={11} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-14" style={{ background: "oklch(17% 0.05 240)" }}>
        <div className="container text-center">
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "Merriweather, Georgia, serif" }}>
            Ready to Join the Barometer?
          </h2>
          <p className="text-sm mb-6 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
            Register your maritime organisation to begin tracking your Technology Adoption Index and
            contributing to sector-wide B-BBEE compliance data.
          </p>
          <Link href="/register"
            className="inline-flex items-center gap-2 px-8 py-3 rounded text-white font-semibold text-sm transition-all hover:opacity-90"
            style={{ background: "oklch(62% 0.18 55)" }}>
            Register Your Organisation
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "oklch(13% 0.04 240)", color: "rgba(255,255,255,0.5)" }}>
        <div style={{ height: "3px", background: "oklch(62% 0.18 55)" }} />
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-xs"
                  style={{ background: "oklch(42% 0.11 200)", fontFamily: "Merriweather, Georgia, serif" }}>B</div>
                <span className="text-white font-semibold text-sm" style={{ fontFamily: "Merriweather, Georgia, serif" }}>B-BBEE Technology Adoption Barometer</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                A research platform operationalising real-time B-BBEE compliance monitoring and digital transformation tracking for the South African maritime sector.
              </p>
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-3">Regulatory Framework</h4>
              <ul className="space-y-1 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                <li>B-BBEE Act 53 of 2003</li>
                <li>Maritime Sector Code</li>
                <li>March 2024 MOU — B-BBEE Commission & PRSA</li>
                <li>Integrated Transport Sector Charter Council</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-3">Platform</h4>
              <ul className="space-y-1 text-xs">
                {[
                  { href: "/dashboard", label: "TAI Dashboard" },
                  { href: "/companies", label: "Company Directory" },
                  { href: "/compliance", label: "Compliance" },
                  { href: "/register", label: "Register Your Organisation" },
                ].map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.35)" }}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
            style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.2)" }}>
            <span>© 2024 B-BBEE Technology Adoption Barometer. Research platform — demonstration data only.</span>
            <span>Aligned with B-BBEE Commission & Ports Regulator of South Africa</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
