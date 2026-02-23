import type { INodeProperties } from 'n8n-workflow';

export const ORDER_RETURN_FIELDS_PARAMETER: INodeProperties = {
	displayName: 'Return Fields',
	name: 'returnFields',
	type: 'multiOptions',
	default: ['id', 'orderdate', 'status', 'total', 'cust_id'],
	description: 'Select which fields to return in the response',
	options: [
		{
			name: 'Batch ID',
			value: 'batch_id',
		},
		{
			name: 'Bill Address 1',
			value: 'bill_addr1',
		},
		{
			name: 'Bill Address 2',
			value: 'bill_addr2',
		},
		{
			name: 'Bill City',
			value: 'bill_city',
		},
		{
			name: 'Bill Company',
			value: 'bill_comp',
		},
		{
			name: 'Bill Country',
			value: 'bill_cntry',
		},
		{
			name: 'Bill Email',
			value: 'bill_email',
		},
		{
			name: 'Bill Fax',
			value: 'bill_fax',
		},
		{
			name: 'Bill First Name',
			value: 'bill_fname',
		},
		{
			name: 'Bill Last Name',
			value: 'bill_lname',
		},
		{
			name: 'Bill Phone',
			value: 'bill_phone',
		},
		{
			name: 'Bill State',
			value: 'bill_state',
		},
		{
			name: 'Bill Zip',
			value: 'bill_zip',
		},
		{
			name: 'Business Title (Ondemand)',
			value: 'business_title',
		},
		{
			name: 'Charges (Ondemand)',
			value: 'charges',
		},
		{
			name: 'Coupons (Ondemand)',
			value: 'coupons',
		},
		{
			name: 'Customer (Ondemand)',
			value: 'customer',
		},
		{
			name: 'Customer ID',
			value: 'cust_id',
		},
		{
			name: 'Customer Login (Ondemand)',
			value: 'cust_login',
		},
		{
			name: 'Customer Password Email (Ondemand)',
			value: 'cust_pw_email',
		},
		{
			name: 'Date In Stock',
			value: 'dt_instock',
		},
		{
			name: 'Date Updated',
			value: 'dt_Updated',
		},
		{
			name: 'Discounts (Ondemand)',
			value: 'discounts',
		},
		{
			name: 'Formatted Net Captured',
			value: 'formatted_net_capt',
		},
		{
			name: 'Formatted Total',
			value: 'formatted_total',
		},
		{
			name: 'Formatted Total Auth',
			value: 'formatted_total_auth',
		},
		{
			name: 'Formatted Total Captured',
			value: 'formatted_total_capt',
		},
		{
			name: 'Formatted Total Refunded',
			value: 'formatted_total_rfnd',
		},
		{
			name: 'Formatted Total Shipping',
			value: 'formatted_total_ship',
		},
		{
			name: 'Formatted Total Tax',
			value: 'formatted_total_tax',
		},
		{
			name: 'ID',
			value: 'id',
		},
		{
			name: 'Items (Ondemand)',
			value: 'items',
		},
		{
			name: 'Net Captured',
			value: 'net_capt',
		},
		{
			name: 'Note Count',
			value: 'note_count',
		},
		{
			name: 'Notes (Ondemand)',
			value: 'notes',
		},
		{
			name: 'Order Date',
			value: 'orderdate',
		},
		{
			name: 'Parts (Ondemand)',
			value: 'parts',
		},
		{
			name: 'Payment Data (Ondemand)',
			value: 'payment_data',
		},
		{
			name: 'Payment ID',
			value: 'pay_id',
		},
		{
			name: 'Payment Module (Ondemand)',
			value: 'payment_module',
		},
		{
			name: 'Payment Status',
			value: 'pay_status',
		},
		{
			name: 'Payments (Ondemand)',
			value: 'payments',
		},
		{
			name: 'Pending Count',
			value: 'pend_count',
		},
		{
			name: 'Ship Address 1',
			value: 'ship_addr1',
		},
		{
			name: 'Ship Address 2',
			value: 'ship_addr2',
		},
		{
			name: 'Ship City',
			value: 'ship_city',
		},
		{
			name: 'Ship Company',
			value: 'ship_comp',
		},
		{
			name: 'Ship Country',
			value: 'ship_cntry',
		},
		{
			name: 'Ship Data',
			value: 'ship_data',
		},
		{
			name: 'Ship Email',
			value: 'ship_email',
		},
		{
			name: 'Ship Fax',
			value: 'ship_fax',
		},
		{
			name: 'Ship First Name',
			value: 'ship_fname',
		},
		{
			name: 'Ship ID',
			value: 'ship_id',
		},
		{
			name: 'Ship Last Name',
			value: 'ship_lname',
		},
		{
			name: 'Ship Method (Ondemand)',
			value: 'ship_method',
		},
		{
			name: 'Ship Phone',
			value: 'ship_phone',
		},
		{
			name: 'Ship Residential',
			value: 'ship_res',
		},
		{
			name: 'Ship State',
			value: 'ship_state',
		},
		{
			name: 'Ship Zip',
			value: 'ship_zip',
		},
		{
			name: 'Source',
			value: 'source',
		},
		{
			name: 'Source ID',
			value: 'source_id',
		},
		{
			name: 'Start Offset',
			value: 'start_offset',
		},
		{
			name: 'Status',
			value: 'status',
		},
		{
			name: 'Stock Status',
			value: 'stk_status',
		},
		{
			name: 'Total',
			value: 'total',
		},
		{
			name: 'Total Auth',
			value: 'total_auth',
		},
		{
			name: 'Total Captured',
			value: 'total_capt',
		},
		{
			name: 'Total Count',
			value: 'total_count',
		},
		{
			name: 'Total Refunded',
			value: 'total_rfnd',
		},
		{
			name: 'Total Shipping',
			value: 'total_ship',
		},
		{
			name: 'Total Tax',
			value: 'total_tax',
		},
	],
	displayOptions: {
		show: {
			operation: ['getOrders'],
		},
	},
};

export const ORDER_ITEM_FIELDS_PARAMETER: INodeProperties = {
	displayName: 'Item Fields',
	name: 'itemFields',
	type: 'multiOptions',
	default: ['line_id', 'name', 'total', 'quantity'],
	description: 'Select which item fields to include',
	options: [
		{ name: 'Base Price', value: 'base_price' },
		{ name: 'Code', value: 'code' },
		{ name: 'Date In Stock', value: 'dt_instock' },
		{ name: 'Formatted Tax', value: 'formatted_tax' },
		{ name: 'Formatted Total', value: 'formatted_total' },
		{ name: 'Formatted Weight', value: 'formatted_weight' },
		{ name: 'Group ID', value: 'group_id' },
		{ name: 'Line ID', value: 'line_id' },
		{ name: 'Name', value: 'name' },
		{ name: 'Order ID', value: 'order_id' },
		{ name: 'Parent ID', value: 'parent_id' },
		{ name: 'Price', value: 'price' },
		{ name: 'Product ID', value: 'product_id' },
		{ name: 'Quantity', value: 'quantity' },
		{ name: 'Retail', value: 'retail' },
		{ name: 'RMA ID', value: 'rma_id' },
		{ name: 'Shipment ID', value: 'shpmnt_id' },
		{ name: 'SKU', value: 'sku' },
		{ name: 'Status', value: 'status' },
		{ name: 'Subscription ID', value: 'subscrp_id' },
		{ name: 'Subterm ID', value: 'subterm_id' },
		{ name: 'Tax', value: 'tax' },
		{ name: 'Taxable', value: 'taxable' },
		{ name: 'Total', value: 'total' },
		{ name: 'Type', value: 'type' },
		{ name: 'Upsold', value: 'upsold' },
		{ name: 'Weight', value: 'weight' },
	],
	displayOptions: {
		show: {
			operation: ['getOrders'],
			returnFields: ['items'],
		},
	},
};

export const FLATTEN_ITEMS_PARAMETER: INodeProperties = {
	displayName: 'Flatten Items',
	name: 'flattenItems',
	type: 'boolean',
	default: true,
	description: 'Whether to flatten items into separate rows (one row per item) or keep items as nested objects within each order',
	displayOptions: {
		show: {
			operation: ['getOrders'],
			returnFields: ['items'],
		},
	},
};

export const ORDER_ONDEMAND_COLUMNS = [
	'ship_method', 'cust_login', 'cust_pw_email', 'business_title', 'payment_module', 
	'parts', 'items', 'charges', 'coupons', 'discounts', 'payments', 'notes', 'customer', 'payment_data'
]; 