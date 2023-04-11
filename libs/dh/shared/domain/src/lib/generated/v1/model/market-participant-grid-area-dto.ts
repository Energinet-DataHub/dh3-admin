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
import { MarketParticipantPriceAreaCode } from './market-participant-price-area-code';


export interface MarketParticipantGridAreaDto { 
    id: string;
    code: string;
    name: string;
    priceAreaCode: MarketParticipantPriceAreaCode;
    validFrom: string;
    validTo?: string | null;
}
export namespace MarketParticipantGridAreaDto {
}



