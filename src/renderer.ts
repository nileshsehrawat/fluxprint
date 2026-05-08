import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import os from "os";
import path from "path";
import crypto from "crypto";

const execFileAsync = promisify(execFile);

export async function renderPdf(input: string): Promise<Buffer> {
  //temprory
  const id = crypto.randomUUID();

  const inputPath = path.join(os.tmpdir(), `${id}.typ`);
  const outputPath = path.join(os.tmpdir(), `${id}.pdf`);

  try {
    await fs.writeFile(inputPath, input);

    //run typst compiler
    await execFileAsync("typst", ["compile", inputPath, outputPath]);

    //read generated pdf
    const pdfBuffer = await fs.readFile(outputPath);

    return pdfBuffer;
  } finally {
    //cleanup
    await Promise.allSettled([fs.unlink(inputPath), fs.unlink(outputPath)]);
  }
}
