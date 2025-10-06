import { create } from 'zustand';

type SessionUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
};

type SessionSnapshot = {
  accessToken: string;
  user: SessionUser;
};

type SessionState = {
  accessToken: string | null;
  user: SessionUser | null;
  isAuthenticated: boolean;
  setSession: (snapshot: SessionSnapshot) => void;
  setAccessToken: (accessToken: string) => void;
  clearSession: () => void;
};

const useSessionStore = create<SessionState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  setSession: ({ accessToken, user }) =>
    set({
      accessToken,
      user,
      isAuthenticated: true,
    }),
  setAccessToken: (accessToken) =>
    set((state) => ({
      accessToken,
      isAuthenticated: Boolean(accessToken && state.user),
    })),
  clearSession: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    }),
}));

export type { SessionSnapshot, SessionUser };
export { useSessionStore };
