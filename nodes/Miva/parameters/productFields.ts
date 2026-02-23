import type { INodeProperties } from 'n8n-workflow';

export const PRODUCT_RETURN_FIELDS_PARAMETER: INodeProperties = {
	displayName: 'Return Fields',
	name: 'returnFields',
	type: 'multiOptions',
	default: ['id', 'name', 'product_inventory'],
	description: 'Select which fields to return in the response',
	options: [
		{
			name: 'Active',
			value: 'active',
		},
		{
			name: 'Attributes (Ondemand)',
			value: 'attributes',
		},
		{
			name: 'Categories (Ondemand)',
			value: 'categories',
		},
		{
			name: 'Category Code (Ondemand)',
			value: 'cancat_code',
		},
		{
			name: 'Category Count (Ondemand)',
			value: 'catcount',
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
			name: 'Description (Ondemand)',
			value: 'descrip',
		},
		{
			name: 'ID',
			value: 'id',
		},
		{
			name: 'Name',
			value: 'name',
		},
		{
			name: 'Page Code (Ondemand)',
			value: 'page_code',
		},
		{
			name: 'Page Title',
			value: 'page_title',
		},
		{
			name: 'Price',
			value: 'price',
		},
		{
			name: 'Product Image Data (Ondemand)',
			value: 'productimagedata',
		},
		{
			name: 'Product Inventory (Ondemand)',
			value: 'product_inventory',
		},
		{
			name: 'Product Inventory Settings (Ondemand)',
			value: 'productinventorysettings',
		},
		{
			name: 'Product Shipping Rules (Ondemand)',
			value: 'productshippingrules',
		},
		{
			name: 'SKU',
			value: 'sku',
		},
		{
			name: 'Subscription Settings (Ondemand)',
			value: 'subscriptionsettings',
		},
		{
			name: 'Subscription Terms (Ondemand)',
			value: 'subscriptionterms',
		},
		{
			name: 'URIs (Ondemand)',
			value: 'uris',
		},
		{
			name: 'URL (Ondemand)',
			value: 'url',
		},
		{
			name: 'Weight',
			value: 'weight',
		},
	],
	displayOptions: {
		show: {
			operation: ['getProducts'],
		},
	},
};

export const PRODUCT_ONDEMAND_COLUMNS = [
	'descrip', 'catcount', 'url', 'product_inventory', 'page_code', 
	'cancat_code', 'productinventorysettings', 'uris', 'productshippingrules', 
	'subscriptionsettings', 'attributes', 'productimagedata', 'categories', 'subscriptionterms'
]; 