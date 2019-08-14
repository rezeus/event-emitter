'use strict';

// NOTE an element with high priority is served before an element with low priority

// TODO no-op on `.splice()`, MAYBE custom function on `.concat()` etc.

class PriorityArray extends Array {
  constructor() {
    super();

    return new Proxy(this, {
      set(target, prop, value, receiver) {
        if (prop[0] < '0' || prop[0] > '9') {
          return Reflect.set(target, prop, value, receiver);
        }

        const val = typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'priority')
          ? value
          : { priority: 10, data: value };

        if (target.length === 0) {
          return Reflect.set(target, prop /* '0' */, val, receiver);
        }

        let added = false;
        for (let i = 0, p = val.priority; i < target.length; i += 1) {
          if (target[i].priority < p) {
            target.splice(i, 0, val);
            added = true;
            break;
          }
        }

        if (added) {
          return true;
        }

        return Reflect.set(target, prop, val, receiver);
      },
      get(target, prop, receiver) {
        if (prop[0] < '0' || prop[0] > '9') {
          return Reflect.get(target, prop, receiver);
        }

        const val = target[prop];

        if (val) {
          return val.data;
        }

        return undefined;
      },
    });
  }
}

module.exports = PriorityArray;

/**
 * @typedef {object} PrioritizedItem
 * @property {number} priority
 * @property {any} data
 */
