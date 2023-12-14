import * as bcrypt from 'bcrypt';
import { SystemConfigConstants } from '../constants';

export default function hashPassword(password: string): string {
  return bcrypt.hashSync(password, SystemConfigConstants.SALT_ROUNDS);
}
