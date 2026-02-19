"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShipment = createShipment;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../transport");
const utils_1 = require("../utils");
async function createShipment(items) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    try {
        const storeCode = this.getNodeParameter('storeCode', 0);
        const orderIdField = this.getNodeParameter('orderIdFieldShipment', 0);
        const lineIdField = this.getNodeParameter('lineIdFieldShipment', 0);
        const createShipmentField = this.getNodeParameter('createShipmentField', 0);
        const returnFields = this.getNodeParameter('returnFields', 0);
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
        if (!(createShipmentField in sampleData))
            missingFields.push(createShipmentField);
        if (missingFields.length > 0) {
            return [[{
                        json: {
                            message: `❌ Cannot process shipments - missing or invalid fields: ${missingFields.join(', ')}`,
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
            const createShipment = inputData[createShipmentField];
            if (createShipment === true && orderId != null && lineId != null) {
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
                            message: `No shipments created - no items marked for shipment (${createShipmentField} must be true)`,
                            processed_items: items.length,
                            shipments_created: 0,
                        },
                    }]];
        }
        const results = [];
        let successCount = 0;
        for (const [orderId, lineIds] of orderGroups) {
            try {
                const response = await transport_1.mivaApiRequest.call(this, 'OrderItemList_CreateShipment', {
                    Store_Code: storeCode,
                    Order_Id: Number(orderId),
                    line_ids: lineIds,
                });
                const fullShipmentData = {
                    success: true,
                    order_id: Number(orderId),
                    line_ids: lineIds,
                    shipment_id: (_a = response.data) === null || _a === void 0 ? void 0 : _a.id,
                    id: (_b = response.data) === null || _b === void 0 ? void 0 : _b.id,
                    code: (_c = response.data) === null || _c === void 0 ? void 0 : _c.code,
                    batch_id: (_d = response.data) === null || _d === void 0 ? void 0 : _d.batch_id,
                    status: (_e = response.data) === null || _e === void 0 ? void 0 : _e.status,
                    labelcount: (_f = response.data) === null || _f === void 0 ? void 0 : _f.labelcount,
                    ship_date: (_g = response.data) === null || _g === void 0 ? void 0 : _g.ship_date,
                    tracknum: (_h = response.data) === null || _h === void 0 ? void 0 : _h.tracknum,
                    tracktype: (_j = response.data) === null || _j === void 0 ? void 0 : _j.tracktype,
                    tracklink: (_k = response.data) === null || _k === void 0 ? void 0 : _k.tracklink,
                    weight: (_l = response.data) === null || _l === void 0 ? void 0 : _l.weight,
                    cost: (_m = response.data) === null || _m === void 0 ? void 0 : _m.cost,
                    formatted_cost: (_o = response.data) === null || _o === void 0 ? void 0 : _o.formatted_cost,
                };
                const filteredData = {};
                returnFields.forEach(field => {
                    if (fullShipmentData.hasOwnProperty(field)) {
                        filteredData[field] = fullShipmentData[field];
                    }
                });
                results.push(filteredData);
                successCount++;
            }
            catch (error) {
                results.push({
                    success: false,
                    order_id: Number(orderId),
                    line_ids: lineIds,
                    error: error.message || 'Unknown error occurred',
                });
            }
        }
        const returnData = results.map(result => ({
            json: result,
        }));
        return [returnData];
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
//# sourceMappingURL=createShipment.js.map