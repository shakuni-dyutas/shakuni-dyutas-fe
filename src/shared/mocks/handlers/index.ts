import { authHandlers } from './auth';
import { healthHandlers } from './health';
import { roomsHandlers } from './rooms';

export const handlers = [...healthHandlers, ...authHandlers, ...roomsHandlers];
