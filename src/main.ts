import { Worker } from "worker_threads";
import path from "path";

const worker = new Worker(path.resolve(__dirname, "worker.js"));

function render(input: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    worker.once("message", (message) => {
      if (message.success) {
        resolve(message.data);
      } else {
        reject(new Error(message.error));
      }
    });
    worker.postMessage(input);
  });
}

async function main() {
  const pdf = await render("Hello Fluxprint");

  console.log(pdf.toString());
}

main();
