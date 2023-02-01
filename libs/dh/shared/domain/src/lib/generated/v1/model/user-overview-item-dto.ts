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
import { AssignedActorDto } from './assigned-actor-dto';
import { UserStatus } from './user-status';


export interface UserOverviewItemDto { 
    id: string;
    status: UserStatus;
    name: string;
    email: string;
    phoneNumber?: string | null;
    createdDate: string;
    assignedActors: Array<AssignedActorDto>;
}


