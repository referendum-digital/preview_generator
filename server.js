import express from 'express';
import puppeteer from 'puppeteer';
import stream from 'stream';

// List of required environment variables
const requiredEnvVars = ['API_KEY'];

// Function to check environment variables
function checkEnvVariables() {
    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error(
            `Error: Missing the following environment variables: ${missingVars.join(', ')}`
        );
        process.exit(1); // Exit with a non-zero status code to indicate failure
    }
}

checkEnvVariables();

const app = express();
const port = process.env.PORT || 3000;

function authenticateRequest(req, res, next) {

    const apiKey = req.headers['key'];
    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
}

app.use(authenticateRequest);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let browser;

// Initialize Puppeteer browser
(async () => {
    browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // For environments like Docker
    });
})();

app.post('/generate', async (req, res) => {
    const { htmlContent } = req.body;

    if (!htmlContent) {
        return res.status(400).send('htmlContent is required');
    }

    try {
        const page = await browser.newPage();

        // Set viewport size if needed
        await page.setViewport({ width: 1200, height: 630 });

        // Set content
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Screenshot options
        const imageBuffer = await page.screenshot({
            type: 'png'
        });

        await page.close();

        const readStream = new stream.PassThrough();

        readStream.end(imageBuffer);

        res.set("Content-disposition", 'attachment; filename=' + "image.png");
        res.set("Content-Type", "image/png");

        readStream.pipe(res);

    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({'error': 'Error generating image'});
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    if (browser) {
        await browser.close();
    }
    process.exit();
});
