export enum UsersRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  INSTALLER = 'installer',
}
export default interface IJwtPayload {
  email: string;
  role: UsersRole;
}
