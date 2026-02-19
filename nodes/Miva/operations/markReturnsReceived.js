"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markReturnsReceived = markReturnsReceived;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../transport");
const utils_1 = require("../utils");
async function markReturnsReceived(items) {
    try {
        const storeCode = this.getNodeParameter('storeCode', 0);
        const returnIdField = this.getNodeParameter('returnIdField', 0);
        const inventoryAdjustment = this.getNodeParameter('inventoryAdjustment', 0);
        utils_1.validateStoreCode.call(this, storeCode, 0);
        if (items.length === 0) {
            return [[{ json: { message: 'No input data provided' } }]];
        }
        const sampleData = items[0].json;
        const missingFields = [];
        if (!(returnIdField in sampleData))
            missingFields.push(returnIdField);
        if (missingFields.length > 0) {
            return [[{
                        json: {
                            message: `❌ Cannot mark returns received - missing or invalid fields: ${missingFields.join(', ')}`,
                            missingFields,
                            alert: true
                        }
                    }]];
        }
        const returnIds = [];
        for (const item of items) {
            const inputData = item.json;
            if (inputData[returnIdField] != null) {
                const returnId = Number(inputData[returnIdField]);
                if (!isNaN(returnId) && returnId > 0) {
                    returnIds.push(returnId);
                }
            }
        }
        if (returnIds.length === 0) {
            return [[{
                        json: {
                            success: false,
                            message: `No valid return IDs found in field '${returnIdField}'`,
                            processed_items: items.length,
                            returns_processed: 0,
                        },
                    }]];
        }
        const response = await transport_1.mivaApiRequest.call(this, 'OrderReturnList_Received', {
            Store_Code: storeCode,
            Return_Ids: returnIds,
            Inventory_Adjustment: inventoryAdjustment ? 1 : 0,
        });
        if (response.success) {
            return [[{
                        json: {
                            success: true,
                            message: `Successfully marked ${returnIds.length} returns as received`,
                            processed_items: items.length,
                            returns_processed: returnIds.length,
                            return_ids: returnIds,
                            inventory_adjustment: inventoryAdjustment,
                        },
                    }]];
        }
        else {
            return [[{
                        json: {
                            success: false,
                            message: 'API call failed',
                            api_response: JSON.parse(JSON.stringify(response)),
                            return_ids: returnIds,
                        },
                    }]];
        }
    }
    catch (error) {
        if (this.continueOnFail()) {
            return [[{
                        json: { error: error.message || 'Unknown error occurred' },
                    }]];
        }
        else {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), error);
        }
    }
}
//# sourceMappingURL=markReturnsReceived.js.map