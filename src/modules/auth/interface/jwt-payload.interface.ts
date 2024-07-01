export interface JwtPayload {
  exp: string;
  iat: string;
  aud: string;
  iss: string;
  sub: string;
  auth_time: string;
}
