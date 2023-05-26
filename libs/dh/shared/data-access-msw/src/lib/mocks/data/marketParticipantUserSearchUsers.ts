import { MarketParticipantUserOverviewResultDto } from '@energinet-datahub/dh/shared/domain';

export const marketParticipantUserSearchUsers: MarketParticipantUserOverviewResultDto = {
  totalUserCount: 4,
  users: [
    {
      id: '3ec41d91-fc6d-4364-ade6-b85576a91d04',
      email: 'testuser1@test.dk',
      firstName: 'Test',
      lastName: 'User 1',
      phoneNumber: '+45 12345678',
      createdDate: '2022-01-01T23:00:00Z',
      status: 'Active',
      assignedActors: [],
    },
    {
      id: 'f73d05cd-cb00-4be3-89b2-115c8425b837',
      email: 'testuser2@test.dk',
      firstName: 'Test',
      lastName: 'User 2',
      phoneNumber: null,
      createdDate: '2022-06-01T22:00:00Z',
      status: 'Inactive',
      assignedActors: [],
    },
    {
      id: '48a2b6f0-59a8-4ef1-87e2-15e8c93fbe3b',
      email: 'testuser3@test.dk',
      firstName: 'Test',
      lastName: 'User 3',
      phoneNumber: '+45 87654321',
      createdDate: '2022-07-01T22:00:00Z',
      status: 'Active',
      assignedActors: [],
    },
    {
      id: '8c2cf14f-05ec-44d8-91a8-e5ccbe108e5e',
      email: 'testuser4@test.dk',
      firstName: 'Test',
      lastName: 'User 4',
      phoneNumber: null,
      createdDate: '2022-12-01T23:00:00Z',
      status: 'Inactive',
      assignedActors: [],
    },
  ],
};
