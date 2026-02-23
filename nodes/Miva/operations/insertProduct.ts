import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { mivaApiRequest } from '../transport';
import { validateStoreCode } from '../utils';

/**
 * Inserts a new product in Miva.
 * Processes each input item individually to create product information.
 */
export async function insertProduct(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject[]> {
	const storeCode = this.getNodeParameter('storeCode', itemIndex) as string;
	const productCodeField = this.getNodeParameter('productCodeField', itemIndex) as string;
	const productNameField = this.getNodeParameter('productNameField', itemIndex) as string;
	const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as IDataObject;
	
	// Extract additional field mappings
	const productSkuField = additionalFields.productSkuField as string;
	const productDescriptionField = additionalFields.productDescriptionField as string;
	const productPriceField = additionalFields.productPriceField as string;
	const productCostField = additionalFields.productCostField as string;
	const productWeightField = additionalFields.productWeightField as string;
	const productInventoryField = additionalFields.productInventoryField as string;
	const productTaxableField = additionalFields.productTaxableField as string;
	const productActiveField = additionalFields.productActiveField as string;
	const productCanonicalCategoryCodeField = additionalFields.productCanonicalCategoryCodeField as string;
	const productAlternateDisplayPageField = additionalFields.productAlternateDisplayPageField as string;
	const productPageTitleField = additionalFields.productPageTitleField as string;
	const productThumbnailField = additionalFields.productThumbnailField as string;
	const productImageField = additionalFields.productImageField as string;

	// Validate store code
	validateStoreCode.call(this, storeCode, itemIndex);

	// Get single input item
	const inputData = this.getInputData()[itemIndex].json;

	// Extract and validate required fields
	const productCode = inputData[productCodeField];
	if (productCode == null || productCode === '') {
		throw new NodeOperationError(this.getNode(), `Missing product code in field '${productCodeField}'`, { itemIndex });
	}

	const productName = inputData[productNameField];
	if (productName == null || productName === '') {
		throw new NodeOperationError(this.getNode(), `Missing product name in field '${productNameField}'`, { itemIndex });
	}

	// Build product insertion object with required fields
	const productInsert: any = {
		Product_Code: String(productCode),
		Product_Name: String(productName),
	};

	// Add optional fields only if they exist and are not blank
	if (productSkuField && inputData[productSkuField] != null && inputData[productSkuField] !== '') {
		productInsert.Product_SKU = String(inputData[productSkuField]);
	}

	if (productDescriptionField && inputData[productDescriptionField] != null && inputData[productDescriptionField] !== '') {
		productInsert.Product_Description = String(inputData[productDescriptionField]);
	}

	if (productPriceField && inputData[productPriceField] != null && inputData[productPriceField] !== '') {
		productInsert.Product_Price = Number(inputData[productPriceField]);
	}

	if (productCostField && inputData[productCostField] != null && inputData[productCostField] !== '') {
		productInsert.Product_Cost = Number(inputData[productCostField]);
	}

	if (productWeightField && inputData[productWeightField] != null && inputData[productWeightField] !== '') {
		productInsert.Product_Weight = Number(inputData[productWeightField]);
	}

	if (productInventoryField && inputData[productInventoryField] != null && inputData[productInventoryField] !== '') {
		productInsert.Product_Inventory = Number(inputData[productInventoryField]);
	}

	if (productTaxableField && inputData[productTaxableField] != null && inputData[productTaxableField] !== '') {
		// Convert input value to boolean - handle various formats
		const taxableValue = inputData[productTaxableField];
		if (typeof taxableValue === 'boolean') {
			productInsert.Product_Taxable = taxableValue;
		} else if (typeof taxableValue === 'string') {
			productInsert.Product_Taxable = taxableValue.toLowerCase() === 'true' || taxableValue === '1';
		} else {
			productInsert.Product_Taxable = Boolean(taxableValue);
		}
	}

	if (productActiveField && inputData[productActiveField] != null && inputData[productActiveField] !== '') {
		// Convert input value to boolean - handle various formats
		const activeValue = inputData[productActiveField];
		if (typeof activeValue === 'boolean') {
			productInsert.Product_Active = activeValue;
		} else if (typeof activeValue === 'string') {
			productInsert.Product_Active = activeValue.toLowerCase() === 'true' || activeValue === '1';
		} else {
			productInsert.Product_Active = Boolean(activeValue);
		}
	}

	if (productCanonicalCategoryCodeField && inputData[productCanonicalCategoryCodeField] != null && inputData[productCanonicalCategoryCodeField] !== '') {
		productInsert.Product_Canonical_Category_Code = String(inputData[productCanonicalCategoryCodeField]);
	}

	if (productAlternateDisplayPageField && inputData[productAlternateDisplayPageField] != null && inputData[productAlternateDisplayPageField] !== '') {
		productInsert.Product_Alternate_Display_Page = String(inputData[productAlternateDisplayPageField]);
	}

	if (productPageTitleField && inputData[productPageTitleField] != null && inputData[productPageTitleField] !== '') {
		productInsert.Product_Page_Title = String(inputData[productPageTitleField]);
	}

	if (productThumbnailField && inputData[productThumbnailField] != null && inputData[productThumbnailField] !== '') {
		productInsert.Product_Thumbnail = String(inputData[productThumbnailField]);
	}

	if (productImageField && inputData[productImageField] != null && inputData[productImageField] !== '') {
		productInsert.Product_Image = String(inputData[productImageField]);
	}

	// Make API call to insert product
	const response = await mivaApiRequest.call(this, 'Product_Insert', {
		Store_Code: storeCode,
		...productInsert,
	});

	// Return Miva response + success/failure message
	return [{
		...response,
		success_message: response.success ? 'Product created successfully' : 'Product creation failed',
		product_code: productCode,
	}];
}
