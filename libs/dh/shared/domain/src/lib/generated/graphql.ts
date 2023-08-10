/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { graphql, ResponseResolver, GraphQLRequest, GraphQLContext } from 'msw'
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateRange: { start: string, end: string};
  DateTimeOffset: string;
};

export type Actor = {
  __typename?: 'Actor';
  /** The gln or eic number of the actor. */
  glnOrEicNumber: Scalars['String'];
  /** The grid areas the actor belongs to. */
  gridAreas: Array<GridArea>;
  /** The id of the actor. */
  id: Scalars['ID'];
  /** The market role of the actor. */
  marketRole?: Maybe<EicFunction>;
  /** The name of the actor. */
  name: Scalars['String'];
  /** The status of the actor. */
  status?: Maybe<ActorStatus>;
};

export enum ActorStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  New = 'New',
  Passive = 'Passive'
}

export type Address = {
  __typename?: 'Address';
  /** The city of the address. */
  city?: Maybe<Scalars['String']>;
  /** The country of the address. */
  country: Scalars['String'];
  /** The number of the address. */
  number?: Maybe<Scalars['String']>;
  /** The street name of the address. */
  streetName?: Maybe<Scalars['String']>;
  /** The zip code of the address. */
  zipCode?: Maybe<Scalars['String']>;
};

export enum BatchState {
  Completed = 'COMPLETED',
  Executing = 'EXECUTING',
  Failed = 'FAILED',
  Pending = 'PENDING'
}

export type Calculation = {
  __typename?: 'Calculation';
  createdByUserName: Scalars['String'];
  /** The execution state. */
  executionState: BatchState;
  /** The execution end time. */
  executionTimeEnd?: Maybe<Scalars['DateTimeOffset']>;
  /** The execution start time. */
  executionTimeStart?: Maybe<Scalars['DateTimeOffset']>;
  gridAreas: Array<GridArea>;
  /** The id of the calculation. */
  id: Scalars['ID'];
  period?: Maybe<Scalars['DateRange']>;
  /** The process type. */
  processType: ProcessType;
  statusType: StatusType;
};

export type CreateCalculationInput = {
  /** The grid areas to be included in the calculation. */
  gridAreaCodes: Array<Scalars['String']>;
  /** The period for the calculation. */
  period: Scalars['DateRange'];
  /** The process type for the calculation. */
  processType: ProcessType;
};

export enum EicFunction {
  BalanceResponsibleParty = 'BalanceResponsibleParty',
  BillingAgent = 'BillingAgent',
  DanishEnergyAgency = 'DanishEnergyAgency',
  DataHubAdministrator = 'DataHubAdministrator',
  ElOverblik = 'ElOverblik',
  EnergySupplier = 'EnergySupplier',
  GridAccessProvider = 'GridAccessProvider',
  ImbalanceSettlementResponsible = 'ImbalanceSettlementResponsible',
  IndependentAggregator = 'IndependentAggregator',
  MeteredDataAdministrator = 'MeteredDataAdministrator',
  MeteredDataResponsible = 'MeteredDataResponsible',
  MeteringPointAdministrator = 'MeteringPointAdministrator',
  SerialEnergyTrader = 'SerialEnergyTrader',
  SystemOperator = 'SystemOperator'
}

export type GraphQlMutation = {
  __typename?: 'GraphQLMutation';
  createCalculation: Calculation;
  updatePermission: Permission;
};


export type GraphQlMutationCreateCalculationArgs = {
  input: CreateCalculationInput;
};


export type GraphQlMutationUpdatePermissionArgs = {
  input: UpdatePermissionInput;
};

export type GraphQlQuery = {
  __typename?: 'GraphQLQuery';
  actor: Actor;
  actors: Array<Actor>;
  calculation?: Maybe<Calculation>;
  calculations: Array<Calculation>;
  gridAreas: Array<GridArea>;
  organization?: Maybe<Organization>;
  organizations?: Maybe<Array<Maybe<Organization>>>;
  permission: Permission;
  permissionLogs: Array<PermissionAuditLog>;
  permissions: Array<Permission>;
  settlementReports: Array<SettlementReport>;
  userrole: UserRoleWithPermissions;
};


export type GraphQlQueryActorArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type GraphQlQueryActorsArgs = {
  eicFunctions?: InputMaybe<Array<EicFunction>>;
};


export type GraphQlQueryCalculationArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type GraphQlQueryCalculationsArgs = {
  executionStates?: InputMaybe<Array<BatchState>>;
  executionTime?: InputMaybe<Scalars['DateRange']>;
  first?: InputMaybe<Scalars['Int']>;
  gridAreaCodes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  period?: InputMaybe<Scalars['DateRange']>;
  processTypes?: InputMaybe<Array<ProcessType>>;
};


export type GraphQlQueryOrganizationArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type GraphQlQueryPermissionArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type GraphQlQueryPermissionLogsArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type GraphQlQueryPermissionsArgs = {
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type GraphQlQuerySettlementReportsArgs = {
  executionTime?: InputMaybe<Scalars['DateRange']>;
  gridAreaCodes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  period?: InputMaybe<Scalars['DateRange']>;
  processType?: InputMaybe<ProcessType>;
};


export type GraphQlQueryUserroleArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type GridArea = {
  __typename?: 'GridArea';
  /** The grid area code. */
  code: Scalars['String'];
  /** The grid area id. */
  id: Scalars['ID'];
  /** The grid area name. */
  name: Scalars['String'];
  /** The price area code for the grid area. */
  priceAreaCode: PriceAreaCode;
  /** Date that the grid area is valid from */
  validFrom: Scalars['DateTimeOffset'];
  /** Date that the grid area is valid to */
  validTo?: Maybe<Scalars['DateTimeOffset']>;
};

export type Organization = {
  __typename?: 'Organization';
  /** The address of the organization. */
  address: Address;
  /** The business register identifier of the organization. */
  businessRegisterIdentifier: Scalars['String'];
  /** The comment of the organization. */
  comment: Scalars['String'];
  /** The name of the organization. */
  name: Scalars['String'];
  /** The ID of the organization. */
  organizationId: Scalars['ID'];
  /** The status of the organization. */
  status: OrganizationStatus;
};

export enum OrganizationStatus {
  Active = 'ACTIVE',
  Blocked = 'BLOCKED',
  Deleted = 'DELETED',
  New = 'NEW'
}

export type Permission = {
  __typename?: 'Permission';
  /** The EIC functions this permission is assignable to. */
  assignableTo: Array<EicFunction>;
  /** The created date of the permission. */
  created: Scalars['DateTimeOffset'];
  /** The description of the permission. */
  description: Scalars['String'];
  /** The ID of the permission. */
  id: Scalars['Int'];
  /** The name of the permission. */
  name: Scalars['String'];
  userRoles: Array<UserRole>;
};

export type PermissionAuditLog = {
  __typename?: 'PermissionAuditLog';
  /** Changed by user id */
  changedByUserId: Scalars['ID'];
  /** Changed by user name */
  changedByUserName: Scalars['String'];
  /** Permission audit log type */
  permissionAuditLogType: PermissionAuditLogType;
  /** Permission id */
  permissionId: Scalars['Int'];
  /** Time of change */
  timestamp: Scalars['DateTimeOffset'];
  /** The new value after the change */
  value: Scalars['String'];
};

export enum PermissionAuditLogType {
  Created = 'CREATED',
  DescriptionChange = 'DESCRIPTION_CHANGE',
  Unknown = 'UNKNOWN'
}

export enum PriceAreaCode {
  Dk_1 = 'DK_1',
  Dk_2 = 'DK_2'
}

export enum ProcessType {
  Aggregation = 'AGGREGATION',
  BalanceFixing = 'BALANCE_FIXING',
  FirstCorrectionSettlement = 'FIRST_CORRECTION_SETTLEMENT',
  SecondCorrectionSettlement = 'SECOND_CORRECTION_SETTLEMENT',
  ThirdCorrectionSettlement = 'THIRD_CORRECTION_SETTLEMENT',
  WholesaleFixing = 'WHOLESALE_FIXING'
}

export type SettlementReport = {
  __typename?: 'SettlementReport';
  /** The batch number */
  batchNumber: Scalars['ID'];
  /** The execution time. */
  executionTime?: Maybe<Scalars['DateTimeOffset']>;
  /** The grid area. */
  gridArea: GridArea;
  period?: Maybe<Scalars['DateRange']>;
  /** The process type. */
  processType: ProcessType;
};

/** How the status should be represented visually. */
export enum StatusType {
  Danger = 'danger',
  Info = 'info',
  Success = 'success',
  Warning = 'warning'
}

export type UpdatePermissionInput = {
  /** The description of the permission to update */
  description: Scalars['String'];
  /** The id of the permission to update */
  id: Scalars['Int'];
};

export type UserRole = {
  __typename?: 'UserRole';
  /** The user role description */
  description: Scalars['String'];
  /** The EIC function the user role belongs to */
  eicFunction: EicFunction;
  /** The user role id. */
  id: Scalars['ID'];
  /** The user role name. */
  name: Scalars['String'];
  /** The user role status */
  status: UserRoleStatus;
};

export enum UserRoleStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export type UserRoleWithPermissions = {
  __typename?: 'UserRoleWithPermissions';
  /** User role description. */
  description?: Maybe<Scalars['String']>;
  /** User role market role. */
  eicFunction?: Maybe<EicFunction>;
  /** User role id */
  id: Scalars['ID'];
  /** User role name */
  name: Scalars['String'];
  /** User role permissions. */
  permissions?: Maybe<Array<Maybe<Permission>>>;
  /** User role status. */
  status?: Maybe<UserRoleStatus>;
};

export type GetPermissionDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetPermissionDetailsQuery = { __typename?: 'GraphQLQuery', permission: { __typename?: 'Permission', id: number, name: string, description: string, created: string, assignableTo: Array<EicFunction>, userRoles: Array<{ __typename?: 'UserRole', id: string, name: string, description: string, eicFunction: EicFunction, status: UserRoleStatus }> } };

export type GetPermissionLogsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetPermissionLogsQuery = { __typename?: 'GraphQLQuery', permissionLogs: Array<{ __typename?: 'PermissionAuditLog', permissionId: number, changedByUserId: string, changedByUserName: string, permissionAuditLogType: PermissionAuditLogType, timestamp: string, value: string }> };

export type GetPermissionsQueryVariables = Exact<{
  searchTerm?: InputMaybe<Scalars['String']>;
}>;


export type GetPermissionsQuery = { __typename?: 'GraphQLQuery', permissions: Array<{ __typename?: 'Permission', id: number, name: string, description: string, created: string }> };

export type GetActorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActorsQuery = { __typename?: 'GraphQLQuery', actors: Array<{ __typename?: 'Actor', id: string, glnOrEicNumber: string, name: string, marketRole?: EicFunction | null, status?: ActorStatus | null }> };

export type CreateCalculationMutationVariables = Exact<{
  input: CreateCalculationInput;
}>;


export type CreateCalculationMutation = { __typename?: 'GraphQLMutation', createCalculation: { __typename?: 'Calculation', id: string } };

export type GetActorFilterQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActorFilterQuery = { __typename?: 'GraphQLQuery', actors: Array<{ __typename?: 'Actor', value: string, displayValue: string, gridAreas: Array<{ __typename?: 'GridArea', code: string }> }> };

export type GetActorsForSettlementReportQueryVariables = Exact<{
  eicFunctions?: InputMaybe<Array<EicFunction> | EicFunction>;
}>;


export type GetActorsForSettlementReportQuery = { __typename?: 'GraphQLQuery', actors: Array<{ __typename?: 'Actor', value: string, displayValue: string, gridAreas: Array<{ __typename?: 'GridArea', code: string }> }> };

export type GetCalculationQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCalculationQuery = { __typename?: 'GraphQLQuery', calculation?: { __typename?: 'Calculation', id: string, executionState: BatchState, executionTimeEnd?: string | null, executionTimeStart?: string | null, period?: { start: string, end: string} | null, statusType: StatusType, processType: ProcessType, createdByUserName: string, gridAreas: Array<{ __typename?: 'GridArea', code: string, name: string, id: string, priceAreaCode: PriceAreaCode, validFrom: string }> } | null };

export type GetCalculationsQueryVariables = Exact<{
  executionTime?: InputMaybe<Scalars['DateRange']>;
  period?: InputMaybe<Scalars['DateRange']>;
  processTypes?: InputMaybe<Array<ProcessType> | ProcessType>;
  gridAreaCodes?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  executionStates?: InputMaybe<Array<BatchState> | BatchState>;
}>;


export type GetCalculationsQuery = { __typename?: 'GraphQLQuery', calculations: Array<{ __typename?: 'Calculation', id: string, executionState: BatchState, executionTimeEnd?: string | null, executionTimeStart?: string | null, period?: { start: string, end: string} | null, statusType: StatusType, processType: ProcessType, createdByUserName: string, gridAreas: Array<{ __typename?: 'GridArea', code: string, name: string }> }> };

export type GetGridAreasQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGridAreasQuery = { __typename?: 'GraphQLQuery', gridAreas: Array<{ __typename?: 'GridArea', code: string, name: string, validTo?: string | null, validFrom: string }> };

export type GetLatestBalanceFixingQueryVariables = Exact<{
  period?: InputMaybe<Scalars['DateRange']>;
}>;


export type GetLatestBalanceFixingQuery = { __typename?: 'GraphQLQuery', calculations: Array<{ __typename?: 'Calculation', period?: { start: string, end: string} | null }> };

export type GetSettlementReportsQueryVariables = Exact<{
  period?: InputMaybe<Scalars['DateRange']>;
  executionTime?: InputMaybe<Scalars['DateRange']>;
}>;


export type GetSettlementReportsQuery = { __typename?: 'GraphQLQuery', settlementReports: Array<{ __typename?: 'SettlementReport', batchNumber: string, processType: ProcessType, period?: { start: string, end: string} | null, executionTime?: string | null, gridArea: { __typename?: 'GridArea', code: string, name: string } }> };


export const GetPermissionDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissionDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"assignableTo"}},{"kind":"Field","name":{"kind":"Name","value":"userRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eicFunction"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetPermissionDetailsQuery, GetPermissionDetailsQueryVariables>;
export const GetPermissionLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissionLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionId"}},{"kind":"Field","name":{"kind":"Name","value":"changedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"changedByUserName"}},{"kind":"Field","name":{"kind":"Name","value":"permissionAuditLogType"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<GetPermissionLogsQuery, GetPermissionLogsQueryVariables>;
export const GetPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchTerm"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}}]}}]} as unknown as DocumentNode<GetPermissionsQuery, GetPermissionsQueryVariables>;
export const GetActorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetActorsQuery, GetActorsQueryVariables>;
export const CreateCalculationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCalculation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCalculationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCalculation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateCalculationMutation, CreateCalculationMutationVariables>;
export const GetActorFilterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorFilter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"value"},"name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"displayValue"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<GetActorFilterQuery, GetActorFilterQueryVariables>;
export const GetActorsForSettlementReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorsForSettlementReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunctions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"value"},"name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","alias":{"kind":"Name","value":"displayValue"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<GetActorsForSettlementReportQuery, GetActorsForSettlementReportQueryVariables>;
export const GetCalculationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCalculation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"executionState"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeEnd"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeStart"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"statusType"}},{"kind":"Field","name":{"kind":"Name","value":"processType"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserName"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"priceAreaCode"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}}]}}]}}]}}]} as unknown as DocumentNode<GetCalculationQuery, GetCalculationQueryVariables>;
export const GetCalculationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCalculations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionTime"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"processTypes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProcessType"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCodes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionStates"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BatchState"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"executionTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionTime"}}},{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}},{"kind":"Argument","name":{"kind":"Name","value":"processTypes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"processTypes"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCodes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCodes"}}},{"kind":"Argument","name":{"kind":"Name","value":"executionStates"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionStates"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"executionState"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeEnd"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeStart"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"statusType"}},{"kind":"Field","name":{"kind":"Name","value":"processType"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserName"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetCalculationsQuery, GetCalculationsQueryVariables>;
export const GetGridAreasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"validTo"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}}]}}]}}]} as unknown as DocumentNode<GetGridAreasQuery, GetGridAreasQueryVariables>;
export const GetLatestBalanceFixingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLatestBalanceFixing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}},{"kind":"Argument","name":{"kind":"Name","value":"processTypes"},"value":{"kind":"EnumValue","value":"BALANCE_FIXING"}},{"kind":"Argument","name":{"kind":"Name","value":"executionStates"},"value":{"kind":"EnumValue","value":"COMPLETED"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}}]}}]}}]} as unknown as DocumentNode<GetLatestBalanceFixingQuery, GetLatestBalanceFixingQueryVariables>;
export const GetSettlementReportsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSettlementReports"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionTime"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settlementReports"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}},{"kind":"Argument","name":{"kind":"Name","value":"executionTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batchNumber"}},{"kind":"Field","name":{"kind":"Name","value":"processType"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"executionTime"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetSettlementReportsQuery, GetSettlementReportsQueryVariables>;

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetPermissionDetailsQuery((req, res, ctx) => {
 *   const { id } = req.variables;
 *   return res(
 *     ctx.data({ permission })
 *   )
 * })
 */
export const mockGetPermissionDetailsQuery = (resolver: ResponseResolver<GraphQLRequest<GetPermissionDetailsQueryVariables>, GraphQLContext<GetPermissionDetailsQuery>, any>) =>
  graphql.query<GetPermissionDetailsQuery, GetPermissionDetailsQueryVariables>(
    'GetPermissionDetails',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetPermissionLogsQuery((req, res, ctx) => {
 *   const { id } = req.variables;
 *   return res(
 *     ctx.data({ permissionLogs })
 *   )
 * })
 */
export const mockGetPermissionLogsQuery = (resolver: ResponseResolver<GraphQLRequest<GetPermissionLogsQueryVariables>, GraphQLContext<GetPermissionLogsQuery>, any>) =>
  graphql.query<GetPermissionLogsQuery, GetPermissionLogsQueryVariables>(
    'GetPermissionLogs',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetPermissionsQuery((req, res, ctx) => {
 *   const { searchTerm } = req.variables;
 *   return res(
 *     ctx.data({ permissions })
 *   )
 * })
 */
export const mockGetPermissionsQuery = (resolver: ResponseResolver<GraphQLRequest<GetPermissionsQueryVariables>, GraphQLContext<GetPermissionsQuery>, any>) =>
  graphql.query<GetPermissionsQuery, GetPermissionsQueryVariables>(
    'GetPermissions',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorsQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ actors })
 *   )
 * })
 */
export const mockGetActorsQuery = (resolver: ResponseResolver<GraphQLRequest<GetActorsQueryVariables>, GraphQLContext<GetActorsQuery>, any>) =>
  graphql.query<GetActorsQuery, GetActorsQueryVariables>(
    'GetActors',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateCalculationMutation((req, res, ctx) => {
 *   const { input } = req.variables;
 *   return res(
 *     ctx.data({ createCalculation })
 *   )
 * })
 */
export const mockCreateCalculationMutation = (resolver: ResponseResolver<GraphQLRequest<CreateCalculationMutationVariables>, GraphQLContext<CreateCalculationMutation>, any>) =>
  graphql.mutation<CreateCalculationMutation, CreateCalculationMutationVariables>(
    'CreateCalculation',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorFilterQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ actors })
 *   )
 * })
 */
export const mockGetActorFilterQuery = (resolver: ResponseResolver<GraphQLRequest<GetActorFilterQueryVariables>, GraphQLContext<GetActorFilterQuery>, any>) =>
  graphql.query<GetActorFilterQuery, GetActorFilterQueryVariables>(
    'GetActorFilter',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorsForSettlementReportQuery((req, res, ctx) => {
 *   const { eicFunctions } = req.variables;
 *   return res(
 *     ctx.data({ actors })
 *   )
 * })
 */
export const mockGetActorsForSettlementReportQuery = (resolver: ResponseResolver<GraphQLRequest<GetActorsForSettlementReportQueryVariables>, GraphQLContext<GetActorsForSettlementReportQuery>, any>) =>
  graphql.query<GetActorsForSettlementReportQuery, GetActorsForSettlementReportQueryVariables>(
    'GetActorsForSettlementReport',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetCalculationQuery((req, res, ctx) => {
 *   const { id } = req.variables;
 *   return res(
 *     ctx.data({ calculation })
 *   )
 * })
 */
export const mockGetCalculationQuery = (resolver: ResponseResolver<GraphQLRequest<GetCalculationQueryVariables>, GraphQLContext<GetCalculationQuery>, any>) =>
  graphql.query<GetCalculationQuery, GetCalculationQueryVariables>(
    'GetCalculation',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetCalculationsQuery((req, res, ctx) => {
 *   const { executionTime, period, processTypes, gridAreaCodes, executionStates } = req.variables;
 *   return res(
 *     ctx.data({ calculations })
 *   )
 * })
 */
export const mockGetCalculationsQuery = (resolver: ResponseResolver<GraphQLRequest<GetCalculationsQueryVariables>, GraphQLContext<GetCalculationsQuery>, any>) =>
  graphql.query<GetCalculationsQuery, GetCalculationsQueryVariables>(
    'GetCalculations',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetGridAreasQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ gridAreas })
 *   )
 * })
 */
export const mockGetGridAreasQuery = (resolver: ResponseResolver<GraphQLRequest<GetGridAreasQueryVariables>, GraphQLContext<GetGridAreasQuery>, any>) =>
  graphql.query<GetGridAreasQuery, GetGridAreasQueryVariables>(
    'GetGridAreas',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetLatestBalanceFixingQuery((req, res, ctx) => {
 *   const { period } = req.variables;
 *   return res(
 *     ctx.data({ calculations })
 *   )
 * })
 */
export const mockGetLatestBalanceFixingQuery = (resolver: ResponseResolver<GraphQLRequest<GetLatestBalanceFixingQueryVariables>, GraphQLContext<GetLatestBalanceFixingQuery>, any>) =>
  graphql.query<GetLatestBalanceFixingQuery, GetLatestBalanceFixingQueryVariables>(
    'GetLatestBalanceFixing',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetSettlementReportsQuery((req, res, ctx) => {
 *   const { period, executionTime } = req.variables;
 *   return res(
 *     ctx.data({ settlementReports })
 *   )
 * })
 */
export const mockGetSettlementReportsQuery = (resolver: ResponseResolver<GraphQLRequest<GetSettlementReportsQueryVariables>, GraphQLContext<GetSettlementReportsQuery>, any>) =>
  graphql.query<GetSettlementReportsQuery, GetSettlementReportsQueryVariables>(
    'GetSettlementReports',
    resolver
  )
