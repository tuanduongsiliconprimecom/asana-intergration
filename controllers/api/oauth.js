const OauthController = {
  getOauthUrl(req, res, next) {
    const url = Plugins.Asana.getAuthUrl({
      externalId: req.query.externalId
    });
    return res.send({
      statusCode: 200,
      success: true,
      data: {
        url
      }
    });
  },
  getAccessToken(req, res, next) {
    Plugins.Asana.getAccessToken({
      code: req.query.code
    }).then(data => {
      if(data.access_token) {
        db.Asana.findOneAndUpdate(
        {
          externalId: req.query.state
        },
        {
          $set :{
            uid: data.data.email,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            externalId: req.query.state  
          }
        },
        {
          upsert: true
        })
        .then(d => console.log('mmmm', d));
      }
      res.send(data)
    })
    .catch(next);
  }
};

module.exports = OauthController;