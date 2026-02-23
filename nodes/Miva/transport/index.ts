import { createHmac } from 'crypto';
import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { MivaApiResponse, MivaApiRequestBody } from '../types';
import { PRODUCT_ONDEMAND_COLUMNS, ORDER_ONDEMAND_COLUMNS } from '../parameters';

/**
 * Generate HMAC signature for Miva API authentication
 */
function generateHMACSignature(
	jsonData: string,
	signingKey: string,
	algorithm: string = 'sha256'
): string {
	// Step 1: Base64 decode the signing key
	const decodedKey = Buffer.from(signingKey, 'base64');
	
	// Step 2: Generate HMAC with the specified algorithm
	const signature = createHmac(algorithm, decodedKey)
		.update(jsonData, 'utf8')
		.digest();
	
	// Step 3: Base64 encode the result
	return signature.toString('base64');
}

/**
 * Generate the X-Miva-API-Authorization header with HMAC signature
 */
function generateAuthHeader(
	apiToken: string,
	jsonData: string,
	signingKey: string,
	algorithm: string = 'sha256'
): string {
	// Generate HMAC signature
	const signature = generateHMACSignature(jsonData, signingKey, algorithm);
	const headerType = `MIVA-HMAC-${algorithm.toUpperCase()}`;
	return `${headerType} ${apiToken}:${signature}`;
}

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

	// Convert request body to JSON string for HMAC signing
	const jsonData = JSON.stringify(requestBody);

	// Generate HMAC authentication header
	const authHeader = generateAuthHeader(
		credentials.apiToken as string,
		jsonData,
		credentials.signingKey as string,
		'sha256'
	);

	const response = await this.helpers.httpRequest({
		method: 'POST',
		url: credentials.baseUrl as string,
		headers: {
			'X-Miva-API-Authorization': authHeader,
			'Content-Type': 'application/json',
			'Accept': '*/*',
		},
		body: jsonData,
	});

	if (!response.success) {
		throw new NodeOperationError(
			this.getNode(),
			`Miva API Error: ${JSON.stringify(response) || 'Unknown error'}`,
		);
	}

	return response;
}

/**
 * Download image from URL and convert to base64
 */
export async function downloadImageToBase64(imageUrl: string): Promise<string> {
	try {
		const response = await fetch(imageUrl, {
			method: 'GET',
			headers: {
				'User-Agent': 'n8n-miva-image-uploader/1.0'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const contentType = response.headers.get('content-type');
		
		if (!contentType || !contentType.startsWith('image/')) {
			throw new Error(`Invalid content type: ${contentType}. Expected image/*`);
		}

		const arrayBuffer = await response.arrayBuffer();
		const imageBuffer = Buffer.from(arrayBuffer);
		return imageBuffer.toString('base64');
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
		const base64Image = await downloadImageToBase64(imageUrl);
		const filename = extractFilenameFromUrl(imageUrl);
		
		// Generate Miva file path
		const mivaFilePath = filePathTemplate
			.replace('{product_id}', productIdentifier)
			.replace('{product_code}', productIdentifier)  
			.replace('{product_sku}', productIdentifier)
			.replace('{filename}', filename);

		// Step 1: Upload image file using Provision_Store
		const imageAddXml = `<Image_Add encoding="base64" filepath="${mivaFilePath}"><![CDATA[${base64Image}]]></Image_Add>`;
		
		const step1Response = await mivaApiRequest.call(this, 'Provision_Store', {
			xml: imageAddXml,
			Store_Code: storeCode
		});
		
		this.logger.info(`Miva Provision_Store Response: ${JSON.stringify(step1Response, null, 2)}`);

		// Step 2: Associate image with product using ProductImage_Add
		const productParams: IDataObject = {
			[identifierType]: productIdentifier,
			Filepath: mivaFilePath,
			ImageType_ID: imageTypeId,
			Store_Code: storeCode
		};

		const step2Response = await mivaApiRequest.call(this, 'ProductImage_Add', productParams);
		
		this.logger.info(`Miva ProductImage_Add Response: ${JSON.stringify(step2Response, null, 2)}`);

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
		const response = await mivaApiRequest.call(this, 'ProductImage_Delete', {
			ProductImage_ID: parseInt(productImageId, 10),
			Store_Code: storeCode
		});

		this.logger.info(`Miva ProductImage_Delete Response: ${JSON.stringify(response, null, 2)}`);

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