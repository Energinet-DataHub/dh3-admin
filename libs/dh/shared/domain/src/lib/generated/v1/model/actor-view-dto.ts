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
import { UserRoleViewDto } from './user-role-view-dto';


export interface ActorViewDto { 
    id: string;
    organizationName: string;
    actorNumber: string;
    name: string;
    userRoles: Array<UserRoleViewDto>;
}


