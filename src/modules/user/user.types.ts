export type UserType = {
  id: number;
  email: string;
  password: string;
  fullName: string;
};

export type CreateUserType = {
  email: string;
  password: string;
  fullName: string;
};

export type UpdateUserType = {
  id: string;
  email: string;
  fullName: string;
};

export type UpdateUserPasswordType = {
  id: number;
  password: string;
  newPassword: string;
};
