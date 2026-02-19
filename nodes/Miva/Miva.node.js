"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Miva = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const operations_1 = require("./operations");
const parameters_1 = require("./parameters");
class Miva {
    constructor() {
        this.description = {
            displayName: 'Miva',
            name: 'miva',
            icon: 'file:miva.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Interact with Miva eCommerce API',
            defaults: {
                name: 'Miva',
            },
            inputs: [n8n_workflow_1.NodeConnectionType.Main],
            outputs: [n8n_workflow_1.NodeConnectionType.Main],
            credentials: [
                {
                    name: 'mivaApi',
                    required: true,
                },
            ],
            properties: [
                parameters_1.OPERATION_PARAMETER,
                parameters_1.QUEUE_FILTER_PARAMETER,
                parameters_1.QUEUE_CODE_PARAMETER,
                parameters_1.STORE_CODE_PARAMETER,
                parameters_1.COUNT_PARAMETER,
                parameters_1.BATCH_SIZE_PARAMETER,
                parameters_1.OFFSET_PARAMETER,
                parameters_1.PRODUCT_RETURN_FIELDS_PARAMETER,
                parameters_1.ORDER_RETURN_FIELDS_PARAMETER,
                parameters_1.ORDER_ITEM_FIELDS_PARAMETER,
                parameters_1.FLATTEN_ITEMS_PARAMETER,
                parameters_1.CUSTOMER_RETURN_FIELDS_PARAMETER,
                parameters_1.PRODUCT_IDENTIFIER_TYPE_PARAMETER_ADJUST,
                parameters_1.PRODUCT_IDENTIFIER_FIELD_PARAMETER_ADJUST,
                parameters_1.ADJUSTMENT_FIELD_PARAMETER,
                parameters_1.PRODUCT_IDENTIFIER_TYPE_PARAMETER_REPORT,
                parameters_1.PRODUCT_IDENTIFIER_FIELD_PARAMETER_REPORT,
                parameters_1.INVENTORY_FIELD_PARAMETER,
                parameters_1.THRESHOLD_FIELD_PARAMETER,
                parameters_1.ORDER_ID_FIELD_PARAMETER,
                parameters_1.LINE_ID_FIELD_PARAMETER,
                parameters_1.CREATE_RETURN_FIELD_PARAMETER,
                parameters_1.ORDER_ID_FIELD_PARAMETER_SHIPMENT,
                parameters_1.LINE_ID_FIELD_PARAMETER_SHIPMENT,
                parameters_1.CREATE_SHIPMENT_FIELD_PARAMETER,
                parameters_1.SHIPMENT_RETURN_FIELDS_PARAMETER,
                parameters_1.SHIPMENT_ID_FIELD_PARAMETER,
                parameters_1.UPDATE_SHIPMENTS_ADDITIONAL_FIELDS_PARAMETER,
                parameters_1.RETURN_ID_FIELD_PARAMETER,
                parameters_1.INVENTORY_ADJUSTMENT_PARAMETER,
                parameters_1.PRODUCT_IDENTIFIER_TYPE_PARAMETER_UPLOAD,
                parameters_1.PRODUCT_IDENTIFIER_FIELD_PARAMETER_UPLOAD,
                parameters_1.IMAGE_URL_FIELD_PARAMETER,
                parameters_1.FILE_PATH_TEMPLATE_PARAMETER,
                parameters_1.IMAGE_TYPE_ID_PARAMETER,
                parameters_1.IMAGE_ID_FIELD_PARAMETER,
                parameters_1.INCLUDE_CUSTOM_FIELDS_PARAMETER,
                parameters_1.ORDER_ID_FIELD_PARAMETER_ACKNOWLEDGE,
                parameters_1.PRODUCT_IDENTIFIER_TYPE_PARAMETER_UPDATE,
                parameters_1.PRODUCT_IDENTIFIER_FIELD_PARAMETER_UPDATE,
                parameters_1.UPDATE_PRODUCT_ADDITIONAL_FIELDS_PARAMETER,
                parameters_1.PRODUCT_CODE_FIELD_PARAMETER_INSERT,
                parameters_1.PRODUCT_NAME_FIELD_PARAMETER_INSERT,
                parameters_1.INSERT_PRODUCT_ADDITIONAL_FIELDS_PARAMETER,
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const operation = this.getNodeParameter('operation', 0);
        const batchOps = ['adjustInventory', 'createReturns', 'createShipment',
            'updateShipments', 'markReturnsReceived', 'acknowledgeOrders',
            'getOrders', 'reportLowInventory'];
        if (batchOps.includes(operation)) {
            switch (operation) {
                case 'getOrders':
                    return await operations_1.operations.getOrders.call(this, items);
                case 'adjustInventory':
                    return await operations_1.operations.adjustInventory.call(this, items);
                case 'createReturns':
                    return await operations_1.operations.createReturns.call(this, items);
                case 'createShipment':
                    return await operations_1.operations.createShipment.call(this, items);
                case 'markReturnsReceived':
                    return await operations_1.operations.markReturnsReceived.call(this, items);
                case 'updateShipments':
                    return await operations_1.operations.updateShipments.call(this, items);
                case 'acknowledgeOrders':
                    return await operations_1.operations.acknowledgeOrders.call(this, items);
                case 'reportLowInventory':
                    return await operations_1.operations.reportLowInventory.call(this, items);
            }
        }
        const perItemOps = ['uploadImages', 'deleteProductImage', 'updateProduct', 'insertProduct', 'getProducts', 'getCustomers'];
        if (perItemOps.includes(operation)) {
            for (let i = 0; i < items.length; i++) {
                try {
                    let responseData;
                    switch (operation) {
                        case 'getProducts':
                            responseData = await operations_1.operations.getProducts.call(this, i);
                            break;
                        case 'getCustomers':
                            responseData = await operations_1.operations.getCustomers.call(this, i);
                            break;
                        case 'uploadImages':
                            responseData = await operations_1.operations.uploadImages.call(this, i);
                            break;
                        case 'deleteProductImage':
                            responseData = await operations_1.operations.deleteProductImage.call(this, i);
                            break;
                        case 'updateProduct':
                            responseData = await operations_1.operations.updateProduct.call(this, i);
                            break;
                        case 'insertProduct':
                            responseData = await operations_1.operations.insertProduct.call(this, i);
                            break;
                    }
                    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData || []), { itemData: { item: i } });
                    returnData.push(...executionData);
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        const executionErrorData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.message }), { itemData: { item: i } });
                        returnData.push(...executionErrorData);
                        continue;
                    }
                    throw error;
                }
            }
            return [returnData];
        }
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
    }
}
exports.Miva = Miva;
//# sourceMappingURL=Miva.node.js.map