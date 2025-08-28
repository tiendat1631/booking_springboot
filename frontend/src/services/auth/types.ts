export type LoginPayload = {
  username: string;
  password: string;
};

export type SignupPayload = LoginPayload & {
  name: string;
  email: string;
  age: number;
}

export type LoginResponse = {
  accessToken: string;
  user: UserResponse;
};


export type UserResponse = {
  id: string;
  username: string;
  email: string;
}
