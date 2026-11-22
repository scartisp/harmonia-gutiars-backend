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

//!temporary list, will expand upon later
let genres = ['rock', 'blues', 'country', 'funk', 'jazz', 'metal']

app.get('/api/genres', (req, res) => {
    res.send(genres);
});
//!temporary list, will expand upon later
let techniques = ['strumming', 'dead note', 'open chord', 'hammer on',
    'pull off', 'sweep picking', 'bend', 'tremelo picking', 'legatto', 'syncopation',
    'staccoto', 'hybrid picking', 'palm muting', 'power chord', 'sliding', 'hybrid picking', 'finger picking',
    'thumping', 'string skipping', 'vibrato']
app.get('/api/techniques', (req, res) => {
    res.send(techniques);
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
            "sweep picking",
            "syncopation"
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
            "hammer on",
            "bend",
            "tremelo picking",
            "legatto",
            "syncopation"
        ],
        'videoId': '8dj9KB89-OQ'
    },
    {
        "_id": "3",
        "title": "The Thrill is Gone",
        "artist": "B.B. King",
        "img": "images/song-library-imgs/thrill.png",
        "genre": "blues",
        "rating": "10",
        'rating_count': 31,
        "techniques": [
            "bend",
            "staccoto"
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
            "hybrid picking"
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
            "power chord"
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
            "dead note"
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
            "open chord",
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
            "bend",
            "vibrato"
        ],
        'videoId': 'orwgEEaJln0'
    }
];
let songIdCount = songs.length;

app.get('/api/songs', (req, res) => {
    res.send(songs);
});

app.post('/api/songs', upload.single('img'), (req, res) => {
    const result = postSongSchema.validate(req.body);
    if (result.error) {
        console.log('Error in validation');
        res.status(400).send(result.error.details[0].message);
        return;
    }
    if (!req.file) {
        res.status(400).send('an image is required');
        return
    }
    songIdCount += 1;
    const { title, artist, genre, techniques, link } = result.value;
    const song = {
        _id: String(songIdCount),
        title: title,
        artist: artist,
        img: 'images/' + req.file.filename,
        genre: genre,
        rating: '10',
        rating_count: 0,
        techniques: techniques,
        videoId: getVideoId(link)
    };
    songs.push(song)
    res.status(200).send(song);
});

app.patch('/api/songs/:id', upload.single('img'), (req, res) => {
    const song = songs.find(song => song._id === req.params.id);
    if (!song) {
        return res.status(404).send('Song not found');
    }

    const result = patchSongSchema.validate(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }

    if (Object.keys(result.value).length === 0 && !req.file) {
        return res.status(400).send('Nothing to update');
    }

    const { link, ...updates } = result.value;
    Object.assign(song, updates);
    if (link) song.videoId = getVideoId(link);
    if (req.file) song.img = 'images/' + req.file.filename;

    res.send(song);
});

app.delete('/api/songs/:id', (req, res) => {
    const song = songs.find(s => s._id === req.params.id);

    if (!song) {
        return res.status(404).send('Song not found');
    }

    const index = songs.indexOf(song);
    songs.splice(index,1);
    res.status(200).send(song);
})

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

const songFields = {
    title: Joi.string().min(1),
    artist: Joi.string().min(1),
    genre: Joi.string().valid(...genres),
    techniques: Joi.array().items(Joi.string().valid(...techniques)).single().unique().max(5),
    link: Joi.string().custom((value, helpers) =>
        getVideoId(value) ? value : helpers.error('any.invalid')
    ).messages({ 'any.invalid': 'link must be a YouTube video URL' })
};

const postSongSchema = Joi.object({
    ...songFields,
    title: songFields.title.required(),
    artist: songFields.artist.required(),
    genre: songFields.genre.required(),
    link: songFields.link.required(),
    techniques: songFields.techniques.default([]),
});

const patchSongSchema = Joi.object(songFields);

app.listen(3002, () => {
    console.log("I'm listening");
});