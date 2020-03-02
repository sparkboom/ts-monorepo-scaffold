export type Check = 'jwt' | 'config';
export type JwtError = 'APP_CHECK__JWT_UNAVAILABLE' | 'APP_CHECK__JWT_INVALID';
export type ConfigError = 'APP_CHECK__CONFIG_LOAD_FAIL';
export type CheckStatus = 'APP_CHECK__INIT' | 'APP_CHECK__IN_PROGRESS' | 'APP_CHECK__SUCCESS' | 'APP_CHECK__FAIL';
export type CheckValue<T> = {
  status: 'APP_CHECK__INIT' | 'APP_CHECK__IN_PROGRESS' | 'APP_CHECK__SUCCESS';
  errors: T[];
};

export type App = {
  checks: {
    jwt: CheckValue<JwtError>;
    config: CheckValue<ConfigError>;
  };
};
