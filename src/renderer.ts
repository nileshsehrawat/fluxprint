export async function renderPdf(input: string): Promise<Buffer> {
  // temporary fake renderer

  await new Promise((r) => setTimeout(r, 100));

  return Buffer.from(`PDF: ${input}`);
}
