/**
 * DOC: https://oauth2-server.readthedocs.io/en/latest/api/oauth2-server.html#new-oauth2server-options
 */

const
  addAcceptedScopesHeader = true,
  addAuthorizedScopesHeader = true,
  allowBearerTokensInQueryString = false,
  authorizationCodeLifetime = 300, // default = 5 minutes, 300 sec
  accessTokenLifetime = 3600, // default = 1 hour, 3600 se
  refreshTokenLifetime = 1209600, // default = 2 weeks, 1209600 sec
  allowExtendedTokenAttributes = false,
  requireClientAuthentication = true,
  alwaysIssueNewRefreshToken = true,
  extendedGrantTypes = {},
  scopes = undefined,
  grants = [
    'authorization_code', // WIP
    'password',
    'refresh_token',
    'client_credentials',
  ]

export default {
  options: {
    // The supplied options will be used as default for the other methods.
    server: {
      addAcceptedScopesHeader,
      addAuthorizedScopesHeader,
      allowBearerTokensInQueryString,
      authorizationCodeLifetime,
      accessTokenLifetime,
      refreshTokenLifetime,
      allowExtendedTokenAttributes,
      requireClientAuthentication,
      alwaysIssueNewRefreshToken,
      extendedGrantTypes,
      scopes,
    },
    // Options by handler methods:
    authenticate: {
      addAcceptedScopesHeader,
      addAuthorizedScopesHeader,
      allowBearerTokensInQueryString,
    },
    authorize: {
      authorizationCodeLifetime,
      accessTokenLifetime,
    },
    token: {
      accessTokenLifetime,
      refreshTokenLifetime,
      allowExtendedTokenAttributes,
      requireClientAuthentication,
      alwaysIssueNewRefreshToken,
      extendedGrantTypes,
    },
  },
  grants,
}
