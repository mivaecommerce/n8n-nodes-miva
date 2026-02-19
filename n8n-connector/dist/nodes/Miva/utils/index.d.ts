import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import type { IdentifierType } from '../types';
export declare function findFieldCaseInsensitive(obj: IDataObject, targetField: string, alternativeFields?: string[]): string | null;
export declare function extractAdjustmentData(inputData: IDataObject, identifierType: IdentifierType): IDataObject | null;
export declare function checkLowStock(inputData: IDataObject, identifierType: IdentifierType): string | null;
export declare function validateStoreCode(this: IExecuteFunctions, storeCode: string, itemIndex: number): void;
export declare function validateCount(this: IExecuteFunctions, count: number, itemIndex: number): void;
export { fetchAllRecords, validateBatchSize } from './paginationUtils';
export type { PaginationOperation } from './paginationUtils';
