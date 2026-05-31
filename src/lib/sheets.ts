import { supabase } from './supabase';

// Backend API function for exporting to Google Sheets
export async function backupToGoogleSheets(spreadsheetId: string, accessToken: string) {
  try {
    if (!spreadsheetId) {
      throw new Error("Spreadsheet ID tidak valid.");
    }

    if (!accessToken) {
        throw new Error("Missing Google Access Token. Harap masukkan token yang valid.");
    }

    const response = await fetch('/api/backup/manual', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ spreadsheetId, accessToken }),
    });

    if (!response.ok) {
        let errorText = await response.text();
        let errorData;
        try {
            errorData = JSON.parse(errorText);
        } catch(e) {
            throw new Error(errorText.substring(0, 50) + "... (Unexpected server response)");
        }
        throw new Error(errorData.error || "Gagal menyimpan ke Google Sheets");
    }

    return true;
  } catch (err: any) {
    console.error("Sheets Backup Error:", err);
    throw err;
  }
}
