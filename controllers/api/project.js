const ProjectController = {
  getList(req, res, next) {
    db.Asana.findOne({
      externalId: req.headers.externalid
    })
    .then(intergrationData => {
      if(!intergrationData) {
        return res.send({
          success: false,
          statusCode: 400,
          data: {
            url: Plugins.Asana.getAuthUrl({
              externalId: req.headers.externalid
            })
          }
        })
      }
      return Plugins.Asana.listProject({
        token: intergrationData.accessToken
      }).then(data => {
        return res.send({
          success: true,
          statusCode: 200,
          data: {
            items: data.data
          }
        });
      })
      .catch(err => {
        if(err.statusCode === 401){ //token was expired
          return Services.Asana.updateAccessToken({
            refreshToken: intergrationData.refreshToken,
            externalId: req.headers.externalid
          })
          .then(accessToken => {
            return Plugins.Asana.listProject({
              token: accessToken
            })
            .then(data => {
              return res.send({
                success: true,
                statusCode: 200,
                data: {
                  items: data.data
                }
              });
            })
          });
        }
        return next(err);
      })
      ;  
    })
    .catch(next);
  }
};

module.exports = ProjectController;