'use strict';

const { expect } = require('chai');
const sinon = require('sinon');

const PriorityIterable = require('../src/PriorityIterable');
const PriorityList = require('../src/PriorityList');
const EventEmitter = require('../');

describe.only('PriorityList', function() {
  it('add more than 1 items properly (ordered add)', function() {
    // Arrange
    const pl = new PriorityList();

    // Act
    pl.add('A9', 9);
    pl.add('B9', 9);
    pl.add('C9', 9);
    pl.add('D7', 7);
    pl.add('E7', 7);
    pl.add('F7', 7);
    pl.add('G7', 7);
    pl.add('H5', 5);
    pl.add('I5', 5);

    const arr = [...pl];

    // Assert
    expect(arr).to.have.lengthOf(9);
    expect(arr).to.eql([
      'A9',
      'B9',
      'C9',
      'D7',
      'E7',
      'F7',
      'G7',
      'H5',
      'I5',
    ]);
  });

  it.only('add more than 1 items properly (mixed add)', function() {
    // Arrange
    const pl = new PriorityList();

    // Act
    pl.add('A9', 9);
    pl.add('E7', 7);
    pl.add('B9', 9);
    pl.add('D7', 7);
    pl.add('F7', 7);
    pl.add('G7', 7);
    pl.add('H5', 5);
    pl.add('C9', 9);
    pl.add('I5', 5);

    const arr = [...pl];

    // Assert
    expect(arr).to.have.lengthOf(9);
    expect(arr).to.eql([
      'A9',
      'B9',
      'C9',
      'E7',
      'D7',
      'F7',
      'G7',
      'H5',
      'I5',
    ]);
  });

  //
});

describe('PriorityIterable', function() {
  it('should push 1 item to the array', function() {
    // Arrange
    const pa = new PriorityIterable();

    // Act
    pa.push('first', 10);

    // Assert
    const arr = [...pa];

    expect(arr).to.have.lengthOf(1);
    expect(arr[0]).to.equal('first');
  });

  it('should push more than 1 items to the array', function() {
    // Arrange
    const pa = new PriorityIterable();

    // Act
    pa.push('first', 10);
    pa.push('second', 20);
    pa.push('third');

    // Assert
    const arr = [...pa];

    expect(arr).to.have.lengthOf(3);
    expect(arr[0]).to.equal('second');
    expect(arr[1]).to.equal('first');
    expect(arr[2]).to.equal('third');
  });

  // TODO
});

describe('event-emitter', function() {
  describe('sanity check #sanity', function() {
    before(() => {
      this.ctx.ee = new EventEmitter();
    });

    it('has function (on) to register listener', function() {
      expect(this.ee.on).to.be.a('function');
    });

    it('has function (once) to register one-off listener', function() {
      expect(this.ee.once).to.be.a('function');
    });

    it('has function (off) to unregister listener', function() {
      expect(this.ee.off).to.be.a('function');
    });

    it('has function (emit) to emit event synchronously', function() {
      expect(this.ee.emit).to.be.a('function');
    });

    it('has function (emitAsync) to emit event asynchronously', function() {
      expect(this.ee.emitAsync).to.be.a('function');
    });

    it("has function (listen) to listen another event emitter's events", function() {
      expect(this.ee.listen).to.be.a('function');
    });

    //
  });

  describe('constructing', function() {
    //
  });

  describe('emitting events', function() {
    it('should invoke synchronous listener', function() {
      // Arrange
      const listenerSpy = sinon.spy();
      const ee = new EventEmitter();

      ee.on('Namespace:event', listenerSpy);

      // Act
      const emitResult = ee.emit('Namespace:event');

      // Assert
      // `emitResult === true` means all the listeners were
      // invoked (i.e. propagation wasn't stopped)
      expect(emitResult).to.be.true;
      expect(listenerSpy.called).to.be.true;
      expect(listenerSpy.calledOn(null)).to.be.true;
      expect(listenerSpy.calledWithExactly({})).to.be.true;
    });

    it('should invoke more than 1 synchronous listeners', function() {
      // Arrange
      const listener1Spy = sinon.spy();
      const listener2Spy = sinon.spy();
      const ee = new EventEmitter();

      ee.on('Namespace:event', listener1Spy);
      ee.on('Namespace:event', listener2Spy);

      // Act
      const emitResult = ee.emit('Namespace:event');

      // Assert
      // `emitResult === true` means all the listeners were
      // invoked (i.e. propagation wasn't stopped)
      expect(emitResult).to.be.true;
      expect(listener1Spy.called).to.be.true;
      expect(listener2Spy.called).to.be.true;
    });

    it('should stop propagation when listener returns false', function() {
      // Arrange
      const listener1Spy = sinon.spy(() => false);
      const listener2Spy = sinon.spy();
      const ee = new EventEmitter();

      ee.on('Namespace:event', listener1Spy);
      ee.on('Namespace:event', listener2Spy);

      // Act
      const emitResult = ee.emit('Namespace:event');

      // Assert// `emitResult === false` means NOT all the listeners
      // were invoked (i.e. propagation WAS stopped)
      expect(emitResult).to.be.false;
      expect(listener1Spy.called).to.be.true;
      expect(listener2Spy.called).to.be.false;
    });

    it('should set context right when invoking listeners', function() {
      // Arrange
      const context = { foo: 'bar' };
      const listenerSpy = sinon.spy();
      const ee = new EventEmitter({ context });

      ee.on('Namespace:event', listenerSpy);

      // Act
      ee.emit('Namespace:event');

      // Assert
      expect(listenerSpy.calledWithExactly(context)).to.be.true;
    });

    it('should set payload right when invoking listeners 1', function() {
      // Arrange
      const payload = { foo: 'bar' };
      const listenerSpy = sinon.spy();
      const ee = new EventEmitter();

      ee.on('Namespace:event', listenerSpy);

      // Act
      ee.emit('Namespace:event', payload);

      // Assert
      expect(listenerSpy.calledWithExactly({}, payload)).to.be.true;
    });

    it('should set payload right when invoking listeners 2', function() {
      // Arrange
      const payload1 = { foo: 'bar' };
      const payload2 = 42;
      const listenerSpy = sinon.spy();
      const ee = new EventEmitter();

      ee.on('Namespace:event', listenerSpy);

      // Act
      ee.emit('Namespace:event', payload1, payload2);

      // Assert
      expect(listenerSpy.calledWithExactly({}, payload1, payload2)).to.be.true;
    });

    it('should set both context and payload right when invoking listeners 1', function() {
      // Arrange
      const context = { foo: 'bar' };
      const payload = { baz: 'qux' };
      const listenerSpy = sinon.spy();
      const ee = new EventEmitter({ context });

      ee.on('Namespace:event', listenerSpy);

      // Act
      ee.emit('Namespace:event', payload);

      // Assert
      expect(listenerSpy.calledWithExactly(context, payload)).to.be.true;
    });

    it('should set both context and payload right when invoking listeners 2', function() {
      // Arrange
      const context = { foo: 'bar' };
      const payload1 = { baz: 'qux' };
      const payload2 = { quux: 'quuz' };
      const listenerSpy = sinon.spy();
      const ee = new EventEmitter({ context });

      ee.on('Namespace:event', listenerSpy);

      // Act
      ee.emit('Namespace:event', payload1, payload2);

      // Assert
      expect(listenerSpy.calledWithExactly(context, payload1, payload2)).to.be.true;
    });

    it("should respect listeners' priority when invoking listeners", function() {
      // Arrange
      const context = { order: [] };
      const listener1 = (ctx) => { ctx.order.push('listener1'); };
      const listener2 = (ctx) => { ctx.order.push('listener2'); };
      const listener3 = (ctx) => { ctx.order.push('listener3'); };
      const listener4 = (ctx) => { ctx.order.push('listener4'); };
      const ee = new EventEmitter({ context });

      // NOTE "an element with high priority is served before an element with low priority"
      //      even though `listener2` registered after `listener1` due to priorities
      //      `listener2` is going to be invoked
      ee.on('Namespace:event', listener1); // it's priority is 10 by default
      ee.on('Namespace:event', listener2, 35);
      ee.on('Namespace:event', listener3, 5);
      ee.on('Namespace:event', listener4, 22);

      // Act
      ee.emit('Namespace:event');

      // Assert
      expect(context.order).to.have.lengthOf(4);
      expect(context.order[0]).to.equal('listener2');
      expect(context.order[1]).to.equal('listener4');
      expect(context.order[2]).to.equal('listener1');
      expect(context.order[3]).to.equal('listener3');
    });

    it("should respect listeners' priority when invoking listeners considering propagation stop", function() {
      // Arrange
      const context = { order: [] };
      const listener1 = (ctx) => { ctx.order.push('listener1'); return false; };
      const listener2 = (ctx) => { ctx.order.push('listener2'); };
      const listener3 = (ctx) => { ctx.order.push('listener3'); };
      const listener4 = (ctx) => { ctx.order.push('listener4'); };
      const ee = new EventEmitter({ context });

      // NOTE "an element with high priority is served before an element with low priority"
      //      even though `listener2` registered after `listener1` due to priorities
      //      `listener2` is going to be invoked
      ee.on('Namespace:event', listener1); // it's priority is 10 by default
      ee.on('Namespace:event', listener2, 35);
      ee.on('Namespace:event', listener3, 5);
      ee.on('Namespace:event', listener4, 22);

      // Act
      ee.emit('Namespace:event');

      // Assert
      expect(context.order).to.have.lengthOf(3);
      expect(context.order[0]).to.equal('listener2');
      expect(context.order[1]).to.equal('listener4');
      expect(context.order[2]).to.equal('listener1');
    });

    it('should bubble up thrown error from a listener', function() {
      // Arrange
      const errorMessage = `some error occurred @ ${(new Date()).getTime()}`;
      const listener = () => { throw new Error(errorMessage); };
      const ee = new EventEmitter();

      ee.on('Namespace:event', listener);

      function emit() { ee.emit('Namespace:event'); }

      // Act & Assert
      expect(emit).to.throw(errorMessage);
    });

    it('should unregister the listener (before emitting the event)', function() {
      // Arrange
      const listenerSpy = sinon.spy();
      const ee = new EventEmitter();

      const unregister = ee.on('Namespace:event', listenerSpy);

      // Act
      unregister();
      const emitResult = ee.emit('Namespace:event');

      // Assert
      // `emitResult === true` means all the listeners were
      // invoked (i.e. propagation wasn't stopped)
      expect(emitResult).to.be.true;
      expect(listenerSpy.called).to.be.false;
    });

    it('should unregister the listener (after emitting the event)', function() {
      // Arrange
      const listenerSpy = sinon.spy();
      const ee = new EventEmitter();

      const unregister = ee.on('Namespace:event', listenerSpy);

      // Act
      const emitResult = ee.emit('Namespace:event');
      unregister();
      ee.emit('Namespace:event');

      // Assert
      // `emitResult === true` means all the listeners were
      // invoked (i.e. propagation wasn't stopped)
      expect(emitResult).to.be.true;
      expect(listenerSpy.calledOnce).to.be.true;
    });

    //
  });

  // TODO `.listen()` from other event emitters (one for Node.js events, one for event-emitter)
});
