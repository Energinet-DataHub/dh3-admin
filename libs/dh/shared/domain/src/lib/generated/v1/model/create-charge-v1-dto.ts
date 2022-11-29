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
import { MarketParticipantV1Dto } from './market-participant-v1-dto';
import { VatClassification } from './vat-classification';
import { Resolution } from './resolution';


export interface CreateChargeV1Dto { 
    senderProvidedChargeId?: string | null;
    chargeName?: string | null;
    description?: string | null;
    taxIndicator: boolean;
    transparentInvoicing: boolean;
    effectiveDate: string;
    chargeType: ChargeType;
    resolution: Resolution;
    vatClassification: VatClassification;
    senderMarketParticipant?: MarketParticipantV1Dto;
}


