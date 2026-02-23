import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { mivaApiRequest } from '../transport';
import { validateStoreCode } from '../utils';

/**
 * Marks one or more returns as received and optionally returns inventory to stock.
 * Processes all input items to extract return IDs from the specified field.
 */
export async function markReturnsReceived(this: IExecuteFunctions, items: INodeExecutionData[]): Promise<INodeExecutionData[][]> {
	try {
		const storeCode = this.getNodeParameter('storeCode', 0) as string;
		const returnIdField = this.getNodeParameter('returnIdField', 0) as string;
		const inventoryAdjustment = this.getNodeParameter('inventoryAdjustment', 0) as boolean;

		// Validate store code
		validateStoreCode.call(this, storeCode, 0);

		// Validate required fields exist in input data (before any processing)
		if (items.length === 0) {
			return [[{ json: { message: 'No input data provided' } }]];
		}

		const sampleData = items[0].json;
		const missingFields: string[] = [];

		if (!(returnIdField in sampleData)) missingFields.push(returnIdField);

		if (missingFields.length > 0) {
			return [[{
				json: {
					message: `❌ Cannot mark returns received - missing or invalid fields: ${missingFields.join(', ')}`,
					missingFields,
					alert: true
				}
			}]];
		}

		// Extract return IDs from input data
		const returnIds: number[] = [];
		
		for (const item of items) {
			const inputData = item.json;
			
			// Get the return ID from the specified field
			if (inputData[returnIdField] != null) {
				const returnId = Number(inputData[returnIdField]);
				if (!isNaN(returnId) && returnId > 0) {
					returnIds.push(returnId);
				}
			}
		}

		// If no valid return IDs found, return summary
		if (returnIds.length === 0) {
			return [[{
				json: {
					success: false,
					message: `No valid return IDs found in field '${returnIdField}'`,
					processed_items: items.length,
					returns_processed: 0,
				},
			}]];
		}

		// Make API call to mark returns as received
		const response = await mivaApiRequest.call(this, 'OrderReturnList_Received', {
			Store_Code: storeCode,
			Return_Ids: returnIds,
			Inventory_Adjustment: inventoryAdjustment ? 1 : 0,
		});

		// Check if API call was successful
		if (response.success) {
			// Return success response  
			return [[{
				json: {
					success: true,
					message: `Successfully marked ${returnIds.length} returns as received`,
					processed_items: items.length,
					returns_processed: returnIds.length,
					return_ids: returnIds,
					inventory_adjustment: inventoryAdjustment,
				},
			}]];
		} else {
			// Return the full API response if not successful
			return [[{
				json: {
					success: false,
					message: 'API call failed',
					api_response: JSON.parse(JSON.stringify(response)),
					return_ids: returnIds,
				},
			}]];
		}

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