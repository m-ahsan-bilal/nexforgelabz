import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/* ═══════════════════════════════════════════════════
   EXIT LEAD API — /api/exit-lead
   Receives exit intent form submissions.
   Rate limited: 3 per IP per hour.
   ═══════════════════════════════════════════════════ */

/* ── Schema ───────────────────────────────────────── */

const bodySchema = z.object({
    idea: z.string().min(10).max(1000),
    email: z.string().email(),
    source: z.string(),
    trigger: z.string().optional(),
    timestamp: z.string(),
});

/* ── In-memory rate limit (resets on cold start) ──── */

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 }); // 1 hour
        return true;
    }

    if (entry.count >= 3) return false;

    entry.count++;
    return true;
}

/* ── Handler ──────────────────────────────────────── */

export async function POST(req: NextRequest) {
    try {
        /* Rate limit check */
        const forwarded = req.headers.get("x-forwarded-for");
        const ip = forwarded?.split(",")[0]?.trim() || "unknown";

        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { error: "Too many requests. Try again later." },
                { status: 429 }
            );
        }

        /* Parse & validate body */
        const body = await req.json();
        const result = bodySchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid data.", details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { idea, email, trigger, timestamp } = result.data;

        /* ── Send email via Resend (if API key available) ── */
        const resendKey = process.env.RESEND_API_KEY;

        if (resendKey) {
            const subject = `🚪 Exit Lead — ${idea.slice(0, 55)}${idea.length > 55 ? "..." : ""}`;

            const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${resendKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: "NexForge Labz <onboarding@resend.dev>",
                    to: "nexforge.labz@gmail.com",
                    reply_to: email,
                    subject,
                    html: `
            <div style="font-family: sans-serif; max-width: 600px;">
              <h2 style="color: #333;">🚪 Exit Intent Lead</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Email</td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Trigger</td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${trigger || "unknown"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Timestamp</td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${timestamp}</td>
                </tr>
              </table>
              <div style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
                <p style="font-weight: bold; margin: 0 0 8px;">Their Idea:</p>
                <p style="margin: 0; white-space: pre-wrap;">${idea}</p>
              </div>
            </div>
          `,
                }),
            });

            if (!res.ok) {
                const errBody = await res.text();
                console.error("[Resend] Exit lead email failed:", res.status, errBody);
            } else {
                console.log(`[Resend] Exit lead email sent — from ${email}`);
            }
        } else {
            /* No Resend key: log to console for development */
            console.log("────────────────────────────────────");
            console.log("🚪 EXIT LEAD CAPTURED");
            console.log(`   Email: ${email}`);
            console.log(`   Idea: ${idea}`);
            console.log(`   Trigger: ${trigger}`);
            console.log(`   Time: ${timestamp}`);
            console.log("────────────────────────────────────");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Exit lead error:", error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}
