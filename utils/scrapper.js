const puppeteer = require('puppeteer');

const scrapeWebsite = async (url) => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", // Windows
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const content = await page.evaluate(() => document.body.innerText);

    await browser.close();
    return content;
  } catch (error) {
    console.error("❌ Scraping Error:", error);
    return null;
  }
};

module.exports = scrapeWebsite