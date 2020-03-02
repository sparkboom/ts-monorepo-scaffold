export const persistRehydrateWithToken = {
  type: 'persist/REHYDRATE',
  payload: {
    api: {
      token: {
        jwt: 'PERSISTED_TOKEN',
        expiryTimeStamp: 1571615706078,
        expiresInSeconds: 3311.836,
      },
    },
    _persist: {
      version: -1,
      rehydrated: true,
    },
  },
  key: '%%APP_NAME%%',
};

export const persistRehydrateNoToken = {
  type: 'persist/REHYDRATE',
  payload: {
    api: {
      token: {},
    },
    _persist: {
      version: -1,
      rehydrated: true,
    },
  },
  key: '%%APP_NAME%%',
};
