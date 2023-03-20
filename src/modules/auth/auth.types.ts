export type RequestGuard = {
  userId: number;
};

export type RefreshBody = {
  userId: number;
  token: string;
};
