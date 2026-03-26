import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { operations } from './operations';
import {
	OPERATION_PARAMETER,
	STORE_CODE_PARAMETER,
	QUEUE_FILTER_PARAMETER,
	QUEUE_CODE_PARAMETER,
	PRODUCT_IDENTIFIER_TYPE_PARAMETER_ADJUST,
	PRODUCT_IDENTIFIER_FIELD_PARAMETER_ADJUST,
	ADJUSTMENT_FIELD_PARAMETER,
	PRODUCT_IDENTIFIER_TYPE_PARAMETER_REPORT,
	PRODUCT_IDENTIFIER_FIELD_PARAMETER_REPORT,
	INVENTORY_FIELD_PARAMETER,
	THRESHOLD_FIELD_PARAMETER,
	ORDER_ID_FIELD_PARAMETER,
	LINE_ID_FIELD_PARAMETER,
	CREATE_RETURN_FIELD_PARAMETER,
	ORDER_ID_FIELD_PARAMETER_SHIPMENT,
	LINE_ID_FIELD_PARAMETER_SHIPMENT,
	CREATE_SHIPMENT_FIELD_PARAMETER,
	SHIPMENT_RETURN_FIELDS_PARAMETER,
	SHIPMENT_ID_FIELD_PARAMETER,
	UPDATE_SHIPMENTS_ADDITIONAL_FIELDS_PARAMETER,
	RETURN_ID_FIELD_PARAMETER,
	INVENTORY_ADJUSTMENT_PARAMETER,
	COUNT_PARAMETER,
	BATCH_SIZE_PARAMETER,
	OFFSET_PARAMETER,
	PRODUCT_RETURN_FIELDS_PARAMETER,
	ORDER_RETURN_FIELDS_PARAMETER,
	ORDER_ITEM_FIELDS_PARAMETER,
	FLATTEN_ITEMS_PARAMETER,
	CUSTOMER_RETURN_FIELDS_PARAMETER,
	PRODUCT_IDENTIFIER_TYPE_PARAMETER_UPLOAD,
	PRODUCT_IDENTIFIER_FIELD_PARAMETER_UPLOAD,
	IMAGE_URL_FIELD_PARAMETER,
	FILE_PATH_TEMPLATE_PARAMETER,
	IMAGE_TYPE_ID_PARAMETER,
	IMAGE_ID_FIELD_PARAMETER,
	INCLUDE_CUSTOM_FIELDS_PARAMETER,
	ORDER_ID_FIELD_PARAMETER_ACKNOWLEDGE,
	PRODUCT_IDENTIFIER_FIELD_PARAMETER_UPDATE,
	PRODUCT_IDENTIFIER_TYPE_PARAMETER_UPDATE,
	UPDATE_PRODUCT_ADDITIONAL_FIELDS_PARAMETER,
	PRODUCT_CODE_FIELD_PARAMETER_INSERT,
	PRODUCT_NAME_FIELD_PARAMETER_INSERT,
	INSERT_PRODUCT_ADDITIONAL_FIELDS_PARAMETER,
} from './parameters';

export class Miva implements INodeType {
	description: INodeTypeDescription = {
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
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'mivaApi',
				required: true,
			},
		],
		properties: [
			OPERATION_PARAMETER,
			QUEUE_FILTER_PARAMETER,
			QUEUE_CODE_PARAMETER,
			STORE_CODE_PARAMETER,
			COUNT_PARAMETER,
			BATCH_SIZE_PARAMETER,
			OFFSET_PARAMETER,
			PRODUCT_RETURN_FIELDS_PARAMETER,
			ORDER_RETURN_FIELDS_PARAMETER,
			ORDER_ITEM_FIELDS_PARAMETER,
			FLATTEN_ITEMS_PARAMETER,
			CUSTOMER_RETURN_FIELDS_PARAMETER,
			PRODUCT_IDENTIFIER_TYPE_PARAMETER_ADJUST,
			PRODUCT_IDENTIFIER_FIELD_PARAMETER_ADJUST,
			ADJUSTMENT_FIELD_PARAMETER,
			PRODUCT_IDENTIFIER_TYPE_PARAMETER_REPORT,
			PRODUCT_IDENTIFIER_FIELD_PARAMETER_REPORT,
			INVENTORY_FIELD_PARAMETER,
			THRESHOLD_FIELD_PARAMETER,
			ORDER_ID_FIELD_PARAMETER,
			LINE_ID_FIELD_PARAMETER,
			CREATE_RETURN_FIELD_PARAMETER,
			ORDER_ID_FIELD_PARAMETER_SHIPMENT,
			LINE_ID_FIELD_PARAMETER_SHIPMENT,
			CREATE_SHIPMENT_FIELD_PARAMETER,
			SHIPMENT_RETURN_FIELDS_PARAMETER,
			SHIPMENT_ID_FIELD_PARAMETER,
			UPDATE_SHIPMENTS_ADDITIONAL_FIELDS_PARAMETER,
			RETURN_ID_FIELD_PARAMETER,
			INVENTORY_ADJUSTMENT_PARAMETER,
			PRODUCT_IDENTIFIER_TYPE_PARAMETER_UPLOAD,
			PRODUCT_IDENTIFIER_FIELD_PARAMETER_UPLOAD,
			IMAGE_URL_FIELD_PARAMETER,
			FILE_PATH_TEMPLATE_PARAMETER,
			IMAGE_TYPE_ID_PARAMETER,
			IMAGE_ID_FIELD_PARAMETER,
			INCLUDE_CUSTOM_FIELDS_PARAMETER,
			ORDER_ID_FIELD_PARAMETER_ACKNOWLEDGE,
			PRODUCT_IDENTIFIER_TYPE_PARAMETER_UPDATE,
			PRODUCT_IDENTIFIER_FIELD_PARAMETER_UPDATE,
			UPDATE_PRODUCT_ADDITIONAL_FIELDS_PARAMETER,
			PRODUCT_CODE_FIELD_PARAMETER_INSERT,
			PRODUCT_NAME_FIELD_PARAMETER_INSERT,
			INSERT_PRODUCT_ADDITIONAL_FIELDS_PARAMETER,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		// Batch operations (process all items at once)
		const batchOps = ['adjustInventory', 'createReturns', 'createShipment', 
						 'updateShipments', 'markReturnsReceived', 'acknowledgeOrders', 
						 'getOrders', 'reportLowInventory'];

		if (batchOps.includes(operation)) {
			switch (operation) {
				case 'getOrders':
					return await operations.getOrders.call(this, items);
				case 'adjustInventory':
					return await operations.adjustInventory.call(this, items);
				case 'createReturns':
					return await operations.createReturns.call(this, items);
				case 'createShipment':
					return await operations.createShipment.call(this, items);
				case 'markReturnsReceived':
					return await operations.markReturnsReceived.call(this, items);
				case 'updateShipments':
					return await operations.updateShipments.call(this, items);
				case 'acknowledgeOrders':
					return await operations.acknowledgeOrders.call(this, items);
				case 'reportLowInventory':
					return await operations.reportLowInventory.call(this, items);
			}
		}

		// Per-item operations (process each item individually like Shopify)
		const perItemOps = ['uploadImages', 'deleteProductImage', 'updateProduct', 'insertProduct', 'getProducts', 'getCustomers'];

		if (perItemOps.includes(operation)) {
			for (let i = 0; i < items.length; i++) {
				try {
					let responseData;
					
					switch (operation) {
						case 'getProducts':
							responseData = await operations.getProducts.call(this, i);
							break;
						case 'getCustomers':
							responseData = await operations.getCustomers.call(this, i);
							break;
						case 'uploadImages':
							responseData = await operations.uploadImages.call(this, i);
							break;
						case 'deleteProductImage':
							responseData = await operations.deleteProductImage.call(this, i);
							break;
						case 'updateProduct':
							responseData = await operations.updateProduct.call(this, i);
							break;
						case 'insertProduct':
							responseData = await operations.insertProduct.call(this, i);
							break;
					}

					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(responseData || []),
						{ itemData: { item: i } }
					);
					returnData.push(...executionData);

				} catch (error) {
					if (this.continueOnFail()) {
						const executionErrorData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray({ error: error.message }),
							{ itemData: { item: i } }
						);
						returnData.push(...executionErrorData);
						continue;
					}
					throw error;
				}
			}
			return [returnData];
		}

		throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
	}
} 