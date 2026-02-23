import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { mivaApiRequest } from '../transport';
import { validateStoreCode } from '../utils';

/**
 * Acknowledges orders as received in the order workflow system.
 * Processes all input items to extract order IDs and sends them to the API.
 */
export async function acknowledgeOrders(this: IExecuteFunctions, items: INodeExecutionData[]): Promise<INodeExecutionData[][]> {
	try {
		const storeCode = this.getNodeParameter('storeCode', 0) as string;
		const orderIdField = this.getNodeParameter('orderIdField', 0) as string;

		// Validate store code
		validateStoreCode.call(this, storeCode, 0);

		// Validate required fields exist in input data (before any processing)
		if (items.length === 0) {
			return [[{ json: { message: 'No input data provided' } }]];
		}

		const sampleData = items[0].json;
		const missingFields: string[] = [];

		if (!(orderIdField in sampleData)) missingFields.push(orderIdField);

		if (missingFields.length > 0) {
			return [[{
				json: {
					message: `❌ Cannot acknowledge orders - missing required fields: ${missingFields.join(', ')}`,
					missingFields,
					alert: true
				}
			}]];
		}

		// Extract order IDs from input data
		const orderIds: number[] = [];

		for (const item of items) {
			const inputData = item.json;

			// Extract order ID (required)
			const orderId = inputData[orderIdField];
			if (orderId == null || orderId === '') {
				continue; // Skip items without valid order ID
			}

			// Convert to number and add to array
			const numericOrderId = Number(orderId);
			if (!isNaN(numericOrderId) && numericOrderId > 0) {
				orderIds.push(numericOrderId);
			}
		}

		// If no valid order IDs to acknowledge, return summary
		if (orderIds.length === 0) {
			return [[{
				json: {
					message: 'No orders acknowledged - no valid order IDs found',
					processed_items: items.length,
					orders_acknowledged: 0,
				},
			}]];
		}

		// Make API call to acknowledge orders
		const response = await mivaApiRequest.call(this, 'Module', {
			Store_Code: storeCode,
			Module_Code: 'orderworkflow',
			Module_Function: 'OrderList_Acknowledge',
			Order_Ids: orderIds,
		});

		// Return success/failure response based on Miva API response
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

	} catch (error) {
		if (this.continueOnFail()) {
			return [[{
				json: { error: error.message || 'Unknown error occurred' },
			}]];
		} else {
			throw new NodeOperationError(this.getNode(), error);
		}
	}
} 