export abstract class DatabaseConstants {
  static readonly DATA_SOURCE = 'DATA_SOURCE';
  static readonly USER_REPOSITORY = 'USER_REPOSITORY';
}

export abstract class SystemConfigConstants {
  static readonly SALT_ROUNDS = process.env.SALT_ROUNDS || 10;
  static readonly JWT_SECRET = process.env.JWT_SECRET || 'secret change me';
  static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
}

export abstract class ErrorConstants {
  static readonly UNIQUE_CONSTRAINT = '23505';
}
