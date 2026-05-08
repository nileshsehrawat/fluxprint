import { parentPort } from "worker_threads";
import { renderPdf } from "./renderer.ts";

parentPort?.on("message", async (input: string) => {
  try {
    const pdfBuffer = await renderPdf(input);

    parentPort?.postMessage({
      success: true,
      data: pdfBuffer,
    });
  } catch (error) {
    parentPort?.postMessage({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
