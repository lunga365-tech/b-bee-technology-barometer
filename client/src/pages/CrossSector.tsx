import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Building2, Globe, Layers, Zap } from "lucide-react";

const SECTORS = [
  {
    icon: Zap,
    name: "ICT Sector",
    code: "ICT Sector Code",
    status: "Gazetted",
    statusColor: "bg-emerald-100 text-emerald-800",
    readiness: "High",
    desc: "The ICT Sector already has a gazetted code and a strong 4IR agenda, making it the most natural candidate for immediate TAI deployment. The sector's existing digital infrastructure baseline and skills development frameworks align closely with the TAI's measurement dimensions.",
    dimensions: ["Digital Infrastructure", "Skills Readiness", "Transformation Metrics", "Innovation Culture"],
    note: "The ICT Sector Code's existing emphasis on skills development and technology investment means the TAI's 25% Digital Skills Weighting can be applied with minimal calibration.",
  },
  {
    icon: Building2,
    name: "Construction Sector",
    code: "Construction Sector Code",
    status: "Active",
    statusColor: "bg-blue-100 text-blue-800",
    readiness: "Medium",
    desc: "The Construction Sector faces significant transformation challenges alongside rapid technological shifts — BIM (Building Information Modelling), drone surveying, and AI-driven project management are reshaping the sector. The TAI's Innovation Culture dimension is particularly relevant here.",
    dimensions: ["Digital Infrastructure", "Skills Readiness", "Transformation Metrics", "Innovation Culture"],
    note: "The Construction Sector's large SMME base and geographic spread make the equitable access bonus points mechanism especially impactful.",
  },
  {
    icon: BarChart3,
    name: "Financial Sector",
    code: "Financial Sector Code",
    status: "Most Mature",
    statusColor: "bg-purple-100 text-purple-800",
    readiness: "High",
    desc: "The Financial Sector has the most mature B-BBEE code and the highest compliance infrastructure, providing the strongest institutional foundation for TAI integration. FinTech adoption, digital banking, and AI-driven financial services create a rich measurement environment.",
    dimensions: ["Digital Infrastructure", "Skills Readiness", "Transformation Metrics", "Innovation Culture"],
    note: "The Financial Sector's sophisticated verification infrastructure means the Barometer's Fronting Prevention Module can be calibrated to the highest standard.",
  },
];

export default function CrossSector() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Cross-Sector Transferability</h1>
        <p className="text-muted-foreground mt-2">The Technology Adoption Index is structurally designed as a sector-agnostic measurement instrument applicable beyond the maritime context.</p>
      </div>

      {/* Architecture Explanation */}
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg gradient-navy flex items-center justify-center flex-shrink-0">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-2">Modular TAI Architecture</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                While this study empirically validates the TAI within the maritime sector, the underlying conceptual architecture is deliberately designed for broader application across the South African economy. The four TAI dimensions — Digital Infrastructure Investment, Skills Readiness, Transformation Metrics, and Innovation Culture — are sector-agnostic by design. The modular platform allows the underlying TAI metrics to be calibrated to the specific sub-elements of any gazetted sector code.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The OECD Digital Economy Outlook 2024 highlights that embracing the technology frontier is fundamental to economic inclusion across all sectors. By structuring the TAI around these four dimensions, the Barometer provides a scalable mechanism to assess B-BBEE compliance through a technological lens in any sector where digital transformation is a strategic priority.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sector Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {SECTORS.map(({ icon: Icon, name, code, status, statusColor, readiness, desc, dimensions, note }) => (
          <Card key={name} className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg gradient-navy flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="font-display text-base">{name}</CardTitle>
                </div>
                <Badge className={`text-xs ${statusColor} flex-shrink-0`}>{status}</Badge>
              </div>
              <div className="text-xs text-muted-foreground">{code} · Readiness: <strong>{readiness}</strong></div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {dimensions.map((d) => (
                  <Badge key={d} variant="outline" className="text-xs">{d}</Badge>
                ))}
              </div>
              <div className="bg-muted/40 rounded-lg p-3 text-xs text-muted-foreground italic">{note}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Implementation Pathway */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-lg">Legislative Implementation Pathway</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Any amendment to a sector code moves through a defined institutional sequence under the B-BBEE Act 53 of 2003. The authority to issue and amend sector codes is vested exclusively in the Minister of Trade, Industry and Competition.
          </p>
          <div className="flex flex-col md:flex-row gap-3">
            {[
              { step: "1", title: "Charter Council Initiation", desc: "Sector's B-BBEE Charter Council initiates the amendment process" },
              { step: "2", title: "60-Day Public Comment", desc: "Mandatory public participation under section 9(5) of the Act" },
              { step: "3", title: "Ministerial Promulgation", desc: "Final gazetting by the Minister under section 9(1)" },
            ].map((s) => (
              <div key={s.step} className="flex-1 flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                <div className="w-7 h-7 rounded-full gradient-navy flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{s.step}</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{s.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Globe className="w-4 h-4 text-primary flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Future research should prioritise testing the Barometer's validity in at least one adjacent sector to establish a standardised, cross-sectoral digital transformation baseline for the South African economy.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="bg-card border border-border rounded-xl p-6 text-center shadow-sm">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">Interested in Piloting the TAI in Your Sector?</h3>
        <p className="text-muted-foreground text-sm mb-4 max-w-lg mx-auto">Register your organisation to participate in the maritime sector pilot, or contact the research team to discuss cross-sector deployment.</p>
        <Link href="/register">
          <Button className="gradient-navy text-white border-0">Register Your Organisation <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </Link>
      </div>
    </div>
  );
}

