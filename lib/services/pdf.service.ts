import pdf from 'pdf-parse';

export class PDFService {
  public static async parsePDF(buffer: Buffer): Promise<string> {
    try {
      const data = await pdf(buffer);
      return data.text.replace(/\s+/g, ' ').trim();
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error('Failed to parse PDF');
    }
  }

  public static async parseBase64PDF(base64String: string): Promise<string> {
    const buffer = Buffer.from(base64String, 'base64');
    return this.parsePDF(buffer);
  }
} 