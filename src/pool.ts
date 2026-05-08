import { Worker } from "worker_threads";
import path from "path";

const WORKER_COUNT = 4;

type PoolWorker = {
  worker: Worker;
  busy: boolean;
};

const workers: PoolWorker[] = [];

//crate workers
for (let i = 0; i < WORKER_COUNT; i++) {
  workers.push({
    worker: new Worker(path.resolve(__dirname, "./worker.ts")),
    busy: false,
  });
}

//round robin scheduling
let current = 0;

//The render function that will be called by the main thread
export function render(input: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    //pick current worker
    const poolWorker = workers[current];

    //move to next worker for next job
    current = current + (1 % workers.length);

    //listen for response from worker
    poolWorker.worker.once("message", (message) => {
      if (message.success) {
        resolve(message.data);
      } else {
        reject(new Error(message.error));
      }
    });

    //send work to worker
    poolWorker.worker.postMessage(input);
  });
}
