import { ChatAnthropic } from "@langchain/anthropic";

export default {
    getModel: (modelName) => {
        return new ChatAnthropic({
            anthropicApiKey: process.env.ANTHROPIC_API_KEY,
            modelName,
            temperature: 0.7
        });
    }
}