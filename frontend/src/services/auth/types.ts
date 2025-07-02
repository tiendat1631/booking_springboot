export type LoginPayload = {
  username: string;
  password: string;
};

export type SignupPayload = LoginPayload & {
  email: string;
}
