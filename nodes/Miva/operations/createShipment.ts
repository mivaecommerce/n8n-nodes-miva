import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { mivaApiRequest } from '../transport';
import { validateStoreCode } from '../utils';

/**
 * Creates shipments from order line items.
 * Groups line items by order_id where create_shipment flag is true,
 * then makes separate API calls to create shipments for each order.
 */
export async function createShipment(this: IExecuteFunctions, items: INodeExecutionData[]): Promise<INodeExecutionData[][]> {
	try {
		const storeCode = this.getNodeParameter('storeCode', 0) as string;
		const orderIdField = this.getNodeParameter('orderIdFieldShipment', 0) as string;
		const lineIdField = this.getNodeParameter('lineIdFieldShipment', 0) as string;
		const createShipmentField = this.getNodeParameter('createShipmentField', 0) as string;
		const returnFields = this.getNodeParameter('returnFields', 0) as string[];

		// Validate store code
		validateStoreCode.call(this, storeCode, 0);

		// Validate required fields exist in input data (before any processing)
		if (items.length === 0) {
			return [[{ json: { message: 'No input data provided' }, pairedItem: { item: 0 } }]];
		}

		const sampleData = items[0].json;
		const missingFields: string[] = [];

		if (!(orderIdField in sampleData)) missingFields.push(orderIdField);
		if (!(lineIdField in sampleData)) missingFields.push(lineIdField);
		if (!(createShipmentField in sampleData)) missingFields.push(createShipmentField);

		if (missingFields.length > 0) {
			return [[{
				json: {
					message: `Cannot process shipments - missing or invalid fields: ${missingFields.join(', ')}`,
					missingFields,
					alert: true
				},
				pairedItem: { item: 0 },
			}]];
		}

		// Group items by order_id where create_shipment is true
		const orderGroups = new Map<string, number[]>();

		for (const item of items) {
			const inputData = item.json;

			// Extract values directly from specified fields
			// TODO: Add field validation in the future to check if fields exist in input data
			const orderId = inputData[orderIdField];
			const lineId = inputData[lineIdField];
			const createShipment = inputData[createShipmentField];

			// Only process if the shipment field is true (boolean) and we have valid IDs
			if (createShipment === true && orderId != null && lineId != null) {
				const orderIdStr = String(orderId);
				if (!orderGroups.has(orderIdStr)) {
					orderGroups.set(orderIdStr, []);
				}
				orderGroups.get(orderIdStr)!.push(Number(lineId));
			}
		}

		// If no shipments to create, return summary
		if (orderGroups.size === 0) {
			return [[{
				json: {
					message: `No shipments created - no items marked for shipment (${createShipmentField} must be true)`,
					processed_items: items.length,
					shipments_created: 0,
				},
				pairedItem: { item: 0 },
			}]];
		}

		// Process each order group to create shipments
		const results: any[] = [];
		let successCount = 0;

		for (const [orderId, lineIds] of orderGroups) {
			try {
				// Make API call to create shipment
				const response = await mivaApiRequest.call(this, 'OrderItemList_CreateShipment', {
					Store_Code: storeCode,
					Order_Id: Number(orderId),
					line_ids: lineIds,
				});

				// Build full shipment data
				const fullShipmentData = {
					success: true,
					order_id: Number(orderId),
					line_ids: lineIds,
					shipment_id: response.data?.id,
					id: response.data?.id,
					code: response.data?.code,
					batch_id: response.data?.batch_id,
					status: response.data?.status,
					labelcount: response.data?.labelcount,
					ship_date: response.data?.ship_date,
					tracknum: response.data?.tracknum,
					tracktype: response.data?.tracktype,
					tracklink: response.data?.tracklink,
					weight: response.data?.weight,
					cost: response.data?.cost,
					formatted_cost: response.data?.formatted_cost,
				};

				// Filter to only include selected fields
				const filteredData: any = {};
				returnFields.forEach(field => {
					if (fullShipmentData.hasOwnProperty(field)) {
						filteredData[field] = (fullShipmentData as any)[field];
					}
				});

				results.push(filteredData);

				successCount++;

			} catch (error) {
				// Continue processing other shipments even if one fails
				results.push({
					success: false,
					order_id: Number(orderId),
					line_ids: lineIds,
					error: error.message || 'Unknown error occurred',
				});
			}
		}

		// Return all results (both successful and failed shipments)
		const returnData = results.map(result => ({
			json: result,
			pairedItem: { item: 0 },
		}));

		return [returnData];

	} catch (error) {
		if (this.continueOnFail()) {
			return [[{
				json: { error: error.message || 'Unknown error occurred' },
				pairedItem: { item: 0 },
			}]];
		} else {
			throw new NodeOperationError(this.getNode(), error);
		}
	}
} 