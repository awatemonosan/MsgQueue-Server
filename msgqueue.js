'use strict'

var MsgQueue = class {
  constructor(options){
    options = options || {};
    this.reqTimeout = options.reqTimeout || 30 * 1000;
    
    this.queue = []; // TODO: make this a hash of linked lists {QUEUENAME:[], etc...}
    this.nextMsgID = 0;
  }

// add message to queue
  enqueue(queue, payload){
    var curTime = new Date().getTime();
    
    var msg = {};
    if(payload!==undefined) msg = JSON.parse(JSON.stringify(payload));

    msg.id = this.nextMsgID++;
    msg.queue = queue;
    msg.queue_time = curTime;
    msg.req_time = 0;
    this.queue.push(msg);
  }

  poll(queue){
    var that = this;
    var curTime = new Date().getTime();

    var count = 0;
    this.queue.forEach(function(msg){
      if(msg.queue !== queue) return;
      if(curTime < msg.req_time+that.reqTimeout) return;
      count++;
    });

    return count;
  }

  count(queue){
    var that = this;
    var curTime = new Date().getTime();

    var count = 0;
    this.queue.forEach(function(msg){
      if(msg.queue !== queue) return;
      count++;
    });

    return count;
  }

  // TODO?: Make this method private?
  getNext(queue){
    var curTime = new Date().getTime();
    var result = null;
    var that = this;
    this.queue.forEach(function(msg){
      // return if the msg is not part of this queue
      if(msg.queue !== queue) return;
      // return if the req has not timed out
      if(curTime < msg.req_time+that.reqTimeout) return;
      // this is the next msg
      result = msg;
    });

    return result;
  }

  req(queue, count){
    // -1 means get every message from that queue
    count = count || -1;
    
    var curTime = new Date().getTime();

    var response = [];
    while(count !== 0){
      var msg = this.getNext(queue);
      if(msg === null) break;

      msg.req_time = curTime;
      response.push(msg);
      if(count>0) count--;
    }

    return response;
  }

  ack(id){
    var curTime = new Date().getTime();

    for(var index=0; index<this.queue.length; index++){
      var msg = this.queue[index];
      if(msg.id !== id) continue;
      if(msg.req_time < curTime - this.reqTimeout) continue;

      this.queue.splice(index, 1);
      break;
    }
  }

  rej(id){
    var curTime = new Date().getTime();

    for(var index=0; index<this.queue.length; index++){
      var msg = this.queue[index];
      if(msg.id !== id) continue;
      msg.req_time = 0;
      break;
    }
  }

  snapshot(){
    return JSON.parse(JSON.stringify(this.queue));
  }
};

module.exports = MsgQueue;
