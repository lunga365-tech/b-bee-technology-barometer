// Demo data seed — runs at startup if organisations table is empty
import { getDb } from "./db";
import { organisations, taiScores, complianceReports, charterReports } from "../drizzle/schema";
import { eq, count } from "drizzle-orm";

const DEMO_ORGS = [
  {
    name: "Transnet National Ports Authority",
    orgType: "terminal_operator" as const,
    registrationNumber: "1992/005010/30",
    samsaNumber: "SAMSA-NPA-001",
    tetaAccredited: true,
    saasoa: false,
    saaff: false,
    contactName: "Portia Dlamini",
    contactEmail: "pdlamini@transnet.net",
    contactPhone: "+27 31 408 8111",
    province: "KwaZulu-Natal",
    city: "Durban",
    isDemo: true,
    status: "approved" as const,
    approvedAt: new Date("2026-01-15"),
  },
  {
    name: "Grindrod Shipping Holdings",
    orgType: "shipping_line" as const,
    registrationNumber: "1966/009846/06",
    samsaNumber: "SAMSA-GRN-002",
    tetaAccredited: true,
    saasoa: true,
    saaff: false,
    contactName: "Sipho Mthembu",
    contactEmail: "smthembu@grindrod.co.za",
    contactPhone: "+27 31 710 0500",
    province: "KwaZulu-Natal",
    city: "Durban",
    isDemo: true,
    status: "approved" as const,
    approvedAt: new Date("2026-01-20"),
  },
  {
    name: "MSC South Africa (Pty) Ltd",
    orgType: "ship_agent" as const,
    registrationNumber: "1994/002345/07",
    samsaNumber: "SAMSA-MSC-003",
    tetaAccredited: false,
    saasoa: true,
    saaff: false,
    contactName: "Nkosi Zulu",
    contactEmail: "nzulu@msc.co.za",
    contactPhone: "+27 21 405 5000",
    province: "Western Cape",
    city: "Cape Town",
    isDemo: true,
    status: "approved" as const,
    approvedAt: new Date("2026-01-22"),
  },
  {
    name: "TETA Maritime Skills Academy",
    orgType: "training_provider" as const,
    registrationNumber: "2001/012345/08",
    samsaNumber: "SAMSA-TETA-004",
    tetaAccredited: true,
    saasoa: false,
    saaff: false,
    contactName: "Zanele Mokoena",
    contactEmail: "zmokoena@teta.org.za",
    contactPhone: "+27 11 577 7000",
    province: "Gauteng",
    city: "Johannesburg",
    isDemo: true,
    status: "approved" as const,
    approvedAt: new Date("2026-01-25"),
  },
  {
    name: "Bureau Veritas South Africa",
    orgType: "marine_surveyor" as const,
    registrationNumber: "1994/007890/07",
    samsaNumber: "SAMSA-BV-005",
    tetaAccredited: false,
    saasoa: false,
    saaff: false,
    contactName: "Thabo Nkosi",
    contactEmail: "thabo.nkosi@bureauveritas.com",
    contactPhone: "+27 31 301 1234",
    province: "KwaZulu-Natal",
    city: "Durban",
    isDemo: true,
    status: "approved" as const,
    approvedAt: new Date("2026-02-01"),
  },
  {
    name: "Bidvest Panalpina Logistics",
    orgType: "freight_forwarder" as const,
    registrationNumber: "1996/003456/06",
    samsaNumber: null,
    tetaAccredited: false,
    saasoa: false,
    saaff: true,
    contactName: "Lungelo Dube",
    contactEmail: "ldube@bidvestpanalpina.co.za",
    contactPhone: "+27 11 570 5000",
    province: "Gauteng",
    city: "Johannesburg",
    isDemo: true,
    status: "approved" as const,
    approvedAt: new Date("2026-02-05"),
  },
  {
    name: "Cape Town Container Terminal Operators",
    orgType: "stevedore" as const,
    registrationNumber: "2003/008765/07",
    samsaNumber: "SAMSA-CTCT-007",
    tetaAccredited: false,
    saasoa: false,
    saaff: false,
    contactName: "Ayanda Botha",
    contactEmail: "ayanda.botha@ctct.co.za",
    contactPhone: "+27 21 408 8000",
    province: "Western Cape",
    city: "Cape Town",
    isDemo: true,
    status: "approved" as const,
    approvedAt: new Date("2026-02-10"),
  },
  {
    name: "Engen Petroleum Marine Bunkering",
    orgType: "bunker_supplier" as const,
    registrationNumber: "1993/004567/06",
    samsaNumber: "SAMSA-EPM-008",
    tetaAccredited: false,
    saasoa: false,
    saaff: false,
    contactName: "Nomvula Sithole",
    contactEmail: "nsithole@engen.co.za",
    contactPhone: "+27 31 460 1000",
    province: "KwaZulu-Natal",
    city: "Durban",
    isDemo: true,
    status: "approved" as const,
    approvedAt: new Date("2026-02-12"),
  },
  {
    name: "Portside Port Services",
    orgType: "port_service" as const,
    registrationNumber: "2005/011234/07",
    samsaNumber: "SAMSA-PPS-009",
    tetaAccredited: false,
    saasoa: false,
    saaff: false,
    contactName: "Bongani Khumalo",
    contactEmail: "bkhumalo@portside.co.za",
    contactPhone: "+27 41 507 1234",
    province: "Eastern Cape",
    city: "Port Elizabeth",
    isDemo: true,
    status: "approved" as const,
    approvedAt: new Date("2026-02-15"),
  },
  {
    name: "Safmarine Container Lines",
    orgType: "shipping_line" as const,
    registrationNumber: "1946/023456/06",
    samsaNumber: "SAMSA-SAF-010",
    tetaAccredited: false,
    saasoa: true,
    saaff: false,
    contactName: "Lindiwe Mahlangu",
    contactEmail: "lmahlangu@safmarine.co.za",
    contactPhone: "+27 21 408 6000",
    province: "Western Cape",
    city: "Cape Town",
    isDemo: true,
    status: "approved" as const,
    approvedAt: new Date("2026-02-18"),
  },
];

const TAI_DATA: Record<string, { di: number; sr: number; tm: number; ic: number }> = {
  "Transnet National Ports Authority": { di: 72, sr: 65, tm: 78, ic: 58 },
  "Grindrod Shipping Holdings": { di: 55, sr: 48, tm: 62, ic: 42 },
  "MSC South Africa (Pty) Ltd": { di: 68, sr: 55, tm: 70, ic: 50 },
  "TETA Maritime Skills Academy": { di: 45, sr: 72, tm: 55, ic: 62 },
  "Bureau Veritas South Africa": { di: 60, sr: 58, tm: 65, ic: 48 },
  "Bidvest Panalpina Logistics": { di: 52, sr: 45, tm: 58, ic: 40 },
  "Cape Town Container Terminal Operators": { di: 38, sr: 32, tm: 45, ic: 28 },
  "Engen Petroleum Marine Bunkering": { di: 30, sr: 28, tm: 35, ic: 22 },
  "Portside Port Services": { di: 25, sr: 22, tm: 30, ic: 18 },
  "Safmarine Container Lines": { di: 62, sr: 52, tm: 68, ic: 45 },
};

function classify(total: number): "Emerging" | "Established" | "Leading" {
  if (total >= 60) return "Leading";
  if (total >= 40) return "Established";
  return "Emerging";
}

export async function seedDemoData() {
  const db = await getDb();
  if (!db) return;

  try {
    // Check if already seeded
    const existing = await db.select({ c: count() }).from(organisations);
    const existingCount = Number(existing[0]?.c ?? 0);
    if (existingCount > 0) {
      console.log(`[Seed] Skipping — ${existingCount} organisations already exist`);
      return;
    }

    console.log("[Seed] Seeding demo organisations...");

    for (const org of DEMO_ORGS) {
      const inserted = await db.insert(organisations).values(org).returning({ id: organisations.id });
      const orgId = inserted[0].id;
      const tai = TAI_DATA[org.name];
      if (tai) {
        const total = (tai.di + tai.sr + tai.tm + tai.ic) / 4;
        await db.insert(taiScores).values({
          organisationId: orgId,
          reportingPeriod: "2025-Q4",
          digitalInfrastructure: String(tai.di),
          skillsReadiness: String(tai.sr),
          transformationMetrics: String(tai.tm),
          innovationCulture: String(tai.ic),
          totalScore: String(total.toFixed(2)),
          classification: classify(total),
          notes: "Demonstration data for platform verification purposes.",
        });
      }
    }

    // Seed a charter report
    const orgs = await db.select().from(organisations);
    const taiRows = await db.select().from(taiScores);
    const avgDI = taiRows.reduce((s, r) => s + Number(r.digitalInfrastructure), 0) / taiRows.length;
    const avgSR = taiRows.reduce((s, r) => s + Number(r.skillsReadiness), 0) / taiRows.length;
    const avgTM = taiRows.reduce((s, r) => s + Number(r.transformationMetrics), 0) / taiRows.length;
    const avgIC = taiRows.reduce((s, r) => s + Number(r.innovationCulture), 0) / taiRows.length;
    const avgTotal = (avgDI + avgSR + avgTM + avgIC) / 4;

    await db.insert(charterReports).values({
      title: "Maritime Sector B-BBEE Technology Adoption Charter Report — Q4 2025",
      reportingPeriod: "2025-Q4",
      totalEntities: orgs.length,
      emergingCount: taiRows.filter(r => Number(r.totalScore) < 40).length,
      establishedCount: taiRows.filter(r => Number(r.totalScore) >= 40 && Number(r.totalScore) < 60).length,
      leadingCount: taiRows.filter(r => Number(r.totalScore) >= 60).length,
      avgDigitalInfrastructure: String(avgDI.toFixed(2)),
      avgSkillsReadiness: String(avgSR.toFixed(2)),
      avgTransformationMetrics: String(avgTM.toFixed(2)),
      avgInnovationCulture: String(avgIC.toFixed(2)),
      avgTotalScore: String(avgTotal.toFixed(2)),
      frontingAlertsCount: 0,
      summary: `This report covers ${orgs.length} registered maritime sector entities for the period 2025-Q4. The sector Technology Adoption Index (TAI) average stands at ${avgTotal.toFixed(1)}/100. ${taiRows.filter(r => Number(r.totalScore) < 40).length} entities are classified as Emerging, ${taiRows.filter(r => Number(r.totalScore) >= 40 && Number(r.totalScore) < 60).length} as Established, and ${taiRows.filter(r => Number(r.totalScore) >= 60).length} as Leading.`,
    });

    console.log(`[Seed] Successfully seeded ${DEMO_ORGS.length} demo organisations with TAI scores and charter report.`);
  } catch (err) {
    console.warn("[Seed] Seeding failed:", err);
  }
}
