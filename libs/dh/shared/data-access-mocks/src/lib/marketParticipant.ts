/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { http, delay, HttpResponse } from 'msw';

import {
  Actor,
  GetActorEditableFieldsQuery,
  ActorStatus,
  EicFunction,
  Organization,
  mockGetActorByIdQuery,
  mockGetActorEditableFieldsQuery,
  mockGetActorsByOrganizationIdQuery,
  mockGetActorsQuery,
  mockGetOrganizationByIdQuery,
  mockGetOrganizationsQuery,
  mockUpdateOrganizationMutation,
  UpdateOrganizationMutation,
  mockGetAuditLogByOrganizationIdQuery,
  mockGetAuditLogByActorIdQuery,
  mockGetGridAreaOverviewQuery,
  mockCreateMarketParticipantMutation,
  mockGetAssociatedActorsQuery,
  OrganizationAuditedChangeAuditLogDto,
  OrganizationAuditedChange,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  MarketParticipantActorClientSecretDto,
  MarketParticipantActorCredentialsDto,
} from '@energinet-datahub/dh/shared/domain';

import organizationsData from './data/marketParticipantOrganizations.json';
import { marketParticipantOrganizationsWithActors } from './data/marketParticipantOrganizationsWithActors';
import gridAreaData from './data/marketParticipantGridArea.json';
import gridAreaOverviewData from './data/marketParticipantGridAreaOverview.json';
import actorData from './data/marketPaticipantActor.json';
import actorContactsData from './data/marketPaticipantActorContacts.json';
import organizationData from './data/marketPaticipantOrganization.json';
import userRoleData from './data/marketParticipantUserRoleTemplates.json';
import { marketParticipantActors } from './data/market-participant-actors';
import { getOrganizationsQueryMock } from './data/market-participant-organizations';
import { getActorAuditLogsMock } from './data/get-actor-audit-logs';
import { getGridAreaOverviewMock } from './data/get-grid-area-overview';

const delayMs = 300;

export function marketParticipantMocks(apiBase: string) {
  return [
    getOrganizations_REST(apiBase),
    getAllOrganizationsWithActors(apiBase),
    getMarketParticipantGridArea(apiBase),
    getMarketParticipantGridAreaOverview(apiBase),
    getActor(apiBase),
    getActorContact(apiBase),
    getOrganization(apiBase),
    getUserRoles(apiBase),
    getActors(),
    getActorById(),
    getActorEditableFields(),
    getOrganizations_GrahpQL(),
    getOrganizationById(),
    getActorByOrganizationId(),
    updateOrganization(),
    getAuditLogByOrganizationId(),
    getAuditLogByActorId(),
    getMarketParticipantActorActorCredentials(apiBase),
    marketParticipantActorAssignCertificateCredentials(apiBase),
    marketParticipantActorRemoveActorCredentials(apiBase),
    marketParticipantActorRequestClientSecretCredentials(apiBase),
    getGridAreaOverview(),
    createMarketParticipant(),
    getAssociatedActors(),
  ];
}

function getOrganizations_REST(apiBase: string) {
  return http.get(`${apiBase}/v1/MarketParticipant/Organization/GetAllOrganizations`, async () => {
    await delay(delayMs);

    return HttpResponse.json(organizationsData);
  });
}

function getAllOrganizationsWithActors(apiBase: string) {
  return http.get(
    `${apiBase}/v1/MarketParticipant/Organization/GetAllOrganizationsWithActors`,
    async () => {
      await delay(delayMs);

      return HttpResponse.json(marketParticipantOrganizationsWithActors);
    }
  );
}

function getOrganization(apiBase: string) {
  return http.get(
    `${apiBase}/v1/MarketParticipant/Organization/GetOrganization`,
    async ({ params }) => {
      const { orgId } = params;
      const organizationDataWithUpdatedId = {
        ...organizationData,
        orgId,
      };

      await delay(delayMs);

      return HttpResponse.json(organizationDataWithUpdatedId);
    }
  );
}

function getMarketParticipantGridArea(apiBase: string) {
  return http.get(`${apiBase}/v1/MarketParticipantGridArea/GetAllGridAreas`, async () => {
    await delay(delayMs);

    return HttpResponse.json(gridAreaData);
  });
}

function getMarketParticipantGridAreaOverview(apiBase: string) {
  return http.get(`${apiBase}/v1/MarketParticipantGridAreaOverview/GetAllGridAreas`, async () => {
    await delay(delayMs);

    return HttpResponse.json(gridAreaOverviewData);
  });
}

function getActor(apiBase: string) {
  return http.get(`${apiBase}/v1/MarketParticipant/Organization/GetActor`, async ({ params }) => {
    const { actorId } = params;
    const actorDataWithUpdatedId = {
      ...actorData,
      actorId,
    };

    await delay(delayMs);

    return HttpResponse.json(actorDataWithUpdatedId);
  });
}

function getActorContact(apiBase: string) {
  return http.get(`${apiBase}/v1/MarketParticipant/Organization/GetContacts`, async () => {
    await delay(delayMs);

    return HttpResponse.json(actorContactsData);
  });
}

function getUserRoles(apiBase: string) {
  return http.get(`${apiBase}/v1/MarketParticipantUserRoleTemplate/users`, async () => {
    await delay(delayMs);

    return HttpResponse.json(userRoleData);
  });
}

function getActors() {
  return mockGetActorsQuery(async () => {
    await delay(delayMs);

    return HttpResponse.json({ data: { __typename: 'Query', actors: marketParticipantActors } });
  });
}

function getActorById() {
  return mockGetActorByIdQuery(async ({ variables }) => {
    const { id } = variables;
    const actorById = marketParticipantActors.find((a) => a.id === id) as Actor;

    await delay(delayMs);

    return HttpResponse.json({ data: { __typename: 'Query', actorById } });
  });
}

function getActorEditableFields() {
  return mockGetActorEditableFieldsQuery(async () => {
    const query: GetActorEditableFieldsQuery = {
      __typename: 'Query',
      actorById: {
        __typename: 'Actor',
        name: 'Test Actor 1',
        organization: {
          __typename: 'Organization',
          domain: 'fake-domain.dk',
        } as Organization,
        contact: {
          __typename: 'ActorContactDto',
          name: 'Test Department',
          email: 'test-actor@fake-domain.dk',
          phone: '11223344',
        },
      },
    };

    await delay(delayMs);

    return HttpResponse.json({ data: query });
  });
}

function getOrganizations_GrahpQL() {
  return mockGetOrganizationsQuery(async () => {
    await delay(delayMs);

    return HttpResponse.json({ data: getOrganizationsQueryMock });
  });
}

function getOrganizationById() {
  return mockGetOrganizationByIdQuery(async ({ variables }) => {
    const { id } = variables;

    const organizationById = getOrganizationsQueryMock.organizations.find(
      (a) => a.organizationId === id
    ) as Organization;

    await delay(delayMs);

    return HttpResponse.json({ data: { __typename: 'Query', organizationById } });
  });
}

function getActorByOrganizationId() {
  return mockGetActorsByOrganizationIdQuery(async ({ variables }) => {
    const { organizationId } = variables;

    const actors: Actor[] = [
      {
        __typename: 'Actor',
        id: '801011ea-a291-41f7-be19-581abc05a5ac',
        glnOrEicNumber: '5790000555465',
        name: 'Inactive balance responsible',
        gridAreas: [],
        marketRole: EicFunction.BalanceResponsibleParty,
        status: ActorStatus.Inactive,
        organization: {
          __typename: 'Organization',
          organizationId: organizationId,
          name: '',
        } as Organization,
      },
      {
        __typename: 'Actor',
        id: '9c3be101-1471-4a1a-8f52-ddb619778f8f',
        glnOrEicNumber: '5790000555466',
        name: 'Active energy supplier',
        gridAreas: [],
        marketRole: EicFunction.EnergySupplier,
        status: ActorStatus.Active,
        organization: {
          __typename: 'Organization',
          organizationId: organizationId,
          name: '',
        } as Organization,
      },
    ];

    await delay(delayMs);

    return HttpResponse.json({ data: { __typename: 'Query', actorsByOrganizationId: actors } });
  });
}

function updateOrganization() {
  return mockUpdateOrganizationMutation(async () => {
    const response: UpdateOrganizationMutation = {
      __typename: 'Mutation',
      updateOrganization: {
        __typename: 'UpdateOrganizationPayload',
        errors: [],
        boolean: true,
      },
    };

    await delay(delayMs);

    return HttpResponse.json({ data: response });
  });
}

function getAuditLogByOrganizationId() {
  return mockGetAuditLogByOrganizationIdQuery(async () => {
    const auditLog: OrganizationAuditedChangeAuditLogDto[] = [
      {
        __typename: 'OrganizationAuditedChangeAuditLogDto',
        auditedBy: 'Jane Doe',
        isInitialAssignment: false,
        currentValue: 'energinet.dk',
        previousValue: null,
        change: OrganizationAuditedChange.Domain,
        timestamp: new Date('2021-09-05T10:00:00'),
      },
      {
        __typename: 'OrganizationAuditedChangeAuditLogDto',
        auditedBy: 'Jane Doe',
        isInitialAssignment: false,
        currentValue: 'Grøn Strøm',
        previousValue: null,
        change: OrganizationAuditedChange.Name,
        timestamp: new Date('2021-09-06T10:00:00'),
      },
    ];

    await delay(delayMs);

    return HttpResponse.json({ data: { __typename: 'Query', organizationAuditLogs: auditLog } });
  });
}

function getAuditLogByActorId() {
  return mockGetAuditLogByActorIdQuery(async () => {
    await delay(delayMs);

    return HttpResponse.json({ data: getActorAuditLogsMock });
  });
}

function getMarketParticipantActorActorCredentials(apiBase: string) {
  const response: MarketParticipantActorCredentialsDto = {
    certificateCredentials: undefined,
    clientSecretCredentials: {
      clientSecretIdentifier: 'client-secret-identifier-value',
      expirationDate: '2020-09-30T12:00:00',
    },
  };

  return http.get(`${apiBase}/v1/MarketParticipantActor/GetActorCredentials`, async () => {
    await delay(delayMs);

    return HttpResponse.json(response);
  });
}

function marketParticipantActorAssignCertificateCredentials(apiBase: string) {
  return http.post(
    `${apiBase}/v1/MarketParticipantActor/AssignCertificateCredentials`,
    async () => {
      await delay(delayMs);

      return new HttpResponse(null, { status: 200 });
    }
  );
}

function marketParticipantActorRemoveActorCredentials(apiBase: string) {
  return http.delete(`${apiBase}/v1/MarketParticipantActor/RemoveActorCredentials`, async () => {
    await delay(delayMs);

    return new HttpResponse(null, { status: 200 });
  });
}

function marketParticipantActorRequestClientSecretCredentials(apiBase: string) {
  return http.post(
    `${apiBase}/v1/MarketParticipantActor/RequestClientSecretCredentials`,
    async () => {
      const clientSecret = 'random-secret-XEi33WhFi8qwnCzrnlf';

      const response: MarketParticipantActorClientSecretDto = {
        secretText: clientSecret,
      };

      await delay(delayMs);

      return HttpResponse.json(response);
    }
  );
}

function getGridAreaOverview() {
  return mockGetGridAreaOverviewQuery(async () => {
    await delay(delayMs);

    return HttpResponse.json({ data: getGridAreaOverviewMock });
  });
}

function createMarketParticipant() {
  return mockCreateMarketParticipantMutation(async () => {
    await delay(delayMs);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        createMarketParticipant: {
          __typename: 'CreateMarketParticipantPayload',
          success: true,
          errors: [],
        },
      },
    });
  });
}

function getAssociatedActors() {
  return mockGetAssociatedActorsQuery(async ({ variables }) => {
    const email = variables.email;

    await delay(delayMs);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        associatedActors: {
          __typename: 'AssociatedActors',
          email: email,
          actors: email === 'testuser1@test.dk' ? ['00000000-0000-0000-0000-000000000001'] : [],
        },
      },
    });
  });
}
