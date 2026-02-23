import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { mivaApiRequest } from '../transport';
import { validateStoreCode } from '../utils';
import type { IdentifierType } from '../types';

export async function adjustInventory(this: IExecuteFunctions, items: INodeExecutionData[]): Promise<INodeExecutionData[][]> {
	try {
		const storeCode = this.getNodeParameter('storeCode', 0) as string;
		const productIdentifierType = this.getNodeParameter('productIdentifierType', 0) as IdentifierType;
		const productIdentifierField = this.getNodeParameter('productIdentifierField', 0) as string;
		const adjustmentField = this.getNodeParameter('adjustmentField', 0) as string;

		// Validate inputs
		validateStoreCode.call(this, storeCode, 0);

		// Validate required fields exist in input data (before any processing)
		if (items.length === 0) {
			return [[{ json: { message: 'No input data provided' } }]];
		}

		const sampleData = items[0].json;
		const missingFields: string[] = [];

		if (!(productIdentifierField in sampleData)) missingFields.push(productIdentifierField);
		if (!(adjustmentField in sampleData)) missingFields.push(adjustmentField);

		if (missingFields.length > 0) {
			return [[{
				json: {
					message: `❌ Cannot adjust inventory - missing or invalid fields: ${missingFields.join(', ')}`,
					missingFields,
					alert: true
				}
			}]];
		}

			// Collect all adjustments from input items
	const allAdjustments: any[] = [];
	
	for (let i = 0; i < items.length; i++) {
		const inputData = items[i].json;

		// Handle single item input
		if (typeof inputData === 'object' && !Array.isArray(inputData)) {
			// Extract values directly from specified fields
			const identifierValue = inputData[productIdentifierField];
			const adjustmentValue = inputData[adjustmentField];
			
			// Skip this item if it doesn't have valid data
			if (identifierValue == null || identifierValue === '' || 
				adjustmentValue == null || adjustmentValue === '') {
				continue; // Skip invalid items
			}

			// Build the adjustment object for the API
			const adjustment = {
				[productIdentifierType]: identifierValue,
				adjustment: Number(adjustmentValue),
			};

			allAdjustments.push(adjustment);
		}
	}

	// If no valid adjustments found, return summary
	if (allAdjustments.length === 0) {
		return [[{
			json: {
				success: false,
				message: 'No valid adjustments found - all items were missing required data',
				processed_items: items.length,
				adjustments_made: 0,
			},
		}]];
	}

	// Make single API call with all adjustments
	await mivaApiRequest.call(this, 'ProductList_Adjust_Inventory', {
		Store_Code: storeCode,
		Inventory_Adjustments: allAdjustments,
	});

	// Return single summary result
	return [[{
		json: {
			success: true,
			message: `Successfully adjusted inventory for ${allAdjustments.length} products`,
			processed_items: items.length,
			adjustments_made: allAdjustments.length,
			skipped_items: items.length - allAdjustments.length,
			storeCode,
		},
	}]];

	} catch (error) {
		if (this.continueOnFail()) {
			return [[{
				json: { 
					error: error.message || 'Unknown error occurred',
					operation: 'adjustInventory',
				},
			}]];
		} else {
			throw new NodeOperationError(this.getNode(), error);
		}
	}
} 