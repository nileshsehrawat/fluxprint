import { Worker } from "worker_threads";
//import path from "path";

const worker = new Worker(new URL("./worker.ts", import.meta.url), {
  execArgv: ["--import", "tsx"],
});

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
  const jobs = Array.from({ length: 10 }, (_, i) => render(`PDF ${i}`));

  const results = await Promise.all(jobs);

  console.log(results.map((r) => Buffer.from(r).toString()));
}

main();
