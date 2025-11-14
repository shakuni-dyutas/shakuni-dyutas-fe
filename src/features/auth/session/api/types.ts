interface AuthUserResponse {
  userId: string;
  email: string;
  username: string | null;
  profileImageURL: string | null;
}

export type { AuthUserResponse };
