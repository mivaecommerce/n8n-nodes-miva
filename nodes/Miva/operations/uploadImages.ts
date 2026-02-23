import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { uploadImageToMiva } from '../transport';
import { validateStoreCode } from '../utils';
import type { ImageUploadResult, ProductIdentifierType } from '../types';

export async function uploadImages(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject[]> {
	// Get parameters
	const storeCode = this.getNodeParameter('storeCode', itemIndex) as string;
	const productIdentifierType = this.getNodeParameter('productIdentifierType', itemIndex) as ProductIdentifierType;
	const productIdentifierField = this.getNodeParameter('productIdentifierField', itemIndex) as string;
	const imageUrlField = this.getNodeParameter('imageUrlField', itemIndex) as string;
	const filePathTemplate = this.getNodeParameter('filePathTemplate', itemIndex) as string;
	const imageTypeId = this.getNodeParameter('imageTypeId', itemIndex) as number;

	// Validate store code
	validateStoreCode.call(this, storeCode, itemIndex);

	// Get single input item
	const inputData = this.getInputData()[itemIndex].json;

	// Extract product identifier and image URL
	const productIdentifier = inputData[productIdentifierField];
	const imageUrl = inputData[imageUrlField];

	// Validate required fields
	if (!productIdentifier) {
		throw new NodeOperationError(this.getNode(), `Missing product identifier in field '${productIdentifierField}'`, { itemIndex });
	}

	if (!imageUrl) {
		throw new NodeOperationError(this.getNode(), `Missing image URL in field '${imageUrlField}'`, { itemIndex });
	}

	// Upload image to Miva
	const result: ImageUploadResult = await uploadImageToMiva.call(
		this,
		imageUrl as string,
		productIdentifier.toString(),
		productIdentifierType,
		storeCode,
		filePathTemplate,
		imageTypeId
	);

	// Create output item with all original data plus status
	const outputItem: IDataObject = {
		...inputData,
		upload_status: result.success ? 'success' : 'failed',
		processing_timestamp: new Date().toISOString(),
	};

	if (result.success) {
		outputItem.miva_file_path = result.mivaFilePath;
	} else {
		outputItem.error_message = result.error;
		if (result.mivaResponse) {
			outputItem.miva_response = result.mivaResponse;
		}
	}

	return [outputItem];
} 