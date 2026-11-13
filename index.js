const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require('joi');

const app = express();
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

let songs = [
    {
        "_id": "1",
        "title": "The Leper Affinity",
        "artist": "Opeth",
        "img": "images/song-library-imgs/leper-img.png",
        "genre": "metal",
        "rating": "10",
        'rating_count': 10,
        "techniques": [
            "Sweep Picking",
            "Syncopation"
        ],
        'videoId': 'nKpIwX2P118'
    },
    {
        "_id": "2",
        "title": "Miles Beyond",
        "artist": "Mahavishnu Orchestra",
        "img": "images/song-library-imgs/miles.png",
        "genre": "jazz",
        "rating": "9",
        'rating_count': 23,
        "techniques": [
            "Hammer on",
            "Bends",
            "Tremelo picking"
        ],
        'videoId': '8dj9KB89-OQ'
    },
    {
        "_id": "3",
        "title": "The Thrill is Gone",
        "artist": "B.B. King",
        "img": "images/song-library-imgs/thrill.png",
        "genre": "Blues",
        "rating": "10",
        'rating_count': 31,
        "techniques": [
            "Bends",
            "Staccoto"
        ],
        'videoId': 'P_Qw4KgqpYI'
    },
    {
        "_id": "4",
        "title": "Holy Fallout",
        "artist": "Cynic",
        "img": "images/song-library-imgs/holy-fallout.png",
        "genre": "rock",
        "rating": "8",
        'rating_count': 13,
        "techniques": [
            "sliding",
            "Hybrid picking"
        ],
        'videoId': 'MJe3RLwftSM'
    },
    {
        "_id": "5",
        "title": "Melanchronic",
        "artist": "Vianova",
        "img": "images/song-library-imgs/melanchronic.png",
        "genre": "metal",
        "rating": "8",
        'rating_count': 1,
        "techniques": [
            "palm muting",
            "power chords"
        ],
        'videoId': 'Uba0M2k9pQs'
    },
    {
        "_id": "6",
        "title": "Real",
        "artist": "Unprocessed",
        "img": "images/song-library-imgs/real.png",
        "genre": "rock",
        "rating": "10",
        'rating_count': 21,
        "techniques": [
            "finger picking",
            "thumping",
            "dead notes"
        ],
        'videoId': 'WVua9g7WPtg'
    },
    {
        "_id": "7",
        "title": "Burning Ring of Fire",
        "artist": "Johnny Cash",
        "img": "images/song-library-imgs/ring-of-fire.png",
        "genre": "country",
        "rating": "10",
        'rating_count': 54,
        "techniques": [
            "open chords",
            "strumming"
        ],
        'videoId': '1WaV2x8GXj0'
    },
    {
        "_id": "8",
        "title": "Burden",
        "artist": "Opeth",
        "img": "images/song-library-imgs/burden.png",
        "genre": "rock",
        "rating": "10",
        'rating_count': 13,
        "techniques": [
            "string skipping",
            "bends",
            "vibrato"
        ],
        'videoId': 'orwgEEaJln0'
    }
];

app.get('/api/songs', (req, res)=> {
  res.send(songs);
});
//!need to validate image
app.post('/api/songs', upload.single('img'), (req, res)=> {
    const result = validateSong(req.body);
    if (result.error) {
        console.log('Error in validation');
        res.status(400).send(result.error.details[0].message);
        return;
    }
    if (!req.file) {
        res.status(400).send('an image is required');
        return
    }

    const videoId = getVideoId(req.body.link);
    const song = {
        _id: songs.length+1,
        title: req.body.title,
        artist: req.body.artist,
        img: 'images/' + req.file.filename,
        genre: req.body.genre,
        rating: '10',
        rating_count: 0,
        techniques: [],
        videoId: videoId
    }
    songs.push(song)
    res.status(200).send(song);
});

// Pulls the 11-character video ID out of any common YouTube URL format.
// Returns null if the link isn't a YouTube video URL.
const getVideoId = link => {
    let url;
    try {
        url = new URL(link);
    } catch {
        return null;
    }

    const host = url.hostname.replace(/^(www\.|m\.|music\.)/, '');
    let id = null;

    if (host === 'youtu.be') {
        // https://youtu.be/ID?si=...
        id = url.pathname.slice(1);
    } else if (host === 'youtube.com') {
        if (url.pathname === '/watch') {
            // https://www.youtube.com/watch?v=ID&t=30s
            id = url.searchParams.get('v');
        } else {
            // https://www.youtube.com/shorts/ID, /embed/ID, /live/ID
            const match = url.pathname.match(/^\/(shorts|embed|live)\/([^/]+)/);
            if (match) id = match[2];
        }
    }

    return /^[\w-]{11}$/.test(id) ? id : null;
};

const validateSong = song => {
    const schema = Joi.object({
        _id: Joi.allow(''),
        title:Joi.string().min(1).required(),
        artist:Joi.string().min(1).required(),
        genre:Joi.string().min(1).required(), //!this needs to be changed 
        //!need to figure out how to add techniques
        link:Joi.string().required().custom((value, helpers) =>
            getVideoId(value) ? value : helpers.error('any.invalid')
        ).messages({ 'any.invalid': 'link must be a YouTube video URL' })
    });

    return schema.validate(song);
};

app.listen(3002, () => {
  console.log("I'm listening");
});