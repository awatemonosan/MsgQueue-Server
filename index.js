'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const MsgQueue = require('./classes/msgqueue');

var MsgQueuePlugin = class extends MsgQueue{
  constructor(app){
    super();

    // for parsing application/json
    app.use(bodyParser.json());

    // for parsing application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

    app.post('/enqueue', function (req, res) {
      let queue = req.body.queue;
      let payload = req.body.payload;

      this.enqueue(queue, payload);

      res.send({});
    });

    app.post('/poll', function (req, res) {
      let queue = req.body.queue;

      let count = this.poll(queue);

      res.send({
        count: count
      });
    });

    app.post('/req', function (req, res) {
      let queue = req.body.queue;
      let count = req.body.count;

      let msgs = this.req(queue, count);

      res.send({
        msgs: msgs
      });
    });

    app.post('/ack', function (req, res) {
      let id = req.body.id;

      this.ack(id);

      res.send({});
    });

    app.post('/rej', function (req, res) {
      let id = req.body.id;

      this.rej(id);

      res.send({});
    });
  }
};