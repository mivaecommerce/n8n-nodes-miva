import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import type { MivaApiResponse } from '../types';
export declare function mivaApiRequest(this: IExecuteFunctions, functionName: string, additionalParams?: IDataObject): Promise<MivaApiResponse>;
export declare function downloadImageToBase64(imageUrl: string): Promise<string>;
export declare function extractFilenameFromUrl(url: string): string;
export declare function uploadImageToMiva(this: IExecuteFunctions, imageUrl: string, productIdentifier: string, identifierType: 'Product_ID' | 'Product_Code' | 'Product_SKU', storeCode: string, filePathTemplate?: string, imageTypeId?: number): Promise<{
    success: boolean;
    mivaFilePath?: string;
    error?: string;
    mivaResponse?: string;
}>;
export declare function deleteProductImageFromMiva(this: IExecuteFunctions, productImageId: string, storeCode: string): Promise<{
    success: boolean;
    error?: string;
    mivaResponse?: string;
}>;
export declare function buildOndemandFilter(returnFields: string[], operation: string, includeCustomFields?: boolean): IDataObject | undefined;
export declare function transformApiResponse(response: MivaApiResponse, returnFields: string[]): IDataObject[];
