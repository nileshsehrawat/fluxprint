import { parentPort } from "worker_threads";
import { renderPdf } from "./renderer";

parentPort?.on("message", async (input: string) => {
  try {
    const pdfBufffer = await renderPdf(input);
    parentPort?.postMessage({
      success: true,
      data: pdfBufffer,
    });
  } catch (error) {
    parentPort?.postMessage({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
