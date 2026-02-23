import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { validateStoreCode, validateCount, validateBatchSize, fetchAllRecords } from '../utils';

export async function getOrders(this: IExecuteFunctions, items: INodeExecutionData[]): Promise<INodeExecutionData[][]> {
	try {
		const count = this.getNodeParameter('count', 0) as number;
		const batchSize = this.getNodeParameter('batchSize', 0) as number;
		const offset = this.getNodeParameter('offset', 0) as number;
		const storeCode = this.getNodeParameter('storeCode', 0) as string;
		const returnFields = this.getNodeParameter('returnFields', 0) as string[];
		const itemFields = returnFields.includes('items') ? this.getNodeParameter('itemFields', 0) as string[] : [];
		const flattenItems = returnFields.includes('items') ? this.getNodeParameter('flattenItems', 0) as boolean : false;
		const queueFilter = this.getNodeParameter('queueFilter', 0) as string;
		const queueCode = queueFilter === 'queue' ? this.getNodeParameter('queueCode', 0) as string : '';

		// Validate inputs
		validateStoreCode.call(this, storeCode, 0);
		validateCount.call(this, count, 0);
		validateBatchSize.call(this, batchSize, 0);

		// Validate queue code if queue filtering is selected
		if (queueFilter === 'queue' && !queueCode) {
			throw new NodeOperationError(this.getNode(), 'Queue Code is required when filtering by queue');
		}

		// Fetch all records using pagination
		const allRecords = await fetchAllRecords.call(
			this,
			'getOrders',
			count,
			batchSize,
			storeCode,
			returnFields,
			{ queueCode, baseOffset: offset }
		);

		let returnData: INodeExecutionData[] = [];		

		// If items are selected and flattening is enabled, flatten the structure
		if (returnFields.includes('items') && flattenItems) {
			allRecords.forEach((record: IDataObject) => {
				if (Array.isArray(record.items)) {
					record.items.forEach((item: IDataObject) => {
						const flattenedRecord: IDataObject = {};

						// Add order fields (except items)
						Object.keys(record).forEach(key => {
							if (key !== 'items') {
								flattenedRecord[key] = record[key];
							}
						});

						// Add item fields (filtered if itemFields specified)
						if (itemFields.length > 0) {
							itemFields.forEach(field => {
								if (item.hasOwnProperty(field)) {
									flattenedRecord[field] = item[field];
								}
							});
						} else {
							Object.keys(item).forEach(key => {
								flattenedRecord[key] = item[key];
							});
						}

						returnData.push({
							json: flattenedRecord,
							pairedItem: { item: 0 },
						});
					});
				} else {
					// If 'items' was requested but the record has no items or it's not an array,
					// still include the order record itself, but without attempting to flatten items.
					// This handles cases where an order might exist but have no line items.
					returnData.push({
						json: record,
						pairedItem: { item: 0 },
					});
				}
			});
		} else if (returnFields.includes('items') && !flattenItems) {
			// Items selected but flattening disabled - filter item fields but keep nested structure
			allRecords.forEach((record: IDataObject) => {
				if (Array.isArray(record.items) && itemFields.length > 0) {
					// Filter item fields if specified
					record.items = record.items.map((item: any) => {
						const filteredItem: IDataObject = {};
						itemFields.forEach(field => {
							if (item.hasOwnProperty(field)) {
								filteredItem[field] = item[field];
							}
						});
						return filteredItem;
					});
				}
				returnData.push({
					json: record,
					pairedItem: { item: 0 },
				});
			});
		} else {
			// Items not selected, return orders as-is
			returnData = allRecords.map((record: IDataObject) => ({
				json: record,
				pairedItem: { item: 0 },
			}));
		}

		// If no records were returned, still return an empty result to indicate success
		if (returnData.length === 0) {
			returnData.push({
				json: {
					message: 'No items found for getOrders',
					storeCode,
					count,
					batchSize,
				},
				pairedItem: { item: 0 },
			});
		}

		return [returnData];

	} catch (error) {
		if (this.continueOnFail()) {
			return [[{
				json: { 
					error: error.message || 'Unknown error occurred',
					operation: 'getOrders',
				},
			}]];
		} else {
			throw new NodeOperationError(this.getNode(), error);
		}
	}
} 