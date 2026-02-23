import type { INodeProperties } from 'n8n-workflow';

export const CUSTOMER_RETURN_FIELDS_PARAMETER: INodeProperties = {
	displayName: 'Return Fields',
	name: 'returnFields',
	type: 'multiOptions',
	default: ['id', 'login', 'bill_fname', 'bill_lname', 'bill_email'],
	description: 'Select which fields to return in the response',
	options: [
		{
			name: 'Account ID',
			value: 'account_id',
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
			name: 'Bill ID',
			value: 'bill_id',
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
			name: 'Business Title',
			value: 'business_title',
		},
		{
			name: 'Credit',
			value: 'credit',
		},
		{
			name: 'Date Created',
			value: 'dt_created',
		},
		{
			name: 'Date Last Login',
			value: 'dt_login',
		},
		{
			name: 'Date Updated',
			value: 'dt_Updated',
		},
		{
			name: 'Formatted Credit',
			value: 'formatted_credit',
		},
		{
			name: 'ID',
			value: 'id',
		},
		{
			name: 'Login',
			value: 'login',
		},
		{
			name: 'Note Count',
			value: 'note_count',
		},
		{
			name: 'Password Email',
			value: 'pw_email',
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
			name: 'Start Offset',
			value: 'start_offset',
		},
		{
			name: 'Total Count',
			value: 'total_count',
		},
	],
	displayOptions: {
		show: {
			operation: ['getCustomers'],
		},
	},
}; 