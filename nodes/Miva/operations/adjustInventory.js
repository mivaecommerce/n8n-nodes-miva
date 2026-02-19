"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustInventory = adjustInventory;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../transport");
const utils_1 = require("../utils");
async function adjustInventory(items) {
    try {
        const storeCode = this.getNodeParameter('storeCode', 0);
        const productIdentifierType = this.getNodeParameter('productIdentifierType', 0);
        const productIdentifierField = this.getNodeParameter('productIdentifierField', 0);
        const adjustmentField = this.getNodeParameter('adjustmentField', 0);
        utils_1.validateStoreCode.call(this, storeCode, 0);
        if (items.length === 0) {
            return [[{ json: { message: 'No input data provided' } }]];
        }
        const sampleData = items[0].json;
        const missingFields = [];
        if (!(productIdentifierField in sampleData))
            missingFields.push(productIdentifierField);
        if (!(adjustmentField in sampleData))
            missingFields.push(adjustmentField);
        if (missingFields.length > 0) {
            return [[{
                        json: {
                            message: `❌ Cannot adjust inventory - missing or invalid fields: ${missingFields.join(', ')}`,
                            missingFields,
                            alert: true
                        }
                    }]];
        }
        const allAdjustments = [];
        for (let i = 0; i < items.length; i++) {
            const inputData = items[i].json;
            if (typeof inputData === 'object' && !Array.isArray(inputData)) {
                const identifierValue = inputData[productIdentifierField];
                const adjustmentValue = inputData[adjustmentField];
                if (identifierValue == null || identifierValue === '' ||
                    adjustmentValue == null || adjustmentValue === '') {
                    continue;
                }
                const adjustment = {
                    [productIdentifierType]: identifierValue,
                    adjustment: Number(adjustmentValue),
                };
                allAdjustments.push(adjustment);
            }
        }
        if (allAdjustments.length === 0) {
            return [[{
                        json: {
                            success: false,
                            message: 'No valid adjustments found - all items were missing required data',
                            processed_items: items.length,
                            adjustments_made: 0,
                        },
                    }]];
        }
        await transport_1.mivaApiRequest.call(this, 'ProductList_Adjust_Inventory', {
            Store_Code: storeCode,
            Inventory_Adjustments: allAdjustments,
        });
        return [[{
                    json: {
                        success: true,
                        message: `Successfully adjusted inventory for ${allAdjustments.length} products`,
                        processed_items: items.length,
                        adjustments_made: allAdjustments.length,
                        skipped_items: items.length - allAdjustments.length,
                        storeCode,
                    },
                }]];
    }
    catch (error) {
        if (this.continueOnFail()) {
            return [[{
                        json: {
                            error: error.message || 'Unknown error occurred',
                            operation: 'adjustInventory',
                        },
                    }]];
        }
        else {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), error);
        }
    }
}
//# sourceMappingURL=adjustInventory.js.map