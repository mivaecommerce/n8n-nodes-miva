export { getProducts } from './getProducts';
export { getOrders } from './getOrders';
export { getCustomers } from './getCustomers';
export { adjustInventory } from './adjustInventory';
export { reportLowInventory } from './reportLowInventory';
export { createReturns } from './createReturns';
export { createShipment } from './createShipment';
export { updateShipments } from './updateShipments';
export { markReturnsReceived } from './markReturnsReceived';
export { uploadImages } from './uploadImages';
export { deleteProductImage } from './deleteProductImage';
export { acknowledgeOrders } from './acknowledgeOrders';
export { updateProduct } from './updateProduct';
export { insertProduct } from './insertProduct';

// Export operations object for easy access in main node
import { getProducts } from './getProducts';
import { getOrders } from './getOrders';
import { getCustomers } from './getCustomers';
import { adjustInventory } from './adjustInventory';
import { reportLowInventory } from './reportLowInventory';
import { createReturns } from './createReturns';
import { createShipment } from './createShipment';
import { updateShipments } from './updateShipments';
import { markReturnsReceived } from './markReturnsReceived';
import { uploadImages } from './uploadImages';
import { deleteProductImage } from './deleteProductImage';
import { acknowledgeOrders } from './acknowledgeOrders';
import { updateProduct } from './updateProduct';
import { insertProduct } from './insertProduct';

export const operations = {
	getProducts,
	getOrders,
	getCustomers,
	adjustInventory,
	reportLowInventory,
	createReturns,
	createShipment,
	updateShipments,
	markReturnsReceived,
	uploadImages,
	deleteProductImage,
	acknowledgeOrders,
	updateProduct,
	insertProduct,
}; 