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
import { ChargeMessageType } from './charge-message-type';


export interface ChargeMessageV1Dto { 
    messageId?: string | null;
    messageType: ChargeMessageType;
    messageDateTime: string;
}
export namespace ChargeMessageV1Dto {
}



