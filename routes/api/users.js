const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('users');
var monk = require('monk');
var db = monk('localhost:27017/MusicApp');

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, function(req, res, next) {
    const {
        body: {
            user
        }
    } = req;

    if (!user.fname) {
        return res.status(422).json({
            errors: {
                fname: 'is required',
            },
        });
    }

    if (!user.lname) {
        return res.status(422).json({
            errors: {
                lname: 'is required',
            },
        });
    }

    if (!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if (!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    const finalUser = new Users(user);

    finalUser.setPassword(user.password);

    return finalUser.save()
        .then(() => res.json({
            user: finalUser.toAuthJSON()
        }));
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, function(req, res, next) {
    const {
        body: {
            user
        }
    } = req;

    if (!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if (!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    return passport.authenticate('local', {
        session: false
    }, function(err, passportUser, info) {
        if (err) {
            return next(err);
        }

        if (passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();
            console.log('user Email: ' + user.email);

            var isAdmin = false;

            return res.json({
                user: user.toAuthJSON()
            });
        }

        //return status(400).info;
        return res.json({
            'error': "login failed"
        });
    })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, function(req, res, next) {
    const {
        payload: {
            id
        }
    } = req;

    return Users.findById(id)
        .then((user) => {
            if (!user) {
                return res.sendStatus(400);
            }

            return res.json({
                user: user.toAuthJSON()
            });
        });
});

// GET Admin status of the user
router.get('/is_admin', auth.required, function(req, res, next) {
    const {
        payload: {
            id
        }
    } = req;

    Users.findOne({
            '_id': id
        },
        function(err, data) {
            if (err) throw err;
            console.log(data['is_admin']);
            if (data['is_admin'] == true) {
                return res.json({
                    'is_admin': true
                });
            } else {
                return res.json({
                    'is_admin': false
                });
            }

        }
    );
});


// GET favorite tracks of the user
router.get('/favorites', auth.required, function(req, res, next) {
    const {
        payload: {
            id
        }
    } = req;

    Users.findOne({
            '_id': id
        },
        function(err, data) {
            if (err) throw err;
            var collection = db.get('tracks');
            var favorites = data['favorites'];
            var trackData = [];
            res.json(data['favorites']);
        }
    );
});

module.exports = router;
