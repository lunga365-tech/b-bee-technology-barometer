import { trpc } from "@/lib/trpc";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { AlertTriangle, Building2, Award, TrendingUp } from "lucide-react";

const TEAL = "#007A87";
const GOLD = "#E8821A";
const NAVY = "#0D2137";

const SECTOR_BASELINE = [
  { dimension: "Digital Infrastructure", score: 32, fill: TEAL },
  { dimension: "Skills Readiness", score: 28, fill: GOLD },
  { dimension: "Transformation Metrics", score: 45, fill: "#2E7D4F" },
  { dimension: "Innovation Culture", score: 22, fill: "#5C4B8A" },
];

const RADAR_DATA = SECTOR_BASELINE.map(d => ({
  subject: d.dimension.split(" ")[0],
  score: d.score,
  fullMark: 100,
}));

const CLASSIFICATION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Emerging:    { bg: "#E8821A18", text: "#9A4E00", border: "#E8821A40" },
  Established: { bg: "#007A8718", text: "#004D57", border: "#007A8740" },
  Leading:     { bg: "#2E7D4F18", text: "#1A4D2E", border: "#2E7D4F40" },
};

const ORG_TYPE_LABELS: Record<string, string> = {
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

function ScoreCard({ label, score, color }: { label: string; score: number; color: string }) {
  const level = score < 30 ? "Below threshold" : score < 50 ? "Developing" : score < 70 ? "Progressing" : "Advanced";
  return (
    <div className="bg-white rounded p-4" style={{ border: "1px solid #E5E7EB", borderTop: `3px solid ${color}` }}>
      <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color }}>{label}</div>
      <div className="flex items-end gap-1 mb-2">
        <span className="text-3xl font-bold" style={{ fontFamily: "Merriweather, Georgia, serif", color: NAVY }}>{score}</span>
        <span className="text-sm mb-1 ml-0.5" style={{ color: "#6B7280" }}>/100</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100">
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
      </div>
      <div className="text-xs mt-1" style={{ color: "#9CA3AF" }}>{level}</div>
    </div>
  );
}

function ClassBadge({ cls }: { cls: string }) {
  const c = CLASSIFICATION_COLORS[cls] ?? { bg: "#F3F4F6", text: "#374151", border: "#D1D5DB" };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      {cls}
    </span>
  );
}

export default function Dashboard() {
  const { data: allLatest, isLoading } = trpc.tai.allLatest.useQuery();

  return (
    <div>
      {/* Demo banner */}
      <div className="py-2.5 px-4 text-center text-xs font-medium"
        style={{ background: "#FEF3C7", color: "#92400E", borderBottom: "1px solid #FDE68A" }}>
        <AlertTriangle size={12} className="inline mr-1.5 mb-0.5" />
        Demonstration Dataset — All displayed maritime entities are seeded demonstration data, not live registrations.
      </div>

      <div className="container py-8">
        {/* Page header */}
        <div className="mb-8 pb-4" style={{ borderBottom: "1px solid #E5E7EB" }}>
          <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: TEAL }}>Technology Adoption Index</div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Merriweather, Georgia, serif", color: NAVY }}>
            TAI Dashboard — Maritime Sector Baseline
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Sector-wide Technology Adoption Index scores across all four dimensions, aligned with the B-BBEE Commission monitoring framework.
          </p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <ScoreCard label="Digital Infrastructure" score={32} color={TEAL} />
          <ScoreCard label="Skills Readiness" score={28} color={GOLD} />
          <ScoreCard label="Transformation Metrics" score={45} color="#2E7D4F" />
          <ScoreCard label="Innovation Culture" score={22} color="#5C4B8A" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded p-5" style={{ border: "1px solid #E5E7EB", borderTop: `3px solid ${TEAL}` }}>
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: TEAL }}>
              Sector Baseline — All Dimensions
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={SECTOR_BASELINE} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="dimension" tick={{ fontSize: 10, fill: "#6B7280" }} tickFormatter={v => v.split(" ")[0]} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#6B7280" }} />
                <Tooltip formatter={(v: number) => [`${v}/100`, "TAI Score"]}
                  contentStyle={{ fontSize: 12, borderRadius: 4, border: "1px solid #E5E7EB" }} />
                <Bar dataKey="score" radius={[2, 2, 0, 0]}>
                  {SECTOR_BASELINE.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded p-5" style={{ border: "1px solid #E5E7EB", borderTop: `3px solid ${GOLD}` }}>
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: GOLD }}>
              Sector Radar Profile
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#374151" }} />
                <Radar name="Sector" dataKey="score" stroke={TEAL} fill={TEAL} fillOpacity={0.18} strokeWidth={2} />
                <Tooltip formatter={(v: number) => [`${v}/100`, "Score"]}
                  contentStyle={{ fontSize: 12, borderRadius: 4, border: "1px solid #E5E7EB" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Classification summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Emerging", pct: 60, desc: "TAI 0–40 · Significant investment needed", color: GOLD, icon: Building2 },
            { label: "Established", pct: 20, desc: "TAI 41–70 · Progressing toward digital maturity", color: TEAL, icon: TrendingUp },
            { label: "Leading", pct: 20, desc: "TAI 71–100 · Digital transformation exemplar", color: "#2E7D4F", icon: Award },
          ].map(c => (
            <div key={c.label} className="bg-white rounded p-4 flex items-center gap-4"
              style={{ border: "1px solid #E5E7EB", borderLeft: `4px solid ${c.color}` }}>
              <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: `${c.color}18` }}>
                <c.icon size={20} style={{ color: c.color }} />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ fontFamily: "Merriweather, Georgia, serif", color: NAVY }}>{c.pct}%</div>
                <div className="text-xs font-semibold" style={{ color: c.color }}>{c.label}</div>
                <div className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{c.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Entity table */}
        <div className="bg-white rounded overflow-hidden" style={{ border: "1px solid #E5E7EB", borderTop: `3px solid ${TEAL}` }}>
          <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "#E5E7EB" }}>
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>
              Registered Entities — Demonstration Dataset
            </div>
            <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: "#FEF3C7", color: "#92400E" }}>
              Demo Data
            </span>
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-sm" style={{ color: "#9CA3AF" }}>Loading entities…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                    {["Organisation", "Type", "Digital Infra", "Skills", "Transform.", "Innovation", "Total", "Class."].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide"
                        style={{ color: "#6B7280" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(allLatest ?? []).map(({ org, score }, i) => (
                    <tr key={org.id} className="border-b transition-colors"
                      style={{ borderColor: "#F3F4F6", background: i % 2 === 0 ? "white" : "#FAFAFA" }}>
                      <td className="px-4 py-3">
                        <div className="font-medium" style={{ color: NAVY }}>{org.name}</div>
                        {org.isDemo && (
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#FEF3C7", color: "#92400E" }}>Demo</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#6B7280" }}>
                        {ORG_TYPE_LABELS[org.orgType] ?? org.orgType}
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-semibold text-sm" style={{ color: TEAL }}>
                        {score ? Number(score.digitalInfrastructure).toFixed(0) : "—"}
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-semibold text-sm" style={{ color: GOLD }}>
                        {score ? Number(score.skillsReadiness).toFixed(0) : "—"}
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-semibold text-sm" style={{ color: "#2E7D4F" }}>
                        {score ? Number(score.transformationMetrics).toFixed(0) : "—"}
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-semibold text-sm" style={{ color: "#5C4B8A" }}>
                        {score ? Number(score.innovationCulture).toFixed(0) : "—"}
                      </td>
                      <td className="px-4 py-3 text-center font-bold font-mono" style={{ color: NAVY }}>
                        {score ? Number(score.totalScore).toFixed(1) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {score && <ClassBadge cls={score.classification} />}
                      </td>
                    </tr>
                  ))}
                  {(!allLatest || allLatest.length === 0) && (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-sm" style={{ color: "#9CA3AF" }}>No entity data available.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
