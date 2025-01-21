import { PromptTemplate } from "@langchain/core/prompts";
import { RetrievalQAChain } from "langchain/chains";
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

    createRagChainResponseFromVectorMemory: async (docsPath, userMessage, model) => {
        try {
            const splitDocs = await getSplittedDocuments(docsPath);
            const vectorStore = await LangchainMemoryVectorStoreHelper.generateVectorStore(splitDocs);
            const chain = generateRetrievalChainFromAiModel(
                model,
                vectorStore
            );
            const response = await chain.call({
                query: userMessage
            });
            return response;
        } catch (error) {
            throw new InternalServerError(
                "Internal Server Error",
                `Error : ${error.message}`
            );
        }
    },


}

function getPromptTemplate() {
    const template = `Use the following pieces of context to answer the question at the end. 
        If you don't know the answer, just say that you don't know, don't try to make up an answer.
        
        Context: {context}
        
        Question: {question}
        
        Answer: Let me help you with that.`;

        return PromptTemplate.fromTemplate(template);
    }

function generateRetrievalChainFromAiModel(model, vectorStore) {
    return RetrievalQAChain.fromLLM(
        model,
        vectorStore.asRetriever(),
        {
            prompt: getPromptTemplate(),
            returnSourceDocuments: true,
            verbose: true
        }
    );
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