import * as bcrypt from 'bcrypt';

export default function comparePasswords(
  password: string,
  hashedPassword: string,
): boolean {
  return bcrypt.compareSync(password, hashedPassword);
}
