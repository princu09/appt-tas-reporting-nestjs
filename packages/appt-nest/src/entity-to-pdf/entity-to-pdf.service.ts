import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class EntityToPdfService {
  async convert(
    object: Record<string, unknown>,
    title: string,
    filename: string,
    converter: (T: Record<string, unknown>) => Record<string, unknown> = null,
  ): Promise<string> {
    const data = converter ? converter(object) : object;
    const doc = new PDFDocument();
    const file = path.join(process.env.TMP_FILE_PATH, filename);

    // Create a temp file
    const fileStream = fs.createWriteStream(file);
    doc.pipe(fileStream);

    // Set font and size
    doc.text(title).moveDown();

    // Iterate the object and add to the pdf
    for (const [key, value] of Object.entries(data)) {
      doc.text(`${key}: ${value}`).moveDown();
    }

    // Finish the pdf
    return new Promise((res) => {
      fileStream.on('finish', () => {
        return res(file);
      });

      doc.end();
    });
  }
  async convertStringify(
    object: Record<string, unknown>,
    title: string,
    filename: string,
    converter: (T: Record<string, unknown>) => Record<string, unknown> = null,
  ): Promise<string> {
    const data = converter ? converter(object) : object;
    const doc = new PDFDocument();
    const file = path.join(process.env.TMP_FILE_PATH, filename);

    // Create a temp file
    const fileStream = fs.createWriteStream(file);
    doc.pipe(fileStream);

    // Set font and size
    doc

      .text(title)
      .moveDown()
      .text(JSON.stringify(data, null, '    '))
      .moveDown();

    // Finish the pdf
    return new Promise((res) => {
      fileStream.on('finish', () => {
        return res(file);
      });

      doc.end();
    });
  }

  async convertFn<T>(
    object: T,
    title: string,
    filename: string,
    converter: (obj: T, doc: PDFKit.PDFDocument) => Promise<void>,
  ): Promise<string> {
    const doc = new PDFDocument();
    const file = path.join(process.env.TMP_FILE_PATH, filename);

    // Create a temp file
    const fileStream = fs.createWriteStream(file);
    doc.pipe(fileStream);

    // Set font and size
    doc.text(title).moveDown();

    await converter(object, doc);

    // Finish the pdf
    return new Promise((res) => {
      fileStream.on('finish', () => {
        return res(file);
      });

      doc.end();
    });
  }
}
