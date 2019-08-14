'use strict';

/* eslint-disable no-underscore-dangle */ // FIXME

const PriorityIterable = require('./src/PriorityIterable');

const DEFAULT_OPTIONS = {
  delimiter: ':',
  context: {}, // listener context
  //
};

/**
 * Get specific event's listeners from all of the event listeners.
 *
 * @param {string} eventName Event name to retrieve listeners array of
 * @this {EventEmitter}
 */
function getListenersArray(eventName, notFoundHandler = () => undefined) {
  const fragments = eventName.split(this.options.delimiter);
  const fragmentsCount = fragments.length;

  let tmp = this._listeners;
  for (
    let i = 0, fragment = fragments[i];
    i < fragmentsCount;
    i += 1, fragment = fragments[i]
  ) {
    if (fragment === '') {
      if (i !== 0) {
        throw new Error("Encountered an empty fragment in the event name and it wasn't at the beginning.");
      }
    } else {
      if (!Object.prototype.hasOwnProperty.call(tmp, fragment)) {
        tmp[fragment] = (i + 1 === fragmentsCount)
          ? notFoundHandler()
          : {};
      }

      tmp = tmp[fragment];
    }
  }

  return tmp;
}

class EventEmitter {
  constructor(options = {}) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };
    this._listeners = {};
  }

  /**
   * Register a listener function with the given name.
   *
   * @param {string} eventName Name of the event, may be delimited (e.g. `'User:created'`).
   * @param {function} listener The function gets invoked when the event is emitted.
   */
  on(eventName, listener, priority = 10) {
    /** @type {PriorityIterable} */
    const listeners = getListenersArray.call(this, eventName, () => new PriorityIterable());

    const index = listeners.push(listener, priority);

    // TODO On `.once()` do this automatically
    return () => { listeners.pop(index); };
  }

  emit(eventName, ...payload) {
    /** @type {PriorityIterable|undefined} */
    const listeners = getListenersArray.call(this, eventName);

    if (!listeners) {
      return undefined;
    }

    let propagationStopped = false;
    // const iterator = listeners[Symbol.iterator]();
    const { iterator } = listeners;
    let result = iterator.next();
    while (!result.done) {
      // let thrown error bubble up
      if (result.value.apply(null, [this.options.context, ...payload]) === false) {
        // stop propagation
        propagationStopped = true;
        break;
      }

      result = iterator.next();
    }

    return !propagationStopped;
  }
}

module.exports = EventEmitter;
