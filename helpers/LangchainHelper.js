import { PromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import LangchainMemoryVectorStoreHelper from "./LangchainMemoryVectorStoreHelper.js";
import DocumentHelper from "./DocumentHelper.js";
import InternalServerError from "../error/InternalServerError.js";

export default {
    splitDocuments: async (documents) => {
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200
        });

        return await textSplitter.splitDocuments(documents);
    },

    createRagChainResponseFromVectorMemory: async (docsPath, question, llm) => {
        try {
            const splitDocs = await getSplittedDocuments(docsPath);
            const vectorStore = await LangchainMemoryVectorStoreHelper.generateVectorStore(splitDocs);
            const retrievedDocs = await vectorStore.similaritySearch(question, 3);
            const context = retrievedDocs.map(doc => doc.pageContent).join("\n\n");
            const messages = await generateMessagesFromPrompt(context, question);
            const response = await llm.call(messages);
            return response;
        } catch (error) {
            throw new InternalServerError(
                "Internal Server Error",
                `Error : ${error.message}`
            );
        }
    },
}

async function generateMessagesFromPrompt(context, question) {
    const prompt = new PromptTemplate({
        inputVariables: ["context", "question"],
        template: `
          You are a helpful assistant. If you don't know the answer, just say that you don't know, don't try to make up an answer. Use the following context to answer the question:
          Context: {context}
          Question: {question}
          Answer:
        `,
    });
    const formattedPrompt = await prompt.format({ context, question });
    return [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: formattedPrompt },
    ];
}

async function splitDocuments(documents) {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    });

    return await textSplitter.splitDocuments(documents);
}

async function getSplittedDocuments(docsPath) {
    const rawDocs = await DocumentHelper.loadMarkdownFiles(docsPath);
    const splitDocs = await splitDocuments(rawDocs);
    return splitDocs;
}