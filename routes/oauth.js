const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('oauth');
});
router.get('/get-oauth-url', (req, res, next) => {
  const url = Plugins.Asana.getAuthUrl();
  return res.send(url);
});
router.get('/callback', (req, res, next) => {
  Plugins.Asana.getAccessToken({
    code: req.query.code
  }).then(data => {
    if(data.access_token) {
      db.Asana.create({
        UID: data.data.email,
        accessToken: data.access_token,
        refreshToken: data.refresh_token
      });
    }
    res.send(data)
  })
  .catch(next);
});

router.post('/list-project', (req, res, next) => {
  db.Asana.findOne({
    UID: req.body.UID
  })
  .then(intergrationData => {
    if(!intergrationData) {
      return res.send({
        success: false,
        message: Plugins.Asana.getAuthUrl()
      })
    }
    return Plugins.Asana.listProject({
      token: intergrationData.accessToken
    }).then(data => {
      return res.send(data.data)
    })
    .catch(err => {
      if(err.statusCode === 401){ //token was expired
        return Services.Asana.updateAccessToken({
          refreshToken: intergrationData.refreshToken,
          UID: req.body.UID
        })
        .then(accessToken => {
          return Plugins.Asana.listProject({
            token: accessToken
          })
          .then(data => {
            return res.send(data.data)
          })
        });
      }
      return next(err);
    })
    ;  
  })
  .catch(next);
});



module.exports = router;
