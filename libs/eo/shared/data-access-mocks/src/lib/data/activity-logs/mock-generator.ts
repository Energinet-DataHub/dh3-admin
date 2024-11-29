import { endOfToday, getUnixTime, startOfToday, subDays } from 'date-fns';

const actorId = 'ACTOR_ID';
const actorName = 'ACTOR_NAME';
const organizationName = 'ORGANIZATION_NAME';
const otherOrganizationName = 'OTHER_ORGANIZATION_NAME';
const actorTypes = ['System', 'User'];
const actionTypes = [
  'Created',
  'Accepted',
  'Declined',
  'Activated',
  'Deactivated',
  'EndDateChanged',
  'Expired',
];

export type entityType = 'MeteringPoint' | 'TransferAgreementProposal' | 'TransferAgreement';
export function generateCombinations(
  entityTypes: entityType[] = [],
  type: 'sender' | 'receiver' = 'sender'
) {
  const combinations = [];

  for (const actorType of actorTypes) {
    for (const entityType of entityTypes) {
      for (const actionType of actionTypes) {
        const combination = generateCombination(actorType, entityType, actionType, type);
        combinations.push(combination);
      }
    }
  }

  return combinations.map((x, index) => {
    if (index !== 0) return x;
    return {
      ...x,
      timestamp: last30Days().end,
    };
  });
}

function generateCombination(
  actorType: string,
  entityType: string,
  actionType: string,
  type: 'sender' | 'receiver'
) {
  return {
    id: generateUUID(),
    timestamp: generateTimestamp(),
    actorId,
    actorType,
    actorName: type === 'sender' ? actorName : null,
    organizationTin: '11223344',
    organizationName,
    otherOrganizationTin: '44332211',
    otherOrganizationName,
    entityType,
    actionType,
    entityId: generateUUID(),
  };
}

function generateUUID() {
  return 'c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd';
}

function last30Days(): { start: number; end: number } {
  return {
    start: getUnixTime(subDays(startOfToday(), 30)), // 30 days ago at 00:00
    end: getUnixTime(endOfToday()), // Today at 23:59:59
  };
}

function generateTimestamp(): number {
  const last30DaysRange = last30Days();
  return Math.floor(
    Math.random() * (last30DaysRange.end - last30DaysRange.start) + last30DaysRange.start
  );
}
