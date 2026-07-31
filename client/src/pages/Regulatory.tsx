import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Building2, CheckCircle2, Clock, FileText, TrendingUp } from "lucide-react";

export default function Regulatory() {
  const { data: summary, isLoading } = trpc.regulatory.summary.useQuery();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Regulatory Feedback Loop</h1>
        <p className="text-muted-foreground mt-2">Real-time aggregated data supporting the joint monitoring obligations under the March 2024 MOU.</p>
      </div>

      {/* MOU Reference */}
      <Card className="border shadow-sm bg-navy/5 border-primary/20">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-foreground text-sm mb-1">Memorandum of Understanding — 13 March 2024</div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                <strong>B-BBEE Commission and Ports Regulator of South Africa (PRSA)</strong> — Memorandum of Understanding on Economic Transformation in the Ports Sector, signed 13 March 2024. This MOU commits both institutions to joint monitoring of transformation in the ports sector. The Barometer platform operationalises the joint monitoring commitment by providing the real-time data infrastructure that the annual verification cycle cannot generate.
              </div>
              <a
                href="https://www.bbbeecommission.co.za/ports-regulator-sa-b-bbee-commission-sign-mou-to-strengthen-partnership-on-economic-transformation-in-the-ports-sector-2/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline mt-2 inline-block"
              >
                View MOU announcement →
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Monitoring Stats */}
      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <Building2 className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground text-sm">Registered Entities</span>
              </div>
              <div className="text-3xl font-bold font-display text-foreground">{summary?.totalEntities ?? "—"}</div>
              <div className="text-xs text-muted-foreground mt-1">{summary?.approvedEntities ?? 0} approved · {(summary?.totalEntities ?? 0) - (summary?.approvedEntities ?? 0)} pending</div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold text-foreground text-sm">Sector TAI Average</span>
              </div>
              <div className="text-3xl font-bold font-display text-foreground">{summary?.sectorTaiAverage ?? "—"}<span className="text-base font-normal text-muted-foreground">/100</span></div>
              <div className="text-xs text-muted-foreground mt-1">Across all registered entities</div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="font-semibold text-foreground text-sm">Open Fronting Alerts</span>
              </div>
              <div className="text-3xl font-bold font-display text-foreground">{summary?.openFrontingAlerts ?? 0}</div>
              <div className="text-xs text-muted-foreground mt-1">Requiring regulatory attention</div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold text-foreground text-sm">Verified Reports</span>
              </div>
              <div className="text-3xl font-bold font-display text-foreground">{summary?.verifiedComplianceReports ?? 0}</div>
              <div className="text-xs text-muted-foreground mt-1">Compliance reports verified</div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-foreground text-sm">Emerging Entities</span>
              </div>
              <div className="text-3xl font-bold font-display text-amber-600">{summary?.emergingCount ?? 0}</div>
              <div className="text-xs text-muted-foreground mt-1">TAI score 0–40 · Investment needed</div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold text-foreground text-sm">Last Updated</span>
              </div>
              <div className="text-sm font-medium text-foreground">{summary?.lastUpdated ? new Date(summary.lastUpdated).toLocaleString("en-ZA") : "—"}</div>
              <div className="text-xs text-muted-foreground mt-1">Real-time data refresh</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Structural Gaps */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-lg">Three Structural Gaps Addressed by the Barometer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { num: "01", title: "Absence of Real-Time Tracking", desc: "The current annual verification cycle cannot monitor transformation commitments between cycles. The Barometer provides continuous quarterly reporting, eliminating the 12-month blind spot." },
              { num: "02", title: "Point-in-Time Audit Vulnerability", desc: "Annual snapshots create conditions for retrospective inflation and fronting. The B-BBEE Commission's 2024/25 APP records that 92% of complaints relate to fronting and misrepresentation — a direct consequence of annual-only monitoring." },
              { num: "03", title: "Absence of Outcome Measurement", desc: "Training expenditure can be claimed for B-BBEE points regardless of whether training resulted in actual 4IR skills acquisition. The Barometer's Fronting Prevention Module flags gaps between claimed expenditure and verified learner outcomes." },
            ].map((gap) => (
              <div key={gap.num} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                <div className="w-8 h-8 rounded-full gradient-navy flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{gap.num}</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{gap.title}</div>
                  <div className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{gap.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

