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
import { ActorStatus } from './actor-status';
import { ActorNumberDto } from './actor-number-dto';
import { ActorMarketRoleDto } from './actor-market-role-dto';
import { ActorNameDto } from './actor-name-dto';


export interface ActorDto { 
    actorId: string;
    externalActorId?: string | null;
    actorNumber: ActorNumberDto;
    status: ActorStatus;
    name: ActorNameDto;
    marketRoles: Array<ActorMarketRoleDto>;
}


