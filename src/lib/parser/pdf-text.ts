import type { TextItem } from './barclays';

// Minimal shape of the pdf.js document we rely on, so this works with both the
// browser build and the Node "legacy" build.
interface PdfLike {
  numPages: number;
  getPage(n: number): Promise<{
    getTextContent(): Promise<{ items: Array<{ str?: string; transform?: number[]; width?: number }> }>;
  }>;
}

export async function extractPages(doc: PdfLike): Promise<TextItem[][]> {
  const pages: TextItem[][] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    pages.push(
      content.items
        .filter((i) => typeof i.str === 'string' && i.transform)
        .map((i) => ({ str: i.str!, x: i.transform![4], y: i.transform![5], width: i.width ?? 0 })),
    );
  }
  return pages;
}
