"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mivaApiRequest = mivaApiRequest;
exports.downloadImageToBase64 = downloadImageToBase64;
exports.extractFilenameFromUrl = extractFilenameFromUrl;
exports.uploadImageToMiva = uploadImageToMiva;
exports.deleteProductImageFromMiva = deleteProductImageFromMiva;
exports.buildOndemandFilter = buildOndemandFilter;
exports.transformApiResponse = transformApiResponse;
const crypto_1 = require("crypto");
const n8n_workflow_1 = require("n8n-workflow");
const parameters_1 = require("../parameters");
function generateHMACSignature(jsonData, signingKey, algorithm = 'sha256') {
    const decodedKey = Buffer.from(signingKey, 'base64');
    const signature = (0, crypto_1.createHmac)(algorithm, decodedKey)
        .update(jsonData, 'utf8')
        .digest();
    return signature.toString('base64');
}
function generateAuthHeader(apiToken, jsonData, signingKey, algorithm = 'sha256') {
    const signature = generateHMACSignature(jsonData, signingKey, algorithm);
    const headerType = `MIVA-HMAC-${algorithm.toUpperCase()}`;
    return `${headerType} ${apiToken}:${signature}`;
}
async function mivaApiRequest(functionName, additionalParams = {}) {
    const credentials = await this.getCredentials('mivaApi');
    const requestBody = {
        Function: functionName,
        Miva_Request_Timestamp: Math.floor(Date.now() / 1000),
        ...additionalParams,
    };
    const jsonData = JSON.stringify(requestBody);
    const authHeader = generateAuthHeader(credentials.apiToken, jsonData, credentials.signingKey, 'sha256');
    const response = await this.helpers.httpRequest({
        method: 'POST',
        url: credentials.baseUrl,
        headers: {
            'X-Miva-API-Authorization': authHeader,
            'Content-Type': 'application/json',
            'Accept': '*/*',
        },
        body: jsonData,
    });
    if (!response.success) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Miva API Error: ${JSON.stringify(response) || 'Unknown error'}`);
    }
    return response;
}
async function downloadImageToBase64(imageUrl) {
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
    }
    catch (error) {
        throw new Error(`Failed to download image from ${imageUrl}: ${error.message}`);
    }
}
function extractFilenameFromUrl(url) {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        let filename = pathname.split('/').pop() || '';
        filename = filename.split('?')[0].split('#')[0];
        if (!filename || !filename.includes('.')) {
            filename = 'image.jpg';
        }
        return filename;
    }
    catch (error) {
        return 'image.jpg';
    }
}
async function uploadImageToMiva(imageUrl, productIdentifier, identifierType, storeCode, filePathTemplate = 'graphics/products/{product_code}/{filename}', imageTypeId = 0) {
    try {
        const base64Image = await downloadImageToBase64(imageUrl);
        const filename = extractFilenameFromUrl(imageUrl);
        const mivaFilePath = filePathTemplate
            .replace('{product_id}', productIdentifier)
            .replace('{product_code}', productIdentifier)
            .replace('{product_sku}', productIdentifier)
            .replace('{filename}', filename);
        const imageAddXml = `<Image_Add encoding="base64" filepath="${mivaFilePath}"><![CDATA[${base64Image}]]></Image_Add>`;
        const step1Response = await mivaApiRequest.call(this, 'Provision_Store', {
            xml: imageAddXml,
            Store_Code: storeCode
        });
        this.logger.info(`Miva Provision_Store Response: ${JSON.stringify(step1Response, null, 2)}`);
        const productParams = {
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
    }
    catch (error) {
        let mivaResponse = '';
        if (error.response) {
            try {
                mivaResponse = JSON.stringify(error.response, null, 2);
            }
            catch (stringifyError) {
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
async function deleteProductImageFromMiva(productImageId, storeCode) {
    try {
        const response = await mivaApiRequest.call(this, 'ProductImage_Delete', {
            ProductImage_ID: parseInt(productImageId, 10),
            Store_Code: storeCode
        });
        this.logger.info(`Miva ProductImage_Delete Response: ${JSON.stringify(response, null, 2)}`);
        return {
            success: true
        };
    }
    catch (error) {
        let mivaResponse = '';
        if (error.response) {
            try {
                mivaResponse = JSON.stringify(error.response, null, 2);
            }
            catch (stringifyError) {
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
function buildOndemandFilter(returnFields, operation, includeCustomFields) {
    let ondemandColumns = [];
    if (operation === 'getProducts') {
        ondemandColumns = returnFields.filter(field => parameters_1.PRODUCT_ONDEMAND_COLUMNS.includes(field));
        if (includeCustomFields) {
            ondemandColumns.push('CustomField_Values:*');
        }
    }
    else if (operation === 'getOrders') {
        ondemandColumns = returnFields.filter(field => parameters_1.ORDER_ONDEMAND_COLUMNS.includes(field));
    }
    return ondemandColumns.length > 0 ? {
        Filter: [{ name: 'ondemandcolumns', value: ondemandColumns }]
    } : undefined;
}
function transformApiResponse(response, returnFields) {
    var _a;
    const records = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.data) || [];
    if (!Array.isArray(records)) {
        throw new Error('Invalid response format from Miva API');
    }
    return records.map(record => {
        const transformedRecord = {};
        returnFields.forEach(field => {
            if (record.hasOwnProperty(field)) {
                transformedRecord[field] = record[field];
            }
        });
        return transformedRecord;
    });
}
//# sourceMappingURL=index.js.map