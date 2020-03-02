export const salescloudCapabilities = {
  leadIngestionTask: {
    destination: {
      marketingCloud: {
        dataExtension: false,
      },
      salesCloud: {
        leadObject: true,
      },
    },
  },
};

export const marketingcloudCapabilities = {
  leadIngestionTask: {
    destination: {
      marketingCloud: {
        dataExtension: true,
      },
      salesCloud: {
        leadObject: false,
      },
    },
  },
};
