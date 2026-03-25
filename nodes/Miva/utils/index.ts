import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * Validates that a store code is provided and not empty.
 * Throws a NodeOperationError if validation fails.
 * 
 * @param this - n8n execution context (bound when called)
 * @param storeCode - The store code to validate
 * @param itemIndex - Index of the current item being processed (for error context)
 * @throws {NodeOperationError} When store code is empty or null
 * 
 * @example
 * // Usage in operation functions:
 * validateStoreCode.call(this, storeCode, 0);
 */
export function validateStoreCode(
	this: IExecuteFunctions,
	storeCode: string,
	itemIndex: number,
): void {
	if (!storeCode) {
		throw new NodeOperationError(this.getNode(), 'Store Code is required', { itemIndex });
	}
}

/**
 * Validates that the count parameter doesn't exceed Miva's API limit of 10,000 records.
 * Throws a NodeOperationError if validation fails.
 * 
 * @param this - n8n execution context (bound when called)
 * @param count - The number of records to fetch
 * @param itemIndex - Index of the current item being processed (for error context)
 * @throws {NodeOperationError} When count exceeds 10,000
 * 
 * @example
 * // Usage in operation functions:
 * validateCount.call(this, count, 0);
 */
export function validateCount(
	this: IExecuteFunctions,
	count: number,
	itemIndex: number,
): void {
	if (count <= 0) {
		throw new NodeOperationError(this.getNode(), 'Count must be greater than 0', { itemIndex });
	}
}

// Export pagination utilities
export { fetchAllRecords, validateBatchSize } from './paginationUtils';
export type { PaginationOperation } from './paginationUtils'; 