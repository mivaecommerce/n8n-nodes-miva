import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { deleteProductImageFromMiva } from '../transport';
import { validateStoreCode } from '../utils';

export async function deleteProductImage(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject[]> {
	// Get parameters
	const storeCode = this.getNodeParameter('storeCode', itemIndex) as string;
	const imageIdField = this.getNodeParameter('imageIdField', itemIndex) as string;

	// Validate store code
	validateStoreCode.call(this, storeCode, itemIndex);

	// Get single input item
	const inputData = this.getInputData()[itemIndex].json;

	// Extract image ID
	const imageId = inputData[imageIdField];

	// Validate required fields
	if (!imageId) {
		throw new NodeOperationError(this.getNode(), `Missing image ID in field '${imageIdField}'`, { itemIndex });
	}

	// Delete image from Miva
	const result = await deleteProductImageFromMiva.call(
		this,
		imageId.toString(),
		storeCode
	);

	// Create output item with status
	const outputItem: IDataObject = {
		[imageIdField]: imageId,
		delete_status: result.success ? 'success' : 'failed',
		processing_timestamp: new Date().toISOString(),
	};

	if (result.success) {
		// Success - no additional fields needed
	} else {
		outputItem.error_message = result.error;
		if (result.mivaResponse) {
			outputItem.miva_response = result.mivaResponse;
		}
	}

	return [outputItem];
} 