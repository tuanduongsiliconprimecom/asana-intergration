const rp = require('request-promise');
module.exports = {
  init() {
    this.options = {
      json: true,
    };
    return Promise.resolve();
  },
  getAuthUrl(options) {
    return `https://app.asana.com/-/oauth_authorize?client_id=${process.env.ASANA_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.ASANA_REDIRECT_URI)}&response_type=code&state=${options.externalId}`;
  },
  getAccessToken(options) {
    const form = {
      grant_type: (options.refreshToken) ? 'refresh_token' : 'authorization_code',
      client_id: process.env.ASANA_CLIENT_ID,
      client_secret: process.env.ASANA_CLIENT_SECRET,
      redirect_uri: process.env.ASANA_REDIRECT_URI,
    };
    if(options.refreshToken) {
      form.refresh_token = options.refreshToken;
    }else {
      form.code = options.code;
    }
    const newOptions = Object.assign({}, this.options, {
      method: 'POST',
      uri: 'https://app.asana.com/-/oauth_token',
      headers: {
        'Content-Type': 'application/json',
      },
      form: form,
      json: true
    });
    return rp(newOptions);
  },
  listProject(options){
    const { token } = options;
    const newOptions = Object.assign({}, this.options, {
      method: 'get',
      baseUrl: `https://app.asana.com/api/1.0`,
      uri: '/projects',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      json: true
    });
    return rp(newOptions);
  }
};