var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;
var Project = mongoose.model('Project');
var ProjectInfo = mongoose.model('ProjectInfo');
var passport = require('passport');
var User = mongoose.model('User');
var jwt = require('express-jwt');
var auth = jwt({ secret: 'SECRET', userProperty: 'payload' });
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/login', function (req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Please fill out all fields' });
    }

    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }

        if (user) {
            return res.json({ token: user.generateJWT() });
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

router.post('/register', function (req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Please fill out all fields' });
    }

    var user = new User();
    //  if (user.Checkusername(req.body.username)) {
    user.username = req.body.username;

    user.setPassword(req.body.password)

    user.save(function (err) {
        if (err) { return next(err); }

        return res.json({ token: user.generateJWT() })
    });
    //  }

});
router.get('/project', function (req, res, next) {
    Project.find(function (err, project) {
        if (err) { return next(err); }

        res.json(project);
    });
});
router.post('/Addproject', auth, function (req, res, next) {
    var project = new Project(req.body);
  
    project.save(function (err, project) {
        if (err) { return next(err); }

        res.json(project);
    });
});

router.post('/AddprojectInfo', auth, function (req, res, next) {
    var projectinfo = new ProjectInfo(req.body);
    projectinfo.Project = req.payload.Pid;
    projectinfo.save(function (err, projectinfo) {
        if (err) { return next(err); }

        res.json(projectinfo);
    });
});
module.exports = router;
