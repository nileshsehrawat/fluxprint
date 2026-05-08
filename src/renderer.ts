import { spawn } from "child_process";

export async function renderPdf(input: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const typst = spawn("typst", ["compile", "-", "-"]);

    const chunks: Buffer[] = [];
    let totalLength = 0;

    typst.stdout.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
      totalLength += chunk.length;
    });

    const errorChunks: Buffer[] = [];

    typst.stderr.on("data", (chunk: Buffer) => {
      errorChunks.push(chunk);
    });

    typst.on("error", reject);

    typst.on("close", (code) => {
      if (code === 0) {
        resolve(Buffer.concat(chunks, totalLength));
      } else {
        reject(
          new Error(
            `Typst exited with code ${code}\n${Buffer.concat(errorChunks).toString()}`,
          ),
        );
      }
    });

    typst.stdin.write(input);
    typst.stdin.end();
  });
}
