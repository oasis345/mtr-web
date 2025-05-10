export const API_ROUTES = {
  USER: {
    PROFILE: {
      url: "/user/profile",
      method: "GET",
    },
    UPDATE_NAME: {
      url: "/user/name",
      method: "PATCH",
    },
    UPDATE: {
      url: "/user/profile",
      method: "PUT",
    },
    UPDATE_PHONE: {
      url: "/user/phone",
      method: "PATCH",
    },
    PUBLIC_PROFILE: {
      url: "/user/:userId",
      method: "GET",
    },
  },
} as const;
