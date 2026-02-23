import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { mivaApiRequest, buildOndemandFilter, transformApiResponse } from '../transport';

export type PaginationOperation = 'getProducts' | 'getOrders' | 'getCustomers';

export async function fetchAllRecords(
	this: IExecuteFunctions,
	operation: PaginationOperation,
	totalCount: number,
	batchSize: number,
	storeCode: string,
	returnFields: string[],
	additionalOptions: IDataObject = {}
): Promise<IDataObject[]> {
	const allRecords: IDataObject[] = [];
	const baseOffset = (additionalOptions.baseOffset as number) || 0;
	let batchIndex = 0;
	let remainingCount = totalCount;

	while (remainingCount > 0) {
		// Calculate how many records to fetch in this batch
		const currentBatchSize = Math.min(batchSize, remainingCount);

		// Calculate current batch offset
		const currentOffset = baseOffset + (batchIndex * batchSize);

		// Build request parameters
		const requestParams: IDataObject = {
			Store_Code: storeCode,
			Count: currentBatchSize,
			Offset: currentOffset,
		};

		// Add ondemandcolumns filter if needed
		const includeCustomFields = additionalOptions.includeCustomFields as boolean | undefined;
		const ondemandFilter = buildOndemandFilter(returnFields, operation, includeCustomFields);
		if (ondemandFilter) {
			Object.assign(requestParams, ondemandFilter);
		}

		// Determine API function based on operation
		let apiFunction: string;
		switch (operation) {
			case 'getProducts':
				apiFunction = 'ProductList_Load_Query';
				break;
			case 'getOrders':
				if (additionalOptions.queueCode) {
					// Use Module function for queue filtering
					apiFunction = 'Module';
					requestParams.Function = 'Module';
					requestParams.Module_Code = 'orderworkflow';
					requestParams.Module_Function = 'QueueOrderList_Load_Query';
					requestParams.Queue_Code = additionalOptions.queueCode;
				} else {
					// Use standard OrderList_Load_Query
					apiFunction = 'OrderList_Load_Query';
				}
				break;
			case 'getCustomers':
				apiFunction = 'CustomerList_Load_Query';
				break;
			default:
				throw new NodeOperationError(this.getNode(), `Unsupported operation for pagination: ${operation}`);
		}

		// Make API request
		const response = await mivaApiRequest.call(this, apiFunction, requestParams);

		// Transform and add records to collection
		const transformedRecords = transformApiResponse(response, returnFields);
		allRecords.push(...transformedRecords);

		// Update for next iteration
		remainingCount -= currentBatchSize;
		batchIndex++;
	}

	return allRecords;
}

export function validateBatchSize(
	this: IExecuteFunctions,
	batchSize: number,
	itemIndex: number
): void {
	if (batchSize <= 0) {
		throw new NodeOperationError(
			this.getNode(),
			'Batch Size must be greater than 0',
			{ itemIndex }
		);
	}
} 