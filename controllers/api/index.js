const express = require('express');
const router = express.Router();
const OauthController = require('./oauth');
const ProjectController = require('./project');

//oauth
router.get('/oauth/get-oauth-url', OauthController.getOauthUrl);
router.get('/oauth/callback', OauthController.getAccessToken);

//project
router.get('/projects', ProjectController.getList);


module.exports = router;