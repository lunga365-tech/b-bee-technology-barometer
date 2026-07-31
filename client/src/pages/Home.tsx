import { Link } from "wouter";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  FileText,
  Globe,
  LogIn,
  Shield,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";

const TAI_DIMENSIONS = [
  { label: "Digital Infrastructure", score: 32, color: "bg-blue-500", description: "Capital expenditure on 4IR technologies" },
  { label: "Skills Readiness", score: 28, color: "bg-amber-500", description: "Volume and quality of 4IR-aligned training" },
  { label: "Transformation Metrics", score: 45, color: "bg-emerald-500", description: "Black ownership in high-tech operational nodes" },
  { label: "Innovation Culture", score: 22, color: "bg-purple-500", description: "Organisational readiness for digital transformation" },
];

const FEATURES = [
  { icon: BarChart3, title: "Technology Adoption Index", desc: "Real-time TAI scores across four dimensions for every registered maritime entity." },
  { icon: Shield, title: "B-BBEE Compliance Tracking", desc: "Live progress against the proposed 25% Digital Skills Weighting and ESD provisions." },
  { icon: ShieldCheck, title: "Fronting Prevention", desc: "Automated anomaly detection flagging gaps between reported expenditure and verified outcomes." },
  { icon: FileText, title: "Charter Council Reporting", desc: "Automated sectoral transformation reports for the Integrated Transport Sector B-BBEE Charter Council." },
  { icon: TrendingUp, title: "Regulatory Feedback Loop", desc: "Real-time aggregated data supporting the B-BBEE Commission and PRSA joint monitoring obligations." },
  { icon: Globe, title: "Cross-Sector Transferability", desc: "TAI architecture applicable to ICT, Construction, and Financial sectors." },
];

const TARGET_SECTORS = [
  { label: "SAASOA Members", desc: "South African Association of Ship Operators and Agents" },
  { label: "SAAFF Members", desc: "South African Association of Freight Forwarders" },
  { label: "SAMSA-Registered Operators", desc: "South African Maritime Safety Authority registered entities" },
  { label: "TETA-Accredited Providers", desc: "Transport Education Training Authority accredited training providers" },
];

export default function Home() {
  const { user } = useAuth();
  const { data: baseline } = trpc.tai.sectorBaseline.useQuery();

  const avgScore = baseline?.avgTotal ? Number(baseline.avgTotal).toFixed(1) : "31.8";

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-navy flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground leading-tight">B-BBEE Technology</div>
                <div className="text-xs text-muted-foreground leading-tight">Adoption Barometer</div>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Dashboard</Link>
              <Link href="/compliance" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Compliance</Link>
              <Link href="/regulatory" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Regulatory</Link>
              <Link href="/cross-sector" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Cross-Sector</Link>
            </nav>
            <div className="flex items-center gap-2">
              {user ? (
                <Link href="/dashboard">
                  <Button size="sm">Go to Dashboard <ArrowRight className="w-4 h-4 ml-1" /></Button>
                </Link>
              ) : (
                <Button size="sm" variant="outline" onClick={() => startLogin()}>
                  <LogIn className="w-4 h-4 mr-1" /> Sign In
                </Button>
              )}
              <Link href="/register">
                <Button size="sm" className="gradient-navy text-white border-0">Register Your Organisation</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="gradient-navy">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/20 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/10 -translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-3xl">
              <Badge className="mb-6 bg-white/15 text-white border-white/20 hover:bg-white/20 text-xs font-medium tracking-wide uppercase">
                South African Maritime Sector · B-BBEE Compliance Platform
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 text-balance">
                B-BBEE Technology Adoption Barometer
              </h1>
              <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-2xl">
                The first operational platform tracking digital transformation progress across South Africa's maritime sector — advancing real-time B-BBEE verification, monitoring, and scorecard compliance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg">
                    Register Your Organisation <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                    View TAI Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sector Baseline Stats Bar */}
        <div className="bg-white border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary font-display">{avgScore}</div>
                <div className="text-xs text-muted-foreground">Sector TAI Average</div>
              </div>
              {TAI_DIMENSIONS.map((d) => (
                <div key={d.label} className="text-center">
                  <div className="text-2xl font-bold text-foreground font-display">{d.score}</div>
                  <div className="text-xs text-muted-foreground">{d.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TAI Dimensions */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Technology Adoption Index</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The TAI measures digital transformation readiness across four dimensions, providing a standardised baseline for B-BBEE compliance tracking.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TAI_DIMENSIONS.map((dim) => (
              <div key={dim.label} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground">{dim.label}</span>
                  <span className="text-2xl font-bold font-display text-foreground">{dim.score}<span className="text-sm font-normal text-muted-foreground">/100</span></span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-3">
                  <div className={`h-2 rounded-full ${dim.color}`} style={{ width: `${dim.score}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">{dim.description}</p>
              </div>
            ))}
          </div>

          {/* Classification Breakdown */}
          <div className="mt-10 bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Entity Classification Breakdown — Maritime Sector</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Emerging", pct: 60, color: "bg-amber-500", textColor: "text-amber-700", bgLight: "bg-amber-50" },
                { label: "Established", pct: 20, color: "bg-blue-500", textColor: "text-blue-700", bgLight: "bg-blue-50" },
                { label: "Leading", pct: 20, color: "bg-emerald-500", textColor: "text-emerald-700", bgLight: "bg-emerald-50" },
              ].map((cls) => (
                <div key={cls.label} className={`${cls.bgLight} rounded-lg p-4 text-center`}>
                  <div className={`text-3xl font-bold font-display ${cls.textColor}`}>{cls.pct}%</div>
                  <div className={`text-sm font-semibold ${cls.textColor} mt-1`}>{cls.label}</div>
                  <div className="w-full bg-white/60 rounded-full h-1.5 mt-2">
                    <div className={`h-1.5 rounded-full ${cls.color}`} style={{ width: `${cls.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Platform Capabilities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive compliance infrastructure designed for regulators, training providers, and maritime operators.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-10 h-10 rounded-lg gradient-navy flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Sectors CTA */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">Who Should Register?</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The Barometer is designed for the full breadth of South Africa's port community — every entity that operates within or immediately outside the country's commercial ports.
              </p>
              <div className="space-y-3">
                {TARGET_SECTORS.map(({ label, desc }) => (
                  <div key={label} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-foreground text-sm">{label}</div>
                      <div className="text-xs text-muted-foreground">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm text-center">
              <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-foreground mb-3">Join the Platform</h3>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Register your organisation to access the full compliance dashboard, submit quarterly TAI reports, and contribute to the sector's digital transformation baseline.
              </p>
              <Link href="/register">
                <Button size="lg" className="w-full gradient-navy text-white border-0 font-semibold">
                  Register Your Organisation <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground mt-3">No cost to register · Reviewed within 5 business days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Article Context */}
      <section className="py-12 gradient-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white max-w-2xl">
              <div className="text-xs font-medium text-white/60 uppercase tracking-wide mb-2">Academic Foundation</div>
              <h3 className="font-display text-xl font-bold mb-2">Grounded in Peer-Reviewed Research</h3>
              <p className="text-white/75 text-sm leading-relaxed">
                This platform operationalises the Dual Framework proposed in <em>Case Studies on Transport Policy</em> (Elsevier, 2025), based on primary survey data from 254 stakeholders across South Africa's transport and maritime skills ecosystem.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link href="/dashboard">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  View Dashboard <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-white text-primary hover:bg-white/90 font-semibold">
                  Register Your Organisation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white/70 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">B-BBEE Technology Adoption Barometer</div>
                <div className="text-xs">Developed by Lunga Jacobs · Stellenbosch University · 2025</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link href="/compliance" className="hover:text-white transition-colors">Compliance</Link>
              <Link href="/regulatory" className="hover:text-white transition-colors">Regulatory</Link>
              <Link href="/register" className="hover:text-white transition-colors">Register</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

