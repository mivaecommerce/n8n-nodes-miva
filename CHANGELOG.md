# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- `updateProduct` and `insertProduct` operations now wrap their function bodies in `try/catch` with `continueOnFail()` handling, consistent with `acknowledgeOrders` and `adjustInventory`. Previously, any error in these operations would halt the entire workflow regardless of the node's "Continue On Error" setting.
- `inputs` and `outputs` in `Miva.node.ts` now use `NodeConnectionType.Main` instead of the string literal `'main'`, as required by n8n's node base file specification.
- Removed three `this.logger.info()` calls in `transport/index.ts` that logged full API response bodies for `Provision_Store`, `ProductImage_Add`, and `ProductImage_Delete`. These responses can contain sensitive product and order data and are not appropriate for production logs.
- Sorted operation options alphabetically in `parameters/common.ts` and removed the `eslint-disable` suppression comment that was masking the ordering issue.
- Removed emoji characters from all operation output strings across `adjustInventory.ts`, `acknowledgeOrders.ts`, `createReturns.ts`, `createShipment.ts`, `markReturnsReceived.ts`, `updateShipments.ts`, and `reportLowInventory.ts`. Replaced with plain text equivalents.
- Removed dead utility functions `extractAdjustmentData`, `checkLowStock`, and `findFieldCaseInsensitive` from `utils/index.ts`, along with their now-unused `IDataObject` and `IdentifierType` imports. None were referenced anywhere in the codebase.
- Replaced `NodeOperationError` with `NodeApiError` for API-originated errors in `transport/index.ts`. Added `NodeApiError` and `JsonObject` imports from `n8n-workflow` to preserve HTTP context in the n8n UI when the Miva API returns `success: false`.
- Added `.github/workflows/publish.yml` GitHub Actions workflow to publish to npm with provenance attestation on each GitHub Release, as required by n8n verification from May 1st 2026.

## [1.0.4] - Prior release

- Initial published release.
