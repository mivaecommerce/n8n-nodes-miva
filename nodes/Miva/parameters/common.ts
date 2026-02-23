import type { INodeProperties } from 'n8n-workflow';

export const OPERATION_PARAMETER: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
	options: [
		{
			name: 'Adjust Inventory',
			value: 'adjustInventory',
			description: 'Adjust product inventory levels',
			action: 'Adjust product inventory levels',
		},
		{
			name: 'Create Returns',
			value: 'createReturns',
			description: 'Create RMA returns for order items',
			action: 'Create RMA returns for order items',
		},
		{
			name: 'Create Shipment',
			value: 'createShipment',
			description: 'Create a shipment from order line items',
			action: 'Create a shipment',
		},
		{
			name: 'Delete Product Image',
			value: 'deleteProductImage',
			description: 'Delete image from product',
			action: 'Delete product image',
		},
		{
			name: 'Get Customers',
			value: 'getCustomers',
			description: 'Retrieve customer data',
			action: 'Get customer data',
		},
		{
			name: 'Get Orders',
			value: 'getOrders',
			description: 'Retrieve order data',
			action: 'Get order data',
		},
		{
			name: 'Get Products',
			value: 'getProducts',
			description: 'Retrieve product data',
			action: 'Get product data',
		},
		{
			name: 'Acknowledge Orders',
			value: 'acknowledgeOrders',
			description: 'Mark orders as received in the order workflow system',
			action: 'Acknowledge orders as received',
		},
		{
			name: 'Update Product',
			value: 'updateProduct',
			description: 'Update product information',
			action: 'Update product details',
		},
		{
			name: 'Insert Product',
			value: 'insertProduct',
			description: 'Create a new product',
			action: 'Create a new product',
		},
		{
			name: 'Mark Returns Received',
			value: 'markReturnsReceived',
			description: 'Mark returns as received and optionally adjust inventory',
			action: 'Mark returns as received',
		},
		{
			name: 'Report Low Inventory',
			value: 'reportLowInventory',
			description: 'Generate low inventory alert message',
			action: 'Generate low inventory alert message',
		},
		{
			name: 'Update Shipments',
			value: 'updateShipments',
			description: 'Update shipment details and mark as shipped',
			action: 'Update shipments',
		},
		{
			name: 'Upload Images',
			value: 'uploadImages',
			description: 'Upload images to products in bulk',
			action: 'Upload images to products',
		},
	],
	default: 'getProducts',
};

export const STORE_CODE_PARAMETER: INodeProperties = {
	displayName: 'Store Code',
	name: 'storeCode',
	type: 'string',
	required: true,
	default: '',
	placeholder: 'e.g., yt2',
	description: 'The Miva store code identifier',
	displayOptions: {
		show: {
			operation: ['getProducts', 'getOrders', 'getCustomers', 'adjustInventory', 'createReturns', 'createShipment', 'deleteProductImage', 'markReturnsReceived', 'updateShipments', 'uploadImages', 'acknowledgeOrders', 'updateProduct', 'insertProduct'],
		},
	},
};

export const QUEUE_FILTER_PARAMETER: INodeProperties = {
	displayName: 'Queue Filter',
	name: 'queueFilter',
	type: 'options',
	default: 'none',
	options: [
		{ name: 'No Filtering', value: 'none' },
		{ name: 'Filter by Order Queue', value: 'queue' }
	],
	description: 'Whether to filter orders by queue',
	displayOptions: {
		show: {
			operation: ['getOrders'],
		},
	},
};

export const QUEUE_CODE_PARAMETER: INodeProperties = {
	displayName: 'Queue Code',
	name: 'queueCode',
	type: 'string',
	required: true,
	default: '',
	placeholder: 'e.g., new_and_updated',
	description: 'Code of the queue to filter orders by',
	displayOptions: {
		show: {
			operation: ['getOrders'],
			queueFilter: ['queue'],
		},
	},
};

export const COUNT_PARAMETER: INodeProperties = {
	displayName: 'Count',
	name: 'count',
	type: 'number',
	default: 100,
	description: 'Total number of records to fetch',
	typeOptions: {
		minValue: 1,
	},
	displayOptions: {
		show: {
			operation: ['getProducts', 'getOrders', 'getCustomers'],
		},
	},
};

export const BATCH_SIZE_PARAMETER: INodeProperties = {
	displayName: 'Batch Size',
	name: 'batchSize',
	type: 'number',
	default: 100,
	description: 'Number of records to fetch per API call',
	typeOptions: {
		minValue: 1,
	},
	displayOptions: {
		show: {
			operation: ['getProducts', 'getOrders', 'getCustomers'],
		},
	},
};

export const OFFSET_PARAMETER: INodeProperties = {
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	default: 0,
	description: 'Base offset to start from (added to pagination offset)',
	typeOptions: {
		minValue: 0,
	},
	displayOptions: {
		show: {
			operation: ['getProducts', 'getOrders', 'getCustomers'],
		},
	},
};

export const PRODUCT_IDENTIFIER_TYPE_PARAMETER_ADJUST: INodeProperties = {
	displayName: 'Product Identifier Type',
	name: 'productIdentifierType',
	type: 'options',
	default: 'product_id',
	description: 'Type of product identifier in the selected field',
	options: [
		{
			name: 'Product ID',
			value: 'product_id',
		},
		{
			name: 'Product Code',
			value: 'product_code',
		},
		{
			name: 'Product SKU',
			value: 'product_sku',
		},
	],
	displayOptions: {
		show: {
			operation: ['adjustInventory'],
		},
	},
};

export const PRODUCT_IDENTIFIER_FIELD_PARAMETER_ADJUST: INodeProperties = {
	displayName: 'Product Identifier Field',
	name: 'productIdentifierField',
	type: 'string',
	required: true,
	default: 'product_id',
	placeholder: 'Select field containing product identifier',
	description: 'Field in input data that contains the product identifier value',
	requiresDataPath: 'single',
	displayOptions: {
		show: {
			operation: ['adjustInventory'],
		},
	},
};

export const ADJUSTMENT_FIELD_PARAMETER: INodeProperties = {
	displayName: 'Adjustment Field',
	name: 'adjustmentField',
	type: 'string',
	required: true,
	default: 'adjustment',
	placeholder: 'Select field containing adjustment value',
	description: 'Field in input data that contains the inventory adjustment amount',
	requiresDataPath: 'single',
	displayOptions: {
		show: {
			operation: ['adjustInventory'],
		},
	},
};

export const PRODUCT_IDENTIFIER_TYPE_PARAMETER_REPORT: INodeProperties = {
	displayName: 'Product Identifier Type',
	name: 'productIdentifierType',
	type: 'options',
	default: 'product_id',
	description: 'Type of product identifier in the selected field',
	options: [
		{
			name: 'Product ID',
			value: 'product_id',
		},
		{
			name: 'Product Code',
			value: 'product_code',
		},
		{
			name: 'Product SKU',
			value: 'product_sku',
		},
	],
	displayOptions: {
		show: {
			operation: ['reportLowInventory'],
		},
	},
};

export const PRODUCT_IDENTIFIER_FIELD_PARAMETER_REPORT: INodeProperties = {
	displayName: 'Product Identifier Field',
	name: 'productIdentifierField',
	type: 'string',
	required: true,
	default: 'product_id',
	placeholder: 'Select field containing product identifier',
	description: 'Field in input data that contains the product identifier value',
	requiresDataPath: 'single',
	displayOptions: {
		show: {
			operation: ['reportLowInventory'],
		},
	},
};

export const INVENTORY_FIELD_PARAMETER: INodeProperties = {
	displayName: 'Inventory Field',
	name: 'inventoryField',
	type: 'string',
	required: true,
	default: 'product_inventory',
	placeholder: 'Select field containing current inventory',
	description: 'Field in input data that contains the current inventory level',
	requiresDataPath: 'single',
	displayOptions: {
		show: {
			operation: ['reportLowInventory'],
		},
	},
};

export const THRESHOLD_FIELD_PARAMETER: INodeProperties = {
	displayName: 'Threshold Field',
	name: 'thresholdField',
	type: 'string',
	required: true,
	default: 'inventory_threshold',
	placeholder: 'Select field containing inventory threshold',
	description: 'Field in input data that contains the low inventory threshold',
	requiresDataPath: 'single',
	displayOptions: {
		show: {
			operation: ['reportLowInventory'],
		},
	},
};

export const ORDER_ID_FIELD_PARAMETER: INodeProperties = {
	displayName: 'Order ID Field',
	name: 'orderIdFieldReturns',
	type: 'string',
	required: true,
	default: 'order_id',
	placeholder: 'Select field containing order ID',
	description: 'Field in input data that contains the order ID',
	requiresDataPath: 'single',
	displayOptions: {
		show: {
			operation: ['createReturns'],
		},
	},
};

export const LINE_ID_FIELD_PARAMETER: INodeProperties = {
	displayName: 'Line ID Field',
	name: 'lineIdFieldReturns',
	type: 'string',
	required: true,
	default: 'line_id',
	placeholder: 'Select field containing line ID',
	description: 'Field in input data that contains the order line item ID',
	requiresDataPath: 'single',
	displayOptions: {
		show: {
			operation: ['createReturns'],
		},
	},
};

export const CREATE_RETURN_FIELD_PARAMETER: INodeProperties = {
	displayName: 'Create Return Field',
	name: 'createReturnFieldReturns',
	type: 'string',
	required: true,
	default: 'create_return',
	placeholder: 'Select field indicating return creation',
	description: 'Field in input data that indicates whether to create a return (must be boolean true)',
	requiresDataPath: 'single',
	displayOptions: {
		show: {
			operation: ['createReturns'],
		},
	},
};

export const RETURN_ID_FIELD_PARAMETER: INodeProperties = {
	displayName: 'Return ID Field',
	name: 'returnIdField',
	type: 'string',
	required: true,
	default: '',
	placeholder: 'Select field containing return IDs',
	description: 'Field in input data that contains the return ID values',
	requiresDataPath: 'single',
	displayOptions: {
		show: {
			operation: ['markReturnsReceived'],
		},
	},
};

export const INVENTORY_ADJUSTMENT_PARAMETER: INodeProperties = {
	displayName: 'Inventory Adjustment',
	name: 'inventoryAdjustment',
	type: 'boolean',
	default: true,
	description: 'Whether inventory should be returned to stock when marking returns as received',
	displayOptions: {
		show: {
			operation: ['markReturnsReceived'],
		},
	},
};

export const ORDER_ID_FIELD_PARAMETER_SHIPMENT: INodeProperties = {
	displayName: 'Order ID Field',
	name: 'orderIdFieldShipment',
	type: 'string',
	required: true,
	default: 'order_id',
	placeholder: 'Select field containing order ID',
	description: 'Field in input data that contains the order ID',
	requiresDataPath: 'single',
	displayOptions: {
		show: {
			operation: ['createShipment'],
		},
	},
};

export const LINE_ID_FIELD_PARAMETER_SHIPMENT: INodeProperties = {
	displayName: 'Line ID Field',
	name: 'lineIdFieldShipment',
	type: 'string',
	required: true,
	default: 'line_id',
	placeholder: 'Select field containing line ID',
	description: 'Field in input data that contains the order line item ID',
	requiresDataPath: 'single',
	displayOptions: {
		show: {
			operation: ['createShipment'],
		},
	},
};

export const CREATE_SHIPMENT_FIELD_PARAMETER: INodeProperties = {
	displayName: 'Create Shipment Field',
	name: 'createShipmentField',
	type: 'string',
	required: true,
	default: 'create_shipment',
	placeholder: 'Select field indicating shipment creation',
	description: 'Field in input data that indicates whether to create a shipment (must be boolean true)',
	requiresDataPath: 'single',
	displayOptions: {
		show: {
			operation: ['createShipment'],
		},
	},
};

export const SHIPMENT_RETURN_FIELDS_PARAMETER: INodeProperties = {
	displayName: 'Return Fields',
	name: 'returnFields',
	type: 'multiOptions',
	default: ['success', 'order_id', 'line_ids', 'shipment_id'],
	description: 'Select which fields to return in the response',
	options: [
		{
			name: 'Batch ID',
			value: 'batch_id',
		},
		{
			name: 'Code',
			value: 'code',
		},
		{
			name: 'Cost',
			value: 'cost',
		},
		{
			name: 'Formatted Cost',
			value: 'formatted_cost',
		},
		{
			name: 'ID',
			value: 'id',
		},
		{
			name: 'Label Count',
			value: 'labelcount',
		},
		{
			name: 'Line IDs',
			value: 'line_ids',
		},
		{
			name: 'Order ID',
			value: 'order_id',
		},
		{
			name: 'Ship Date',
			value: 'ship_date',
		},
		{
			name: 'Shipment ID',
			value: 'shipment_id',
		},
		{
			name: 'Status',
			value: 'status',
		},
		{
			name: 'Success',
			value: 'success',
		},
		{
			name: 'Track Link',
			value: 'tracklink',
		},
		{
			name: 'Track Number',
			value: 'tracknum',
		},
		{
			name: 'Track Type',
			value: 'tracktype',
		},
		{
			name: 'Weight',
			value: 'weight',
		},
	],
	displayOptions: {
		show: {
			operation: ['createShipment'],
		},
	},
};

export const SHIPMENT_ID_FIELD_PARAMETER: INodeProperties = {
	displayName: 'Shipment ID Field',
	name: 'shipmentIdField',
	type: 'string',
	required: true,
	default: 'shipment_id',
	placeholder: 'Select field containing shipment ID',
	description: 'Field in input data that contains the shipment ID (required)',
	requiresDataPath: 'single',
	displayOptions: {
		show: {
			operation: ['updateShipments'],
		},
	},
};



// Update Shipments Additional Fields
export const UPDATE_SHIPMENTS_ADDITIONAL_FIELDS_PARAMETER: INodeProperties = {
	displayName: 'Additional Fields',
	name: 'additionalFields',
	type: 'collection',
	placeholder: 'Add Field',
	default: {},
	displayOptions: {
		show: {
			operation: ['updateShipments'],
		},
	},
	// eslint-disable-next-line n8n-nodes-base/node-param-collection-type-unsorted-items
	options: [
		// Tracking Fields
		{
			displayName: 'Mark Shipped Field',
			name: 'markShippedField',
			type: 'string',
			default: '',
			placeholder: 'Select field indicating mark shipped',
			description: 'Field in input data that indicates whether to mark as shipped (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Track Number Field',
			name: 'trackNumberField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing tracking number',
			description: 'Field in input data that contains the tracking number (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Track Type Field',
			name: 'trackTypeField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing tracking type',
			description: 'Field in input data that contains the tracking type (optional)',
			requiresDataPath: 'single',
		},
		// Shipping Fields
		{
			displayName: 'Cost Field',
			name: 'costField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing cost',
			description: 'Field in input data that contains the shipping cost (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Weight Field',
			name: 'weightField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing weight',
			description: 'Field in input data that contains the weight (optional)',
			requiresDataPath: 'single',
		},
	],
};

// Acknowledge Orders Parameters
export const ORDER_ID_FIELD_PARAMETER_ACKNOWLEDGE: INodeProperties = {
	displayName: 'Order ID Field',
	name: 'orderIdField',
	type: 'string',
	required: true,
	default: 'order_id',
	placeholder: 'Select field containing order ID',
	description: 'Field in input data that contains the order ID (required)',
	requiresDataPath: 'single',
	displayOptions: {
		show: {
			operation: ['acknowledgeOrders'],
		},
	},
};

// Update Product Parameters
export const PRODUCT_IDENTIFIER_FIELD_PARAMETER_UPDATE: INodeProperties = {
	displayName: 'Product Identifier Field',
	name: 'productIdentifierField',
	type: 'string',
	required: true,
	default: 'product_code',
	placeholder: 'Select field containing product identifier',
	description: 'Field in input data that contains the product identifier (required)',
	requiresDataPath: 'single',
	displayOptions: {
		show: {
			operation: ['updateProduct'],
		},
	},
};

export const PRODUCT_IDENTIFIER_TYPE_PARAMETER_UPDATE: INodeProperties = {
	displayName: 'Product Identifier Type',
	name: 'productIdentifierType',
	type: 'options',
	required: true,
	default: 'Product_Code',
	options: [
		{
			name: 'Product ID',
			value: 'Product_ID',
		},
		{
			name: 'Product Code',
			value: 'Product_Code',
		},
		{
			name: 'Product SKU',
			value: 'Product_SKU',
		},
	],
	description: 'The type of product identifier to use',
	displayOptions: {
		show: {
			operation: ['updateProduct'],
		},
	},
};

export const UPDATE_PRODUCT_ADDITIONAL_FIELDS_PARAMETER: INodeProperties = {
	displayName: 'Additional Fields',
	name: 'additionalFields',
	type: 'collection',
	placeholder: 'Add Field',
	default: {},
	displayOptions: {
		show: {
			operation: ['updateProduct'],
		},
	},
	// eslint-disable-next-line n8n-nodes-base/node-param-collection-type-unsorted-items
	options: [
		// Basic Product Fields
		{
			displayName: 'Product Name Field',
			name: 'productNameField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing product name',
			description: 'Field in input data that contains the product name (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Product Description Field',
			name: 'productDescriptionField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing product description',
			description: 'Field in input data that contains the product description (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Product Price Field',
			name: 'productPriceField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing product price',
			description: 'Field in input data that contains the product price (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Product Cost Field',
			name: 'productCostField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing product cost',
			description: 'Field in input data that contains the product cost (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Product Weight Field',
			name: 'productWeightField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing product weight',
			description: 'Field in input data that contains the product weight (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Product Inventory Field',
			name: 'productInventoryField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing product inventory',
			description: 'Field in input data that contains the product inventory (optional)',
			requiresDataPath: 'single',
		},
		// Status Fields
		{
			displayName: 'Product Taxable Field',
			name: 'productTaxableField',
			type: 'boolean',
			default: false,
			description: 'Whether the product is taxable',
		},
		{
			displayName: 'Product Active Field',
			name: 'productActiveField',
			type: 'boolean',
			default: false,
			description: 'Whether the product is active',
		},
		// Display Fields
		{
			displayName: 'Product Canonical Category Code Field',
			name: 'productCanonicalCategoryCodeField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing canonical category code',
			description: 'Field in input data that contains the canonical category code (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Product Alternate Display Page Field',
			name: 'productAlternateDisplayPageField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing alternate display page',
			description: 'Field in input data that contains the alternate display page (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Product Page Title Field',
			name: 'productPageTitleField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing page title',
			description: 'Field in input data that contains the page title (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Product Thumbnail Field',
			name: 'productThumbnailField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing thumbnail image',
			description: 'Field in input data that contains the thumbnail image (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Product Image Field',
			name: 'productImageField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing full-size image',
			description: 'Field in input data that contains the full-size image (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Custom Fields',
			name: 'customFields',
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true,
			},
			default: {},
			options: [
				{
					displayName: 'Custom Field',
					name: 'customField',
					values: [
						{
							displayName: 'Module Name',
							name: 'moduleName',
							type: 'string',
							required: true,
							default: 'customfields',
							placeholder: 'e.g., customfields, discount_saleprice, upsxml',
							description: 'The module name for this custom field',
						},
						{
							displayName: 'Custom Field Name',
							name: 'customFieldName',
							type: 'string',
							required: true,
							default: '',
							placeholder: 'e.g., FATHERSDAY25, header, footer',
							description: 'The custom field name in Miva',
						},
						{
							displayName: 'Custom Field Value Field',
							name: 'customFieldValueField',
							type: 'string',
							required: true,
							default: '',
							placeholder: 'Select field containing the value',
							description: 'Field in input data that contains the custom field value',
							requiresDataPath: 'single',
						},
					],
				},
			],
		},
	],
};

// Upload Images Parameters
export const PRODUCT_IDENTIFIER_TYPE_PARAMETER_UPLOAD: INodeProperties = {
	displayName: 'Product Identifier Type',
	name: 'productIdentifierType',
	type: 'options',
	required: true,
	default: 'Product_Code',
	options: [
		{
			name: 'Product ID',
			value: 'Product_ID',
		},
		{
			name: 'Product Code',
			value: 'Product_Code',
		},
		{
			name: 'Product SKU',
			value: 'Product_SKU',
		},
	],
	description: 'The type of product identifier to use',
	displayOptions: {
		show: {
			operation: ['uploadImages'],
		},
	},
};

export const PRODUCT_IDENTIFIER_FIELD_PARAMETER_UPLOAD: INodeProperties = {
	displayName: 'Product Identifier Field',
	name: 'productIdentifierField',
	type: 'string',
	required: true,
	default: 'product_code',
	placeholder: 'Select field containing product identifier',
	description: 'Field in input data that contains the product identifier (required)',
	requiresDataPath: 'single',
	displayOptions: {
		show: {
			operation: ['uploadImages'],
		},
	},
};

export const IMAGE_URL_FIELD_PARAMETER: INodeProperties = {
	displayName: 'Image URL Field',
	name: 'imageUrlField',
	type: 'string',
	required: true,
	default: 'image_url',
	placeholder: 'Select field containing image URL',
	description: 'Field in input data that contains the image URL (required)',
	requiresDataPath: 'single',
	displayOptions: {
		show: {
			operation: ['uploadImages'],
		},
	},
};

export const FILE_PATH_TEMPLATE_PARAMETER: INodeProperties = {
	displayName: 'File Path Template',
	name: 'filePathTemplate',
	type: 'string',
	default: 'graphics/products/{product_code}/{filename}',
	placeholder: 'e.g., graphics/products/{product_code}/{filename}',
	description: 'Miva file path template. Available variables: {product_id}, {product_code}, {product_sku}, {filename}.',
	displayOptions: {
		show: {
			operation: ['uploadImages'],
		},
	},
};

export const IMAGE_TYPE_ID_PARAMETER: INodeProperties = {
	displayName: 'Image Type ID',
	name: 'imageTypeId',
	type: 'number',
	default: 0,
	description: 'Miva image type ID (0 = no specific type)',
	displayOptions: {
		show: {
			operation: ['uploadImages'],
		},
	},
};

export const IMAGE_ID_FIELD_PARAMETER: INodeProperties = {
	displayName: 'Image ID Field',
	name: 'imageIdField',
	type: 'string',
	required: true,
	default: 'image_id',
	placeholder: 'Select field containing image ID',
	description: 'Field in input data that contains the image ID to delete',
	requiresDataPath: 'single',
	displayOptions: {
		show: {
			operation: ['deleteProductImage'],
		},
	},
};

export const INCLUDE_CUSTOM_FIELDS_PARAMETER: INodeProperties = {
	displayName: 'Include Custom Fields',
	name: 'includeCustomFields',
	type: 'boolean',
	default: false,
	description: 'Whether to include custom field values in product data',
	displayOptions: {
		show: {
			operation: ['getProducts'],
		},
	},
};

// Insert Product Parameters
export const PRODUCT_CODE_FIELD_PARAMETER_INSERT: INodeProperties = {
	displayName: 'Product Code Field',
	name: 'productCodeField',
	type: 'string',
	required: true,
	default: '',
	placeholder: 'Select field containing product code',
	description: 'Field in input data that contains the unique product code',
	requiresDataPath: 'single',
	displayOptions: {
		show: {
			operation: ['insertProduct'],
		},
	},
};

export const PRODUCT_NAME_FIELD_PARAMETER_INSERT: INodeProperties = {
	displayName: 'Product Name Field',
	name: 'productNameField',
	type: 'string',
	required: true,
	default: '',
	placeholder: 'Select field containing product name',
	description: 'Field in input data that contains the product name',
	requiresDataPath: 'single',
	displayOptions: {
		show: {
			operation: ['insertProduct'],
		},
	},
};

export const INSERT_PRODUCT_ADDITIONAL_FIELDS_PARAMETER: INodeProperties = {
	displayName: 'Additional Fields',
	name: 'additionalFields',
	type: 'collection',
	placeholder: 'Add Field',
	default: {},
	displayOptions: {
		show: {
			operation: ['insertProduct'],
		},
	},
	// eslint-disable-next-line n8n-nodes-base/node-param-collection-type-unsorted-items
	options: [
		// Basic Product Fields
		{
			displayName: 'Product SKU Field',
			name: 'productSkuField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing product SKU',
			description: 'Field in input data that contains the product SKU (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Product Description Field',
			name: 'productDescriptionField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing product description',
			description: 'Field in input data that contains the product description (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Product Price Field',
			name: 'productPriceField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing product price',
			description: 'Field in input data that contains the product price (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Product Cost Field',
			name: 'productCostField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing product cost',
			description: 'Field in input data that contains the product cost (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Product Weight Field',
			name: 'productWeightField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing product weight',
			description: 'Field in input data that contains the product weight (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Product Inventory Field',
			name: 'productInventoryField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing product inventory',
			description: 'Field in input data that contains the product inventory (optional)',
			requiresDataPath: 'single',
		},
		// Status Fields
		{
			displayName: 'Product Taxable Field',
			name: 'productTaxableField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing taxable status',
			description: 'Field in input data that contains whether the product is taxable (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Product Active Field',
			name: 'productActiveField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing active status',
			description: 'Field in input data that contains whether the product is active (optional)',
			requiresDataPath: 'single',
		},
		// Display Fields
		{
			displayName: 'Product Canonical Category Code Field',
			name: 'productCanonicalCategoryCodeField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing canonical category code',
			description: 'Field in input data that contains the canonical category code (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Product Alternate Display Page Field',
			name: 'productAlternateDisplayPageField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing alternate display page',
			description: 'Field in input data that contains the alternate display page (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Product Page Title Field',
			name: 'productPageTitleField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing page title',
			description: 'Field in input data that contains the page title (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Product Thumbnail Field',
			name: 'productThumbnailField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing thumbnail image',
			description: 'Field in input data that contains the thumbnail image (optional)',
			requiresDataPath: 'single',
		},
		{
			displayName: 'Product Image Field',
			name: 'productImageField',
			type: 'string',
			default: '',
			placeholder: 'Select field containing full-size image',
			description: 'Field in input data that contains the full-size image (optional)',
			requiresDataPath: 'single',
		},
	],
}; 