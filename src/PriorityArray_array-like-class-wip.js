'use strict';

// NOTE an element with high priority is served before an element with low priority

// TODO no-op on `.splice()`, MAYBE custom function on `.concat()` etc.

const DEFAULT_OPTIONS = {
  defaultPriority: 10,
  //
};

class PriorityArray {
  constructor(options = {}) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    return new Proxy([], {
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

  /**
   * Inserts new items to the priority array considering their priorities,
   * and returns their indices as a regular JavaScript array respectively.
   *
   * @param  {...any} items New items of the priority array
   * @returns {number[]} Inserted items' indices
   */
  push(...items) {
    //
    const za = 'aa';
    debugger;
  }
}

module.exports = PriorityArray;
