import { render } from "./pool.ts";

async function benchmark() {
  const JOBS = 20;

  const typst = `
  = Fluxprint Benchmark
  Hello PDF
  `;

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
