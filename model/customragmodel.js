import AIModelHelper from "../helpers/AIModelHelper.js";
import ConstantFetchHelper from "../helpers/ConstantFetchHelper.js";
import LangchainHelper from "../helpers/LangchainHelper.js";

class CustomRAGModel {
    constructor(selectedModel, userMessage) {
        this.docsPath = './documents';
        this.selectedModel = selectedModel;
        this.userMessage = userMessage;
    }

    setDBType(dbType) {
        this.dbType = dbType;
    }

    /* try catch; pass the throwable err */
    async generateResponse() {
        if(this.dbType == ConstantFetchHelper.getDBTypes().LANGCHAIN_VECTORSTORE) {
            const model = AIModelHelper.initializeModel(this.selectedModel);

            if(!!!model) return "Error Generating Response";
            
            const response = await LangchainHelper.createRagChainResponseFromVectorMemory(this.docsPath, this.userMessage, model);
            return !!response && !!response.text ? response.text : "Error Generating Response";
        } else {
            return "Error Generating Response";
        }
    
    }
}

export default CustomRAGModel;