const marketParticipantSubPaths = {
  actorsPath: 'actors',
  organizationsPath: 'organizations',
  marketRolesPath: 'market-roles',
} as const;

const eSettSubPaths = {
  outgoingMessagesPath: 'outgoing-messages',
  meteringGridareaImbalancePath: 'metering-gridarea-imbalance',
  imbalanceResponsiblePartiesPath: 'balance-responsible',
} as const;

const adminSubPaths = {
  users: 'users',
  roles: 'roles',
  permissions: 'permissions',
} as const;

const wholesaleSubPaths = {
  requestCalculation: 'request-calculation',
  calculations: 'calculations',
  settlementReports: 'settlement-reports',
} as const;

const basePaths = {
  marketParticipantBasePath: 'market-participant',
  messageArchiveBasePath: 'message-archive',
  esettBasePath: 'esett',
  admin: 'admin',
  imbalancPrices: 'imbalance-prices',
  gridAreas: 'grid-areas',
  wholesale: 'wholesale',
  login: 'login',
} as const;

export type MarketParticipantSubPaths =
  (typeof marketParticipantSubPaths)[keyof typeof marketParticipantSubPaths];

export type BasePaths = (typeof basePaths)[keyof typeof basePaths];

export type ESettSubPaths = (typeof eSettSubPaths)[keyof typeof eSettSubPaths];

export type WholesaleSubPaths = (typeof wholesaleSubPaths)[keyof typeof wholesaleSubPaths];

export type AdminSubPaths = (typeof adminSubPaths)[keyof typeof adminSubPaths];

type SubPaths = MarketParticipantSubPaths | ESettSubPaths | WholesaleSubPaths | AdminSubPaths;

export const getPath = <T extends BasePaths | SubPaths>(route: T) => route;

export const combinePaths = <T extends SubPaths, Y extends BasePaths>(basePath: Y, path: T) =>
  `/${basePath}/${path}`;
