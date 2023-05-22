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
import { ActorNumberDto } from './actor-number-dto';
import { ActorNameDto } from './actor-name-dto';


export interface Actor { 
    actorId: string;
    actorNumber: ActorNumberDto;
    name: ActorNameDto;
}


