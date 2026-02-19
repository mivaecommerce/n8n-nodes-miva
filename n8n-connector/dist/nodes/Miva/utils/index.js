"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBatchSize = exports.fetchAllRecords = void 0;
exports.findFieldCaseInsensitive = findFieldCaseInsensitive;
exports.extractAdjustmentData = extractAdjustmentData;
exports.checkLowStock = checkLowStock;
exports.validateStoreCode = validateStoreCode;
exports.validateCount = validateCount;
const n8n_workflow_1 = require("n8n-workflow");
function findFieldCaseInsensitive(obj, targetField, alternativeFields = []) {
    const allFields = [targetField, ...alternativeFields];
    for (const field of allFields) {
        const matchingKey = Object.keys(obj).find(key => key.toLowerCase() === field.toLowerCase());
        if (matchingKey)
            return matchingKey;
    }
    return null;
}
function extractAdjustmentData(inputData, identifierType) {
    if (typeof inputData !== 'object' || Array.isArray(inputData)) {
        return null;
    }
    const identifierKey = identifierType === 'product_id'
        ? findFieldCaseInsensitive(inputData, 'product_id', ['id'])
        : findFieldCaseInsensitive(inputData, identifierType);
    const adjustmentKey = findFieldCaseInsensitive(inputData, 'adjustment');
    if (!identifierKey || !adjustmentKey)
        return null;
    const identifierValue = inputData[identifierKey];
    const adjustmentValue = inputData[adjustmentKey];
    if (identifierValue == null || identifierValue === '' ||
        adjustmentValue == null || adjustmentValue === '') {
        return null;
    }
    return {
        [identifierType]: identifierValue,
        adjustment: adjustmentValue,
    };
}
function checkLowStock(inputData, identifierType) {
    if (typeof inputData !== 'object' || Array.isArray(inputData)) {
        return null;
    }
    const identifierKey = identifierType === 'product_id'
        ? findFieldCaseInsensitive(inputData, 'product_id', ['id'])
        : findFieldCaseInsensitive(inputData, identifierType);
    const inventoryKey = findFieldCaseInsensitive(inputData, 'product_inventory');
    const thresholdKey = findFieldCaseInsensitive(inputData, 'inventory_threshold', ['inventory_threshhold']);
    if (!identifierKey || !inventoryKey)
        return null;
    const identifierValue = inputData[identifierKey];
    const currentInventory = Number(inputData[inventoryKey]) || 0;
    const threshold = thresholdKey && inputData[thresholdKey] != null && inputData[thresholdKey] !== ''
        ? Number(inputData[thresholdKey]) || 0
        : 0;
    if (currentInventory < threshold) {
        return `${identifierType.replace('_', ' ')} ${identifierValue}: ${currentInventory} units (threshold: ${threshold})`;
    }
    return null;
}
function validateStoreCode(storeCode, itemIndex) {
    if (!storeCode) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Store Code is required', { itemIndex });
    }
}
function validateCount(count, itemIndex) {
    if (count <= 0) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Count must be greater than 0', { itemIndex });
    }
}
var paginationUtils_1 = require("./paginationUtils");
Object.defineProperty(exports, "fetchAllRecords", { enumerable: true, get: function () { return paginationUtils_1.fetchAllRecords; } });
Object.defineProperty(exports, "validateBatchSize", { enumerable: true, get: function () { return paginationUtils_1.validateBatchSize; } });
//# sourceMappingURL=index.js.map