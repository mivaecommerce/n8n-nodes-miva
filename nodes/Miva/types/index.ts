import type { IDataObject } from 'n8n-workflow';

export interface MivaApiResponse {
	success: boolean;
	error_message?: string;
	data?: IDataObject;
	processed?: boolean;
}

export interface InventoryAdjustment {
	product_id?: string | number;
	product_code?: string;
	product_sku?: string;
	adjustment: number;
}

export interface ImageUploadResult {
	success: boolean;
	mivaFilePath?: string;
	error?: string;
	mivaResponse?: string;
}

export type MivaOperation =
  | 'getProducts'
  | 'getOrders'
  | 'getCustomers'
  | 'adjustInventory'
  | 'reportLowInventory'
  | 'createReturns'
  | 'createShipment'
  | 'updateShipments'
  | 'markReturnsReceived'
  | 'uploadImages'
  | 'deleteProductImage'
  | 'acknowledgeOrders'
  | 'updateProduct'
  | 'insertProduct';
  
export type IdentifierType = 'product_id' | 'product_code' | 'product_sku';
export type ProductIdentifierType = 'Product_ID' | 'Product_Code' | 'Product_SKU';

export interface MivaApiRequestBody extends IDataObject {
	Function: string;
	Miva_Request_Timestamp: number;
	Store_Code?: string;
	Count?: number;
	Offset?: number;
	Filter?: Array<{
		name: string;
		value: string[];
	}>;
	Inventory_Adjustments?: InventoryAdjustment[];
} 