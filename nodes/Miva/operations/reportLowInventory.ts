import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import type { IdentifierType } from '../types';

export async function reportLowInventory(this: IExecuteFunctions, items: INodeExecutionData[]): Promise<INodeExecutionData[][]> {
	const productIdentifierType = this.getNodeParameter('productIdentifierType', 0) as IdentifierType;
	const productIdentifierField = this.getNodeParameter('productIdentifierField', 0) as string;
	const inventoryField = this.getNodeParameter('inventoryField', 0) as string;
	const thresholdField = this.getNodeParameter('thresholdField', 0) as string;
	
	if (items.length === 0) {
		return [[{ json: { message: 'No input data provided' }, pairedItem: { item: 0 } }]];
	}

	// Check if required fields exist in the data (using first row as sample)
	const sampleData = items[0].json;
	const missingFields: string[] = [];

	if (!(productIdentifierField in sampleData)) missingFields.push(productIdentifierField);
	if (!(inventoryField in sampleData)) missingFields.push(inventoryField);
	if (!(thresholdField in sampleData)) missingFields.push(thresholdField);

	if (missingFields.length > 0) {
		return [[{
			json: {
				message: `Cannot check stock - missing required fields: ${missingFields.join(', ')}`,
				missingFields,
				alert: true
			},
			pairedItem: { item: 0 },
		}]];
	}

	// All required fields exist, process the items
	const lowStockItems: string[] = [];
	for (const item of items) {
		const inputData = item.json;
		
		// Extract values directly from specified fields
		const identifierValue = inputData[productIdentifierField];
		const currentInventory = Number(inputData[inventoryField]) || 0;
		const threshold = inputData[thresholdField] != null && inputData[thresholdField] !== '' 
			? Number(inputData[thresholdField]) || 0 
			: 0;

		// Check if inventory is below threshold
		if (identifierValue != null && identifierValue !== '' && currentInventory < threshold) {
			lowStockItems.push(`${productIdentifierType.replace('_', ' ')} ${identifierValue}: ${currentInventory} units (threshold: ${threshold})`);
		}
	}

	// Build result message
	const message = lowStockItems.length > 0
		? `Low Stock Alert:\n- ${lowStockItems.join('\n- ')}`
		: 'All items are in stock';

	return [[{
		json: {
			message,
			lowStockCount: lowStockItems.length,
			alert: lowStockItems.length > 0
		},
		pairedItem: { item: 0 },
	}]];
} 