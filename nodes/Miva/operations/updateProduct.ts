import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { mivaApiRequest } from '../transport';
import { validateStoreCode } from '../utils';

/**
 * Updates product details in Miva.
 * Processes each input item individually to update product information.
 */
export async function updateProduct(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject[]> {
	const storeCode = this.getNodeParameter('storeCode', itemIndex) as string;
	const productIdentifierField = this.getNodeParameter('productIdentifierField', itemIndex) as string;
	const productIdentifierType = this.getNodeParameter('productIdentifierType', itemIndex) as string;
	const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as IDataObject;
	const productNameField = additionalFields.productNameField as string;
	const productDescriptionField = additionalFields.productDescriptionField as string;
	const productPriceField = additionalFields.productPriceField as string;
	const productCostField = additionalFields.productCostField as string;
	const productWeightField = additionalFields.productWeightField as string;
	const productInventoryField = additionalFields.productInventoryField as string;
	const productTaxableField = additionalFields.productTaxableField as boolean;
	const productActiveField = additionalFields.productActiveField as boolean;
	const productCanonicalCategoryCodeField = additionalFields.productCanonicalCategoryCodeField as string;
	const productAlternateDisplayPageField = additionalFields.productAlternateDisplayPageField as string;
	const productPageTitleField = additionalFields.productPageTitleField as string;
	const productThumbnailField = additionalFields.productThumbnailField as string;
	const productImageField = additionalFields.productImageField as string;
	const customFields = additionalFields.customFields as IDataObject;

	// Validate store code
	validateStoreCode.call(this, storeCode, itemIndex);

	// Get single input item
	const inputData = this.getInputData()[itemIndex].json;

	// Extract product identifier (required)
	const productIdentifier = inputData[productIdentifierField];
	if (productIdentifier == null || productIdentifier === '') {
		throw new NodeOperationError(this.getNode(), `Missing product identifier in field '${productIdentifierField}'`, { itemIndex });
	}

	// Build product update object
	const productUpdate: any = {
		[productIdentifierType]: productIdentifier,
	};

	// Add optional fields only if they exist and are not blank
	if (productNameField && inputData[productNameField] != null && inputData[productNameField] !== '') {
		productUpdate.Product_Name = String(inputData[productNameField]);
	}

	if (productDescriptionField && inputData[productDescriptionField] != null && inputData[productDescriptionField] !== '') {
		productUpdate.Product_Description = String(inputData[productDescriptionField]);
	}

	if (productPriceField && inputData[productPriceField] != null && inputData[productPriceField] !== '') {
		productUpdate.Product_Price = Number(inputData[productPriceField]);
	}

	if (productCostField && inputData[productCostField] != null && inputData[productCostField] !== '') {
		productUpdate.Product_Cost = Number(inputData[productCostField]);
	}

	if (productWeightField && inputData[productWeightField] != null && inputData[productWeightField] !== '') {
		productUpdate.Product_Weight = Number(inputData[productWeightField]);
	}

	if (productInventoryField && inputData[productInventoryField] != null && inputData[productInventoryField] !== '') {
		productUpdate.Product_Inventory = Number(inputData[productInventoryField]);
	}

	if (productTaxableField != null) {
		productUpdate.Product_Taxable = Boolean(productTaxableField);
	}

	if (productActiveField != null) {
		productUpdate.Product_Active = Boolean(productActiveField);
	}

	if (productCanonicalCategoryCodeField && inputData[productCanonicalCategoryCodeField] != null && inputData[productCanonicalCategoryCodeField] !== '') {
		productUpdate.Product_Canonical_Category_Code = String(inputData[productCanonicalCategoryCodeField]);
	}

	if (productAlternateDisplayPageField && inputData[productAlternateDisplayPageField] != null && inputData[productAlternateDisplayPageField] !== '') {
		productUpdate.Product_Alternate_Display_Page = String(inputData[productAlternateDisplayPageField]);
	}

	if (productPageTitleField && inputData[productPageTitleField] != null && inputData[productPageTitleField] !== '') {
		productUpdate.Product_Page_Title = String(inputData[productPageTitleField]);
	}

	if (productThumbnailField && inputData[productThumbnailField] != null && inputData[productThumbnailField] !== '') {
		productUpdate.Product_Thumbnail = String(inputData[productThumbnailField]);
	}

	if (productImageField && inputData[productImageField] != null && inputData[productImageField] !== '') {
		productUpdate.Product_Image = String(inputData[productImageField]);
	}

	// Process custom fields if any are configured
	if (customFields && Object.keys(customFields).length > 0) {
		const customFieldValues: { [key: string]: { [key: string]: any } } = {};
		
		// Process each custom field mapping
		for (const [, value] of Object.entries(customFields)) {
			// Handle the array structure - value is an array of custom field objects
			const customFieldArray = value as IDataObject[];
			
			for (const customField of customFieldArray) {
				const moduleName = customField.moduleName as string;
				const fieldName = customField.customFieldName as string;
				const valueField = customField.customFieldValueField as string;
				
				// All fields are mandatory - validate they exist and are not empty
				if (!moduleName?.trim() || !fieldName?.trim() || !valueField?.trim()) {
					throw new NodeOperationError(
						this.getNode(),
						`All custom field parameters (Module Name, Custom Field Name, Custom Field Value Field) are required and cannot be empty`,
						{ itemIndex }
					);
				}
				
				// Validate field exists in input data
				if (!(valueField in inputData)) {
					throw new NodeOperationError(
						this.getNode(),
						`Custom field value field '${valueField}' does not exist in input data`,
						{ itemIndex }
					);
				}
				
				// Initialize module if not exists
				if (!customFieldValues[moduleName]) {
					customFieldValues[moduleName] = {};
				}
				
				// Add custom field value
				customFieldValues[moduleName][fieldName] = inputData[valueField];
			}
		}
		
		// Add to product update if any custom fields
		if (Object.keys(customFieldValues).length > 0) {
			productUpdate.CustomField_Values = customFieldValues;
		}
	}

	// Make API call to update product
	const response = await mivaApiRequest.call(this, 'Product_Update', {
		Store_Code: storeCode,
		...productUpdate,
	});

	// Return Miva response + success/failure message
	return [{
		...response,
		success_message: response.success ? 'Product updated successfully' : 'Product update failed',
		product_identifier: productIdentifier,
	}];
} 