'use strict';

/* eslint-disable no-underscore-dangle */ // FIXME

const DEFAULT_OPTIONS = {
  defaultPriority: 10,
  //
};

class PriorityIterable {
  constructor(/** @type {PriorityIterableOptions} */ options = {}) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    this._prioritizedData = {}; // { priority: number -> data: any[] }
    this._priorities = []; // [7, 10, 42, ...]
    this._length = 0;
  }

  get length() {
    return this._length;
  }

  /**
   * Insert new item to the priority array considering it's priority.
   *
   * @param {any} item New item of the priority array
   * @this {PriorityIterable}
   * _returns {number} Index of the inserted item on the priority array
   */
  push(item, priority = undefined) {
    /** @type {number} */
    const normalizedPriority = priority || this.options.defaultPriority;

    if (!this._priorities.includes(normalizedPriority)) {
      this._prioritizedData[normalizedPriority] = [];

      let added = false;
      for (let i = 0; i < this._priorities.length; i += 1) {
        if (this._priorities[i] < normalizedPriority) {
          // TODO i or i-1, find out!!!
          this._priorities.splice(i, 0, normalizedPriority);
          added = true;
          break;
        }
      }
      if (added === false) {
        this._priorities.push(normalizedPriority);
      }
    }

    const indexOnPrioritizedData = this._prioritizedData[normalizedPriority].push(item) - 1;
    this._length += 1;

    return `${normalizedPriority}.${indexOnPrioritizedData}`;
  }

  /**
   * Remove the item from the priority iterable via the given index and return the item.
   *
   * @param {string} index Priority iterable specific index of the item
   */
  pop(index) {
    const [priorityStr, indexOnPrioritizedDataStr] = index.split('.');
    const priority = Number.parseInt(priorityStr, 10);
    const indexOnPrioritizedData = Number.parseInt(indexOnPrioritizedDataStr, 10);

    const [item] = this._prioritizedData[priority].splice(indexOnPrioritizedData, 1);
    this._length -= 1;

    return item;
  }

  get iterator() {
    const self = this;

    return {
      next() {
        if (this.currentPriorityIndex === self._priorities.length) {
          this.currentPriorityIndex = 0;
          this.currentItemIndex = 0;
          return { done: true };
        }

        const p = self._prioritizedData[self._priorities[this.currentPriorityIndex]];
        const ps = p.length;

        if (this.currentItemIndex < ps) {
          const value = p[this.currentItemIndex];
          this.currentItemIndex += 1;
          return { value, done: false };
        }

        this.currentPriorityIndex += 1;
        this.currentItemIndex = 0;
        return this.next();
      },
      currentPriorityIndex: 0,
      currentItemIndex: 0, // on `this.prioritized`
    };
  }

  [Symbol.iterator]() {
    return this.iterator;
  }

  // NOTE Instead of `inst.toArray(): any[]` use `[...inst]` or `Array.from(inst)`
}

module.exports = PriorityIterable;


/**
 * @typedef {object} PriorityIterableOptions
 * @property {number} defaultPriority Default priority for new item
 */
