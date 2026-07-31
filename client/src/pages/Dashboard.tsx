import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, Info } from "lucide-react";

const SECTOR_BASELINE = [
  { dimension: "Digital Infrastructure", score: 32, fill: "#3b82f6" },
  { dimension: "Skills Readiness", score: 28, fill: "#f59e0b" },
  { dimension: "Transformation Metrics", score: 45, fill: "#10b981" },
  { dimension: "Innovation Culture", score: 22, fill: "#8b5cf6" },
];

const RADAR_DATA = SECTOR_BASELINE.map((d) => ({ subject: d.dimension.split(" ")[0], score: d.score, fullMark: 100 }));

const classificationColor: Record<string, string> = {
  Emerging: "bg-amber-100 text-amber-800 border-amber-200",
  Established: "bg-blue-100 text-blue-800 border-blue-200",
  Leading: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const orgTypeLabel: Record<string, string> = {
  terminal_operator: "Terminal Operator",
  ship_agent: "Ship Agent",
  stevedore: "Stevedore",
  bunker_supplier: "Bunker Supplier",
  freight_forwarder: "Freight Forwarder",
  training_provider: "Training Provider",
  port_service: "Port Service",
  shipping_line: "Shipping Line",
  marine_surveyor: "Marine Surveyor",
  other: "Other",
};

export default function Dashboard() {
  const { data: allLatest, isLoading } = trpc.tai.allLatest.useQuery();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Technology Adoption Index Dashboard</h1>
        <p className="text-muted-foreground mt-2">Sector baseline scores and entity-level TAI performance across the maritime sector.</p>
      </div>

      {/* Demonstration Banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-amber-800 text-sm">Demonstration Dataset</div>
          <div className="text-amber-700 text-sm mt-0.5">
            All maritime entities displayed below are <strong>seeded demonstration data</strong> and do not represent live registrations or actual B-BBEE compliance records. This dataset illustrates the platform's capabilities and establishes sector baselines for research purposes. Real organisations may register via the <a href="/register" className="underline font-medium">registration page</a>.
          </div>
        </div>
      </div>

      {/* Sector Baseline Cards */}
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Sector Baseline — TAI Dimension Scores</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {SECTOR_BASELINE.map((dim) => (
            <Card key={dim.dimension} className="border shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground">{dim.dimension}</span>
                  <span className="text-2xl font-bold font-display" style={{ color: dim.fill }}>{dim.score}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${dim.score}%`, backgroundColor: dim.fill }} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">out of 100</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base">Sector Baseline — Bar Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={SECTOR_BASELINE} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="dimension" tick={{ fontSize: 10 }} tickFormatter={(v) => v.split(" ")[0]} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => [`${v}/100`, "TAI Score"]} />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {SECTOR_BASELINE.map((entry) => (
                    <Cell key={entry.dimension} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base">Sector Baseline — Radar Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <Radar name="Sector Average" dataKey="score" stroke="#1e3a5f" fill="#1e3a5f" fillOpacity={0.25} />
                <Tooltip formatter={(v) => [`${v}/100`, "Score"]} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Classification Breakdown */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-base">Entity Classification Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Emerging", pct: 60, desc: "TAI score 0–40 · Significant investment needed", color: "bg-amber-500" },
              { label: "Established", pct: 20, desc: "TAI score 41–70 · Progressing toward digital maturity", color: "bg-blue-500" },
              { label: "Leading", pct: 20, desc: "TAI score 71–100 · Digital transformation exemplar", color: "bg-emerald-500" },
            ].map((cls) => (
              <div key={cls.label} className="text-center p-4 rounded-lg bg-muted/40">
                <div className="text-4xl font-bold font-display text-foreground">{cls.pct}%</div>
                <div className="font-semibold text-foreground mt-1">{cls.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{cls.desc}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Entity Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-foreground">Entity TAI Scores</h2>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Info className="w-3.5 h-3.5" />
            Demonstration data only
          </div>
        </div>
        {isLoading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Organisation</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">Type</th>
                    <th className="text-center px-3 py-3 font-semibold text-blue-600">Digital Infra</th>
                    <th className="text-center px-3 py-3 font-semibold text-amber-600">Skills</th>
                    <th className="text-center px-3 py-3 font-semibold text-emerald-600">Transform.</th>
                    <th className="text-center px-3 py-3 font-semibold text-purple-600">Innovation</th>
                    <th className="text-center px-3 py-3 font-semibold text-foreground">Total</th>
                    <th className="text-center px-3 py-3 font-semibold text-foreground">Class.</th>
                  </tr>
                </thead>
                <tbody>
                  {(allLatest ?? []).map(({ org, score }) => (
                    <tr key={org.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{org.name}</div>
                        {org.isDemo && <Badge variant="outline" className="text-xs mt-0.5 text-amber-600 border-amber-200">Demo</Badge>}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{orgTypeLabel[org.orgType] ?? org.orgType}</td>
                      <td className="px-3 py-3 text-center font-mono font-medium text-blue-600">{score ? Number(score.digitalInfrastructure).toFixed(0) : "—"}</td>
                      <td className="px-3 py-3 text-center font-mono font-medium text-amber-600">{score ? Number(score.skillsReadiness).toFixed(0) : "—"}</td>
                      <td className="px-3 py-3 text-center font-mono font-medium text-emerald-600">{score ? Number(score.transformationMetrics).toFixed(0) : "—"}</td>
                      <td className="px-3 py-3 text-center font-mono font-medium text-purple-600">{score ? Number(score.innovationCulture).toFixed(0) : "—"}</td>
                      <td className="px-3 py-3 text-center font-bold font-mono text-foreground">{score ? Number(score.totalScore).toFixed(1) : "—"}</td>
                      <td className="px-3 py-3 text-center">
                        {score && (
                          <Badge className={`text-xs ${classificationColor[score.classification]}`}>{score.classification}</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                  {(!allLatest || allLatest.length === 0) && (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No entity data available yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

