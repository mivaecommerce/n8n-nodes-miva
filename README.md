# n8n-miva-connector

n8n community node for integrating with Miva eCommerce platforms. Provides programmatic access to Miva's JSON API for managing products, orders, customers, inventory, and fulfillment operations within n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

**Build the package files**
```bash
cd n8n-connector
npm install
npm run build
```
This installs dependencies and produces the distributable files that n8n loads. The build script clears `dist/`, compiles TypeScript to JavaScript, and runs the icon build task so the node metadata is ready for packaging. The output is written to `dist/`, which is the only folder published by this package.

**Use the package with n8n (local development)**
```bash
npm link
```
`npm link` makes the package available globally for local development. In your n8n installation, run `npm link n8n-nodes-miva` so n8n resolves this node from your local build. Re-run `npm run build` after code changes to refresh the `dist/` artifacts, then restart n8n to pick up the latest build.

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation for other ways to use the package file.

## Operations

### Data Retrieval
- **Get Products**: Retrieve product information with field selection and pagination
- **Get Orders**: Access order data with item flattening and field filtering
- **Get Customers**: Retrieve customer information and account data

### Inventory Management
- **Adjust Inventory**: Update product inventory levels in bulk
- **Report Low Inventory**: Generate low stock alerts

### Order Processing
- **Create Returns**: Create RMA returns for order items
- **Create Shipment**: Generate shipments from order line items
- **Update Shipments**: Modify shipment details and tracking
- **Mark Returns Received**: Process returned items and adjust inventory
- **Acknowledge Orders**: Mark orders as acknowledged

### Product Management
- **Insert Product**: Create new products
- **Update Product**: Modify existing product data

### Media Management
- **Upload Images**: Upload images to products from URLs
- **Delete Product Image**: Remove images from products

## Project Structure

```
miva-n8n-connector/
├── credentials/
│   └── MivaApi.credentials.ts           # API authentication
├── nodes/Miva/                          # Main node implementation
│   ├── Miva.node.ts                     # Entry point & operation routing
│   ├── Miva.node.json                   # Node metadata
│   ├── index.ts                         # Module export
│   ├── miva.svg                         # Node icon
│   ├── operations/                      # Business logic implementation
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
├── ARCHITECTURE.md                       # Technical architecture details
└── package.json                          # Dependencies & n8n registration
```

## Architecture

The node follows a layered architecture:

- **Presentation Layer**: UI parameters and field selection
- **Orchestration Layer**: Operation routing and execution coordination
- **Business Logic Layer**: Core operation implementations
- **Transport Layer**: API communication and response transformation
- **Utility Layer**: Shared helper functions and validation

### Processing Patterns

**Batch Operations**: Process multiple input items in single API calls
- `getOrders`, `adjustInventory`, `createReturns`, `createShipment`, `updateShipments`, `markReturnsReceived`, `acknowledgeOrders`, `reportLowInventory`

**Individual Operations**: Process each input item separately
- `getProducts`, `getCustomers`, `uploadImages`, `deleteProductImage`, `updateProduct`, `insertProduct`

### API Integration

- **Authentication**: HMAC-SHA256 with base64-encoded signing key
- **Request Format**: POST requests with JSON body and timestamp
- **Response Handling**: Automatic transformation from Miva's nested structure to flat objects
- **Field Optimization**: Dynamic ondemand column filtering for performance

## Credentials

### Required Configuration
1. **API Token**: Your store's API authorization token
2. **Base URL**: Your Miva store's API endpoint (e.g., `https://yourstore.com/mm5/json.mvc`)
3. **Signing Key**: Base64-encoded HMAC signing key for secure communication

### Security Features
- All API requests use HMAC-SHA256 authentication
- Credentials stored in n8n's encrypted credential system
- No credential information logged or exposed in error messages

## Usage Examples

### Basic Product Retrieval
```
Miva: Get Products
├── Store Code: your_store
├── Count: 100
├── Return Fields: product_code, product_name, product_inventory
└── Include Custom Fields: false
```

### Order Processing with Item Flattening
```
Miva: Get Orders
├── Store Code: your_store
├── Count: 50
├── Return Fields: id, total, customer, items
├── Order Item Fields: product_code, quantity, price
└── Flatten Items: true
```

### Bulk Inventory Adjustment
```
Miva: Adjust Inventory
├── Store Code: your_store
├── Product Identifier Type: product_sku
├── Product Identifier Field: sku
└── Adjustment Field: adjustment_amount
```

### Image Upload
```
Miva: Upload Images
├── Store Code: your_store
├── Product Identifier Type: product_code
├── Product Identifier Field: product_code
├── Image URL Field: image_url
└── File Path Template: graphics/products/{product_code}/{filename}
```

## Field Selection

The node supports dynamic field selection to optimize API performance:

**Product Fields**: Basic fields like `product_code`, `product_name`, `product_inventory`
**Order Fields**: Order data including `id`, `total`, `customer`, `items`
**Customer Fields**: Customer information and account data

**Ondemand Fields**: Automatically detected and optimized for performance
- Products: `descrip`, `catcount`, `url`, `product_inventory`, `attributes`
- Orders: `ship_method`, `cust_login`, `parts`, `items`, `charges`

## Error Handling

- **Continue on Fail**: Support for n8n's continue-on-fail mode
- **Validation**: Input parameter validation with helpful error messages
- **API Errors**: Proper handling of Miva API error responses
- **Context Preservation**: Error messages include operation context and item index

## Performance Considerations

- **Pagination**: Built-in support for large datasets (up to 10,000 records per request)
- **Field Filtering**: Response transformation filters unused fields
- **Batch Processing**: Multiple operations batch data for efficiency
- **Memory Management**: No retention of large response objects between operations

## Development

### Building
```bash
npm run build
```

### Testing
```bash
npm run lint
npm run format
```

### TypeScript
The project uses TypeScript with strict type checking and comprehensive interfaces for all API operations.

## Resources

* [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Miva JSON API Documentation](https://docs.miva.com/developer/developer-resources/json-api/api-getting-started/)
* [Project Architecture Documentation](ARCHITECTURE.md)

## Version History

### v0.1.0
- Complete Miva API integration with 14 core operations
- HMAC-SHA256 authentication for all API requests
- Support for products, orders, customers, inventory, and media management
- Advanced features: order flattening, field selection, batch processing
- Comprehensive error handling and validation
- Performance optimizations with ondemand column support

---

**Note**: This is a community-maintained node. For issues, feature requests, or contributions, please visit the [GitHub repository](https://github.com/mivaecommerce/n8n-nodes-miva).
