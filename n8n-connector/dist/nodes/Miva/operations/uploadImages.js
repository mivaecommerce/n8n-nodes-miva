"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImages = uploadImages;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../transport");
const utils_1 = require("../utils");
async function uploadImages(itemIndex) {
    const storeCode = this.getNodeParameter('storeCode', itemIndex);
    const productIdentifierType = this.getNodeParameter('productIdentifierType', itemIndex);
    const productIdentifierField = this.getNodeParameter('productIdentifierField', itemIndex);
    const imageUrlField = this.getNodeParameter('imageUrlField', itemIndex);
    const filePathTemplate = this.getNodeParameter('filePathTemplate', itemIndex);
    const imageTypeId = this.getNodeParameter('imageTypeId', itemIndex);
    utils_1.validateStoreCode.call(this, storeCode, itemIndex);
    const inputData = this.getInputData()[itemIndex].json;
    const productIdentifier = inputData[productIdentifierField];
    const imageUrl = inputData[imageUrlField];
    if (!productIdentifier) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Missing product identifier in field '${productIdentifierField}'`, { itemIndex });
    }
    if (!imageUrl) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Missing image URL in field '${imageUrlField}'`, { itemIndex });
    }
    const result = await transport_1.uploadImageToMiva.call(this, imageUrl, productIdentifier.toString(), productIdentifierType, storeCode, filePathTemplate, imageTypeId);
    const outputItem = {
        ...inputData,
        upload_status: result.success ? 'success' : 'failed',
        processing_timestamp: new Date().toISOString(),
    };
    if (result.success) {
        outputItem.miva_file_path = result.mivaFilePath;
    }
    else {
        outputItem.error_message = result.error;
        if (result.mivaResponse) {
            outputItem.miva_response = result.mivaResponse;
        }
    }
    return [outputItem];
}
//# sourceMappingURL=uploadImages.js.map