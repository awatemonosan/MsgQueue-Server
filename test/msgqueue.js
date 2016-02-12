var should = require('chai').should();

var MsgQueue = require('../msgqueue');

describe('#MsgQueue', function(){

  describe('.enqueue', function(){
    it('should add to the queue',function(){
      var q = new MsgQueue();
      q.poll('test').should.equal(0);
      q.enqueue('test',{data:1});
      q.poll('test').should.equal(1);
    });
  });
  
  describe('.poll', function(){
    it('returns the correct number of messages per queue',function(){
      var q = new MsgQueue();
      q.poll('1').should.equal(0);
      q.poll('2').should.equal(0);
      q.poll('3').should.equal(0);

      q.enqueue('1');
      q.enqueue('2');
      q.poll('1').should.equal(1);
      q.poll('2').should.equal(1);
      q.poll('3').should.equal(0);

      q.req('1');
      q.poll('1').should.equal(0);
      q.poll('2').should.equal(1);
      q.poll('3').should.equal(0);
    });
  });

  describe('.req', function(){
    it('TODO',function(){

    });
  });

  describe('.ack', function(){
    it('TODO',function(){

    });
  });

  describe('.rej', function(){
    it('TODO',function(){

    });
  });

});
