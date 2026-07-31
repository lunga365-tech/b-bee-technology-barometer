import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Link } from "wouter";
import { Search, Building2, Eye, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { useState } from "react";

const TEAL = "#007A87";
const GOLD = "#E8821A";
const NAVY = "#0D2137";

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

export default function Companies() {
  const { user, isAuthenticated } = useAuth();
  const { data: orgs, isLoading } = trpc.organisations.list.useQuery();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const canViewDetails = isAuthenticated && (
    user?.role === "admin" || user?.role === "examiner" || user?.role === "verifier"
  );

  const filtered = (orgs ?? []).filter(o => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) ||
      (o.orgType ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (o.city ?? "").toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || o.orgType === filterType;
    return matchSearch && matchType;
  });

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
        <div className="mb-6 pb-4" style={{ borderBottom: "1px solid #E5E7EB" }}>
          <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: TEAL }}>Company Directory</div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Merriweather, Georgia, serif", color: NAVY }}>
            Registered Maritime Organisations
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            All organisations registered on the B-BBEE Technology Adoption Barometer.
            {!canViewDetails && " Sign in as an Examiner or Verifier to access detailed compliance data."}
          </p>
        </div>

        {/* Access notice */}
        {!isAuthenticated && (
          <div className="mb-6 p-4 rounded flex items-start gap-3"
            style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderLeft: `4px solid ${TEAL}` }}>
            <Eye size={16} className="flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
            <div>
              <div className="text-sm font-semibold mb-0.5" style={{ color: NAVY }}>Examiner & Verifier Access</div>
              <p className="text-xs" style={{ color: "#374151" }}>
                Examiners and Verifiers can view full compliance data, TAI scores, and fronting alert status for all registered companies.{" "}
                <button onClick={() => startLogin()} className="font-medium underline" style={{ color: TEAL }}>Sign in</button> to access detailed views.
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
            <input type="text" placeholder="Search organisations, type, or city…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded"
              style={{ border: "1px solid #D1D5DB", outline: "none" }} />
          </div>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="px-3 py-2 text-sm rounded"
            style={{ border: "1px solid #D1D5DB", outline: "none", minWidth: 180 }}>
            <option value="all">All Types</option>
            {Object.entries(ORG_TYPE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Entities", value: orgs?.length ?? 0, color: TEAL },
            { label: "Approved", value: orgs?.filter(o => o.status === "approved").length ?? 0, color: GOLD },
            { label: "TETA Accredited", value: orgs?.filter(o => o.tetaAccredited).length ?? 0, color: "#2E7D4F" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded p-4 text-center"
              style={{ border: "1px solid #E5E7EB", borderTop: `3px solid ${s.color}` }}>
              <div className="text-2xl font-bold" style={{ fontFamily: "Merriweather, Georgia, serif", color: NAVY }}>{s.value}</div>
              <div className="text-xs uppercase tracking-wide mt-0.5" style={{ color: s.color }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Company cards */}
        {isLoading ? (
          <div className="text-center py-12 text-sm" style={{ color: "#9CA3AF" }}>Loading organisations…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-sm" style={{ color: "#9CA3AF" }}>No organisations match your search.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(org => (
              <div key={org.id} className="bg-white rounded p-5 flex flex-col gap-3"
                style={{ border: "1px solid #E5E7EB", borderTop: `3px solid ${TEAL}` }}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: "#007A8712" }}>
                    <Building2 size={18} style={{ color: TEAL }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate" style={{ color: NAVY }}>{org.name}</div>
                    <div className="text-xs" style={{ color: "#9CA3AF" }}>{ORG_TYPE_LABELS[org.orgType] ?? org.orgType}</div>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium flex-shrink-0"
                    style={org.status === "approved"
                      ? { background: "#2E7D4F18", color: "#2E7D4F", border: "1px solid #2E7D4F40" }
                      : { background: "#E8821A18", color: "#9A4E00", border: "1px solid #E8821A40" }}>
                    {org.status === "approved" ? "Active" : "Pending"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div style={{ color: "#9CA3AF" }}>Province</div>
                    <div className="font-medium" style={{ color: NAVY }}>{org.province ?? "—"}</div>
                  </div>
                  <div>
                    <div style={{ color: "#9CA3AF" }}>City</div>
                    <div className="font-medium" style={{ color: NAVY }}>{org.city ?? "—"}</div>
                  </div>
                  {canViewDetails && (
                    <>
                      <div>
                        <div style={{ color: "#9CA3AF" }}>CIPC Reg. No.</div>
                        <div className="font-medium" style={{ color: NAVY }}>{org.registrationNumber ?? "—"}</div>
                      </div>
                      <div>
                        <div style={{ color: "#9CA3AF" }}>SAMSA No.</div>
                        <div className="font-medium" style={{ color: NAVY }}>{org.samsaNumber ?? "—"}</div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {org.tetaAccredited && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#007A8712", color: TEAL }}>TETA Accredited</span>
                  )}
                  {org.saasoa && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#2E7D4F12", color: "#2E7D4F" }}>SAASOA</span>
                  )}
                  {org.saaff && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#5C4B8A12", color: "#5C4B8A" }}>SAAFF</span>
                  )}
                </div>

                {canViewDetails && (
                  <div className="pt-2 border-t" style={{ borderColor: "#F3F4F6" }}>
                    <Link href={`/compliance?org=${org.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium"
                      style={{ color: TEAL }}>
                      <TrendingUp size={12} /> View Compliance Data
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
