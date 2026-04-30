import type { IExecuteFunctions, IDataObject, JsonObject } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import type { MivaApiResponse, MivaApiRequestBody } from '../types';
import { PRODUCT_ONDEMAND_COLUMNS, ORDER_ONDEMAND_COLUMNS } from '../parameters';

export async function mivaApiRequest(
	this: IExecuteFunctions,
	functionName: string,
	additionalParams: IDataObject = {},
): Promise<MivaApiResponse> {
	const credentials = await this.getCredentials('mivaApi');

	// Build request body with consistent property order
	const requestBody: MivaApiRequestBody = {
		Function: functionName,
		Miva_Request_Timestamp: Math.floor(Date.now() / 1000),
		...additionalParams,
	};

	// Serialize here so the credential authenticate function signs the exact same bytes
	const jsonData = JSON.stringify(requestBody);

	const response = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'mivaApi',
		{
			method: 'POST',
			url: credentials.baseUrl as string,
			headers: {
				'Content-Type': 'application/json',
				'Accept': '*/*',
			},
			body: jsonData,
		},
	);

	if (!response.success) {
		throw new NodeApiError(this.getNode(), response as unknown as JsonObject);
	}

	return response;
}

/**
 * Download image from URL and convert to base64
 */
export async function downloadImageToBase64(this: IExecuteFunctions, imageUrl: string): Promise<string> {
	try {
		const response = await this.helpers.httpRequest({
			method: 'GET',
			url: imageUrl,
			headers: {
				'User-Agent': 'n8n-miva-image-uploader/1.0',
			},
			encoding: 'arraybuffer',
			returnFullResponse: true,
		});

		const contentType = ((response.headers?.['content-type'] as string) ?? '');

		if (!contentType.startsWith('image/')) {
			throw new Error(`Invalid content type: ${contentType}. Expected image/*`);
		}

		return Buffer.from(response.body as ArrayBuffer).toString('base64');
	} catch (error) {
		throw new Error(`Failed to download image from ${imageUrl}: ${error.message}`);
	}
}

/**
 * Extract filename from URL, handling query parameters
 */
export function extractFilenameFromUrl(url: string): string {
	try {
		const urlObj = new URL(url);
		const pathname = urlObj.pathname;
		let filename = pathname.split('/').pop() || '';
		
		// Remove query parameters and fragments
		filename = filename.split('?')[0].split('#')[0];
		
		// If no filename or no extension, generate default
		if (!filename || !filename.includes('.')) {
			filename = 'image.jpg';
		}
		
		return filename;
	} catch (error) {
		return 'image.jpg';
	}
}

/**
 * Upload image to Miva using 2-step process
 */
export async function uploadImageToMiva(
	this: IExecuteFunctions,
	imageUrl: string,
	productIdentifier: string,
	identifierType: 'Product_ID' | 'Product_Code' | 'Product_SKU',
	storeCode: string,
	filePathTemplate: string = 'graphics/products/{product_code}/{filename}',
	imageTypeId: number = 0
): Promise<{ success: boolean; mivaFilePath?: string; error?: string; mivaResponse?: string }> {
	
	try {
		// Download and convert image
		const base64Image = await downloadImageToBase64.call(this, imageUrl);
		const filename = extractFilenameFromUrl(imageUrl);
		
		// Generate Miva file path
		const mivaFilePath = filePathTemplate
			.replace('{product_id}', productIdentifier)
			.replace('{product_code}', productIdentifier)  
			.replace('{product_sku}', productIdentifier)
			.replace('{filename}', filename);

		// Step 1: Upload image file using Image_Add
		await mivaApiRequest.call(this, 'Image_Add', {
			Filepath: mivaFilePath,
			Image_Data: base64Image,
			Store_Code: storeCode
		});
		
		// Step 2: Associate image with product using ProductImage_Add
		const productParams: IDataObject = {
			[identifierType]: productIdentifier,
			Filepath: mivaFilePath,
			ImageType_ID: imageTypeId,
			Store_Code: storeCode
		};

		await mivaApiRequest.call(this, 'ProductImage_Add', productParams);
		
		return {
			success: true,
			mivaFilePath
		};

	} catch (error) {
		// Capture the full Miva API response for debugging
		let mivaResponse = '';
		if (error.response) {
			try {
				mivaResponse = JSON.stringify(error.response, null, 2);
			} catch (stringifyError) {
				mivaResponse = `Failed to stringify response: ${stringifyError.message}`;
			}
		}
		
		return { 
			success: false, 
			error: error.message,
			mivaResponse
		};
	}
}

/**
 * Delete product image from Miva
 */
export async function deleteProductImageFromMiva(
	this: IExecuteFunctions,
	productImageId: string,
	storeCode: string
): Promise<{ success: boolean; error?: string; mivaResponse?: string }> {
	try {
		await mivaApiRequest.call(this, 'ProductImage_Delete', {
			ProductImage_ID: parseInt(productImageId, 10),
			Store_Code: storeCode
		});

		return {
			success: true
		};

	} catch (error) {
		// Capture the full Miva API response for debugging
		let mivaResponse = '';
		if (error.response) {
			try {
				mivaResponse = JSON.stringify(error.response, null, 2);
			} catch (stringifyError) {
				mivaResponse = `Failed to stringify response: ${stringifyError.message}`;
			}
		}
		
		return { 
			success: false, 
			error: error.message,
			mivaResponse
		};
	}
}

export function buildOndemandFilter(returnFields: string[], operation: string, includeCustomFields?: boolean): IDataObject | undefined {
	let ondemandColumns: string[] = [];

	if (operation === 'getProducts') {
		ondemandColumns = returnFields.filter(field => PRODUCT_ONDEMAND_COLUMNS.includes(field));
		
		// Add custom fields if requested
		if (includeCustomFields) {
			ondemandColumns.push('CustomField_Values:*');
		}
	} else if (operation === 'getOrders') {
		ondemandColumns = returnFields.filter(field => ORDER_ONDEMAND_COLUMNS.includes(field));
	}

	// ondemandcolumns must be all lowercase. Do not change it to Ondemandcolumns ever.
	return ondemandColumns.length > 0 ? {
		// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
		Filter: [{ name: 'ondemandcolumns', value: ondemandColumns }]
	} : undefined;
}

export function transformApiResponse(response: MivaApiResponse, returnFields: string[]): IDataObject[] {
	const records = response.data?.data || [];

	if (!Array.isArray(records)) {
		throw new Error('Invalid response format from Miva API');
	}

	return records.map(record => {
		const transformedRecord: IDataObject = {};
		returnFields.forEach(field => {
			if (record.hasOwnProperty(field)) {
				transformedRecord[field] = record[field];
			}
		});
		return transformedRecord;
	});
} 