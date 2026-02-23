import {
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MivaApi implements ICredentialType {
	name = 'mivaApi';
	displayName = 'Miva API';
	documentationUrl = 'https://docs.miva.com/json-api';

	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The Miva API authorization token (enter the token only, without "MIVA" prefix)',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://localhost/mm5/json.mvc',
			required: true,
			description: 'The base URL for your Miva store API endpoint',
		},
		{
			displayName: 'Signing Key',
			name: 'signingKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Base64-encoded HMAC signing key (required for secure API communication)',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			method: 'POST',
			url: '={{ $credentials.baseUrl }}',
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				Function: 'Store_Load',
				Miva_Request_Timestamp: '={{ Math.floor(Date.now() / 1000) }}',
			},
		},
	};
} 