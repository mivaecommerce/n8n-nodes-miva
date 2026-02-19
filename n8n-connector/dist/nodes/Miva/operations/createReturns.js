"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReturns = createReturns;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../transport");
const utils_1 = require("../utils");
async function createReturns(items) {
    try {
        const storeCode = this.getNodeParameter('storeCode', 0);
        const orderIdField = this.getNodeParameter('orderIdFieldReturns', 0);
        const lineIdField = this.getNodeParameter('lineIdFieldReturns', 0);
        const createReturnField = this.getNodeParameter('createReturnFieldReturns', 0);
        utils_1.validateStoreCode.call(this, storeCode, 0);
        if (items.length === 0) {
            return [[{ json: { message: 'No input data provided' } }]];
        }
        const sampleData = items[0].json;
        const missingFields = [];
        if (!(orderIdField in sampleData))
            missingFields.push(orderIdField);
        if (!(lineIdField in sampleData))
            missingFields.push(lineIdField);
        if (!(createReturnField in sampleData))
            missingFields.push(createReturnField);
        if (missingFields.length > 0) {
            return [[{
                        json: {
                            message: `❌ Cannot process returns - missing or invalid fields: ${missingFields.join(', ')}`,
                            missingFields,
                            alert: true
                        }
                    }]];
        }
        const orderGroups = new Map();
        for (const item of items) {
            const inputData = item.json;
            const orderId = inputData[orderIdField];
            const lineId = inputData[lineIdField];
            const createReturn = inputData[createReturnField];
            if (createReturn === true && orderId != null && lineId != null) {
                const orderIdStr = String(orderId);
                if (!orderGroups.has(orderIdStr)) {
                    orderGroups.set(orderIdStr, []);
                }
                orderGroups.get(orderIdStr).push(Number(lineId));
            }
        }
        if (orderGroups.size === 0) {
            return [[{
                        json: {
                            message: `No returns created - no items marked for return (${createReturnField} must be true)`,
                            processed_items: items.length,
                            returns_created: 0,
                        },
                    }]];
        }
        const returnData = [];
        for (const [orderId, lineIds] of orderGroups) {
            try {
                const response = await transport_1.mivaApiRequest.call(this, 'OrderItemList_CreateReturn', {
                    Store_Code: storeCode,
                    Order_Id: Number(orderId),
                    line_ids: lineIds,
                });
                lineIds.forEach(lineId => {
                    var _a;
                    returnData.push({
                        json: {
                            order_id: Number(orderId),
                            line_id: lineId,
                            return_id: (_a = response.data) === null || _a === void 0 ? void 0 : _a.id,
                        },
                    });
                });
            }
            catch (error) {
                lineIds.forEach(lineId => {
                    returnData.push({
                        json: {
                            order_id: Number(orderId),
                            line_id: lineId,
                            error: error.message || 'Failed to create return',
                        },
                    });
                });
            }
        }
        return [returnData];
    }
    catch (error) {
        if (this.continueOnFail()) {
            return [[{
                        json: {
                            success: false,
                            error: error.message || 'Unknown error occurred',
                        },
                    }]];
        }
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), error.message || 'Unknown error occurred');
    }
}
//# sourceMappingURL=createReturns.js.map