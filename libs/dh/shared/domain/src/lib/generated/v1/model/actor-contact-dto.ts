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
import { ContactCategory } from './contact-category';


export interface ActorContactDto { 
    contactId: string;
    category: ContactCategory;
    name: string;
    email: string;
    phone?: string | null;
}
export namespace ActorContactDto {
}



