"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllRecords = fetchAllRecords;
exports.validateBatchSize = validateBatchSize;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../transport");
async function fetchAllRecords(operation, totalCount, batchSize, storeCode, returnFields, additionalOptions = {}) {
    const allRecords = [];
    const baseOffset = additionalOptions.baseOffset || 0;
    let batchIndex = 0;
    let remainingCount = totalCount;
    while (remainingCount > 0) {
        const currentBatchSize = Math.min(batchSize, remainingCount);
        const currentOffset = baseOffset + (batchIndex * batchSize);
        const requestParams = {
            Store_Code: storeCode,
            Count: currentBatchSize,
            Offset: currentOffset,
        };
        const includeCustomFields = additionalOptions.includeCustomFields;
        const ondemandFilter = (0, transport_1.buildOndemandFilter)(returnFields, operation, includeCustomFields);
        if (ondemandFilter) {
            Object.assign(requestParams, ondemandFilter);
        }
        let apiFunction;
        switch (operation) {
            case 'getProducts':
                apiFunction = 'ProductList_Load_Query';
                break;
            case 'getOrders':
                if (additionalOptions.queueCode) {
                    apiFunction = 'Module';
                    requestParams.Function = 'Module';
                    requestParams.Module_Code = 'orderworkflow';
                    requestParams.Module_Function = 'QueueOrderList_Load_Query';
                    requestParams.Queue_Code = additionalOptions.queueCode;
                }
                else {
                    apiFunction = 'OrderList_Load_Query';
                }
                break;
            case 'getCustomers':
                apiFunction = 'CustomerList_Load_Query';
                break;
            default:
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported operation for pagination: ${operation}`);
        }
        const response = await transport_1.mivaApiRequest.call(this, apiFunction, requestParams);
        const transformedRecords = (0, transport_1.transformApiResponse)(response, returnFields);
        allRecords.push(...transformedRecords);
        remainingCount -= currentBatchSize;
        batchIndex++;
    }
    return allRecords;
}
function validateBatchSize(batchSize, itemIndex) {
    if (batchSize <= 0) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Batch Size must be greater than 0', { itemIndex });
    }
}
//# sourceMappingURL=paginationUtils.js.map