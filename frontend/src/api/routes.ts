const API_URL = "https://localhost:5173/api";

const SERVICES = {
  USER: `${API_URL}/user/users`,
  USER_ROOT: `${API_URL}/user`,
  SESSION: `${API_URL}/auth/session`,
  CDN: `/api/uploads`,
  GAME: `${API_URL}/game`,
  PEOPLE: `${API_URL}/people`,
  TWOFA: `${API_URL}/auth/2fa`
}

export const API_USER = {

  BASIC: {
    BASIC: `${SERVICES.USER}`,
    REGISTER: `${SERVICES.USER}`,
    DELETE: `${SERVICES.USER}/me`,
    INFOS: `${SERVICES.USER}/me`,
    PREFERENCES: `${SERVICES.USER}/me?includePreferences=true`,
    ONLY_PREFERENCES: `${SERVICES.USER}/me/preferences`,
  
  },
  UPDATE: {
    PREF: {
      AVATAR: `${SERVICES.USER}/me/preferences/avatar`,
      BANNER: `${SERVICES.USER}/me/preferences/banner`,
      ALL : `${SERVICES.USER}/me/preferences`,  //Toutes les preferences (theme, langues, avatar, banner)
    },
    PASSWORD: `${SERVICES.USER}/me/password`,
    EMAIL: `${SERVICES.USER}/me/email`,
    USERNAME: `${SERVICES.USER}/me/username`,
  },
  SOCIAL: {
    FRIENDS: `${SERVICES.USER_ROOT}/friends`,
    BLOCKED: `${SERVICES.USER_ROOT}/blocked`,
    NOTIFICATIONS: `${SERVICES.USER_ROOT}/pending`,
  },
  SEARCH: `${SERVICES.USER_ROOT}/search`, // ?q=inputValue&page=1&limit=10&hydrate=true

  TWOFA: `${SERVICES.USER}/2fa`,
}

export const API_SESSION = {

  CREATE: `${SERVICES.SESSION}`,
  DELETE: `${SERVICES.SESSION}`,
  VERIFY_ACCESS: `${SERVICES.SESSION}/accessToken`,
  VERIFY_REFRESH: `${SERVICES.SESSION}/verify/refreshToken`,
  TWOFA_SESSION:  `${SERVICES.SESSION}/2fa`,
  REFRESH: `${SERVICES.SESSION}/refresh`,
}

export const API_GAME = {
  ROOM_INFO: `${SERVICES.GAME}/rooms/`,
  LOCAL_CREATE: `${SERVICES.GAME}/local/init`,
  LOCAL_SEND: `${SERVICES.GAME}/local/input`,
  LOCAL_GET_STATE: `${SERVICES.GAME}/local/state`,
  CREATE: `${SERVICES.GAME}/rooms/join`,
}

export const API_CDN = {
  AVATAR: `${SERVICES.CDN}/avatar`,
  BANNER: `${SERVICES.CDN}/banner`,
}

export const MODULE_TWOFA = {
  RESEND_EMAIL: `${SERVICES.TWOFA}/resendVerifEmail`,
  VERIFY: {
      EMAIL: `${SERVICES.TWOFA}/email`,
      TWOFA: `${SERVICES.TWOFA}/code`,
  },
}