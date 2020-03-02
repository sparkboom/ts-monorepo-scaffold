export const intialRouterState = (jwt: string | null, expiresInSeconds: number): any => ({
  router: {
    location: {
      search: `?jwt=${jwt}&expiresInSeconds=${expiresInSeconds}`,
    },
  },
});

export const initialApiState = (token: any): any => ({
  api: {
    token,
  },
});
