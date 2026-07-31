import {
  boolean,
  decimal,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin", "examiner", "verifier"]);
export const orgTypeEnum = pgEnum("org_type", [
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
]);
export const orgStatusEnum = pgEnum("org_status", ["pending", "approved", "rejected"]);
export const classificationEnum = pgEnum("classification", ["Emerging", "Established", "Leading"]);
export const complianceStatusEnum = pgEnum("compliance_status", ["draft", "submitted", "verified", "flagged"]);
export const alertTypeEnum = pgEnum("alert_type", [
  "expenditure_learner_gap",
  "ownership_mismatch",
  "training_outcome_gap",
  "documentation_anomaly",
]);
export const severityEnum = pgEnum("severity", ["low", "medium", "high"]);
export const alertStatusEnum = pgEnum("alert_status", ["open", "under_review", "resolved", "escalated"]);
export const regStatusEnum = pgEnum("reg_status", ["pending", "approved", "rejected"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const organisations = pgTable("organisations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  orgType: orgTypeEnum("orgType").notNull(),
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
  status: orgStatusEnum("status").default("pending").notNull(),
  approvedAt: timestamp("approvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Organisation = typeof organisations.$inferSelect;
export type InsertOrganisation = typeof organisations.$inferInsert;

export const taiScores = pgTable("tai_scores", {
  id: serial("id").primaryKey(),
  organisationId: integer("organisationId").notNull(),
  reportingPeriod: varchar("reportingPeriod", { length: 20 }).notNull(),
  digitalInfrastructure: decimal("digitalInfrastructure", { precision: 5, scale: 2 }).notNull(),
  skillsReadiness: decimal("skillsReadiness", { precision: 5, scale: 2 }).notNull(),
  transformationMetrics: decimal("transformationMetrics", { precision: 5, scale: 2 }).notNull(),
  innovationCulture: decimal("innovationCulture", { precision: 5, scale: 2 }).notNull(),
  totalScore: decimal("totalScore", { precision: 5, scale: 2 }).notNull(),
  classification: classificationEnum("classification").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TaiScore = typeof taiScores.$inferSelect;
export type InsertTaiScore = typeof taiScores.$inferInsert;

export const complianceReports = pgTable("compliance_reports", {
  id: serial("id").primaryKey(),
  organisationId: integer("organisationId").notNull(),
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
  claimedLearnersCount: integer("claimedLearnersCount"),
  verifiedLearnersCount: integer("verifiedLearnersCount"),
  overallComplianceScore: decimal("overallComplianceScore", { precision: 5, scale: 2 }),
  status: complianceStatusEnum("status").default("draft").notNull(),
  submittedAt: timestamp("submittedAt"),
  verifiedAt: timestamp("verifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ComplianceReport = typeof complianceReports.$inferSelect;
export type InsertComplianceReport = typeof complianceReports.$inferInsert;

export const frontingAlerts = pgTable("fronting_alerts", {
  id: serial("id").primaryKey(),
  organisationId: integer("organisationId").notNull(),
  complianceReportId: integer("complianceReportId"),
  alertType: alertTypeEnum("alertType").notNull(),
  severity: severityEnum("severity").notNull(),
  description: text("description").notNull(),
  claimedValue: varchar("claimedValue", { length: 100 }),
  verifiedValue: varchar("verifiedValue", { length: 100 }),
  gapPercentage: decimal("gapPercentage", { precision: 5, scale: 2 }),
  status: alertStatusEnum("status").default("open").notNull(),
  resolvedAt: timestamp("resolvedAt"),
  resolvedBy: integer("resolvedBy"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type FrontingAlert = typeof frontingAlerts.$inferSelect;
export type InsertFrontingAlert = typeof frontingAlerts.$inferInsert;

export const charterReports = pgTable("charter_reports", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  reportingPeriod: varchar("reportingPeriod", { length: 20 }).notNull(),
  totalEntities: integer("totalEntities").notNull(),
  emergingCount: integer("emergingCount").notNull(),
  establishedCount: integer("establishedCount").notNull(),
  leadingCount: integer("leadingCount").notNull(),
  avgDigitalInfrastructure: decimal("avgDigitalInfrastructure", { precision: 5, scale: 2 }),
  avgSkillsReadiness: decimal("avgSkillsReadiness", { precision: 5, scale: 2 }),
  avgTransformationMetrics: decimal("avgTransformationMetrics", { precision: 5, scale: 2 }),
  avgInnovationCulture: decimal("avgInnovationCulture", { precision: 5, scale: 2 }),
  avgTotalScore: decimal("avgTotalScore", { precision: 5, scale: 2 }),
  frontingAlertsCount: integer("frontingAlertsCount").default(0),
  summary: text("summary"),
  generatedBy: integer("generatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CharterReport = typeof charterReports.$inferSelect;
export type InsertCharterReport = typeof charterReports.$inferInsert;

export const registrationRequests = pgTable("registration_requests", {
  id: serial("id").primaryKey(),
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
  status: regStatusEnum("status").default("pending").notNull(),
  reviewedAt: timestamp("reviewedAt"),
  reviewedBy: integer("reviewedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RegistrationRequest = typeof registrationRequests.$inferSelect;
export type InsertRegistrationRequest = typeof registrationRequests.$inferInsert;
