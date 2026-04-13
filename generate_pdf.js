const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, 'Quizzify_UML_Diagrams.html');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(fs.readFileSync(filePath));
});

server.listen(8080, async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto(`http://localhost:8080`, { waitUntil: 'networkidle0' });
    
    // Wait for 8 seconds to ensure mermaid renders
    await new Promise(r => setTimeout(r, 8000));
    
    // Save to PDF
    const pdfPathRoot = path.join(__dirname, 'Quizzify_UML_Diagrams.pdf');
    await page.pdf({
      path: pdfPathRoot,
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });
    
    console.log(`Successfully generated PDF at ${pdfPathRoot}`);
    await browser.close();
    server.close();
  } catch (err) {
    console.error('Failed to generate PDF:', err);
    server.close();
    process.exit(1);
  }
});
