"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductImage = deleteProductImage;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../transport");
const utils_1 = require("../utils");
async function deleteProductImage(itemIndex) {
    const storeCode = this.getNodeParameter('storeCode', itemIndex);
    const imageIdField = this.getNodeParameter('imageIdField', itemIndex);
    utils_1.validateStoreCode.call(this, storeCode, itemIndex);
    const inputData = this.getInputData()[itemIndex].json;
    const imageId = inputData[imageIdField];
    if (!imageId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Missing image ID in field '${imageIdField}'`, { itemIndex });
    }
    const result = await transport_1.deleteProductImageFromMiva.call(this, imageId.toString(), storeCode);
    const outputItem = {
        [imageIdField]: imageId,
        delete_status: result.success ? 'success' : 'failed',
        processing_timestamp: new Date().toISOString(),
    };
    if (result.success) {
    }
    else {
        outputItem.error_message = result.error;
        if (result.mivaResponse) {
            outputItem.miva_response = result.mivaResponse;
        }
    }
    return [outputItem];
}
//# sourceMappingURL=deleteProductImage.js.map