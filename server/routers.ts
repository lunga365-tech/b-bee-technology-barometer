import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";

// ─── Admin guard ──────────────────────────────────────────────────────────────
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Organisations ──────────────────────────────────────────────────────────
  organisations: router({
    list: publicProcedure.query(() => db.listOrganisations(true)),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getOrganisationById(input.id)),

    updateStatus: adminProcedure
      .input(z.object({ id: z.number(), status: z.enum(["pending", "approved", "rejected"]) }))
      .mutation(({ input }) => db.updateOrganisationStatus(input.id, input.status)),
  }),

  // ─── TAI Scores ─────────────────────────────────────────────────────────────
  tai: router({
    sectorBaseline: publicProcedure.query(() => db.getSectorBaseline()),

    listScores: publicProcedure
      .input(z.object({ organisationId: z.number().optional() }))
      .query(({ input }) => db.listTaiScores(input.organisationId)),

    latestByOrg: publicProcedure
      .input(z.object({ organisationId: z.number() }))
      .query(({ input }) => db.getLatestTaiScoreByOrg(input.organisationId)),

    allLatest: publicProcedure.query(async () => {
      const orgs = await db.listOrganisations(true);
      const results = await Promise.all(
        orgs.map(async (org) => {
          const score = await db.getLatestTaiScoreByOrg(org.id);
          return { org, score };
        })
      );
      return results.filter((r) => r.score !== undefined);
    }),
  }),

  // ─── Compliance ─────────────────────────────────────────────────────────────
  compliance: router({
    list: publicProcedure
      .input(z.object({ organisationId: z.number().optional() }))
      .query(({ input }) => db.listComplianceReports(input.organisationId)),

    listWithOrgs: publicProcedure.query(async () => {
      const reports = await db.listComplianceReports();
      const orgs = await db.listOrganisations(true);
      const orgMap = new Map(orgs.map((o) => [o.id, o]));
    return reports.map((r) => ({ ...r, organisation: orgMap.get(r.organisationId) }));
    }),

    verify: protectedProcedure
      .input(z.object({ reportId: z.number(), status: z.enum(["verified", "rejected"]) }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "verifier" && ctx.user.role !== "admin")
          throw new TRPCError({ code: "FORBIDDEN", message: "Verifier access required" });
        return db.updateComplianceReportVerification(input.reportId, input.status, ctx.user.id);
      }),
  }),

  // ─── Fronting Alerts ────────────────────────────────────────────────────────
  fronting: router({
    list: publicProcedure
      .input(z.object({ organisationId: z.number().optional() }))
      .query(({ input }) => db.listFrontingAlerts(input.organisationId)),

    listWithOrgs: publicProcedure.query(async () => {
      const alerts = await db.listFrontingAlerts();
      const orgs = await db.listOrganisations(true);
      const orgMap = new Map(orgs.map((o) => [o.id, o]));
      return alerts.map((a) => ({ ...a, organisation: orgMap.get(a.organisationId) }));
    }),

    resolve: protectedProcedure
      .input(z.object({ alertId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "verifier" && ctx.user.role !== "admin")
          throw new TRPCError({ code: "FORBIDDEN", message: "Verifier access required" });
        return db.updateFrontingAlertStatus(input.alertId, "resolved", ctx.user.id);
      }),

    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["open", "under_review", "resolved", "escalated"]),
        notes: z.string().optional(),
      }))
      .mutation(({ input, ctx }) => db.updateFrontingAlertStatus(input.id, input.status, ctx.user.id, input.notes)),
  }),

  // ─── Charter Council Reports ────────────────────────────────────────────────
  charter: router({
    list: publicProcedure.query(() => db.listCharterReports()),

    generate: adminProcedure
      .input(z.object({ reportingPeriod: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const baseline = await db.getSectorBaseline();
        const orgs = await db.listOrganisations(true);
        const alerts = await db.listFrontingAlerts();
        const openAlerts = alerts.filter((a) => a.status === "open" || a.status === "under_review");
        const id = await db.insertCharterReport({
          title: `Integrated Transport Sector B-BBEE Charter Council — Sectoral Transformation Report ${input.reportingPeriod}`,
          reportingPeriod: input.reportingPeriod,
          totalEntities: orgs.length,
          emergingCount: Number(baseline?.emergingCount ?? 0),
          establishedCount: Number(baseline?.establishedCount ?? 0),
          leadingCount: Number(baseline?.leadingCount ?? 0),
          avgDigitalInfrastructure: String(Number(baseline?.avgDI ?? 32).toFixed(2)),
          avgSkillsReadiness: String(Number(baseline?.avgSR ?? 28).toFixed(2)),
          avgTransformationMetrics: String(Number(baseline?.avgTM ?? 45).toFixed(2)),
          avgInnovationCulture: String(Number(baseline?.avgIC ?? 22).toFixed(2)),
          avgTotalScore: String(Number(baseline?.avgTotal ?? 31.75).toFixed(2)),
          frontingAlertsCount: openAlerts.length,
          summary: `This report covers ${orgs.length} registered maritime sector entities for the period ${input.reportingPeriod}. The sector Technology Adoption Index (TAI) average stands at ${Number(baseline?.avgTotal ?? 31.75).toFixed(1)}/100. ${Number(baseline?.emergingCount ?? 0)} entities are classified as Emerging, ${Number(baseline?.establishedCount ?? 0)} as Established, and ${Number(baseline?.leadingCount ?? 0)} as Leading. There are ${openAlerts.length} open fronting prevention alerts requiring attention.`,
          generatedBy: ctx.user.id,
        });
        return { id };
      }),
  }),

  // ─── Registration Requests ──────────────────────────────────────────────────
  registration: router({
    submit: publicProcedure
      .input(z.object({
        orgName: z.string().min(2),
        orgType: z.string(),
        registrationNumber: z.string().optional(),
        samsaNumber: z.string().optional(),
        tetaAccredited: z.boolean().optional(),
        saasoa: z.boolean().optional(),
        saaff: z.boolean().optional(),
        contactName: z.string().min(2),
        contactEmail: z.string().email(),
        contactPhone: z.string().optional(),
        province: z.string().optional(),
        city: z.string().optional(),
        message: z.string().optional(),
      }))
      .mutation(({ input }) => db.insertRegistrationRequest(input)),

    list: adminProcedure.query(() => db.listRegistrationRequests()),

    updateStatus: adminProcedure
      .input(z.object({ id: z.number(), status: z.enum(["pending", "approved", "rejected"]) }))
      .mutation(({ input, ctx }) => db.updateRegistrationRequestStatus(input.id, input.status, ctx.user.id)),
  }),

  // ─── Regulatory Feedback ────────────────────────────────────────────────────
  regulatory: router({
    summary: publicProcedure.query(async () => {
      const baseline = await db.getSectorBaseline();
      const orgs = await db.listOrganisations(true);
      const alerts = await db.listFrontingAlerts();
      const reports = await db.listComplianceReports();
      const openAlerts = alerts.filter((a) => a.status === "open");
      const verifiedReports = reports.filter((r) => r.status === "verified");
      return {
        totalEntities: orgs.length,
        approvedEntities: orgs.filter((o) => o.status === "approved").length,
        sectorTaiAverage: Number(baseline?.avgTotal ?? 31.75).toFixed(1),
        emergingCount: Number(baseline?.emergingCount ?? 0),
        establishedCount: Number(baseline?.establishedCount ?? 0),
        leadingCount: Number(baseline?.leadingCount ?? 0),
        openFrontingAlerts: openAlerts.length,
        verifiedComplianceReports: verifiedReports.length,
        mouReference: "B-BBEE Commission and Ports Regulator of South Africa, Memorandum of Understanding on Economic Transformation in the Ports Sector, signed 13 March 2024",
        lastUpdated: new Date().toISOString(),
      };
    }),
  }),

  // ─── Admin ──────────────────────────────────────────────────────────────────
  admin: router({
    stats: adminProcedure.query(async () => {
      const orgs = await db.listOrganisations(true);
      const alerts = await db.listFrontingAlerts();
      const reports = await db.listComplianceReports();
      const registrations = await db.listRegistrationRequests();
      const charterRpts = await db.listCharterReports();
      return {
        totalOrganisations: orgs.length,
        demoOrganisations: orgs.filter((o) => o.isDemo).length,
        liveOrganisations: orgs.filter((o) => !o.isDemo).length,
        pendingRegistrations: registrations.filter((r) => r.status === "pending").length,
        openAlerts: alerts.filter((a) => a.status === "open").length,
        totalReports: reports.length,
        totalCharterReports: charterRpts.length,
      };
    }),

    allOrganisations: adminProcedure.query(() => db.listOrganisations(true)),
    allAlerts: adminProcedure.query(() => db.listFrontingAlerts()),
    allRegistrations: adminProcedure.query(() => db.listRegistrationRequests()),
  }),

  // ─── Diagnostic (temporary) ─────────────────────────────────────────────────
  diagnostic: router({
    dbCheck: publicProcedure.query(async () => {
      const { Pool } = await import("pg");
      const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
      try {
        const client = await pool.connect();
        const result = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
        const cols = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'organisations' ORDER BY ordinal_position");
        client.release();
        await pool.end();
        return { tables: result.rows.map((r: any) => r.table_name), orgColumns: cols.rows.map((r: any) => r.column_name) };
      } catch (err: any) {
        await pool.end().catch(() => {});
        return { error: err.message, code: err.code };
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
// Temporary diagnostic endpoint - remove after debugging
