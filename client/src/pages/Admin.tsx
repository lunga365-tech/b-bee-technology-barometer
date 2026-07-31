import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { AlertTriangle, Building2, FileText, LogIn, ShieldAlert, Users } from "lucide-react";

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const { data: stats, isLoading: statsLoading } = trpc.admin.stats.useQuery(undefined, { enabled: user?.role === "admin" });
  const { data: orgs } = trpc.admin.allOrganisations.useQuery(undefined, { enabled: user?.role === "admin" });
  const { data: alerts } = trpc.admin.allAlerts.useQuery(undefined, { enabled: user?.role === "admin" });
  const { data: registrations } = trpc.admin.allRegistrations.useQuery(undefined, { enabled: user?.role === "admin" });

  const updateAlertStatus = trpc.fronting.updateStatus.useMutation({
    onSuccess: () => { toast.success("Alert status updated."); utils.admin.allAlerts.invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const updateRegStatus = trpc.registration.updateStatus.useMutation({
    onSuccess: () => { toast.success("Registration status updated."); utils.admin.allRegistrations.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20">
        <ShieldAlert className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
        <h2 className="font-display text-xl font-semibold text-foreground mb-2">Admin Access Required</h2>
        <p className="text-muted-foreground mb-4">Please sign in with an administrator account to access this page.</p>
        <Button onClick={() => startLogin()}><LogIn className="w-4 h-4 mr-1" /> Sign In</Button>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="text-center py-20">
        <ShieldAlert className="w-12 h-12 mx-auto mb-4 text-red-400" />
        <h2 className="font-display text-xl font-semibold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground">This page is restricted to platform administrators only.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage registered organisations, review submissions, and monitor platform activity.</p>
      </div>

      {/* Stats */}
      {statsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Building2, label: "Total Organisations", value: stats?.totalOrganisations ?? 0, sub: `${stats?.demoOrganisations ?? 0} demo · ${stats?.liveOrganisations ?? 0} live` },
            { icon: Users, label: "Pending Registrations", value: stats?.pendingRegistrations ?? 0, sub: "Awaiting review" },
            { icon: AlertTriangle, label: "Open Alerts", value: stats?.openAlerts ?? 0, sub: "Fronting prevention" },
            { icon: FileText, label: "Charter Reports", value: stats?.totalCharterReports ?? 0, sub: "Generated" },
          ].map(({ icon: Icon, label, value, sub }) => (
            <Card key={label} className="border shadow-sm">
              <CardContent className="p-5">
                <Icon className="w-5 h-5 text-primary mb-2" />
                <div className="text-2xl font-bold font-display text-foreground">{value}</div>
                <div className="text-xs font-medium text-foreground">{label}</div>
                <div className="text-xs text-muted-foreground">{sub}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Tabs defaultValue="registrations">
        <TabsList>
          <TabsTrigger value="registrations">Registration Requests</TabsTrigger>
          <TabsTrigger value="organisations">Organisations</TabsTrigger>
          <TabsTrigger value="alerts">Fronting Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="registrations" className="mt-4">
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-3 font-semibold">Organisation</th>
                    <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Contact</th>
                    <th className="text-center px-3 py-3 font-semibold">Status</th>
                    <th className="text-center px-3 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(registrations ?? []).map((r) => (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{r.orgName}</div>
                        <div className="text-xs text-muted-foreground">{r.orgType}</div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="text-sm">{r.contactName}</div>
                        <div className="text-xs text-muted-foreground">{r.contactEmail}</div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <Badge variant="outline" className={`text-xs ${r.status === "approved" ? "text-emerald-700 border-emerald-200" : r.status === "rejected" ? "text-red-700 border-red-200" : "text-amber-700 border-amber-200"}`}>{r.status}</Badge>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {r.status === "pending" && (
                          <div className="flex items-center justify-center gap-1">
                            <Button size="sm" variant="outline" className="text-xs h-7 text-emerald-700 border-emerald-200 hover:bg-emerald-50" onClick={() => updateRegStatus.mutate({ id: r.id, status: "approved" })}>Approve</Button>
                            <Button size="sm" variant="outline" className="text-xs h-7 text-red-700 border-red-200 hover:bg-red-50" onClick={() => updateRegStatus.mutate({ id: r.id, status: "rejected" })}>Reject</Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {(!registrations || registrations.length === 0) && (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No registration requests yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="organisations" className="mt-4">
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-3 font-semibold">Name</th>
                    <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Type</th>
                    <th className="text-center px-3 py-3 font-semibold">Demo</th>
                    <th className="text-center px-3 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(orgs ?? []).map((o) => (
                    <tr key={o.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium">{o.name}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{o.orgType.replace(/_/g, " ")}</td>
                      <td className="px-3 py-3 text-center">{o.isDemo ? <Badge className="text-xs bg-amber-100 text-amber-800 border-amber-200">Demo</Badge> : <span className="text-muted-foreground text-xs">Live</span>}</td>
                      <td className="px-3 py-3 text-center"><Badge variant="outline" className={`text-xs ${o.status === "approved" ? "text-emerald-700 border-emerald-200" : "text-muted-foreground"}`}>{o.status}</Badge></td>
                    </tr>
                  ))}
                  {(!orgs || orgs.length === 0) && (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No organisations registered yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="mt-4">
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-3 font-semibold">Organisation</th>
                    <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Type</th>
                    <th className="text-center px-3 py-3 font-semibold">Severity</th>
                    <th className="text-center px-3 py-3 font-semibold">Status</th>
                    <th className="text-center px-3 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(alerts ?? []).map((a) => (
                    <tr key={a.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium">{`Org #${a.organisationId}`}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">{a.alertType.replace(/_/g, " ")}</td>
                      <td className="px-3 py-3 text-center"><Badge variant="outline" className={`text-xs ${a.severity === "high" ? "text-red-700 border-red-200" : a.severity === "medium" ? "text-amber-700 border-amber-200" : "text-blue-700 border-blue-200"}`}>{a.severity}</Badge></td>
                      <td className="px-3 py-3 text-center"><Badge variant="outline" className="text-xs">{a.status}</Badge></td>
                      <td className="px-3 py-3 text-center">
                        {a.status === "open" && (
                          <div className="flex items-center justify-center gap-1">
                            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => updateAlertStatus.mutate({ id: a.id, status: "under_review" })}>Review</Button>
                            <Button size="sm" variant="outline" className="text-xs h-7 text-emerald-700 border-emerald-200 hover:bg-emerald-50" onClick={() => updateAlertStatus.mutate({ id: a.id, status: "resolved" })}>Resolve</Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {(!alerts || alerts.length === 0) && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No fronting alerts recorded.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

