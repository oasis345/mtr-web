export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface User {
  id: string;
  socialId: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  name?: string | null;
  provider: string;
  role: Role;
}
