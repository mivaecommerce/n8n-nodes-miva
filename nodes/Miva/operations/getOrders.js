"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = getOrders;
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("../utils");
async function getOrders(items) {
    try {
        const count = this.getNodeParameter('count', 0);
        const batchSize = this.getNodeParameter('batchSize', 0);
        const offset = this.getNodeParameter('offset', 0);
        const storeCode = this.getNodeParameter('storeCode', 0);
        const returnFields = this.getNodeParameter('returnFields', 0);
        const itemFields = returnFields.includes('items') ? this.getNodeParameter('itemFields', 0) : [];
        const flattenItems = returnFields.includes('items') ? this.getNodeParameter('flattenItems', 0) : false;
        const queueFilter = this.getNodeParameter('queueFilter', 0);
        const queueCode = queueFilter === 'queue' ? this.getNodeParameter('queueCode', 0) : '';
        utils_1.validateStoreCode.call(this, storeCode, 0);
        utils_1.validateCount.call(this, count, 0);
        utils_1.validateBatchSize.call(this, batchSize, 0);
        if (queueFilter === 'queue' && !queueCode) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Queue Code is required when filtering by queue');
        }
        const allRecords = await utils_1.fetchAllRecords.call(this, 'getOrders', count, batchSize, storeCode, returnFields, { queueCode, baseOffset: offset });
        let returnData = [];
        if (returnFields.includes('items') && flattenItems) {
            allRecords.forEach((record) => {
                if (Array.isArray(record.items)) {
                    record.items.forEach((item) => {
                        const flattenedRecord = {};
                        Object.keys(record).forEach(key => {
                            if (key !== 'items') {
                                flattenedRecord[key] = record[key];
                            }
                        });
                        if (itemFields.length > 0) {
                            itemFields.forEach(field => {
                                if (item.hasOwnProperty(field)) {
                                    flattenedRecord[field] = item[field];
                                }
                            });
                        }
                        else {
                            Object.keys(item).forEach(key => {
                                flattenedRecord[key] = item[key];
                            });
                        }
                        returnData.push({
                            json: flattenedRecord,
                            pairedItem: { item: 0 },
                        });
                    });
                }
                else {
                    returnData.push({
                        json: record,
                        pairedItem: { item: 0 },
                    });
                }
            });
        }
        else if (returnFields.includes('items') && !flattenItems) {
            allRecords.forEach((record) => {
                if (Array.isArray(record.items) && itemFields.length > 0) {
                    record.items = record.items.map((item) => {
                        const filteredItem = {};
                        itemFields.forEach(field => {
                            if (item.hasOwnProperty(field)) {
                                filteredItem[field] = item[field];
                            }
                        });
                        return filteredItem;
                    });
                }
                returnData.push({
                    json: record,
                    pairedItem: { item: 0 },
                });
            });
        }
        else {
            returnData = allRecords.map((record) => ({
                json: record,
                pairedItem: { item: 0 },
            }));
        }
        if (returnData.length === 0) {
            returnData.push({
                json: {
                    message: 'No items found for getOrders',
                    storeCode,
                    count,
                    batchSize,
                },
                pairedItem: { item: 0 },
            });
        }
        return [returnData];
    }
    catch (error) {
        if (this.continueOnFail()) {
            return [[{
                        json: {
                            error: error.message || 'Unknown error occurred',
                            operation: 'getOrders',
                        },
                    }]];
        }
        else {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), error);
        }
    }
}
//# sourceMappingURL=getOrders.js.map