var express = require('express')
var app = express()
const http = require('http')
const port = process.env.PORT || 4000
const HTTPError = require('node-http-error')
const dal = require('../DAL/no-sql.js')
var bodyParser = require('body-parser')
app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.send('Welcome to the Album Store home page.')
})

function BuildResponseError(err) {

    const statuscheck = isNaN(err.message.substring(0, 3)) === true
        ? "400"
        : err.message.substring(0, 3)
    const status = err.status
        ? Number(err.status)
        : Number(statuscheck)
    const message = err.status
        ? err.message
        : err.message.substring(3)
    const reason = message
    const error = status === 400
        ? "Bad Request"
        : err.name
    const name = error

    var errormsg = {}
    errormsg.error = error
    errormsg.reason = reason
    errormsg.name = name
    errormsg.status = status
    errormsg.message = message

    console.log("BuildResponseError-->", errormsg)
    return errormsg
}
app.get('/albums/:id', function (req, res, next) {
  const albumID = req.params.id
  dal.getAlbumByID(albumID, function(err, data) {
    if (err) { return (err.message) }
    console.log('Call Successful. Here is the Album')
    res.append('Content-type', 'application/json')
    res.status(200).send({data})
  })
})

app.get('/albums', function (req, res, next) {
  const sortByParam = req.query.sortby || 'albums'
  //const sortBy = getPersonSortBy(sortByParam, dalModule)
  const sortBy = sortByParam
  const sortToken = req.query.sorttoken || ''
  const limit = req.query.limit || 5

  dal.listAlbums(sortBy, sortToken, limit, function callback(err, data) {
    if (err) {
        var responseError = BuildResponseError(err)
        return next(new HTTPError(responseError.status, responseError.message, responseError));
    }
    if (data) {
      console.log('Call successful.  Albums listed', data)
      res.append('Content-type', 'application/json')
      res.status(201).send(JSON.stringify(data, null, 2))
    }
  })
})

app.post('/albums', function(req, res, next) {
  console.log(req.body)
  dal.createAlbum(req.body, function(err, data) {
    if (err) {
      var responseError = BuildResponseError(err)
      return next(new HTTPError(responseError.status, responseError.message, responseError))
    }
    console.log('Call Successful, Album added', data)
    res.append('Content-type', 'application/json')
    res.status(201).send(JSON.stringify(data, null, 2))
  })
})

app.put('/albums/:id', function(req, res, next) {
    console.log(req.body)
    dal.updateAlbum(req.body, function(err, data) {
        if (err) {
            var responseError = BuildResponseError(err)
            return next(new HTTPError(responseError.status, responseError.message, responseError));
        }
        console.log('Call successful.  Album updated', data)
        res.append('Content-type', 'application/json')
        res.status(201).send(JSON.stringify(data, null, 2))
    })
})

app.delete('/albums/:id', function(req, res, next) {
    console.log(req.body)
    dal.deleteAlbum(req.body, function(err, data) {
        if (err) {
            var responseError = BuildResponseError(err)
            return next(new HTTPError(responseError.status, responseError.message, responseError));
        }
        console.log('Call successful.  Album deleted', data)
        res.append('Content-type', 'application/json')
        res.status(201).send(JSON.stringify(data, null, 2))
    })
})

var server = http.createServer(app)
server.listen(port, () => console.log('opened server on port', server.address()))
