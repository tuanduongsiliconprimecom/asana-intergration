module.exports = {
  updateAccessToken(options) {
    console.log(options);
    return Plugins.Asana.getAccessToken({
        refreshToken: options.refreshToken
      })
      .then(data => {
        return db.Asana.findOneAndUpdate({
          externalId: options.externalId
        }, {
          $set :{
            accessToken: data.access_token,
          }
        })
        .then(() => Promise.resolve(data.access_token));
      });
  }
};