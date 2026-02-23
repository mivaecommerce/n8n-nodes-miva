import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { validateStoreCode, validateCount, validateBatchSize, fetchAllRecords } from '../utils';

export async function getProducts(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[]> {
	try {
		const count = this.getNodeParameter('count', 0) as number;
		const batchSize = this.getNodeParameter('batchSize', 0) as number;
		const offset = this.getNodeParameter('offset', 0) as number;
		const storeCode = this.getNodeParameter('storeCode', 0) as string;
		const returnFields = this.getNodeParameter('returnFields', itemIndex) as string[];
		const includeCustomFields = this.getNodeParameter('includeCustomFields', itemIndex) as boolean;

		// Validate inputs
		validateStoreCode.call(this, storeCode, itemIndex);
		validateCount.call(this, count, itemIndex);
		validateBatchSize.call(this, batchSize, itemIndex);

		// Fetch all records using pagination
		const allRecords = await fetchAllRecords.call(
			this,
			'getProducts',
			count,
			batchSize,
			storeCode,
			returnFields,
			{ includeCustomFields, baseOffset: offset }
		);

		// Convert to n8n format
		const returnData: INodeExecutionData[] = allRecords.map((record: IDataObject) => ({
			json: record,
			pairedItem: { item: itemIndex },
		}));

		// If no records were returned, still return an empty result to indicate success
		if (allRecords.length === 0) {
			returnData.push({
				json: {
					message: 'No items found for getProducts',
					storeCode,
					count,
					batchSize,
				},
				pairedItem: { item: itemIndex },
			});
		}

		return returnData;

	} catch (error) {
		if (this.continueOnFail()) {
			return [{
				json: { 
					error: error.message || 'Unknown error occurred',
					operation: 'getProducts',
					itemIndex,
				},
				pairedItem: { item: itemIndex },
			}];
		} else {
			throw new NodeOperationError(this.getNode(), error, {
				itemIndex,
			});
		}
	}
} 