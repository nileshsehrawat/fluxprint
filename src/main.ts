import { render } from "./pool";

async function main() {
  const jobs = Array.from({ length: 20 }, (_, i) => render(`PDF ${i}`));

  const results = await Promise.all(jobs);

  console.log(results.length);
}

main();
