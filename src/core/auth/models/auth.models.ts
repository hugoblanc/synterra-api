export interface PostForgotPassword {
  password: string;
  token: string;
}

export interface ForgotTarget {
  email: string;
}

export interface UpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export interface Credentials {
  email: string;
  password: string;
  savePassword: boolean;
}
