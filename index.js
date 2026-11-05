const express = require("express");
const cors = require("cors");
const app = express();
// const Joi = require("joi");
const multer = require("multer");
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
  res.sendFile(__dirname + "/index.html");
});

let songs = [
    {
        "_id": "1",
        "title": "The Leper Affinity",
        "artist": "Opeth",
        "link": "https://youtu.be/nKpIwX2P118?si=rrdnEy_4ajwrCyBn",
        "img": "./public/images/song-library-imgs/leper-img.png",
        "genre": "metal",
        "rating": "10",
        "techniques": [
            "Sweep Picking",
            "Syncopation"
        ]
    },
    {
        "_id": "2",
        "title": "Miles Beyond",
        "artist": "Mahavishnu Orchestra",
        "link": "https://youtu.be/8dj9KB89-OQ?si=LU1dT4c6x1_sNaRB",
        "img": "./public/images/song-library-imgs/miles.png",
        "genre": "jazz",
        "rating": "9",
        "techniques": [
            "Hammer on",
            "Bends",
            "Tremelo picking"
        ]
    },
    {
        "_id": "3",
        "title": "The Thrill is Gone",
        "artist": "B.B. King",
        "link": "https://youtu.be/kpC69qIe02E?si=HJeze8XuxUketYFy",
        "img": "./public/images/song-library-imgs/thrill.png",
        "genre": "Blues",
        "rating": "10",
        "techniques": [
            "Bends",
            "Staccoto"
        ]
    },
    {
        "_id": "4",
        "title": "Holy Fallout",
        "artist": "Cynic",
        "link": "https://youtu.be/MJe3RLwftSM?si=19DV33X6fSYuWgne",
        "img": "./public/images/song-library-imgs/holy-fallout.png",
        "genre": "rock",
        "rating": "8",
        "techniques": [
            "sliding",
            "Hybrid picking"
        ]
    },
    {
        "_id": "5",
        "title": "Melanchronic",
        "artist": "Vianova",
        "link": "https://youtu.be/Uba0M2k9pQs?si=yG8XM8Itm5TckiJ4",
        "img": "./public/images/song-library-imgs/melanchronic.png",
        "genre": "metal",
        "rating": "8",
        "techniques": [
            "palm muting",
            "power chords"
        ]
    },
    {
        "_id": "6",
        "title": "Real",
        "artist": "Unprocessed",
        "link": "https://youtu.be/WVua9g7WPtg?si=deDnWwBlrx4E0r9i",
        "img": "./public/images/song-library-imgs/real.png",
        "genre": "rock",
        "rating": "10",
        "techniques": [
            "finger picking",
            "thumping",
            "dead notes"
        ]
    },
    {
        "_id": "7",
        "title": "Burning Ring of Fire",
        "artist": "Johnny Cash",
        "link": "https://youtu.be/5WyLhwYFgmk?si=D2BxBBm6XO8zRBtg",
        "img": "./public/images/song-library-imgs/ring-of-fire.png",
        "genre": "country",
        "rating": "10",
        "techniques": [
            "open chords",
            "strumming"
        ]
    },
    {
        "_id": "8",
        "title": "Burden",
        "artist": "Opeth",
        "link": "https://youtu.be/orwgEEaJln0?si=_So15HCk-gKYbkRU",
        "img": "./public/images/song-library-imgs/burden.png",
        "genre": "rock",
        "rating": "10",
        "techniques": [
            "string skipping",
            "bends",
            "vibrato"
        ]
    }
];

app.get('/api/songs', (req, res)=> {
  res.send(songs);

});

app.listen(3002, () => {
  console.log("I'm listening");
});