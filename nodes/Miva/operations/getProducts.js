"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("../utils");
async function getProducts(itemIndex) {
    try {
        const count = this.getNodeParameter('count', 0);
        const batchSize = this.getNodeParameter('batchSize', 0);
        const offset = this.getNodeParameter('offset', 0);
        const storeCode = this.getNodeParameter('storeCode', 0);
        const returnFields = this.getNodeParameter('returnFields', itemIndex);
        const includeCustomFields = this.getNodeParameter('includeCustomFields', itemIndex);
        utils_1.validateStoreCode.call(this, storeCode, itemIndex);
        utils_1.validateCount.call(this, count, itemIndex);
        utils_1.validateBatchSize.call(this, batchSize, itemIndex);
        const allRecords = await utils_1.fetchAllRecords.call(this, 'getProducts', count, batchSize, storeCode, returnFields, { includeCustomFields, baseOffset: offset });
        const returnData = allRecords.map((record) => ({
            json: record,
            pairedItem: { item: itemIndex },
        }));
        if (allRecords.length === 0) {
            returnData.push({
                json: {
                    message: 'No items found for getProducts',
                    storeCode,
                    count,
                    batchSize,
                },
                pairedItem: { item: itemIndex },
            });
        }
        return returnData;
    }
    catch (error) {
        if (this.continueOnFail()) {
            return [{
                    json: {
                        error: error.message || 'Unknown error occurred',
                        operation: 'getProducts',
                        itemIndex,
                    },
                    pairedItem: { item: itemIndex },
                }];
        }
        else {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, {
                itemIndex,
            });
        }
    }
}
//# sourceMappingURL=getProducts.js.map