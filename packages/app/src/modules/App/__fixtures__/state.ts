export const initialAppState = (check: string, status = 'APP_CHECK__INIT', errors: string[] = []) => ({
  app: {
    checks: {
      [check]: {
        status,
        errors,
      },
    },
  },
});
