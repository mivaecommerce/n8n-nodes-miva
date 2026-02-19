import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
export type PaginationOperation = 'getProducts' | 'getOrders' | 'getCustomers';
export declare function fetchAllRecords(this: IExecuteFunctions, operation: PaginationOperation, totalCount: number, batchSize: number, storeCode: string, returnFields: string[], additionalOptions?: IDataObject): Promise<IDataObject[]>;
export declare function validateBatchSize(this: IExecuteFunctions, batchSize: number, itemIndex: number): void;
