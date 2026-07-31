import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { CheckSquare, AlertTriangle, Clock, CheckCircle, FileText, Building2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const TEAL = "#007A87";
const GOLD = "#E8821A";
const NAVY = "#0D2137";

export default function Verify() {
  const { user, isAuthenticated } = useAuth();
  const isVerifier = isAuthenticated && (user?.role === "verifier" || user?.role === "admin");

  const { data: reportsData, refetch: refetchReports } = trpc.compliance.listWithOrgs.useQuery();
  const { data: alertsData, refetch: refetchAlerts } = trpc.fronting.listWithOrgs.useQuery();
  const [tab, setTab] = useState<"reports" | "alerts">("reports");
  const [resolving, setResolving] = useState<number | null>(null);

  const resolveAlert = trpc.fronting.resolve.useMutation({
    onSuccess: () => { toast.success("Alert resolved"); refetchAlerts(); setResolving(null); },
    onError: () => toast.error("Failed to resolve alert"),
  });

  const verifyReport = trpc.compliance.verify.useMutation({
    onSuccess: () => { toast.success("Report updated"); refetchReports(); },
    onError: () => toast.error("Failed to update report"),
  });

  if (!isAuthenticated) {
    return (
      <div className="container py-16 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#007A8712" }}>
          <CheckSquare size={28} style={{ color: TEAL }} />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "Merriweather, Georgia, serif", color: NAVY }}>Verifier Portal</h2>
        <p className="text-sm mb-6" style={{ color: "#6B7280" }}>Sign in with a Verifier account to access the verification portal.</p>
        <button onClick={() => startLogin()} className="px-6 py-2.5 rounded text-white font-medium text-sm" style={{ background: TEAL }}>Sign In</button>
      </div>
    );
  }

  if (!isVerifier) {
    return (
      <div className="container py-16 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#FEF3C7" }}>
          <AlertTriangle size={28} style={{ color: GOLD }} />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "Merriweather, Georgia, serif", color: NAVY }}>Verifier Access Required</h2>
        <p className="text-sm" style={{ color: "#6B7280" }}>Your account does not have Verifier privileges. Contact the platform administrator.</p>
      </div>
    );
  }

  // listWithOrgs returns spread: { ...report/alert fields, organisation: org }
  const pendingReports = (reportsData ?? []).filter(r => r.status === "submitted" || r.status === "draft");
  const openAlerts = (alertsData ?? []).filter(a => a.status === "open");

  return (
    <div>
      <div className="container py-8">
        <div className="mb-6 pb-4" style={{ borderBottom: "1px solid #E5E7EB" }}>
          <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: TEAL }}>Verifier Portal</div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Merriweather, Georgia, serif", color: NAVY }}>Compliance Verification</h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>Review compliance reports and resolve fronting prevention alerts.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Pending Reports", value: pendingReports.length, color: GOLD, icon: Clock },
            { label: "Open Alerts", value: openAlerts.length, color: "#DC2626", icon: AlertTriangle },
            { label: "Total Reports", value: reportsData?.length ?? 0, color: TEAL, icon: FileText },
            { label: "Total Alerts", value: alertsData?.length ?? 0, color: "#5C4B8A", icon: CheckSquare },
          ].map(s => (
            <div key={s.label} className="bg-white rounded p-4 flex items-center gap-3"
              style={{ border: "1px solid #E5E7EB", borderTop: `3px solid ${s.color}` }}>
              <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}18` }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ fontFamily: "Merriweather, Georgia, serif", color: NAVY }}>{s.value}</div>
                <div className="text-xs" style={{ color: "#9CA3AF" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-0 mb-6 border-b" style={{ borderColor: "#E5E7EB" }}>
          {[
            { id: "reports" as const, label: `Compliance Reports (${pendingReports.length} pending)` },
            { id: "alerts" as const, label: `Fronting Alerts (${openAlerts.length} open)` },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px"
              style={tab === t.id ? { borderColor: TEAL, color: TEAL } : { borderColor: "transparent", color: "#6B7280" }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "reports" && (
          <div className="space-y-3">
            {(reportsData ?? []).length === 0 ? (
              <div className="text-center py-12 text-sm" style={{ color: "#9CA3AF" }}>No compliance reports yet.</div>
            ) : (
              (reportsData ?? []).map(row => (
                <div key={row.id} className="bg-white rounded p-5"
                  style={{ border: "1px solid #E5E7EB", borderLeft: `4px solid ${row.status === "verified" ? "#2E7D4F" : row.status === "flagged" ? "#DC2626" : GOLD}` }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0" style={{ background: "#007A8712" }}>
                        <Building2 size={16} style={{ color: TEAL }} />
                      </div>
                      <div>
                        <div className="font-semibold text-sm" style={{ color: NAVY }}>{row.organisation?.name ?? "Unknown Organisation"}</div>
                        <div className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
                          Period: {row.reportingPeriod} · Submitted: {row.submittedAt ? new Date(row.submittedAt).toLocaleDateString() : "Draft"}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                          {[
                            { label: "Digital Skills Target", value: `${row.digitalSkillsWeightingTarget ?? 25}%` },
                            { label: "Claimed Learners", value: row.claimedLearnersCount ?? 0 },
                            { label: "Verified Learners", value: row.verifiedLearnersCount ?? 0 },
                            { label: "Compliance Score", value: `${row.overallComplianceScore ?? 0}/100` },
                          ].map(f => (
                            <div key={f.label} className="text-xs">
                              <div style={{ color: "#9CA3AF" }}>{f.label}</div>
                              <div className="font-semibold" style={{ color: NAVY }}>{f.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                        style={row.status === "verified" ? { background: "#2E7D4F18", color: "#2E7D4F" }
                          : row.status === "flagged" ? { background: "#DC262618", color: "#DC2626" }
                          : { background: "#E8821A18", color: "#9A4E00" }}>
                        {row.status === "verified" ? <CheckCircle size={10} /> : <Clock size={10} />}
                        {row.status}
                      </span>
                      {(row.status === "submitted" || row.status === "draft") && (
                        <div className="flex gap-2">
                          <button onClick={() => verifyReport.mutate({ reportId: row.id, status: "verified" })}
                            className="px-3 py-1.5 rounded text-xs font-medium text-white" style={{ background: "#2E7D4F" }}>
                            Verify
                          </button>
                          <button onClick={() => verifyReport.mutate({ reportId: row.id, status: "rejected" })}
                            className="px-3 py-1.5 rounded text-xs font-medium text-white" style={{ background: "#DC2626" }}>
                            Flag
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "alerts" && (
          <div className="space-y-3">
            {(alertsData ?? []).length === 0 ? (
              <div className="text-center py-12 text-sm" style={{ color: "#9CA3AF" }}>No fronting alerts.</div>
            ) : (
              (alertsData ?? []).map(row => (
                <div key={row.id} className="bg-white rounded p-5"
                  style={{ border: "1px solid #E5E7EB", borderLeft: `4px solid ${row.status === "resolved" ? "#2E7D4F" : "#DC2626"}` }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
                        style={{ background: row.status === "resolved" ? "#2E7D4F18" : "#DC262618" }}>
                        <AlertTriangle size={16} style={{ color: row.status === "resolved" ? "#2E7D4F" : "#DC2626" }} />
                      </div>
                      <div>
                        <div className="font-semibold text-sm" style={{ color: NAVY }}>{row.organisation?.name ?? "Unknown Organisation"}</div>
                        <div className="text-xs font-medium mt-0.5" style={{ color: "#DC2626" }}>{row.alertType.replace(/_/g, " ").toUpperCase()}</div>
                        <p className="text-xs mt-1 leading-relaxed" style={{ color: "#6B7280" }}>{row.description}</p>
                        <div className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                          Severity: <span className="font-medium" style={{ color: row.severity === "high" ? "#DC2626" : row.severity === "medium" ? GOLD : "#6B7280" }}>{row.severity}</span>
                          {" · "}Detected: {new Date(row.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                        style={row.status === "resolved" ? { background: "#2E7D4F18", color: "#2E7D4F" } : { background: "#DC262618", color: "#DC2626" }}>
                        {row.status === "resolved" ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                        {row.status}
                      </span>
                      {row.status === "open" && (
                        <button disabled={resolving === row.id}
                          onClick={() => { setResolving(row.id); resolveAlert.mutate({ alertId: row.id }); }}
                          className="px-3 py-1.5 rounded text-xs font-medium text-white disabled:opacity-60"
                          style={{ background: "#2E7D4F" }}>
                          {resolving === row.id ? "Resolving…" : "Mark Resolved"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

