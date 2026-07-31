CREATE TYPE IF NOT EXISTS "public"."alert_status" AS ENUM('open', 'under_review', 'resolved', 'escalated');--> statement-breakpoint
CREATE TYPE IF NOT EXISTS "public"."alert_type" AS ENUM('expenditure_learner_gap', 'ownership_mismatch', 'training_outcome_gap', 'documentation_anomaly');--> statement-breakpoint
CREATE TYPE IF NOT EXISTS "public"."classification" AS ENUM('Emerging', 'Established', 'Leading');--> statement-breakpoint
CREATE TYPE IF NOT EXISTS "public"."compliance_status" AS ENUM('draft', 'submitted', 'verified', 'flagged');--> statement-breakpoint
CREATE TYPE IF NOT EXISTS "public"."org_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE IF NOT EXISTS "public"."org_type" AS ENUM('terminal_operator', 'ship_agent', 'stevedore', 'bunker_supplier', 'freight_forwarder', 'training_provider', 'port_service', 'shipping_line', 'marine_surveyor', 'other');--> statement-breakpoint
CREATE TYPE IF NOT EXISTS "public"."reg_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE IF NOT EXISTS "public"."severity" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE IF NOT EXISTS "public"."user_role" AS ENUM('user', 'admin', 'examiner', 'verifier');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "charter_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"reportingPeriod" varchar(20) NOT NULL,
	"totalEntities" integer NOT NULL,
	"emergingCount" integer NOT NULL,
	"establishedCount" integer NOT NULL,
	"leadingCount" integer NOT NULL,
	"avgDigitalInfrastructure" numeric(5, 2),
	"avgSkillsReadiness" numeric(5, 2),
	"avgTransformationMetrics" numeric(5, 2),
	"avgInnovationCulture" numeric(5, 2),
	"avgTotalScore" numeric(5, 2),
	"frontingAlertsCount" integer DEFAULT 0,
	"summary" text,
	"generatedBy" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "compliance_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"organisationId" integer NOT NULL,
	"reportingPeriod" varchar(20) NOT NULL,
	"totalSdExpenditure" numeric(15, 2),
	"fourirSdExpenditure" numeric(15, 2),
	"fourirSdPercentage" numeric(5, 2),
	"digitalSkillsWeightingTarget" numeric(5, 2) DEFAULT '25.00',
	"equitableAccessBonus" boolean DEFAULT false,
	"equitableAccessScore" numeric(5, 2) DEFAULT '0.00',
	"esdTechContributions" numeric(15, 2),
	"esdTechRecognised" boolean DEFAULT false,
	"esdScore" numeric(5, 2),
	"claimedLearnersCount" integer,
	"verifiedLearnersCount" integer,
	"overallComplianceScore" numeric(5, 2),
	"status" "compliance_status" DEFAULT 'draft' NOT NULL,
	"submittedAt" timestamp,
	"verifiedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fronting_alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"organisationId" integer NOT NULL,
	"complianceReportId" integer,
	"alertType" "alert_type" NOT NULL,
	"severity" "severity" NOT NULL,
	"description" text NOT NULL,
	"claimedValue" varchar(100),
	"verifiedValue" varchar(100),
	"gapPercentage" numeric(5, 2),
	"status" "alert_status" DEFAULT 'open' NOT NULL,
	"resolvedAt" timestamp,
	"resolvedBy" integer,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organisations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"orgType" "org_type" NOT NULL,
	"registrationNumber" varchar(100),
	"samsaNumber" varchar(100),
	"tetaAccredited" boolean DEFAULT false,
	"saasoa" boolean DEFAULT false,
	"saaff" boolean DEFAULT false,
	"contactName" varchar(255),
	"contactEmail" varchar(320),
	"contactPhone" varchar(50),
	"province" varchar(100),
	"city" varchar(100),
	"isDemo" boolean DEFAULT false NOT NULL,
	"status" "org_status" DEFAULT 'pending' NOT NULL,
	"approvedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "registration_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"orgName" varchar(255) NOT NULL,
	"orgType" varchar(100) NOT NULL,
	"registrationNumber" varchar(100),
	"samsaNumber" varchar(100),
	"tetaAccredited" boolean DEFAULT false,
	"saasoa" boolean DEFAULT false,
	"saaff" boolean DEFAULT false,
	"contactName" varchar(255) NOT NULL,
	"contactEmail" varchar(320) NOT NULL,
	"contactPhone" varchar(50),
	"province" varchar(100),
	"city" varchar(100),
	"message" text,
	"status" "reg_status" DEFAULT 'pending' NOT NULL,
	"reviewedAt" timestamp,
	"reviewedBy" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tai_scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"organisationId" integer NOT NULL,
	"reportingPeriod" varchar(20) NOT NULL,
	"digitalInfrastructure" numeric(5, 2) NOT NULL,
	"skillsReadiness" numeric(5, 2) NOT NULL,
	"transformationMetrics" numeric(5, 2) NOT NULL,
	"innovationCulture" numeric(5, 2) NOT NULL,
	"totalScore" numeric(5, 2) NOT NULL,
	"classification" "classification" NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
