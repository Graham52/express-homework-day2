const express = require('express');
const parser = require('body-parser');
const server = express();

server.use(parser.json());
server.use(express.static('client/public'));

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

MongoClient.connect('mongodb://localhost:27017', function (err, client) {
    if (err) {
      console.error(err);
      return;
    }
    const db = client.db('star_wars');
    console.log('Connected to DB');
    const quotesCollection = db.collection('quotes');


    // CREATE
    server.post('/api/quotes', function (req, res) {
      const newQuote = req.body;

      quotesCollection.save(newQuote, function (err, result) {
        if (err) {
          console.error(err);
          res.status(500);
          res.send();
          return;
        }

        console.log('Saved!');
        res.status(201);
        res.json( result.ops[0] )
      });
    });

    // INDEX
    server.get('/api/quotes', function (req, res) {
      quotesCollection.find().toArray(function (err, allQuotes) {
        if (err) {
          console.error(err);
          res.status(500);
          res.send();
          return;
        }

        res.json(allQuotes);
      });
    });

    //DELETE all
    server.delete('/api/quotes', function (req, res) {
      quotesCollection.deleteMany({}, function(err, result) {
        if (err) {
          console.error(err);
          res.status(500);
          res.send();
          return;
        }

        res.send();
      });
    });

    //Update
    server.put('/api/quotes/:id', function(req, res) {
      const updatedQuote = req.body;

      const id = req.params.id;
      const objectID = ObjectID(id);

      quotesCollection.update( {_id: objectID}, updatedQuote, function(err, result) {
        if (err) {
          console.error(err);
          res.status(500);
          res.send();
          return;
        }

        res.send(result);
      });


    });

    //Delete 1
    server.delete('/api/quotes/:id', function (req, res) {

      const id = req.params.id;
      const objectID = ObjectID(id);

      quotesCollection.deleteMany({_id: objectID}, function(err, result) {
        if (err) {
          console.error(err);
          res.status(500);
          res.send();
          return;
        }

        res.send();
      });
    });

    //Find 1
    server.get('/api/quotes/:id', function (req, res) {

      const id = req.params.id;
      const objectID = ObjectID(id);

      quotesCollection.findOne ( {_id: objectID} ,function (err, oneQuote) {
        if (err) {
          console.error(err);
          res.status(500);
          res.send();
          return;
        }

        res.json(oneQuote);
      });
    });


    server.listen(3000, function(){
      console.log("Listening on port 3000");
    });
});
