"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = updateProduct;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../transport");
const utils_1 = require("../utils");
async function updateProduct(itemIndex) {
    const storeCode = this.getNodeParameter('storeCode', itemIndex);
    const productIdentifierField = this.getNodeParameter('productIdentifierField', itemIndex);
    const productIdentifierType = this.getNodeParameter('productIdentifierType', itemIndex);
    const additionalFields = this.getNodeParameter('additionalFields', itemIndex);
    const productNameField = additionalFields.productNameField;
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
    const customFields = additionalFields.customFields;
    utils_1.validateStoreCode.call(this, storeCode, itemIndex);
    const inputData = this.getInputData()[itemIndex].json;
    const productIdentifier = inputData[productIdentifierField];
    if (productIdentifier == null || productIdentifier === '') {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Missing product identifier in field '${productIdentifierField}'`, { itemIndex });
    }
    const productUpdate = {
        [productIdentifierType]: productIdentifier,
    };
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
    if (customFields && Object.keys(customFields).length > 0) {
        const customFieldValues = {};
        for (const [, value] of Object.entries(customFields)) {
            const customFieldArray = value;
            for (const customField of customFieldArray) {
                const moduleName = customField.moduleName;
                const fieldName = customField.customFieldName;
                const valueField = customField.customFieldValueField;
                if (!(moduleName === null || moduleName === void 0 ? void 0 : moduleName.trim()) || !(fieldName === null || fieldName === void 0 ? void 0 : fieldName.trim()) || !(valueField === null || valueField === void 0 ? void 0 : valueField.trim())) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `All custom field parameters (Module Name, Custom Field Name, Custom Field Value Field) are required and cannot be empty`, { itemIndex });
                }
                if (!(valueField in inputData)) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Custom field value field '${valueField}' does not exist in input data`, { itemIndex });
                }
                if (!customFieldValues[moduleName]) {
                    customFieldValues[moduleName] = {};
                }
                customFieldValues[moduleName][fieldName] = inputData[valueField];
            }
        }
        if (Object.keys(customFieldValues).length > 0) {
            productUpdate.CustomField_Values = customFieldValues;
        }
    }
    const response = await transport_1.mivaApiRequest.call(this, 'Product_Update', {
        Store_Code: storeCode,
        ...productUpdate,
    });
    return [{
            ...response,
            success_message: response.success ? 'Product updated successfully' : 'Product update failed',
            product_identifier: productIdentifier,
        }];
}
//# sourceMappingURL=updateProduct.js.map