import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { mivaApiRequest } from '../transport';
import { validateStoreCode } from '../utils';

/**
 * Updates shipment details and marks shipments as shipped.
 * Processes all input items to build shipment update objects for the API.
 */
export async function updateShipments(this: IExecuteFunctions, items: INodeExecutionData[]): Promise<INodeExecutionData[][]> {
	try {
		const storeCode = this.getNodeParameter('storeCode', 0) as string;
		const shipmentIdField = this.getNodeParameter('shipmentIdField', 0) as string;
		const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;
		const markShippedField = additionalFields.markShippedField as string;
		const trackNumberField = additionalFields.trackNumberField as string;
		const trackTypeField = additionalFields.trackTypeField as string;
		const costField = additionalFields.costField as string;
		const weightField = additionalFields.weightField as string;

		// Validate store code
		validateStoreCode.call(this, storeCode, 0);

		// Validate required fields exist in input data (before any processing)
		if (items.length === 0) {
			return [[{ json: { message: 'No input data provided' } }]];
		}

		const sampleData = items[0].json;
		const missingFields: string[] = [];

		if (!(shipmentIdField in sampleData)) missingFields.push(shipmentIdField);

		if (missingFields.length > 0) {
			return [[{
				json: {
					message: `❌ Cannot update shipments - missing required fields: ${missingFields.join(', ')}`,
					missingFields,
					alert: true
				}
			}]];
		}

		// Build shipment updates array
		const shipmentUpdates: any[] = [];

		for (const item of items) {
			const inputData = item.json;

			// Extract shipment ID (required)
			const shipmentId = inputData[shipmentIdField];
			if (shipmentId == null || shipmentId === '') {
				continue; // Skip items without valid shipment ID
			}

			// Build shipment update object
			const shipmentUpdate: any = {
				shpmnt_id: Number(shipmentId),
			};

			// Add optional fields only if they exist and are not blank
			if (markShippedField && inputData[markShippedField] != null && inputData[markShippedField] !== '') {
				shipmentUpdate.mark_shipped = inputData[markShippedField];
			}

			if (trackNumberField && inputData[trackNumberField] != null && inputData[trackNumberField] !== '') {
				shipmentUpdate.tracknum = String(inputData[trackNumberField]);
			}

			if (trackTypeField && inputData[trackTypeField] != null && inputData[trackTypeField] !== '') {
				shipmentUpdate.tracktype = String(inputData[trackTypeField]);
			}

			if (costField && inputData[costField] != null && inputData[costField] !== '') {
				shipmentUpdate.cost = inputData[costField];
			}

			if (weightField && inputData[weightField] != null && inputData[weightField] !== '') {
				shipmentUpdate.weight = inputData[weightField];
			}

			shipmentUpdates.push(shipmentUpdate);
		}

		// If no valid shipments to update, return summary
		if (shipmentUpdates.length === 0) {
			return [[{
				json: {
					message: 'No shipments updated - no valid shipment IDs found',
					processed_items: items.length,
					shipments_updated: 0,
				},
			}]];
		}

		// Make API call to update shipments
		const response = await mivaApiRequest.call(this, 'OrderShipmentList_Update', {
			Store_Code: storeCode,
			Shipment_Updates: shipmentUpdates,
		});

		// Return success response
		return [[{
			json: {
				success: Boolean(response.success),
				message: `Successfully updated ${shipmentUpdates.length} shipments`,
				processed_items: items.length,
				shipments_updated: shipmentUpdates.length,
				shipment_ids: shipmentUpdates.map(update => update.shpmnt_id),
			},
		}]];

	} catch (error) {
		if (this.continueOnFail()) {
			return [[{
				json: { error: error.message || 'Unknown error occurred' },
			}]];
		} else {
			throw new NodeOperationError(this.getNode(), error);
		}
	}
} 