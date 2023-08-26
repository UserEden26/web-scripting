// import puppeteer from "puppeteer-core";
const puppeteer = require("puppeteer");

const run = async () => {
  let browser;
  try {
    // browser = await puppeteer.connect({
    //   browserWSEndpoint: `wss://`,
    // });

    browser = await puppeteer.launch();
    const page = await browser.newPage();
    // page.setDefaultNavigationTimeout(2 * 60 * 1000);

    await page.goto(
      "https://books.toscrape.com/catalogue/category/books_1/index.html"
    );

    const productPods = await page.$$(".product_pod");

    for (const pod of productPods) {
      const anchorText = await pod.$eval(
        "h3 a",
        (anchor) => anchor.textContent
      );

      if (!anchorText.endsWith("...")) {
        console.log(anchorText);
      } else {
        const url = await pod.$eval("h3 a", (anchor) => anchor.href);

        const newPage = await browser.newPage();
        await newPage.goto(url);

        const pageTitle = await newPage.$eval(
          "h1",
          (title) => title.textContent
        );
        console.log(pageTitle);

        await newPage.close();
      }
    }
  } catch (e) {
    console.error("SCRAP FAILED", e);
  } finally {
    await browser?.close();
  }
};

module.exports = run;
