import { render } from "./pool.ts";
import fs from "fs/promises";

async function main() {
  const typstContent = `= Fluxprint Hello from Typst.`;

  const pdf = await render(typstContent);

  console.log("PDF size:", pdf.length);

  // optional test output
  await fs.writeFile("test.pdf", pdf);
}

main();
