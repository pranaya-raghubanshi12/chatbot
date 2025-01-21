import { createLogger, format, transports } from 'winston';
import fs from 'fs';

// Define the log levels
const LOG_FILE_NAME = 'debug.log';
const LOG_FILE_PATH = `${process.cwd()}/${LOG_FILE_NAME}`;

// Logger configuration interface
// Logger configuration
const config = {
    level: 'info',
    filePath: LOG_FILE_NAME,
    consoleEnabled: false,
};

// Create the logger
const logger = createLogger({
    level: config.level,
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamps
        format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`), // Custom log format
    ),
    transports: [
        new transports.File({ filename: config.filePath }), // Log to a file
    ],
});

const clearOldLogs = () => {
    fs.readFile(LOG_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading log file:', err);
            return;
        }

        const now = new Date();
        const oneHourAgo = now.getTime() - 60 * 60 * 1000;
        const lines = data.split('\n');
        const filteredLines = lines.filter((line) => {
            const match = line.match(/^\[(.*?)\]/);
            if (match && match[1]) {
                const logTime = new Date(match[1]).getTime();
                return logTime >= oneHourAgo; // Keep logs from the last hour
            }
            return false; // Discard invalid or unparseable lines
        });

        if(lines.join(',') == filteredLines.join(',')) {
            console.log("no debug logs to remove");
            return;
        }

        fs.writeFile(LOG_FILE_PATH, filteredLines.join('\n'), (err) => {
            if (err) {
                console.error('Error writing log file:', err);
            } else {
                console.log('Old logs cleared successfully.');
            }
        });
    });
};

// Add console transport if enabled
if (config.consoleEnabled) {
    logger.add(
        new transports.Console({
            format: format.combine(
                format.colorize(), // Colorize console output
                format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`),
            ),
        }),
    );
}

// Export the logger for use in other modules
export default {
    logger,
    clearOldLogs
};
