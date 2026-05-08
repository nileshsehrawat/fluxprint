import { render } from "./pool.ts";

async function benchmark() {
  const JOBS = 100;

  const typst = `
    = Fluxprint Benchmark
    Hello PDF
  `;

  //warm up benchmark
  console.log("Warming up...");
  await Promise.all(Array.from({ length: 20 }, () => render(typst)));

  //actual benchmark
  console.log("Running benchmark...");

  const start = performance.now();
  const jobs = Array.from({ length: JOBS }, () => render(typst));

  await Promise.all(jobs);
  const end = performance.now();
  const seconds = (end - start) / 1000;

  console.log("Jobs:", JOBS);
  console.log("Time:", seconds.toFixed(2), "sec");
  console.log("PDF/sec:", (JOBS / seconds).toFixed(2));
}

benchmark();
