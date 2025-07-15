import fs from 'fs/promises';
import pdfParser from 'pdf-parse';

export async function parseResume(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const parsed = await pdfParser(dataBuffer);

    await fs.unlink(filePath);

    return parsed.text;
  } catch (err) {
    console.error("❌ Failed to parse or delete file:", err);
    throw err;
  }
}
