"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomers = getCustomers;
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("../utils");
async function getCustomers(itemIndex) {
    try {
        const count = this.getNodeParameter('count', 0);
        const batchSize = this.getNodeParameter('batchSize', 0);
        const offset = this.getNodeParameter('offset', 0);
        const storeCode = this.getNodeParameter('storeCode', 0);
        const returnFields = this.getNodeParameter('returnFields', itemIndex);
        utils_1.validateStoreCode.call(this, storeCode, itemIndex);
        utils_1.validateCount.call(this, count, itemIndex);
        utils_1.validateBatchSize.call(this, batchSize, itemIndex);
        const allRecords = await utils_1.fetchAllRecords.call(this, 'getCustomers', count, batchSize, storeCode, returnFields, { baseOffset: offset });
        const returnData = allRecords.map((record) => ({
            json: record,
            pairedItem: { item: itemIndex },
        }));
        if (allRecords.length === 0) {
            returnData.push({
                json: {
                    message: 'No items found for getCustomers',
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
                        operation: 'getCustomers',
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
//# sourceMappingURL=getCustomers.js.map