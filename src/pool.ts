//moving from parallelism to controlled concurrency with a worker pool

import { Worker } from "worker_threads";
import path from "path";

const WORKER_COUNT = 4;

type PoolWorker = {
  worker: Worker;
  busy: boolean;
};

type Job = {
  input: string;
  resolve: (value: Buffer) => void;
  reject: (reason?: any) => void;
};

const workers: PoolWorker[] = [];

const queue: Job[] = [];

//crate workers
for (let i = 0; i < WORKER_COUNT; i++) {
  workers.push({
    worker: new Worker(new URL("./worker.ts", import.meta.url), {
      execArgv: ["--import", "tsx"],
    }),
    busy: false,
  });
}

function processQueue() {
  //find free workers
  const poolWorker = workers.find((w) => !w.busy);

  if (!poolWorker) {
    return;
  }

  const job = queue.shift(); //get next job from queue

  if (!job) {
    return;
  }

  poolWorker.busy = true; //mark all workers as busy

  //Listen for workers result
  poolWorker.worker.once("message", (message) => {
    // Worker is free again
    poolWorker.busy = false;
    // Process next queued job
    processQueue();
    if (message.success) {
      job.resolve(message.data);
    } else {
      job.reject(message.error);
    }
  });
  //send work to worker
  poolWorker.worker.postMessage(job.input);
}

//The render function that will be called by the main thread
export function render(input: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    //Add job to the queue
    queue.push({
      input,
      resolve,
      reject,
    });

    processQueue(); //Try to process the queue
  });
}
