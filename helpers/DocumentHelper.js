import fs from 'fs';
import path from 'path';
import { Document } from '@langchain/core/documents';

export default {
    loadMarkdownFiles: async (directoryPath) => {
        const documents = [];

        // Read all files in the directory
        const files = fs.readdirSync(directoryPath);

        for (const file of files) {
            if (path.extname(file) === '.md') {
                const filePath = path.join(directoryPath, file);
                const content = fs.readFileSync(filePath, 'utf-8');

                // Create a Document object for each markdown file
                documents.push(
                    new Document({
                        pageContent: content,
                        metadata: { source: filePath }
                    })
                );
            }
        }

        return documents;
    }
}