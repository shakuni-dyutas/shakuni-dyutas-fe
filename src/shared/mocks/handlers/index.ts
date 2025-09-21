import { HttpResponse, http } from 'msw';

export const handlers = [http.get('/api/health', () => HttpResponse.json({ status: 'ok' }))];
