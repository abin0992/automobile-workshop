import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

type Diagnosis = { problem: string; fix: string };

/**
 * Map a raw driver error to something actionable. Never echoes the connection
 * string or credentials — only the error code and a human explanation.
 */
function diagnose(error: unknown): Diagnosis {
  // Drizzle wraps driver errors, sometimes several layers deep, so walk the
  // whole cause chain rather than checking only the top-level error.
  const codes: string[] = [];
  const messages: string[] = [];
  let current: unknown = error;
  for (let depth = 0; current && depth < 8; depth += 1) {
    const node = current as { code?: string; message?: string; cause?: unknown };
    if (node.code) codes.push(String(node.code));
    if (node.message) messages.push(String(node.message));
    current = node.cause;
  }
  const code = codes[0] ?? "";
  const allCodes = codes.join(" ");
  const message = messages.join(" ").toLowerCase();

  if (!process.env.DATABASE_URL) {
    return {
      problem: "DATABASE_URL is not set on this deployment.",
      fix: "Add it in Netlify → Site configuration → Environment variables, then redeploy.",
    };
  }
  if (allCodes.includes("42P01") || message.includes("does not exist")) {
    return {
      problem: "Connected to the database, but the tables are missing.",
      fix: "Run `npx drizzle-kit push` locally with the same DATABASE_URL to create them.",
    };
  }
  if (allCodes.includes("28P01") || message.includes("password authentication failed")) {
    return {
      problem: "The database rejected the username or password.",
      fix: "On Supabase pooler ports the username is `postgres.<project-ref>`. Percent-encode special characters in the password.",
    };
  }
  if (allCodes.includes("ENOTFOUND") || allCodes.includes("EAI_AGAIN")) {
    return {
      problem: "The database hostname could not be resolved.",
      fix: "Check the host in DATABASE_URL. A paused Supabase project also fails this way — resume it in the dashboard.",
    };
  }
  if (
    allCodes.includes("ETIMEDOUT") ||
    allCodes.includes("ECONNREFUSED") ||
    allCodes.includes("ECONNRESET") ||
    message.includes("connection terminated") ||
    message.includes("timeout")
  ) {
    return {
      problem: "Could not establish a connection to the database.",
      fix: "Use the Supabase transaction pooler host on port 6543 with ?sslmode=require. The direct connection is often unreachable from serverless hosts.",
    };
  }
  if (message.includes("too many clients")) {
    return {
      problem: "The database is out of connection slots.",
      fix: "Switch DATABASE_URL to the transaction pooler on port 6543.",
    };
  }
  if (message.includes("self-signed certificate") || message.includes("certificate")) {
    return {
      problem: "TLS certificate verification failed.",
      fix: "Append ?sslmode=no-verify to DATABASE_URL.",
    };
  }
  return {
    problem: `The database connection failed${code ? ` (${code})` : ""}.`,
    fix: "Check DATABASE_URL in your Netlify environment variables.",
  };
}

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return Response.json({ ok: false, ...diagnose(null) }, { status: 500 });
  }

  try {
    await db.execute(sql`select 1`);
  } catch (error) {
    return Response.json({ ok: false, stage: "connect", ...diagnose(error) }, { status: 500 });
  }

  try {
    await db.execute(sql`select 1 from "services" limit 1`);
  } catch (error) {
    return Response.json({ ok: false, stage: "schema", ...diagnose(error) }, { status: 500 });
  }

  return Response.json({ ok: true });
}
