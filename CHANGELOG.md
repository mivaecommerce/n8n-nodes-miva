# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.5] - 2026-03-26

### Fixed
- `updateProduct` and `insertProduct` operations now wrap their function bodies in `try/catch` with `continueOnFail()` handling, consistent with `acknowledgeOrders` and `adjustInventory`. Previously, any error in these operations would halt the entire workflow regardless of the node's "Continue On Error" setting.
- `inputs` and `outputs` in `Miva.node.ts` now use `NodeConnectionTypes.Main` (the exported const object from `n8n-workflow`) instead of a raw `'main'` string literal. `NodeConnectionType` (singular) is a type alias and cannot be used as a value; `NodeConnectionTypes` (plural) is the correct runtime constant.
- Removed three `this.logger.info()` calls in `transport/index.ts` that logged full API response bodies for `Provision_Store`, `ProductImage_Add`, and `ProductImage_Delete`. These responses can contain sensitive product and order data and are not appropriate for production logs.
- Sorted operation options alphabetically in `parameters/common.ts` and removed the `eslint-disable` suppression comment that was masking the ordering issue.
- Removed emoji characters from all operation output strings across `adjustInventory.ts`, `acknowledgeOrders.ts`, `createReturns.ts`, `createShipment.ts`, `markReturnsReceived.ts`, `updateShipments.ts`, and `reportLowInventory.ts`. Replaced with plain text equivalents.
- Removed dead utility functions `extractAdjustmentData`, `checkLowStock`, and `findFieldCaseInsensitive` from `utils/index.ts`, along with their now-unused `IDataObject` and `IdentifierType` imports. None were referenced anywhere in the codebase.
- Replaced `NodeOperationError` with `NodeApiError` for API-originated errors in `transport/index.ts`. Added `NodeApiError` and `JsonObject` imports from `n8n-workflow` to preserve HTTP context in the n8n UI when the Miva API returns `success: false`.
- Added `.github/workflows/publish.yml` GitHub Actions workflow to publish to npm with provenance attestation on each GitHub Release, as required by n8n verification from May 1st 2026.
- Fixed n8n package scanner failure: moved HMAC signing logic out of `transport/index.ts` and into a function-based `authenticate` property on `MivaApi.credentials.ts`. `mivaApiRequest` now calls `this.helpers.httpRequestWithAuthentication()` as required by the scanner. The credential's `authenticate` function receives the full request options, serializes the body to JSON, computes the HMAC-SHA256 signature, and injects the `X-Miva-API-Authorization` header — ensuring the signature always covers the exact bytes sent. This also fixes the credential test button, which previously sent unsigned requests.
- Removed unused `step1Response`, `step2Response`, and `response` variable assignments in `transport/index.ts` that produced TypeScript `noUnusedLocals` errors.
- Fixed `node` field in `Miva.node.json` from `"n8n-nodes-base.miva"` (the placeholder value from n8n docs) to `"@mivalabs/n8n-nodes-miva.miva"` so n8n correctly associates codex metadata with this package.
- Added `icon = 'file:miva.svg' as const` to `MivaApi.credentials.ts` and copied `miva.svg` into the `credentials/` folder so the brand icon appears in the n8n credentials panel.

## [1.0.4] - Prior release

- Initial published release.
