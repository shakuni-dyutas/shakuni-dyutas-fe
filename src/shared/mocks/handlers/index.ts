import { authHandlers } from './auth';
import { healthHandlers } from './health';
import { rankingHandlers } from './rankings';
import { roomsHandlers } from './rooms';
import { trialHistoriesHandlers } from './trial-histories';

export const handlers = [
  ...healthHandlers,
  ...authHandlers,
  ...rankingHandlers,
  ...roomsHandlers,
  ...trialHistoriesHandlers,
];
