import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  CharterReport,
  ComplianceReport,
  FrontingAlert,
  InsertCharterReport,
  InsertComplianceReport,
  InsertFrontingAlert,
  InsertOrganisation,
  InsertRegistrationRequest,
  InsertTaiScore,
  InsertUser,
  Organisation,
  RegistrationRequest,
  TaiScore,
  charterReports,
  complianceReports,
  frontingAlerts,
  organisations,
  registrationRequests,
  taiScores,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    const value = user[field];
    if (value === undefined) continue;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Organisations ────────────────────────────────────────────────────────────

export async function listOrganisations(includeDemo = true): Promise<Organisation[]> {
  const db = await getDb();
  if (!db) return [];
  if (includeDemo) {
    return db.select().from(organisations).orderBy(desc(organisations.createdAt));
  }
  return db.select().from(organisations).where(eq(organisations.isDemo, false)).orderBy(desc(organisations.createdAt));
}

export async function getOrganisationById(id: number): Promise<Organisation | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(organisations).where(eq(organisations.id, id)).limit(1);
  return result[0];
}

export async function insertOrganisation(org: InsertOrganisation): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(organisations).values(org);
  return (result[0] as any).insertId;
}

export async function updateOrganisationStatus(id: number, status: "pending" | "approved" | "rejected") {
  const db = await getDb();
  if (!db) return;
  await db.update(organisations).set({ status, approvedAt: status === "approved" ? new Date() : undefined }).where(eq(organisations.id, id));
}

// ─── TAI Scores ───────────────────────────────────────────────────────────────

export async function listTaiScores(organisationId?: number): Promise<TaiScore[]> {
  const db = await getDb();
  if (!db) return [];
  if (organisationId) {
    return db.select().from(taiScores).where(eq(taiScores.organisationId, organisationId)).orderBy(desc(taiScores.createdAt));
  }
  return db.select().from(taiScores).orderBy(desc(taiScores.createdAt));
}

export async function getLatestTaiScoreByOrg(organisationId: number): Promise<TaiScore | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(taiScores).where(eq(taiScores.organisationId, organisationId)).orderBy(desc(taiScores.createdAt)).limit(1);
  return result[0];
}

export async function insertTaiScore(score: InsertTaiScore): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(taiScores).values(score);
  return (result[0] as any).insertId;
}

export async function getSectorBaseline() {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select({
      avgDI: sql<number>`AVG(CAST(${taiScores.digitalInfrastructure} AS DECIMAL))`,
      avgSR: sql<number>`AVG(CAST(${taiScores.skillsReadiness} AS DECIMAL))`,
      avgTM: sql<number>`AVG(CAST(${taiScores.transformationMetrics} AS DECIMAL))`,
      avgIC: sql<number>`AVG(CAST(${taiScores.innovationCulture} AS DECIMAL))`,
      avgTotal: sql<number>`AVG(CAST(${taiScores.totalScore} AS DECIMAL))`,
      emergingCount: sql<number>`SUM(CASE WHEN ${taiScores.classification} = 'Emerging' THEN 1 ELSE 0 END)`,
      establishedCount: sql<number>`SUM(CASE WHEN ${taiScores.classification} = 'Established' THEN 1 ELSE 0 END)`,
      leadingCount: sql<number>`SUM(CASE WHEN ${taiScores.classification} = 'Leading' THEN 1 ELSE 0 END)`,
      total: sql<number>`COUNT(*)`,
    })
    .from(taiScores);
  return result[0] ?? null;
}

// ─── Compliance Reports ───────────────────────────────────────────────────────

export async function listComplianceReports(organisationId?: number): Promise<ComplianceReport[]> {
  const db = await getDb();
  if (!db) return [];
  if (organisationId) {
    return db.select().from(complianceReports).where(eq(complianceReports.organisationId, organisationId)).orderBy(desc(complianceReports.createdAt));
  }
  return db.select().from(complianceReports).orderBy(desc(complianceReports.createdAt));
}

export async function insertComplianceReport(report: InsertComplianceReport): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(complianceReports).values(report);
  return (result[0] as { insertId: number }).insertId;
}

export async function updateComplianceReportVerification(
  id: number,
  status: "verified" | "rejected",
  verifiedBy: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(complianceReports)
    .set({
      verifiedAt: new Date(),
      status: status === "verified" ? "verified" : "flagged",
    })
    .where(eq(complianceReports.id, id));
  return { success: true };
}

// ─── Fronting Alerts ──────────────────────────────────────────────────────────

export async function listFrontingAlerts(organisationId?: number): Promise<FrontingAlert[]> {
  const db = await getDb();
  if (!db) return [];
  if (organisationId) {
    return db.select().from(frontingAlerts).where(eq(frontingAlerts.organisationId, organisationId)).orderBy(desc(frontingAlerts.createdAt));
  }
  return db.select().from(frontingAlerts).orderBy(desc(frontingAlerts.createdAt));
}

export async function insertFrontingAlert(alert: InsertFrontingAlert): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(frontingAlerts).values(alert);
  return (result[0] as any).insertId;
}

export async function updateFrontingAlertStatus(id: number, status: "open" | "under_review" | "resolved" | "escalated", resolvedBy?: number, notes?: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(frontingAlerts).set({
    status,
    resolvedAt: status === "resolved" ? new Date() : undefined,
    resolvedBy: resolvedBy ?? undefined,
    notes: notes ?? undefined,
  }).where(eq(frontingAlerts.id, id));
}

// ─── Charter Reports ──────────────────────────────────────────────────────────

export async function listCharterReports(): Promise<CharterReport[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(charterReports).orderBy(desc(charterReports.createdAt));
}

export async function insertCharterReport(report: InsertCharterReport): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(charterReports).values(report);
  return (result[0] as any).insertId;
}

// ─── Registration Requests ────────────────────────────────────────────────────

export async function listRegistrationRequests(): Promise<RegistrationRequest[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(registrationRequests).orderBy(desc(registrationRequests.createdAt));
}

export async function insertRegistrationRequest(req: InsertRegistrationRequest): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(registrationRequests).values(req);
  return (result[0] as any).insertId;
}

export async function updateRegistrationRequestStatus(id: number, status: "pending" | "approved" | "rejected", reviewedBy?: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(registrationRequests).set({
    status,
    reviewedAt: new Date(),
    reviewedBy: reviewedBy ?? undefined,
  }).where(eq(registrationRequests.id, id));
}
