export interface JwtPayload {
  sub: string;
  email: string | null;
  dni: string | null;
  role: string;
}