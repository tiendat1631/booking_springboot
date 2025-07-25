export type LoginPayload = {
  username: string;
  password: string;
};

export type SignupPayload = LoginPayload & {
  name: string;
  email: string;
  age: number;
  phoneNum: string;
}
