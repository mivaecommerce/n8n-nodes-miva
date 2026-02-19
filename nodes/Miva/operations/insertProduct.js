"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertProduct = insertProduct;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../transport");
const utils_1 = require("../utils");
async function insertProduct(itemIndex) {
    const storeCode = this.getNodeParameter('storeCode', itemIndex);
    const productCodeField = this.getNodeParameter('productCodeField', itemIndex);
    const productNameField = this.getNodeParameter('productNameField', itemIndex);
    const additionalFields = this.getNodeParameter('additionalFields', itemIndex);
    const productSkuField = additionalFields.productSkuField;
    const productDescriptionField = additionalFields.productDescriptionField;
    const productPriceField = additionalFields.productPriceField;
    const productCostField = additionalFields.productCostField;
    const productWeightField = additionalFields.productWeightField;
    const productInventoryField = additionalFields.productInventoryField;
    const productTaxableField = additionalFields.productTaxableField;
    const productActiveField = additionalFields.productActiveField;
    const productCanonicalCategoryCodeField = additionalFields.productCanonicalCategoryCodeField;
    const productAlternateDisplayPageField = additionalFields.productAlternateDisplayPageField;
    const productPageTitleField = additionalFields.productPageTitleField;
    const productThumbnailField = additionalFields.productThumbnailField;
    const productImageField = additionalFields.productImageField;
    utils_1.validateStoreCode.call(this, storeCode, itemIndex);
    const inputData = this.getInputData()[itemIndex].json;
    const productCode = inputData[productCodeField];
    if (productCode == null || productCode === '') {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Missing product code in field '${productCodeField}'`, { itemIndex });
    }
    const productName = inputData[productNameField];
    if (productName == null || productName === '') {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Missing product name in field '${productNameField}'`, { itemIndex });
    }
    const productInsert = {
        Product_Code: String(productCode),
        Product_Name: String(productName),
    };
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
        const taxableValue = inputData[productTaxableField];
        if (typeof taxableValue === 'boolean') {
            productInsert.Product_Taxable = taxableValue;
        }
        else if (typeof taxableValue === 'string') {
            productInsert.Product_Taxable = taxableValue.toLowerCase() === 'true' || taxableValue === '1';
        }
        else {
            productInsert.Product_Taxable = Boolean(taxableValue);
        }
    }
    if (productActiveField && inputData[productActiveField] != null && inputData[productActiveField] !== '') {
        const activeValue = inputData[productActiveField];
        if (typeof activeValue === 'boolean') {
            productInsert.Product_Active = activeValue;
        }
        else if (typeof activeValue === 'string') {
            productInsert.Product_Active = activeValue.toLowerCase() === 'true' || activeValue === '1';
        }
        else {
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
    const response = await transport_1.mivaApiRequest.call(this, 'Product_Insert', {
        Store_Code: storeCode,
        ...productInsert,
    });
    return [{
            ...response,
            success_message: response.success ? 'Product created successfully' : 'Product creation failed',
            product_code: productCode,
        }];
}
//# sourceMappingURL=insertProduct.js.map