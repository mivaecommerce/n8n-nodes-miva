import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { mivaApiRequest } from '../transport';
import { validateStoreCode } from '../utils';

export async function createReturns(this: IExecuteFunctions, items: INodeExecutionData[]): Promise<INodeExecutionData[][]> {
	try {
		const storeCode = this.getNodeParameter('storeCode', 0) as string;
		const orderIdField = this.getNodeParameter('orderIdFieldReturns', 0) as string;
		const lineIdField = this.getNodeParameter('lineIdFieldReturns', 0) as string;
		const createReturnField = this.getNodeParameter('createReturnFieldReturns', 0) as string;

		// Validate store code
		validateStoreCode.call(this, storeCode, 0);

		// Validate required fields exist in input data (before any processing)
		if (items.length === 0) {
			return [[{ json: { message: 'No input data provided' } }]];
		}

		const sampleData = items[0].json;
		const missingFields: string[] = [];

		if (!(orderIdField in sampleData)) missingFields.push(orderIdField);
		if (!(lineIdField in sampleData)) missingFields.push(lineIdField);
		if (!(createReturnField in sampleData)) missingFields.push(createReturnField);

		if (missingFields.length > 0) {
			return [[{
				json: {
					message: `❌ Cannot process returns - missing or invalid fields: ${missingFields.join(', ')}`,
					missingFields,
					alert: true
				}
			}]];
		}

		// Group items by order_id where create_return is true
		const orderGroups = new Map<string, number[]>();

		for (const item of items) {
			const inputData = item.json;

			// Extract values directly from specified fields
			const orderId = inputData[orderIdField];
			const lineId = inputData[lineIdField];
			const createReturn = inputData[createReturnField];

			// Only process if the return field is true (boolean) and we have valid IDs
			if (createReturn === true && orderId != null && lineId != null) {
				const orderIdStr = String(orderId);
				if (!orderGroups.has(orderIdStr)) {
					orderGroups.set(orderIdStr, []);
				}
				orderGroups.get(orderIdStr)!.push(Number(lineId));
			}
		}

		// If no orders to process, return summary
		if (orderGroups.size === 0) {
			return [[{
				json: {
					message: `No returns created - no items marked for return (${createReturnField} must be true)`,
					processed_items: items.length,
					returns_created: 0,
				},
			}]];
		}

		// Make API calls for each order
		const returnData: INodeExecutionData[] = [];

		for (const [orderId, lineIds] of orderGroups) {
			try {
				const response = await mivaApiRequest.call(this, 'OrderItemList_CreateReturn', {
					Store_Code: storeCode,
					Order_Id: Number(orderId),
					line_ids: lineIds,
				});

				// Add one result per line_id
				lineIds.forEach(lineId => {
					returnData.push({
						json: {
							order_id: Number(orderId),
							line_id: lineId,
							return_id: response.data?.id,
						},
					});
				});

			} catch (error) {
				// Add error for each line_id in this order
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

	} catch (error) {
		if (this.continueOnFail()) {
			return [[{
				json: {
					success: false,
					error: error.message || 'Unknown error occurred',
				},
			}]];
		}
		throw new NodeOperationError(this.getNode(), error.message || 'Unknown error occurred');
	}
} 