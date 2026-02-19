"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShipments = updateShipments;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../transport");
const utils_1 = require("../utils");
async function updateShipments(items) {
    try {
        const storeCode = this.getNodeParameter('storeCode', 0);
        const shipmentIdField = this.getNodeParameter('shipmentIdField', 0);
        const additionalFields = this.getNodeParameter('additionalFields', 0);
        const markShippedField = additionalFields.markShippedField;
        const trackNumberField = additionalFields.trackNumberField;
        const trackTypeField = additionalFields.trackTypeField;
        const costField = additionalFields.costField;
        const weightField = additionalFields.weightField;
        utils_1.validateStoreCode.call(this, storeCode, 0);
        if (items.length === 0) {
            return [[{ json: { message: 'No input data provided' } }]];
        }
        const sampleData = items[0].json;
        const missingFields = [];
        if (!(shipmentIdField in sampleData))
            missingFields.push(shipmentIdField);
        if (missingFields.length > 0) {
            return [[{
                        json: {
                            message: `❌ Cannot update shipments - missing required fields: ${missingFields.join(', ')}`,
                            missingFields,
                            alert: true
                        }
                    }]];
        }
        const shipmentUpdates = [];
        for (const item of items) {
            const inputData = item.json;
            const shipmentId = inputData[shipmentIdField];
            if (shipmentId == null || shipmentId === '') {
                continue;
            }
            const shipmentUpdate = {
                shpmnt_id: Number(shipmentId),
            };
            if (markShippedField && inputData[markShippedField] != null && inputData[markShippedField] !== '') {
                shipmentUpdate.mark_shipped = inputData[markShippedField];
            }
            if (trackNumberField && inputData[trackNumberField] != null && inputData[trackNumberField] !== '') {
                shipmentUpdate.tracknum = String(inputData[trackNumberField]);
            }
            if (trackTypeField && inputData[trackTypeField] != null && inputData[trackTypeField] !== '') {
                shipmentUpdate.tracktype = String(inputData[trackTypeField]);
            }
            if (costField && inputData[costField] != null && inputData[costField] !== '') {
                shipmentUpdate.cost = inputData[costField];
            }
            if (weightField && inputData[weightField] != null && inputData[weightField] !== '') {
                shipmentUpdate.weight = inputData[weightField];
            }
            shipmentUpdates.push(shipmentUpdate);
        }
        if (shipmentUpdates.length === 0) {
            return [[{
                        json: {
                            message: 'No shipments updated - no valid shipment IDs found',
                            processed_items: items.length,
                            shipments_updated: 0,
                        },
                    }]];
        }
        const response = await transport_1.mivaApiRequest.call(this, 'OrderShipmentList_Update', {
            Store_Code: storeCode,
            Shipment_Updates: shipmentUpdates,
        });
        return [[{
                    json: {
                        success: Boolean(response.success),
                        message: `Successfully updated ${shipmentUpdates.length} shipments`,
                        processed_items: items.length,
                        shipments_updated: shipmentUpdates.length,
                        shipment_ids: shipmentUpdates.map(update => update.shpmnt_id),
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
//# sourceMappingURL=updateShipments.js.map