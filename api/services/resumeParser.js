import fs from 'fs';
import pdfParser from 'pdf-parse';

export async function parseResume(filePath) {
      console.log("📄 Trying to read:", filePath);
      const dataBuffer = fs.readFileSync(filePath);
      const parsed = await pdfParser(dataBuffer);
      return parsed.text;
}