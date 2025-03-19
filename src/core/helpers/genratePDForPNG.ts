import puppeteer from "puppeteer";

export const DocumentGeneratorService = {
  /**
   * Generate a PDF or PNG document from HTML content
   */
  async generate(htmlContent: string, type: string) {
    if (!["pdf", "png"].includes(type)) {
      console.error("Invalid type. Please use 'pdf' or 'png'.");
      return;
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

    if (type === "pdf") {
      await page.pdf({ path: "output.pdf", format: "A4" });
      console.log("PDF generated: output.pdf");
    } else if (type === "png") {
      await page.screenshot({ path: "output.png", fullPage: true });
      console.log("PNG generated: output.png");
    }

    await browser.close();
  },
};