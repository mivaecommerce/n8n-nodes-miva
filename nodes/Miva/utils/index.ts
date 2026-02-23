import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { IdentifierType } from '../types';

/**
 * Finds a field in an object using case-insensitive matching.
 * Useful for handling input data where field names may have different casing.
 * 
 * @param obj - The object to search in
 * @param targetField - The primary field name to look for
 * @param alternativeFields - Alternative field names to check if target is not found
 * @returns The actual key name from the object, or null if not found
 * 
 * @example
 * // Returns "Product_ID" if object has { "Product_ID": 123 }
 * findFieldCaseInsensitive(data, 'product_id')
 * 
 * // Returns "id" if object has { "id": 123 } and no product_id field
 * findFieldCaseInsensitive(data, 'product_id', ['id'])
 */
export function findFieldCaseInsensitive(
	obj: IDataObject,
	targetField: string,
	alternativeFields: string[] = [],
): string | null {
	const allFields = [targetField, ...alternativeFields];

	for (const field of allFields) {
		const matchingKey = Object.keys(obj).find(key => key.toLowerCase() === field.toLowerCase());
		if (matchingKey) return matchingKey;
	}

	return null;
}

/**
 * Extracts and validates inventory adjustment data from input data.
 * Used by the adjustInventory operation to process input rows.
 * 
 * @param inputData - Raw input data from a single row
 * @param identifierType - Type of product identifier to look for ('product_id', 'product_code', or 'product_sku')
 * @returns Normalized adjustment object with identifier and adjustment values, or null if invalid
 * 
 * @example
 * // Input: { "Product_ID": 123, "Adjustment": -5 }
 * // Returns: { "product_id": 123, "adjustment": -5 }
 * extractAdjustmentData(inputData, 'product_id')
 * 
 * // Returns null if required fields are missing or empty
 * extractAdjustmentData({ "name": "test" }, 'product_id') // null
 */
export function extractAdjustmentData(
	inputData: IDataObject,
	identifierType: IdentifierType,
): IDataObject | null {
	if (typeof inputData !== 'object' || Array.isArray(inputData)) {
		return null;
	}

	const identifierKey = identifierType === 'product_id' 
		? findFieldCaseInsensitive(inputData, 'product_id', ['id'])
		: findFieldCaseInsensitive(inputData, identifierType);
		
	const adjustmentKey = findFieldCaseInsensitive(inputData, 'adjustment');

	if (!identifierKey || !adjustmentKey) return null;

	const identifierValue = inputData[identifierKey];
	const adjustmentValue = inputData[adjustmentKey];

	if (identifierValue == null || identifierValue === '' || 
		adjustmentValue == null || adjustmentValue === '') {
		return null;
	}

	return {
		[identifierType]: identifierValue,
		adjustment: adjustmentValue,
	};
}

/**
 * Checks if a product's inventory is below its threshold and generates a low stock alert message.
 * Used by the reportLowInventory operation to process individual items.
 * 
 * @param inputData - Raw input data containing product info, inventory, and threshold
 * @param identifierType - Type of product identifier to use in the alert message
 * @returns Formatted low stock alert message, or null if stock is sufficient or data is invalid
 * 
 * @example
 * // Input: { "product_id": 123, "product_inventory": 5, "inventory_threshold": 10 }
 * // Returns: "product id 123: 5 units (threshold: 10)"
 * checkLowStock(inputData, 'product_id')
 * 
 * // Returns null if inventory >= threshold
 * checkLowStock({ "product_id": 123, "product_inventory": 15, "inventory_threshold": 10 }, 'product_id') // null
 */
export function checkLowStock(inputData: IDataObject, identifierType: IdentifierType): string | null {
	if (typeof inputData !== 'object' || Array.isArray(inputData)) {
		return null;
	}

	const identifierKey = identifierType === 'product_id' 
		? findFieldCaseInsensitive(inputData, 'product_id', ['id'])
		: findFieldCaseInsensitive(inputData, identifierType);
		
	const inventoryKey = findFieldCaseInsensitive(inputData, 'product_inventory');
	const thresholdKey = findFieldCaseInsensitive(inputData, 'inventory_threshold', ['inventory_threshhold']);

	if (!identifierKey || !inventoryKey) return null;

	const identifierValue = inputData[identifierKey];
	const currentInventory = Number(inputData[inventoryKey]) || 0;
	const threshold = thresholdKey && inputData[thresholdKey] != null && inputData[thresholdKey] !== '' 
		? Number(inputData[thresholdKey]) || 0 
		: 0;

	if (currentInventory < threshold) {
		return `${identifierType.replace('_', ' ')} ${identifierValue}: ${currentInventory} units (threshold: ${threshold})`;
	}

	return null;
}

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