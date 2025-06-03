const API_URL = "https://localhost:5173/api";

const SERVICES = {
  USER: `${API_URL}/user/users`,
  SESSION: `${API_URL}/user/session`,
  CDN: `${API_URL}/uploads`,
  GAME: `${API_URL}/game`,
  PEOPLE: `${API_URL}/people`,
}

export const API_USER = {

  BASIC: {
    REGISTER: `${SERVICES.USER}`,
    DELETE: `${SERVICES.USER}/me`,
    INFOS: `${SERVICES.USER}/me`,
    PREFERENCES: `${SERVICES.USER}/me/preferences`,
  },
  UPDATE: {
    PREF: {
      AVATAR: `${SERVICES.USER}/me/preferences/avatar`,
      BANNER: `${SERVICES.USER}/me/preferences/banner`,
      ALL : `${SERVICES.USER}/me/preferences`,  //Toutes les preferences
      // THEME_LANG: `${SERVICES.USER}/me/preferences/theme-lang`,  //Theme et les langues:
    },  //Theme et les langues
    PASSWORD: `${SERVICES.USER}/me/password`,
    EMAIL: `${SERVICES.USER}/me/email`,
    USERNAME: `${SERVICES.USER}/me/username`,
  }
}

export const API_PEOPLE = {
  FRIENDS: `${SERVICES.PEOPLE}/friends`,
  SEARCH: `${SERVICES.PEOPLE}/`,  // ?search=inputValue
  ALL: `${SERVICES.PEOPLE}/all`,
  SELF: `${SERVICES.PEOPLE}/all/self`
};

export const API_SESSION = {

  CREATE: `${SERVICES.SESSION}`,
  DELETE: `${SERVICES.SESSION}`,
  VERIFY_ACCESS: `${SERVICES.SESSION}/verify/accessToken`,
  VERIFY_REFRESH: `${SERVICES.SESSION}/verify/refreshToken`,

  REFRESH: `${SERVICES.SESSION}/refresh`,

}

export const API_GAME = {
  ROOM_INFO: `${SERVICES.GAME}/`,
  LOCAL_CREATE: `${SERVICES.GAME}/local/init`,
  LOCAL_SEND: `${SERVICES.GAME}/local/input`,
  LOCAL_GET_STATE: `${SERVICES.GAME}/local/state`,
  CREATE: `${SERVICES.GAME}/join`,
}

export const API_CDN = {
  AVATAR: `${SERVICES.CDN}/avatar`,
  BANNER: `${SERVICES.CDN}/banner`,
}