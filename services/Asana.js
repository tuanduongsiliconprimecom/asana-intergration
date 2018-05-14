module.exports = {
  updateAccessToken(options) {
    return Plugins.Asana.getAccessToken({
        refreshToken: options.refreshToken
      })
      .then(data => {
        return db.Asana.findOneAndUpdate({
          UID: options.UID
        }, {
          accessToken: data.access_token,
        })
        .then(() => Promise.resolve(data.access_token));
      });
  }
};