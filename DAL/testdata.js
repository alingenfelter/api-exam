const PouchDB = require('pouchdb-http')
const db = new PouchDB('http://127.0.0.1:5984/api-exam/')
const dalNoSQL = require('./no-sql.js')
const {
    forEach
} = require('ramda')

var views = [{
    _id: "_design/albums",
    views: {
        "albums": {
            map: function(doc) {
                if (doc.type === "album") {
                    emit(doc._id)
                }
            }.toString()
        }
    }
}]

var albums = [{
    "type": "album",
    "name": "Got Your Six",
    "artist": "Five Finger Death Punch",
    "description": "Got Your Six is the sixth studio album by American heavy metal band Five Finger Death Punch. It was released on September 4, 2015 on the Prospect Park label.[2][3] Got Your Six sold 119,000 units to debut at No. 2 on the Billboard 200.",
    "in_stock": "true",
    "retail_cost": 14.39,
    "date_available": "2015-09-04"
}, {
    "type": "album",
    "name": "Damn the Torpedos",
    "artist": "Tom Petty and the Heartbreakers",
    "description": "Damn the Torpedoes is the third album by Tom Petty and the Heartbreakers, released in 1979. This was the first of three Petty albums originally released by the Backstreet Records label, distributed by MCA Records. It built on the commercial success and critical acclaim of his two previous albums and peaked at #2 on the Billboard 200 album chart.[1] In 2003, the album was ranked number 313 on Rolling Stone magazine's list of the 500 greatest albums of all time.",
    "in_stock": "true",
    "retail_cost": 9.99,
    "date_available": "1979-10-19"
}, {
    "type": "album",
    "name": "Scars and Souvenirs",
    "artist": "Theory of a Deadman",
    "description": "The title of the album comes from a line in the song 'By the Way'. The title refers to the 'scars and souvenirs', or the ups and downs of one's lifetime, as a large majority of the songs on the album deal with things like relationships and obstacles that one might encounter during his or her life.",
    "in_stock": "false",
    "retail_cost": 6.99,
    "date_available": "2008-04-01"
}, {
    "type": "album",
    "name": "The Weight of These Wings",
    "artist": "Miranda Lambert",
    "description": "The Weight of These Wings is the upcoming sixth studio album by American country music artist Miranda Lambert set to be released on November 18, 2016, by RCA Records Nashville. The album will consist of two discs, Disc 1–The Nerve, and Disc 2−The Heart.",
    "in_stock": "false",
    "retail_cost": 16.99,
    "date_available": "2016-11-18"
}, {
    "type": "album",
    "name": "Big Boat",
    "artist": "Phish",
    "description": "Big Boat is the 13th studio album by the American rock band Phish.[1] Recorded in Nashville, New York and the band's home studio, The Barn, in Vermont, Big Boat was produced with Bob Ezrin — who also helmed 2014's Fuego.[2] It was released on October 7, 2016 by JEMP Records/ATO Records. It debuted at #19 on the Billboard 200.",
    "in_stock": "false",
    "retail_cost": 11.69,
    "date_available": "2016-10-7"
}]

function callback (msgHeader) {
  return function (err, response) {
    if (err) return console.log('ERROR:\n', err.message)
    return console.log(msgHeader, response)
  }
}

db.bulkDocs(views, function(err, res) {
    if (err) {
        console.log(err.message)
    }
    if (res) {
        console.log(res)
    }
})

albums.forEach(function(album) {
  dalNoSQL.createAlbum(album, callback('Album created.'))
})
