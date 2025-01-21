import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";

export default {
    initializeModel: (modelName) => {
        switch (modelName) {
            case "claude-3-5-sonnet-20241022":
            case "claude-3-5-haiku-20241022":
            case "claude-3-sonnet-20240229":
            case "claude-3-haiku-20240307":
                return new ChatAnthropic({
                    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
                    modelName,
                    temperature: 0.7
                });

            case "gpt-4o":
            case "gpt-4o-mini":
            case "gpt-3.5-turbo":
                return new ChatOpenAI({
                    openAIApiKey: process.env.OPENAI_API_KEY,
                    temperature: 0.7,
                    modelName
                });

            default:
                return null;
        }
    }
}