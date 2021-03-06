'use strict'

var bodyParser = require('body-parser');

var MsgQueue = require('./msgqueue');

var MsgQueuePlugin = class extends MsgQueue{
  constructor(app, reqTimeout){
    super(reqTimeout);

    // for parsing application/json
    app.use(bodyParser.json());

    // for parsing application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

    var that = this;
    app.post('/enqueue', function (req, res) {
      let queue = req.body.queue;
      let payload = req.body.payload;

      if(queue === 'log') console.log(payload.msg);
      else that.enqueue(queue, payload);
      
      res.send({});
    });

    app.post('/poll', function (req, res) {
      let queue = req.body.queue;

      let count = that.poll(queue);

      res.send({
        count: count
      });
    });

    app.post('/count', function (req, res) {
      let queue = req.body.queue;

      let count = that.count(queue);

      res.send({
        count: count
      });
    });

    app.post('/req', function (req, res) {
      let queue = req.body.queue;
      let count = req.body.count;

      let msgs = that.req(queue, count);

      res.send({
        msgs: msgs
      });
    });

    app.post('/ack', function (req, res) {
      let id = req.body.id;

      that.ack(id);

      res.send({});
    });

    app.post('/rej', function (req, res) {
      let id = req.body.id;

      that.rej(id);

      res.send({});
    });

    app.post('/ping', function (req, res) {
      res.send({});
    });
  }
};

module.exports = MsgQueuePlugin;