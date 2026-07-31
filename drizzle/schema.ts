import {
  boolean,
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const organisations = mysqlTable("organisations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  orgType: mysqlEnum("orgType", [
    "terminal_operator",
    "ship_agent",
    "stevedore",
    "bunker_supplier",
    "freight_forwarder",
    "training_provider",
    "port_service",
    "shipping_line",
    "marine_surveyor",
    "other",
  ]).notNull(),
  registrationNumber: varchar("registrationNumber", { length: 100 }),
  samsaNumber: varchar("samsaNumber", { length: 100 }),
  tetaAccredited: boolean("tetaAccredited").default(false),
  saasoa: boolean("saasoa").default(false),
  saaff: boolean("saaff").default(false),
  contactName: varchar("contactName", { length: 255 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 50 }),
  province: varchar("province", { length: 100 }),
  city: varchar("city", { length: 100 }),
  isDemo: boolean("isDemo").default(false).notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  approvedAt: timestamp("approvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Organisation = typeof organisations.$inferSelect;
export type InsertOrganisation = typeof organisations.$inferInsert;

export const taiScores = mysqlTable("tai_scores", {
  id: int("id").autoincrement().primaryKey(),
  organisationId: int("organisationId").notNull(),
  reportingPeriod: varchar("reportingPeriod", { length: 20 }).notNull(),
  digitalInfrastructure: decimal("digitalInfrastructure", { precision: 5, scale: 2 }).notNull(),
  skillsReadiness: decimal("skillsReadiness", { precision: 5, scale: 2 }).notNull(),
  transformationMetrics: decimal("transformationMetrics", { precision: 5, scale: 2 }).notNull(),
  innovationCulture: decimal("innovationCulture", { precision: 5, scale: 2 }).notNull(),
  totalScore: decimal("totalScore", { precision: 5, scale: 2 }).notNull(),
  classification: mysqlEnum("classification", ["Emerging", "Established", "Leading"]).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TaiScore = typeof taiScores.$inferSelect;
export type InsertTaiScore = typeof taiScores.$inferInsert;

export const complianceReports = mysqlTable("compliance_reports", {
  id: int("id").autoincrement().primaryKey(),
  organisationId: int("organisationId").notNull(),
  reportingPeriod: varchar("reportingPeriod", { length: 20 }).notNull(),
  totalSdExpenditure: decimal("totalSdExpenditure", { precision: 15, scale: 2 }),
  fourirSdExpenditure: decimal("fourirSdExpenditure", { precision: 15, scale: 2 }),
  fourirSdPercentage: decimal("fourirSdPercentage", { precision: 5, scale: 2 }),
  digitalSkillsWeightingTarget: decimal("digitalSkillsWeightingTarget", { precision: 5, scale: 2 }).default("25.00"),
  equitableAccessBonus: boolean("equitableAccessBonus").default(false),
  equitableAccessScore: decimal("equitableAccessScore", { precision: 5, scale: 2 }).default("0.00"),
  esdTechContributions: decimal("esdTechContributions", { precision: 15, scale: 2 }),
  esdTechRecognised: boolean("esdTechRecognised").default(false),
  esdScore: decimal("esdScore", { precision: 5, scale: 2 }),
  claimedLearnersCount: int("claimedLearnersCount"),
  verifiedLearnersCount: int("verifiedLearnersCount"),
  overallComplianceScore: decimal("overallComplianceScore", { precision: 5, scale: 2 }),
  status: mysqlEnum("status", ["draft", "submitted", "verified", "flagged"]).default("draft").notNull(),
  submittedAt: timestamp("submittedAt"),
  verifiedAt: timestamp("verifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ComplianceReport = typeof complianceReports.$inferSelect;
export type InsertComplianceReport = typeof complianceReports.$inferInsert;

export const frontingAlerts = mysqlTable("fronting_alerts", {
  id: int("id").autoincrement().primaryKey(),
  organisationId: int("organisationId").notNull(),
  complianceReportId: int("complianceReportId"),
  alertType: mysqlEnum("alertType", [
    "expenditure_learner_gap",
    "ownership_mismatch",
    "training_outcome_gap",
    "documentation_anomaly",
  ]).notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high"]).notNull(),
  description: text("description").notNull(),
  claimedValue: varchar("claimedValue", { length: 100 }),
  verifiedValue: varchar("verifiedValue", { length: 100 }),
  gapPercentage: decimal("gapPercentage", { precision: 5, scale: 2 }),
  status: mysqlEnum("status", ["open", "under_review", "resolved", "escalated"]).default("open").notNull(),
  resolvedAt: timestamp("resolvedAt"),
  resolvedBy: int("resolvedBy"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FrontingAlert = typeof frontingAlerts.$inferSelect;
export type InsertFrontingAlert = typeof frontingAlerts.$inferInsert;

export const charterReports = mysqlTable("charter_reports", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  reportingPeriod: varchar("reportingPeriod", { length: 20 }).notNull(),
  totalEntities: int("totalEntities").notNull(),
  emergingCount: int("emergingCount").notNull(),
  establishedCount: int("establishedCount").notNull(),
  leadingCount: int("leadingCount").notNull(),
  avgDigitalInfrastructure: decimal("avgDigitalInfrastructure", { precision: 5, scale: 2 }),
  avgSkillsReadiness: decimal("avgSkillsReadiness", { precision: 5, scale: 2 }),
  avgTransformationMetrics: decimal("avgTransformationMetrics", { precision: 5, scale: 2 }),
  avgInnovationCulture: decimal("avgInnovationCulture", { precision: 5, scale: 2 }),
  avgTotalScore: decimal("avgTotalScore", { precision: 5, scale: 2 }),
  frontingAlertsCount: int("frontingAlertsCount").default(0),
  summary: text("summary"),
  generatedBy: int("generatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CharterReport = typeof charterReports.$inferSelect;
export type InsertCharterReport = typeof charterReports.$inferInsert;

export const registrationRequests = mysqlTable("registration_requests", {
  id: int("id").autoincrement().primaryKey(),
  orgName: varchar("orgName", { length: 255 }).notNull(),
  orgType: varchar("orgType", { length: 100 }).notNull(),
  registrationNumber: varchar("registrationNumber", { length: 100 }),
  samsaNumber: varchar("samsaNumber", { length: 100 }),
  tetaAccredited: boolean("tetaAccredited").default(false),
  saasoa: boolean("saasoa").default(false),
  saaff: boolean("saaff").default(false),
  contactName: varchar("contactName", { length: 255 }).notNull(),
  contactEmail: varchar("contactEmail", { length: 320 }).notNull(),
  contactPhone: varchar("contactPhone", { length: 50 }),
  province: varchar("province", { length: 100 }),
  city: varchar("city", { length: 100 }),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  reviewedAt: timestamp("reviewedAt"),
  reviewedBy: int("reviewedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RegistrationRequest = typeof registrationRequests.$inferSelect;
export type InsertRegistrationRequest = typeof registrationRequests.$inferInsert;
