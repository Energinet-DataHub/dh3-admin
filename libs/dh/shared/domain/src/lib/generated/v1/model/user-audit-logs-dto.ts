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
import { UserInviteAuditLogDto } from './user-invite-audit-log-dto';
import { UserRoleAssignmentAuditLogDto } from './user-role-assignment-audit-log-dto';


export interface UserAuditLogsDto { 
    roleAssignmentAuditLogs: Array<UserRoleAssignmentAuditLogDto>;
    userInviteAuditLogs: Array<UserInviteAuditLogDto>;
}


