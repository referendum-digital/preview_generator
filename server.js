import express from "express";
import { createServer } from "node:http";
// List of required environment variables
const requiredEnvVars = ['API_KEY', 'TELEGRAM_BOT_TOKEN', 'S3_API_KEY'];

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
const httpServer = createServer(app);

app.use(express.json());

const port = process.env.PORT || 3000;

function authenticateRequest(req, res, next) {

    const apiKey = req.headers['key'];
    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
}


app.use(authenticateRequest);

app.post("/generate", (req, res, next) => {
    let question = req.body["question"];
    let owner = req.body["owner"];
    let referendumId = req.body["referendum_id"];

    let avatar = req.body["avatar_telegram_file_id"];
    // either this either that should be specified to fetch avatar
    let avatarURL = req.body["avatar_url"];

    // provide validations for all values and return error if form incorrect
    // It should generate html using some template with parameters from body
    // template save in repo
    // it should look like example.png
    // no need to make it perfect, lets build somehow, and fix template later. for more information on preview ask Bogdan.


    // after success generating html it should be converted to image with size 1200 * 630 or 800 * 419
    // and should be saved in wasabi storage (it is the same like amazon s3. it uses amazon s3 api, just different base url.) API key for wasabi I will provide
    // is should save in bucket /referendum_previews/referendumId

    // https://docs.wasabi.com/docs/how-do-i-use-aws-sdk-for-javascript-v3-with-wasabi here is link how to integrate wasabi via s3 api.

    // if req success return {"ok": 1} if not return error {"error": "description of error"}
    return res.status(200).json({"ok": 1});
});



httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
