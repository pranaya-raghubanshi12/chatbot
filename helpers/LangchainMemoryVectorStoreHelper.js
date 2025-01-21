import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

export default {
    generateVectorStore: async (splitDocs) => {
        const vectorStore = await MemoryVectorStore.fromDocuments(
            splitDocs,
            new OpenAIEmbeddings()
        );
        return vectorStore;
    }
}