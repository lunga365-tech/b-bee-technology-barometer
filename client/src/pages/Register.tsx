import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Link } from "wouter";
import { ArrowLeft, BarChart3, CheckCircle2 } from "lucide-react";

const ORG_TYPES = [
  { value: "terminal_operator", label: "Terminal Operator" },
  { value: "ship_agent", label: "Ship Agent" },
  { value: "stevedore", label: "Stevedore" },
  { value: "bunker_supplier", label: "Bunker Supplier" },
  { value: "freight_forwarder", label: "Freight Forwarder" },
  { value: "training_provider", label: "Training Provider (TETA-accredited)" },
  { value: "port_service", label: "Port Service Provider" },
  { value: "shipping_line", label: "Shipping Line" },
  { value: "marine_surveyor", label: "Marine Surveyor" },
  { value: "other", label: "Other Maritime Entity" },
];

const PROVINCES = ["Eastern Cape","Free State","Gauteng","KwaZulu-Natal","Limpopo","Mpumalanga","Northern Cape","North West","Western Cape"];

export default function Register() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    orgName: "", orgType: "", registrationNumber: "", samsaNumber: "",
    tetaAccredited: false, saasoa: false, saaff: false,
    contactName: "", contactEmail: "", contactPhone: "",
    province: "", city: "", message: "",
  });

  const mutation = trpc.registration.submit.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (e) => toast.error(e.message),
  });

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.orgName || !form.orgType || !form.contactName || !form.contactEmail) {
      toast.error("Please complete all required fields.");
      return;
    }
    mutation.mutate(form);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-3">Registration Submitted</h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Thank you for registering <strong>{form.orgName}</strong>. Your application has been received and will be reviewed within 5 business days. You will be contacted at <strong>{form.contactEmail}</strong>.
          </p>
          <Link href="/dashboard">
            <Button className="gradient-navy text-white border-0">View TAI Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-navy flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground text-sm">B-BBEE Technology Adoption Barometer</span>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Register Your Organisation</h1>
          <p className="text-muted-foreground leading-relaxed">
            Join the B-BBEE Technology Adoption Barometer to access the full compliance dashboard, submit quarterly TAI reports, and contribute to the maritime sector's digital transformation baseline. Registration is open to all port community entities including SAASOA members, SAAFF members, SAMSA-registered operators, and TETA-accredited training providers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organisation Details */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">Organisation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Organisation Name <span className="text-red-500">*</span></label>
                  <input className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.orgName} onChange={(e) => set("orgName", e.target.value)} placeholder="e.g. Cape Town Container Terminal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Organisation Type <span className="text-red-500">*</span></label>
                  <select className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white" value={form.orgType} onChange={(e) => set("orgType", e.target.value)}>
                    <option value="">Select type...</option>
                    {ORG_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">CIPC Registration Number</label>
                  <input className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.registrationNumber} onChange={(e) => set("registrationNumber", e.target.value)} placeholder="e.g. 2010/123456/07" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">SAMSA Registration Number</label>
                  <input className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.samsaNumber} onChange={(e) => set("samsaNumber", e.target.value)} placeholder="If applicable" />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {[
                  { key: "tetaAccredited", label: "TETA-Accredited Training Provider" },
                  { key: "saasoa", label: "SAASOA Member" },
                  { key: "saaff", label: "SAAFF Member" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={(form as any)[key]} onChange={(e) => set(key, e.target.checked)} className="rounded border-border" />
                    <span className="text-sm text-foreground">{label}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Contact Name <span className="text-red-500">*</span></label>
                  <input className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.contactName} onChange={(e) => set("contactName", e.target.value)} placeholder="Full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Contact Email <span className="text-red-500">*</span></label>
                  <input type="email" className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} placeholder="name@company.co.za" />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                  <input className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} placeholder="+27 21 000 0000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Province</label>
                  <select className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white" value={form.province} onChange={(e) => set("province", e.target.value)}>
                    <option value="">Select...</option>
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">City</label>
                  <input className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Cape Town" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Additional Message</label>
                <textarea className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" rows={3} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Any additional context about your organisation or how you plan to use the platform..." />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full gradient-navy text-white border-0 font-semibold" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Register Your Organisation"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">Your registration will be reviewed within 5 business days. No cost to register.</p>
        </form>
      </div>
    </div>
  );
}

