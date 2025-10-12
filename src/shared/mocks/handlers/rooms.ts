import { delay, HttpResponse, http } from 'msw';

const ROOM_CREATE_ENDPOINT = '*/rooms';
const ROOM_CREATION_DELAY_MS = 1000;

export const roomsHandlers = [
  http.post(ROOM_CREATE_ENDPOINT, async ({ request }) => {
    const body = (await request.json()) as {
      title?: string;
    };

    if (!body.title) {
      return HttpResponse.json(
        { message: '방 제목이 필요해요.' },
        {
          status: 400,
        },
      );
    }

    await delay(ROOM_CREATION_DELAY_MS);

    return HttpResponse.json(
      {
        roomId: 'room-1234',
        redirectPath: '/rooms/room-1234',
      },
      { status: 201 },
    );
  }),
];
