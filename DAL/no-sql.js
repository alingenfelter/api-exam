const path = require('path')
const PouchDB = require('pouchdb-http')
PouchDB.plugin(require('pouchdb-mapreduce'))
const fetchConfig = require('zero-config')

var config = fetchConfig(path.join(__dirname, '..'), {
  dcValue: 'test'
})
const urlFormat = require('url').format
const db = new PouchDB('http://127.0.0.1:5984/api-exam')


var dal = {
  createView: createView,
  getAlbumByID: getAlbumByID,
  listAlbums: listAlbums,
  createAlbum: createAlbum,
  updateAlbum: updateAlbum,
  deleteAlbum: deleteAlbum
}

function createView(designDoc, callback) {
  if (typeof designDoc == 'undefined' || designDoc === null) {
    return callback(new Error('400. Missing design doc'))
  }
  else {
    db.put(designDoc, function (err, response) {
      if (err) return callback(err)
      if (response) return callback(null, response)
    })
  }
}


function getAlbumByID(id, callback) {
    if (typeof id == "undefined" || id === null) {
        return callback(new Error('400. Missing id parameter'));
    } else {
        db.get(id, function(err, data) {
            if (err) return callback(err);
            if (data) return callback(null, data);
        })
    }
}


function listAlbums(sortBy, startKey, limit, callback) {
  if (typeof sortBy == 'undefined' || sortBy === null) {
    return callback(new Error('Missing sort by parameter'))
  }
  if (startKey !== '') {
    limit = limit + 1
  }
  db.query(sortBy, {
    startkey: startKey,
    limit: limit,
    include_docs: true
  }, function (err, data) {
    if (err) return callback(err)
    if (startKey !== '') {
      data.rows.shift()
    }
    callback(null, data.rows)
  })
}

function createAlbum(data, callback) {
  if (typeof data == 'undefined' || data === null) {
    return callback(new Error('400. Missing data to create Album.'))
  }
  else if (data.hasOwnProperty('_id') === true){
    return callback(new Error('400. ID is not permitted when creating an album'))
  }
  else if(data.hasOwnProperty('_rev') === true){
    return callback(new Error('400. Rev is not permitted when creating an album'))
  }
  else if(data.hasOwnProperty('name') !== true) {
    return callback(new Error('400. The album name is required'))
  }
  else if(data.hasOwnProperty('artist') !== true) {
    return callback(new Error('400. The artist name is required'))
  }
  else if(data.hasOwnProperty('date_available') !== true) {
    return callback(new Error('400. The date the album is available is required'))
  }
  else {
    data.type = 'album'
    data._id = 'album_' + data.artist + data.name

    db.put(data, function(err, response) {
      if (err) return callback(err)
      if (response) return callback(null, response)
    })
  }
}

function updateAlbum(data, callback) {
    // Call to couch retrieving a document with the given _id value.
    if (typeof data == "undefined" || data === null) {
        return callback(new Error('400Missing data for update'));
    } else if (data.hasOwnProperty('_id') !== true) {
        return callback(new Error('400. Missing id property from data'));
    } else if (data.hasOwnProperty('_rev') !== true) {
        return callback(new Error('400. Missing rev property from data'));
    } else {
        db.put(data, function(err, response) {
            if (err) return callback(err);
            if (response) return callback(null, response);
        });
    }
}

function deleteAlbum(data, callback) {
    if (typeof data == "undefined" || data === null) {
        return callback(new Error('400Missing data for delete'));
    } else if (data.hasOwnProperty('_id') !== true) {
        return callback(new Error('400Missing _id property from data'));
    } else if (data.hasOwnProperty('_rev') !== true) {
        return callback(new Error('400Missing _rev property from data'));
    } else {
      db.remove(data, function(err, response) {
          if (err) return callback(err);
          if (response) return callback(null, response);
      });
  }
}

module.exports = dal
