const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log("Launching browser for screenshots...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });

  console.log("Navigating to mock screens...");
  await page.goto('http://localhost:3000/mock-screens', { waitUntil: 'networkidle0' });

  console.log("Capturing Input Screen...");
  const inputElem = await page.$('#input-mock');
  await inputElem.screenshot({ path: path.join(__dirname, 'quizzify_input_mock.png') });

  console.log("Capturing Output Screen...");
  const outputElem = await page.$('#output-mock');
  await outputElem.screenshot({ path: path.join(__dirname, 'quizzify_output_mock.png') });

  console.log("Capturing Leaderboard Screen...");
  const leaderboardElem = await page.$('#leaderboard-mock');
  await leaderboardElem.screenshot({ path: path.join(__dirname, 'quizzify_leaderboard_mock.png') });

  console.log("Screenshots captured successfully!");
  await browser.close();
})();
