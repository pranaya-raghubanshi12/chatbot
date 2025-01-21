import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import "dotenv/config"
import { fileURLToPath } from 'url';
import CustomRAGModel from './model/customragmodel.js';
import ConstantFetchHelper from './helpers/ConstantFetchHelper.js';
import ErrorResponseHelper from './helpers/ErrorResponseHelper.js';
import LoggerHelper from './helpers/LoggerHelper.js';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

// Serve static files (CSS and JS)
app.use(express.static(path.join(__dirname, 'public')));

// Render the HTML page on GET request
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle the message POST request
app.post('/send-message', async (req, res) => {
    try {
        const customRagModel = new CustomRAGModel(req.body.model, req.body.message);
        customRagModel.setDBType(ConstantFetchHelper.getDBTypes().LANGCHAIN_VECTORSTORE);
        const responseText = await customRagModel.generateResponse();
        res.json({ message: responseText });
    } catch(error) {
        ErrorResponseHelper.handleError(error, res);
    }
    
});

// Start the server
app.listen(port, () => {
    LoggerHelper.clearOldLogs()
    setInterval(() => {
        LoggerHelper.clearOldLogs()
    }, 60 * 60 * 1000);
    console.log(`Server is running on http://localhost:${port}`);
});
