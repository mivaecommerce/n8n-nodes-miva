"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportLowInventory = reportLowInventory;
async function reportLowInventory(items) {
    const productIdentifierType = this.getNodeParameter('productIdentifierType', 0);
    const productIdentifierField = this.getNodeParameter('productIdentifierField', 0);
    const inventoryField = this.getNodeParameter('inventoryField', 0);
    const thresholdField = this.getNodeParameter('thresholdField', 0);
    if (items.length === 0) {
        return [[{ json: { message: 'No input data provided' } }]];
    }
    const sampleData = items[0].json;
    const missingFields = [];
    if (!(productIdentifierField in sampleData))
        missingFields.push(productIdentifierField);
    if (!(inventoryField in sampleData))
        missingFields.push(inventoryField);
    if (!(thresholdField in sampleData))
        missingFields.push(thresholdField);
    if (missingFields.length > 0) {
        return [[{
                    json: {
                        message: `❌ Cannot check stock - missing required fields: ${missingFields.join(', ')}`,
                        missingFields,
                        alert: true
                    }
                }]];
    }
    const lowStockItems = [];
    for (const item of items) {
        const inputData = item.json;
        const identifierValue = inputData[productIdentifierField];
        const currentInventory = Number(inputData[inventoryField]) || 0;
        const threshold = inputData[thresholdField] != null && inputData[thresholdField] !== ''
            ? Number(inputData[thresholdField]) || 0
            : 0;
        if (identifierValue != null && identifierValue !== '' && currentInventory < threshold) {
            lowStockItems.push(`${productIdentifierType.replace('_', ' ')} ${identifierValue}: ${currentInventory} units (threshold: ${threshold})`);
        }
    }
    const message = lowStockItems.length > 0
        ? `🚨 Low Stock Alert:\n• ${lowStockItems.join('\n• ')}`
        : '✅ All items are in stock';
    return [[{
                json: {
                    message,
                    lowStockCount: lowStockItems.length,
                    alert: lowStockItems.length > 0
                },
            }]];
}
//# sourceMappingURL=reportLowInventory.js.map