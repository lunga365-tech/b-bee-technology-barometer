import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, Info, ShieldAlert, ShieldCheck } from "lucide-react";

const severityColor: Record<string, string> = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  low: "bg-blue-100 text-blue-800 border-blue-200",
};

const alertTypeLabel: Record<string, string> = {
  expenditure_learner_gap: "Expenditure–Learner Gap",
  ownership_mismatch: "Ownership Mismatch",
  training_outcome_gap: "Training Outcome Gap",
  documentation_anomaly: "Documentation Anomaly",
};

export default function Compliance() {
  const { data: complianceData } = trpc.compliance.listWithOrgs.useQuery();
  const { data: alertsData } = trpc.fronting.listWithOrgs.useQuery();

  const openAlerts = (alertsData ?? []).filter((a) => a.status === "open" || a.status === "under_review");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">B-BBEE Scorecard Compliance Dashboard</h1>
        <p className="text-muted-foreground mt-2">Live progress against the proposed Digital Skills Weighting, equitable access bonus points, and technology-inclusive ESD provisions.</p>
      </div>

      {/* Proposed Amendments Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-foreground text-sm">Amendment 1</div>
                <div className="text-xs text-muted-foreground mt-0.5">25% Digital Skills Weighting</div>
                <div className="text-xs text-blue-600 mt-1 font-medium">Minimum of total SD expenditure directed to 4IR competencies</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Target</span><span>25%</span>
              </div>
              <Progress value={25} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="font-semibold text-foreground text-sm">Amendment 2</div>
                <div className="text-xs text-muted-foreground mt-0.5">Equitable Access Bonus Points</div>
                <div className="text-xs text-emerald-600 mt-1 font-medium">Subsidised digital access for historically disadvantaged learners</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Bonus Points Available</span><span>Up to 5 pts</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold text-foreground text-sm">Amendment 3</div>
                <div className="text-xs text-muted-foreground mt-0.5">Technology-Inclusive ESD</div>
                <div className="text-xs text-purple-600 mt-1 font-medium">In-kind tech contributions to Black-owned maritime SMMEs recognised as ESD</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Recognition Multiplier</span><span>1.5×</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fronting Prevention Module */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              Fronting Prevention Module
            </CardTitle>
            {openAlerts.length > 0 && (
              <Badge className="bg-red-100 text-red-800 border-red-200">{openAlerts.length} Open Alert{openAlerts.length !== 1 ? "s" : ""}</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Automated anomaly detection flagging gaps between reported training expenditure and verifiable learner outcomes. The B-BBEE Commission's 2024/25 APP records that 92% of complaints relate to fronting and misrepresentation.
          </p>
        </CardHeader>
        <CardContent>
          {openAlerts.length === 0 ? (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-emerald-800 text-sm font-medium">No open fronting alerts at this time.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {openAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-red-800 text-sm">{(alert as any).organisation?.name ?? `Organisation #${alert.organisationId}`}</span>
                      <Badge className={`text-xs ${severityColor[alert.severity]}`}>{alert.severity.toUpperCase()}</Badge>
                      <Badge variant="outline" className="text-xs">{alertTypeLabel[alert.alertType] ?? alert.alertType}</Badge>
                    </div>
                    <p className="text-red-700 text-sm mt-1">{alert.description}</p>
                    {alert.claimedValue && alert.verifiedValue && (
                      <div className="text-xs text-red-600 mt-1">
                        Claimed: <strong>{alert.claimedValue}</strong> · Verified: <strong>{alert.verifiedValue}</strong>
                        {alert.gapPercentage && <span> · Gap: <strong>{Number(alert.gapPercentage).toFixed(1)}%</strong></span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance Reports Table */}
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Compliance Reports</h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 font-semibold">Organisation</th>
                  <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Period</th>
                  <th className="text-center px-3 py-3 font-semibold">4IR SD %</th>
                  <th className="text-center px-3 py-3 font-semibold hidden lg:table-cell">Equitable Access</th>
                  <th className="text-center px-3 py-3 font-semibold hidden lg:table-cell">ESD Tech</th>
                  <th className="text-center px-3 py-3 font-semibold">Overall</th>
                  <th className="text-center px-3 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {(complianceData ?? []).map((r) => (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{(r as any).organisation?.name ?? `Org #${r.organisationId}`}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{r.reportingPeriod}</td>
                    <td className="px-3 py-3 text-center">
                      <span className={`font-mono font-medium ${Number(r.fourirSdPercentage) >= 25 ? "text-emerald-600" : "text-amber-600"}`}>
                        {r.fourirSdPercentage ? `${Number(r.fourirSdPercentage).toFixed(1)}%` : "—"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center hidden lg:table-cell">
                      {r.equitableAccessBonus ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-3 py-3 text-center hidden lg:table-cell">
                      {r.esdTechRecognised ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-3 py-3 text-center font-mono font-bold">{r.overallComplianceScore ? `${Number(r.overallComplianceScore).toFixed(1)}` : "—"}</td>
                    <td className="px-3 py-3 text-center">
                      <Badge variant="outline" className={`text-xs ${r.status === "verified" ? "text-emerald-700 border-emerald-200" : r.status === "flagged" ? "text-red-700 border-red-200" : "text-muted-foreground"}`}>
                        {r.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {(!complianceData || complianceData.length === 0) && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No compliance reports submitted yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

