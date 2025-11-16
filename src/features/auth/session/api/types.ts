interface AuthUserResponse {
  userId: string;
  email: string;
  username: string | null;
  profileImageURL: string | null;
  points?: number;
  rank?: number;
  debates?: number;
  wins?: number;
  loses?: number;
}

export type { AuthUserResponse };
