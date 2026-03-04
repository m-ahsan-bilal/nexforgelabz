import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/* ═══════════════════════════════════════════════════
   PROJECT BRIEF API — /api/project-brief
   Validates, rate limits, sends notification + 
   confirmation emails via Resend, and Slack webhook.
   ═══════════════════════════════════════════════════ */

/* ── Schema ───────────────────────────────────────── */

const schema = z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    idea: z.string().min(30).max(1000),
    budget: z.enum(["5k-10k", "10k-20k", "20k-40k", "40k-80k", "80k+", "unsure"]),
    source: z.string().optional(),
    timestamp: z.string().optional(),
});

/* ── In-memory rate limit ─────────────────────────── */

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
        return true;
    }

    if (entry.count >= 5) return false;
    entry.count++;
    return true;
}

/* ── Budget label map ─────────────────────────────── */

const budgetLabels: Record<string, string> = {
    "5k-10k": "$5k–$10k",
    "10k-20k": "$10k–$20k",
    "20k-40k": "$20k–$40k",
    "40k-80k": "$40k–$80k",
    "80k+": "$80k+",
    unsure: "Not sure yet",
};

/* ── Handler ──────────────────────────────────────── */

export async function POST(req: NextRequest) {
    try {
        /* Rate limit */
        const forwarded = req.headers.get("x-forwarded-for");
        const ip = forwarded?.split(",")[0]?.trim() || "unknown";

        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { error: "Too many submissions. Try WhatsApp instead." },
                { status: 429 }
            );
        }

        /* Validate */
        const body = await req.json();
        const result = schema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid data.", details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { name, email, idea, budget, source, timestamp } = result.data;
        const budgetLabel = budgetLabels[budget] || budget;
        const ts = timestamp || new Date().toISOString();

        /* ── Send emails via Resend ─────────────────────── */
        const resendKey = process.env.RESEND_API_KEY;

        if (resendKey) {
            // EMAIL A — Internal notification
            const subjectA = `🚀 Project Brief — ${budgetLabel} — ${name} — ${idea.slice(0, 50)}${idea.length > 50 ? "..." : ""}`;

            await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${resendKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: "NexForge Labz <leads@nexforgelabz.com>",
                    to: "nexforge.labz@gmail.com",
                    subject: subjectA,
                    html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 600px; background: #0d0d14; color: #e5e5e5; padding: 32px; border-radius: 12px;">
              <h2 style="color: #fff; margin: 0 0 20px; font-size: 20px;">🚀 NEW PROJECT BRIEF</h2>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #222; font-weight: bold; color: #aaa; width: 100px;">Name</td>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #222; color: #fff;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #222; font-weight: bold; color: #aaa;">Email</td>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #222;"><a href="mailto:${email}" style="color: #3b7aff;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #222; font-weight: bold; color: #aaa;">Budget</td>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #222; color: #f59e0b; font-weight: bold;">${budgetLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #222; font-weight: bold; color: #aaa;">Source</td>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #222; color: #e5e5e5;">${source || "Not specified"}</td>
                </tr>
              </table>
              <div style="background: #131320; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <p style="color: #aaa; font-size: 12px; margin: 0 0 8px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">Their Idea</p>
                <p style="color: #e5e5e5; margin: 0; white-space: pre-wrap; font-family: monospace; font-size: 14px; line-height: 1.6;">${idea}</p>
              </div>
              <a href="mailto:${email}" style="display: inline-block; background: #3b7aff; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Quick Reply →</a>
              <p style="color: #555; font-size: 11px; margin-top: 20px;">Timestamp: ${ts} · IP: ${ip}</p>
            </div>
          `,
                }),
            });

            // EMAIL B — Founder confirmation
            await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${resendKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: "NexForge Labz <hello@nexforgelabz.com>",
                    to: email,
                    subject: `Got your brief, ${name} 👋`,
                    text: `Hey ${name},

Got your brief — thanks for sharing what you're building.

We'll review it carefully and send you a personalized scope estimate within 24 hours: tech stack recommendation, rough timeline, and ballpark cost range.

If anything's urgent, just reply to this email directly.

Even if your idea turns out to be a better fit for a different approach or tool, we'll tell you that honestly. That's the only kind of advice we give.

Talk soon,
The NexForge team

P.S. Check spam if you don't hear from us — sometimes emails hide.`,
                }),
            });
        } else {
            /* No Resend key: log to console */
            console.log("────────────────────────────────────");
            console.log("🚀 PROJECT BRIEF RECEIVED");
            console.log(`   Name: ${name}`);
            console.log(`   Email: ${email}`);
            console.log(`   Budget: ${budgetLabel}`);
            console.log(`   Source: ${source || "N/A"}`);
            console.log(`   Idea: ${idea}`);
            console.log(`   Time: ${ts}`);
            console.log("────────────────────────────────────");
        }

        /* ── Slack webhook (optional) ──────────────────── */
        const slackUrl = process.env.SLACK_WEBHOOK_URL;
        if (slackUrl) {
            await fetch(slackUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: `🚀 New Brief: ${name} | ${budgetLabel} | "${idea.slice(0, 100)}${idea.length > 100 ? "..." : ""}"`,
                }),
            }).catch(() => { });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Project brief error:", error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}
