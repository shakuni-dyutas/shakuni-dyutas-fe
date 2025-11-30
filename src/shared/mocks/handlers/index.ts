import { authHandlers } from './auth';
import { healthHandlers } from './health';
import { roomResultHandlers } from './room-result';
import { roomsHandlers } from './rooms';
import { trialHistoriesHandlers } from './trial-histories';

export const handlers = [
  ...healthHandlers,
  ...authHandlers,
  ...roomsHandlers,
  ...roomResultHandlers,
  ...trialHistoriesHandlers,
];
