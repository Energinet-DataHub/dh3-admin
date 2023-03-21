/**
 * DataHub BFF
 * Backend-for-frontend for DataHub
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ChargeType } from './charge-type';
import { ChargeVatClassification } from './charge-vat-classification';
import { ChargeResolution } from './charge-resolution';


export interface ChargeV1Dto { 
    id: string;
    chargeType: ChargeType;
    resolution: ChargeResolution;
    chargeId?: string | null;
    chargeName?: string | null;
    chargeDescription?: string | null;
    chargeOwner?: string | null;
    chargeOwnerName?: string | null;
    vatClassification: ChargeVatClassification;
    taxIndicator: boolean;
    transparentInvoicing: boolean;
    hasAnyPrices: boolean;
    validFromDateTime: string;
    validToDateTime?: string | null;
}


