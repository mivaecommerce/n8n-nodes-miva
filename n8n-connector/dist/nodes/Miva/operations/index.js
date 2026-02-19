"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operations = exports.insertProduct = exports.updateProduct = exports.acknowledgeOrders = exports.deleteProductImage = exports.uploadImages = exports.markReturnsReceived = exports.updateShipments = exports.createShipment = exports.createReturns = exports.reportLowInventory = exports.adjustInventory = exports.getCustomers = exports.getOrders = exports.getProducts = void 0;
var getProducts_1 = require("./getProducts");
Object.defineProperty(exports, "getProducts", { enumerable: true, get: function () { return getProducts_1.getProducts; } });
var getOrders_1 = require("./getOrders");
Object.defineProperty(exports, "getOrders", { enumerable: true, get: function () { return getOrders_1.getOrders; } });
var getCustomers_1 = require("./getCustomers");
Object.defineProperty(exports, "getCustomers", { enumerable: true, get: function () { return getCustomers_1.getCustomers; } });
var adjustInventory_1 = require("./adjustInventory");
Object.defineProperty(exports, "adjustInventory", { enumerable: true, get: function () { return adjustInventory_1.adjustInventory; } });
var reportLowInventory_1 = require("./reportLowInventory");
Object.defineProperty(exports, "reportLowInventory", { enumerable: true, get: function () { return reportLowInventory_1.reportLowInventory; } });
var createReturns_1 = require("./createReturns");
Object.defineProperty(exports, "createReturns", { enumerable: true, get: function () { return createReturns_1.createReturns; } });
var createShipment_1 = require("./createShipment");
Object.defineProperty(exports, "createShipment", { enumerable: true, get: function () { return createShipment_1.createShipment; } });
var updateShipments_1 = require("./updateShipments");
Object.defineProperty(exports, "updateShipments", { enumerable: true, get: function () { return updateShipments_1.updateShipments; } });
var markReturnsReceived_1 = require("./markReturnsReceived");
Object.defineProperty(exports, "markReturnsReceived", { enumerable: true, get: function () { return markReturnsReceived_1.markReturnsReceived; } });
var uploadImages_1 = require("./uploadImages");
Object.defineProperty(exports, "uploadImages", { enumerable: true, get: function () { return uploadImages_1.uploadImages; } });
var deleteProductImage_1 = require("./deleteProductImage");
Object.defineProperty(exports, "deleteProductImage", { enumerable: true, get: function () { return deleteProductImage_1.deleteProductImage; } });
var acknowledgeOrders_1 = require("./acknowledgeOrders");
Object.defineProperty(exports, "acknowledgeOrders", { enumerable: true, get: function () { return acknowledgeOrders_1.acknowledgeOrders; } });
var updateProduct_1 = require("./updateProduct");
Object.defineProperty(exports, "updateProduct", { enumerable: true, get: function () { return updateProduct_1.updateProduct; } });
var insertProduct_1 = require("./insertProduct");
Object.defineProperty(exports, "insertProduct", { enumerable: true, get: function () { return insertProduct_1.insertProduct; } });
const getProducts_2 = require("./getProducts");
const getOrders_2 = require("./getOrders");
const getCustomers_2 = require("./getCustomers");
const adjustInventory_2 = require("./adjustInventory");
const reportLowInventory_2 = require("./reportLowInventory");
const createReturns_2 = require("./createReturns");
const createShipment_2 = require("./createShipment");
const updateShipments_2 = require("./updateShipments");
const markReturnsReceived_2 = require("./markReturnsReceived");
const uploadImages_2 = require("./uploadImages");
const deleteProductImage_2 = require("./deleteProductImage");
const acknowledgeOrders_2 = require("./acknowledgeOrders");
const updateProduct_2 = require("./updateProduct");
const insertProduct_2 = require("./insertProduct");
exports.operations = {
    getProducts: getProducts_2.getProducts,
    getOrders: getOrders_2.getOrders,
    getCustomers: getCustomers_2.getCustomers,
    adjustInventory: adjustInventory_2.adjustInventory,
    reportLowInventory: reportLowInventory_2.reportLowInventory,
    createReturns: createReturns_2.createReturns,
    createShipment: createShipment_2.createShipment,
    updateShipments: updateShipments_2.updateShipments,
    markReturnsReceived: markReturnsReceived_2.markReturnsReceived,
    uploadImages: uploadImages_2.uploadImages,
    deleteProductImage: deleteProductImage_2.deleteProductImage,
    acknowledgeOrders: acknowledgeOrders_2.acknowledgeOrders,
    updateProduct: updateProduct_2.updateProduct,
    insertProduct: insertProduct_2.insertProduct,
};
//# sourceMappingURL=index.js.map