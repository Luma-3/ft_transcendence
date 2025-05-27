const API_URL = "https://localhost:5173/api";

const SERVICES = {
  USER: `${API_URL}/user/users`,
  SESSION: `${API_URL}/user/session`,
  GAME: `${API_URL}/game`,
}

export const API_USER = {

  BASIC: {
    REGISTER: `${SERVICES.USER}`,
    DELETE: `${SERVICES.USER}/me`,
    INFOS: `${SERVICES.USER}/me`,
    PREFERENCES: `${SERVICES.USER}/me/preferences`,
  },
  UPDATE: {
    PREF: `${SERVICES.USER}/me/preferences`,  //Theme et les langues
    PASSWORD: `${SERVICES.USER}/me/password`,
    EMAIL: `${SERVICES.USER}/me/email`,
    USERNAME: `${SERVICES.USER}/me/username`,
  }
}

export const API_SESSION = {

  CREATE: `${SERVICES.SESSION}`,
  DELETE: `${SERVICES.SESSION}`,
  VERIFY_ACCESS: `${SERVICES.SESSION}/verify/accessToken`,
  VERIFY_REFRESH: `${SERVICES.SESSION}/verify/refreshToken`,

  REFRESH: `${SERVICES.SESSION}/refresh`,

}

export const API_GAME = {
  LOCAL_CREATE: `${SERVICES.GAME}/local/init`,
  LOCAL_SEND: `${SERVICES.GAME}/local/input`,
  LOCAL_GET_STATE: `${SERVICES.GAME}/local/state`,
  CREATE: `${SERVICES.GAME}/games`,
}

