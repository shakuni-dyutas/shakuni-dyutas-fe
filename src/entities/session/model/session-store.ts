import { create } from 'zustand';

type SessionUser = {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl?: string | null;
};

type SessionSnapshot = {
  accessToken: string;
  user: SessionUser;
};

type SessionState = {
  accessToken: string | null;
  user: SessionUser | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  setSession: (snapshot: SessionSnapshot) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: SessionUser | null) => void;
  setBootstrapping: (isBootstrapping: boolean) => void;
  clearSession: () => void;
};

const useSessionStore = create<SessionState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isBootstrapping: true,
  setSession: ({ accessToken, user }) =>
    set({
      accessToken,
      user,
      isAuthenticated: true,
    }),
  setAccessToken: (accessToken) =>
    set(() => ({
      accessToken,
      isAuthenticated: Boolean(accessToken),
    })),
  setUser: (user) => set({ user }),
  setBootstrapping: (isBootstrapping) => set({ isBootstrapping }),
  clearSession: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isBootstrapping: false,
    }),
}));

export type { SessionSnapshot, SessionUser };
export { useSessionStore };
