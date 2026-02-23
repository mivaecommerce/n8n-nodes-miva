# Miva n8n Node - Technical Architecture

## Overview

The Miva n8n node provides programmatic access to the Miva Merchant API through n8n workflows. Built as a community node package, it implements a layered architecture for maintainable and extensible e-commerce automation.

## Project Structure

```
miva-n8n-connector/
├── credentials/
│   └── MivaApi.credentials.ts           # API authentication
├── nodes/Miva/                          # Main node implementation
│   ├── Miva.node.ts                     # Entry point & orchestration
│   ├── Miva.node.json                   # Node metadata
│   ├── index.ts                         # Module export
│   ├── miva.svg                         # Node icon
│   ├── operations/                      # Business logic layer
│   │   ├── getProducts.ts               # Product retrieval
│   │   ├── getOrders.ts                 # Order retrieval with flattening
│   │   ├── getCustomers.ts              # Customer retrieval
│   │   ├── adjustInventory.ts           # Bulk inventory adjustments
│   │   ├── reportLowInventory.ts        # Alert generation
│   │   ├── createReturns.ts             # RMA return creation
│   │   ├── createShipment.ts            # Shipment creation
│   │   ├── updateShipments.ts           # Shipment updates
│   │   ├── markReturnsReceived.ts       # Return processing
│   │   ├── acknowledgeOrders.ts         # Order acknowledgment
│   │   ├── insertProduct.ts             # Product creation
│   │   ├── updateProduct.ts             # Product updates
│   │   ├── uploadImages.ts              # Bulk image uploads
│   │   ├── deleteProductImage.ts        # Image deletion
│   │   └── index.ts                     # Operation exports
│   ├── parameters/                      # UI parameter definitions
│   │   ├── common.ts                    # Shared parameters
│   │   ├── productFields.ts             # Product field options
│   │   ├── orderFields.ts               # Order field options
│   │   ├── customerFields.ts            # Customer field options
│   │   └── index.ts                     # Parameter exports
│   ├── transport/                       # API communication layer
│   │   └── index.ts                     # HTTP client & transformers
│   ├── utils/                           # Shared utilities
│   │   ├── index.ts                     # Field matching & validation
│   │   └── paginationUtils.ts           # Pagination helpers
│   └── types/                           # TypeScript definitions
│       └── index.ts                     # Interfaces & types
├── dist/                                # Compiled JavaScript output
├── package.json                         # Dependencies & n8n registration
└── tsconfig.json                        # TypeScript configuration
```

## Architectural Patterns

### 1. Layered Architecture

The node follows a clean layered architecture:

- **Presentation Layer** (`parameters/`): UI parameter definitions and field selection
- **Orchestration Layer** (`Miva.node.ts`): Operation routing and execution coordination
- **Business Logic Layer** (`operations/`): Core operation implementations with data processing
- **Transport Layer** (`transport/`): API communication abstraction and response transformation
- **Utility Layer** (`utils/`): Shared helper functions and validation
- **Data Layer** (`types/`): Type definitions and interfaces

### 2. Processing Patterns

The node supports two distinct processing patterns:

**Batch Operations** (process all items at once):
```typescript
export async function getOrders(
    this: IExecuteFunctions, 
    items: INodeExecutionData[]
): Promise<INodeExecutionData[][]>
```

**Individual Operations** (process each item separately):
```typescript
export async function getProducts(
    this: IExecuteFunctions, 
    itemIndex: number
): Promise<INodeExecutionData[]>
```

### 3. Data Transformation

Operations implement consistent data transformation patterns:
- **Field Selection**: Dynamic filtering of API responses
- **Order Flattening**: Converting nested order items to flat structure
- **Case-Insensitive Matching**: Flexible input data handling
- **Ondemand Column Optimization**: Performance-optimized API requests

## Core Components

### Authentication (`credentials/MivaApi.credentials.ts`)

Implements HMAC-based authentication with mandatory signing key:

```typescript
export class MivaApi implements ICredentialType {
    name = 'mivaApi';
    
    properties: INodeProperties[] = [
        {
            displayName: 'API Token',
            name: 'apiToken',
            type: 'string',
            required: true,
        },
        {
            displayName: 'Base URL',
            name: 'baseUrl',
            type: 'string',
            required: true,
        },
        {
            displayName: 'Signing Key',
            name: 'signingKey',
            type: 'string',
            required: true,
        },
    ];
}
```

**Features:**
- HMAC-SHA256 authentication for all API requests
- Base64-encoded signing key required
- Built-in credential testing via `Store_Load` API call
- Configurable base URL for different environments

### Main Node (`nodes/Miva/Miva.node.ts`)

The orchestration hub with operation routing:

```typescript
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const operation = this.getNodeParameter('operation', 0) as string;

    // Batch operations
    if (operation === 'getOrders') {
        return await operations.getOrders.call(this, items);
    } else if (operation === 'adjustInventory') {
        return await operations.adjustInventory.call(this, items);
    }
    // ... other batch operations

    // Individual operations
    else if (operation === 'getProducts') {
        const result = await operations.getProducts.call(this, 0);
        return [result];
    }
    // ... other individual operations
}
```

**Operation Categories:**
- **Data Retrieval**: `getProducts`, `getOrders`, `getCustomers` 
- **Inventory Management**: `adjustInventory`, `reportLowInventory`
- **Order Processing**: `createReturns`, `createShipment`, `updateShipments`, `markReturnsReceived`, `acknowledgeOrders`
- **Product Management**: `insertProduct`, `updateProduct`
- **Media Management**: `uploadImages`, `deleteProductImage`

### Transport Layer (`transport/index.ts`)

Provides API communication abstraction with core functions:

**`mivaApiRequest()` Function:**
```typescript
export async function mivaApiRequest(
    this: IExecuteFunctions,
    functionName: string,
    additionalParams: IDataObject = {},
): Promise<MivaApiResponse>
```

**HMAC Implementation:**
```typescript
function generateHMACSignature(jsonData: string, signingKey: string): string {
    const decodedKey = Buffer.from(signingKey, 'base64');
    const signature = createHmac('sha256', decodedKey)
        .update(jsonData, 'utf8')
        .digest();
    return signature.toString('base64');
}
```

**`buildOndemandFilter()` Function:**
```typescript
export function buildOndemandFilter(
    returnFields: string[], 
    operation: string,
    includeCustomFields?: boolean
): IDataObject | undefined
```

**`transformApiResponse()` Function:**
```typescript
export function transformApiResponse(
    response: MivaApiResponse, 
    returnFields: string[]
): IDataObject[]
```

**`uploadImageToMiva()` Function:**
```typescript
export async function uploadImageToMiva(
    this: IExecuteFunctions,
    imageUrl: string,
    productIdentifier: string,
    identifierType: 'Product_ID' | 'Product_Code' | 'Product_SKU',
    storeCode: string,
    filePathTemplate: string = 'graphics/products/{product_code}/{filename}',
    imageTypeId: number = 0
): Promise<ImageUploadResult>
```

**`deleteProductImageFromMiva()` Function:**
```typescript
export async function deleteProductImageFromMiva(
    this: IExecuteFunctions,
    productImageId: string,
    storeCode: string
): Promise<{ success: boolean; error?: string; mivaResponse?: string }>
```

### Operations Layer (`operations/`)

Each operation implements a consistent pattern:

#### Standard Data Retrieval Pattern:
```typescript
export async function getProducts(this: IExecuteFunctions, itemIndex: number) {
    try {
        // 1. Extract parameters
        const storeCode = this.getNodeParameter('storeCode', itemIndex) as string;
        const count = this.getNodeParameter('count', itemIndex) as number;
        const returnFields = this.getNodeParameter('returnFields', itemIndex) as string[];
        
        // 2. Validate inputs
        validateStoreCode.call(this, storeCode, itemIndex);
        validateCount.call(this, count, itemIndex);
        
        // 3. Build request with optimization
        const requestParams = { Count: count, Store_Code: storeCode };
        const ondemandFilter = buildOndemandFilter(returnFields, 'getProducts');
        if (ondemandFilter) Object.assign(requestParams, ondemandFilter);
        
        // 4. API request
        const response = await mivaApiRequest.call(this, 'ProductList_Load_Query', requestParams);
        
        // 5. Transform and return
        const transformedRecords = transformApiResponse(response, returnFields);
        return transformedRecords.map(record => ({
            json: record,
            pairedItem: { item: itemIndex },
        }));
        
    } catch (error) {
        if (this.continueOnFail()) {
            return [{ json: { error: error.message }, pairedItem: { item: itemIndex } }];
        }
        throw new NodeOperationError(this.getNode(), error, { itemIndex });
    }
}
```

#### Batch Processing Pattern:
```typescript
export async function adjustInventory(this: IExecuteFunctions, items: INodeExecutionData[]) {
    const adjustments: InventoryAdjustment[] = [];
    
    items.forEach((item, index) => {
        const adjustmentData = extractAdjustmentData(
            item.json, 
            identifierType as IdentifierType
        );
        if (adjustmentData) {
            adjustments.push(adjustmentData as InventoryAdjustment);
        }
    });
    
    const response = await mivaApiRequest.call(this, 'ProductInventoryAdjustments_Update', {
        Store_Code: storeCode,
        Inventory_Adjustments: adjustments,
    });
    
    return [[{ json: { success: true, adjustments_processed: adjustments.length } }]];
}
```

### Utilities Layer (`utils/index.ts`)

Provides helper functions:

**Case-Insensitive Field Matching:**
```typescript
export function findFieldCaseInsensitive(
    obj: IDataObject, 
    targetField: string, 
    alternativeFields: string[] = []
): string | null
```

**Data Extraction:**
```typescript
export function extractAdjustmentData(
    inputData: any,
    identifierType: IdentifierType,
): IDataObject | null
```

**Validation:**
```typescript
export function validateStoreCode(this: IExecuteFunctions, storeCode: string, itemIndex: number): void
export function validateCount(this: IExecuteFunctions, count: number, itemIndex: number): void
```

## API Integration Patterns

### Miva API Request Structure

All API requests follow this pattern:

```typescript
{
    Function: "API_Function_Name",
    Miva_Request_Timestamp: 1690123456,   // Unix timestamp
    Store_Code: "store_identifier",
    Count: 100,                            // Optional: pagination
    Offset: 0,                             // Optional: pagination
    Filter: [                              // Optional: ondemand optimization
        {
            name: "ondemandcolumns",       // Always lowercase
            value: ["field1", "field2"]
        }
    ]
}
```

### Ondemand Column Optimization

Performance feature for large datasets:

**Product Ondemand Fields:**
- `descrip`, `catcount`, `url`, `product_inventory`, `page_code`, `cancat_code`, `productinventorysettings`, `uris`, `productshippingrules`, `subscriptionsettings`, `attributes`, `productimagedata`, `categories`, `subscriptionterms`

**Order Ondemand Fields:**
- `ship_method`, `cust_login`, `cust_pw_email`, `business_title`, `payment_module`, `parts`, `items`, `charges`, `coupons`, `discounts`, `payments`, `notes`, `customer`, `payment_data`

### Response Transformation Pipeline

Multi-stage transformation from Miva API to n8n format:

```typescript
// 1. Raw Miva API Response
{
    success: true,
    data: {
        data: [
            { id: 1, name: "Product A", descrip: "Description..." },
        ]
    }
}

// 2. Transformed Records (filtered by returnFields)
[
    { id: 1, name: "Product A" },  // descrip filtered out if not selected
]

// 3. Final n8n Format
[
    {
        json: { id: 1, name: "Product A" },
        pairedItem: { item: 0 }
    }
]
```

## Type Safety

### Core Interfaces

```typescript
export interface MivaApiResponse {
    success: boolean;
    error_message?: string;
    data?: any;
}

export interface MivaApiRequestBody extends IDataObject {
    Function: string;
    Miva_Request_Timestamp: number;
    Store_Code?: string;
    Count?: number;
    Offset?: number;
    Filter?: Array<{
        name: string;
        value: string[];
    }>;
    Inventory_Adjustments?: InventoryAdjustment[];
}

export interface InventoryAdjustment {
    product_id?: string | number;
    product_code?: string;
    product_sku?: string;
    adjustment: number;
}

export interface ImageUploadResult {
    success: boolean;
    mivaFilePath?: string;
    error?: string;
    mivaResponse?: string;
}

export type MivaOperation = 
    | 'getProducts' 
    | 'getOrders' 
    | 'getCustomers' 
    | 'adjustInventory' 
    | 'reportLowInventory'
    | 'createReturns'
    | 'createShipment'
    | 'updateShipments'
    | 'markReturnsReceived'
    | 'acknowledgeOrders'
    | 'insertProduct'
    | 'updateProduct'
    | 'uploadImages'
    | 'deleteProductImage';

export type IdentifierType = 'product_id' | 'product_code' | 'product_sku';
export type ProductIdentifierType = 'Product_ID' | 'Product_Code' | 'Product_SKU';
```

## Build Process

### TypeScript Compilation

```bash
npm run build
# Executes: npx rimraf dist && tsc && gulp build:icons
```

**Build Pipeline:**
1. **Clean**: Remove previous build artifacts
2. **Compile**: Transform TypeScript to JavaScript with source maps
3. **Icons**: Process SVG assets for n8n compatibility

### n8n Registration

`package.json` registers the compiled files with n8n:

```json
{
    "n8n": {
        "n8nNodesApiVersion": 1,
        "credentials": ["dist/credentials/MivaApi.credentials.js"],
        "nodes": ["dist/nodes/Miva/Miva.node.js"]
    }
}
```

## Error Handling Strategy

### Layered Error Handling

1. **Operation Level**: Operation-specific error handling with context
2. **Transport Level**: API communication error abstraction
3. **Utility Level**: Validation errors with helpful messages
4. **Node Level**: Final error formatting for n8n UI

### Continue on Fail Support

Comprehensive support for n8n's `continueOnFail` mode:

```typescript
if (this.continueOnFail()) {
    return [{
        json: { 
            error: error.message,
            operation: 'operationName',
            input_data: inputData 
        },
        pairedItem: { item: itemIndex }
    }];
}
```

## Performance Considerations

### API Optimization Strategies

- **Ondemand Columns**: Automatic detection and optimization of API calls
- **Pagination**: Configurable count/offset with validation (max 10,000)
- **Batch Processing**: Operations batch multiple changes into single API calls
- **Field Selection**: Response transformation filters out unused fields

## Security Considerations

### Credential Management

- **Secure Storage**: API tokens stored in n8n's encrypted credential system
- **No Logging**: Credential information never logged or exposed in error messages
- **HTTPS Enforcement**: All API communication over encrypted connections

This architecture provides a robust foundation for extending the Miva n8n node while maintaining code quality, type safety, and separation of concerns. 