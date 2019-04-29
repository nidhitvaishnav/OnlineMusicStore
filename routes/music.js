var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/MusicApp');

const mongoose = require('mongoose');
const Users = mongoose.model('users');

// router.get('/', function(req, res) {
//     var collection = db.get('tracks');

//     var searchCriteria={};
//     var search = req.query.search;
//     var genreFiter = req.query.genre;
//     if(search || genreFiter)
//         searchCriteria ={
//             'title': {'$regex': search, '$options':'i'},
//             'genre': {'$regex': genreFiter}
//         };
//     // console.log(searchCriteria);
//     collection.find(searchCriteria, function(err, tracks){
//         if (err) throw err;
//         res.json(tracks);
//     });
// });

router.get('/', function(req, res) {
    var collection = db.get('tracks');
    collection.find({}, function(err, tracks) {
        if (err) throw err;
        res.json(tracks);
    });
});


router.post('/', function(req, res) {
    var collection = db.get('tracks');
    var genre = new Array();
    genre = req.body.genre.split(",");
    var artist = new Array();
    artist = req.body.artist.split(",");
    collection.insert({
        title: req.body.title,
        album: req.body.album,
        genre: genre,
        artist: artist,
        trackLength: req.body.trackLength,
        downloadCount: 0
    }, function(err, track) {
        if (err) throw err;
        res.json(track);
    });
});


router.get('/:id', function(req, res) {
    var collection = db.get('tracks');
    collection.findOne({
        _id: req.params.id
    }, function(err, track) {
        if (err) throw err;
        res.json(track);
    });
});

router.put('/:id', function(req, res) {
    var collection = db.get('tracks');
    var genre = new Array();
    genre = (req.body.genre + "").split(",");
    var artist = new Array();
    artist = (req.body.artist + "").split(",");
    collection.update({
        _id: req.params.id
    }, {
        title: req.body.title,
        album: req.body.album,
        genre: genre,
        artist: artist,
        trackLength: req.body.trackLength
    }, function(err, track) {
        if (err) throw err;
        res.json(track);
    });
});

router.delete('/:id', function(req, res) {
    var collection = db.get('tracks');
    collection.remove({
        _id: req.params.id
    }, function(err, track) {
        if (err) throw err;

        res.json(track);
    });
});

router.post('/like', function(req, res) {
    var fav = req.body.trackID;
    // console.log("fev:", fev);
    Users.findOne({
            _id: req.body.userID
        },
        function(err, data) {
            console.log(data['favorites']);
            if (!data['favorites'].includes(fav)) {
                Users.findOneAndUpdate({
                        _id: req.body.userID
                    }, {
                        $push: {
                            favorites: fav
                        }
                    },
                    function(error, success) {
                        if (err) {
                            console.log(err);
                            res.json({
                                'error': err
                            });
                        } else {
                            console.log(success);
                            res.json({
                                'success': success
                            });
                        }
                    });
            }
        }
    );
});


router.post('/unlike', function(req, res) {
    console.log("unlike");
    var fav = req.body.trackID;
    Users.findOne({
            _id: req.body.userID
        },
        function(err, data) {
            console.log("fav" + fav);
            if (data['favorites'].includes(fav)) {

                Users.update(
                    {
                        "_id": req.body.userID
                    },
                    {
                        "$pull": {
                            "favorites": fav
                        }
                    },
                    function(error, success) {
                        if (err) {
                            console.log(err);
                            res.json({
                                'error': err
                            });
                        } else {
                            console.log(success);
                            res.json({
                                'success': success
                            });
                        }
                    });
            }
        }
    );
});

module.exports = router;
