import { google } from 'googleapis';
import crypto from 'crypto';
import { QueryCallbackType } from './oauth2.schema';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
]

const state = crypto.randomBytes(32).toString('hex');

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: 'online',
  scope: scopes,
  include_granted_scopes: true,
  state: state,
})

export class Oauth2Service {
  static getGoogleAuthUrl() {
    console.log('URL: ', authorizationUrl);
    return authorizationUrl;
  }

  static async callback(query: QueryCallbackType) {
    if (query.error) {
      throw new Error(`Error during OAuth2 callback: ${query.error}`);
    }
    else if (query.state !== state) {
      throw new Error('State mismatch during OAuth2 callback, potential CSRF attack');
    }
    console.log('State matches, proceeding with OAuth2 callback');
    const { tokens } = await oauth2Client.getToken(query.code);
    return tokens;
  }
}
