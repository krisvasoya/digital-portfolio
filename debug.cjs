const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.evaluateOnNewDocument(() => {
    window.addEventListener('error', e => {
      window.logError('BROWSER UNCAUGHT ERROR: ' + e.message + '\n' + (e.error?.stack || e.error));
    });
    window.addEventListener('unhandledrejection', e => {
      window.logError('BROWSER UNHANDLED REJECTION: ' + (e.reason?.stack || e.reason));
    });
  });

  await page.exposeFunction('logError', message => {
    require('fs').writeFileSync('exact_error.txt', message);
  });

  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    console.log("Page loaded. Waiting for errors...");
    await new Promise(r => setTimeout(r, 2000));
  } catch (err) {
    console.error("Puppeteer navigation failed:", err);
  } finally {
    await browser.close();
  }
})();
