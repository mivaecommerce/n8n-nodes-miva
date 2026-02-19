"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acknowledgeOrders = acknowledgeOrders;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../transport");
const utils_1 = require("../utils");
async function acknowledgeOrders(items) {
    try {
        const storeCode = this.getNodeParameter('storeCode', 0);
        const orderIdField = this.getNodeParameter('orderIdField', 0);
        utils_1.validateStoreCode.call(this, storeCode, 0);
        if (items.length === 0) {
            return [[{ json: { message: 'No input data provided' } }]];
        }
        const sampleData = items[0].json;
        const missingFields = [];
        if (!(orderIdField in sampleData))
            missingFields.push(orderIdField);
        if (missingFields.length > 0) {
            return [[{
                        json: {
                            message: `❌ Cannot acknowledge orders - missing required fields: ${missingFields.join(', ')}`,
                            missingFields,
                            alert: true
                        }
                    }]];
        }
        const orderIds = [];
        for (const item of items) {
            const inputData = item.json;
            const orderId = inputData[orderIdField];
            if (orderId == null || orderId === '') {
                continue;
            }
            const numericOrderId = Number(orderId);
            if (!isNaN(numericOrderId) && numericOrderId > 0) {
                orderIds.push(numericOrderId);
            }
        }
        if (orderIds.length === 0) {
            return [[{
                        json: {
                            message: 'No orders acknowledged - no valid order IDs found',
                            processed_items: items.length,
                            orders_acknowledged: 0,
                        },
                    }]];
        }
        const response = await transport_1.mivaApiRequest.call(this, 'Module', {
            Store_Code: storeCode,
            Module_Code: 'orderworkflow',
            Module_Function: 'OrderList_Acknowledge',
            Order_Ids: orderIds,
        });
        return [[{
                    json: {
                        success: Boolean(response.success),
                        processed: Boolean(response.processed),
                        message: response.processed
                            ? `Successfully acknowledged ${orderIds.length} orders`
                            : 'Request was successful but no orders were processed',
                        processed_items: items.length,
                        orders_acknowledged: response.processed ? orderIds.length : 0,
                        order_ids: orderIds,
                    },
                }]];
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
//# sourceMappingURL=acknowledgeOrders.js.map