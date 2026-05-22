export interface SignupDto {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface SignupResult {
  name: string;
  email: string;
  role: string;
}
