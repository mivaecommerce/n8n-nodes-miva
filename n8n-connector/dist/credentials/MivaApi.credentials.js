"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MivaApi = void 0;
class MivaApi {
    constructor() {
        this.name = 'mivaApi';
        this.displayName = 'Miva API';
        this.documentationUrl = 'https://docs.miva.com/json-api';
        this.properties = [
            {
                displayName: 'API Token',
                name: 'apiToken',
                type: 'string',
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
    }
}
exports.MivaApi = MivaApi;
//# sourceMappingURL=MivaApi.credentials.js.map