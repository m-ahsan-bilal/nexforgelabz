import { google } from "googleapis";
import path from "path";
import fs from "fs";

/* ═══════════════════════════════════════════════════
   GOOGLE SHEETS HELPER
   Appends a row to the configured spreadsheet.
   Requires:
     GOOGLE_SHEET_ID env var
     google-service-account.json in project root (local)
     OR GOOGLE_SERVICE_ACCOUNT_KEY env var (Vercel/prod)
   ═══════════════════════════════════════════════════ */

export async function appendToSheet(values: string[]): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    console.log("[Sheets] Skipping — GOOGLE_SHEET_ID not set.");
    return;
  }

  try {
    // Try env var first (for Vercel), then fall back to local JSON file
    let credentials: object;

    const keyFromEnv = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (keyFromEnv) {
      credentials = JSON.parse(keyFromEnv);
    } else {
      const filePath = path.join(process.cwd(), "google-service-account.json");
      if (!fs.existsSync(filePath)) {
        console.log("[Sheets] Skipping — no service account key found.");
        return;
      }
      credentials = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:Z",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [values] },
    });

    console.log("[Sheets] Row appended successfully.");
  } catch (err) {
    // Never break the API response on sheet failure
    console.error("[Sheets] Failed to append row:", err);
  }
}
