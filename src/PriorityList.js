'use strict';

// TR Ekleme O(1), silme O(n/m) where n is the length of the list and m is the priorities count

/**
 * head         priorityChangePoints.7     priorityChangePoints.5
 *  ||                   ||                          ||
 *  vv                   vv                          vv
 *
 *  A9 --> B9 --> C9 --> D7 --> E7 --> F7 --> G7 --> H5 --> I5 --x
 *  ^^     ^      ^          ^
 *  ||     |      |          |
 *  ||   value    |         next
 * node           |
 *             priority
 *
 * - Maximum priority is the priority of the node which `head` points
 * - `priorityChangePoints` always has 1-less priority (in the schema above priority 9 is absent)
 *   This is due to priorities changes from one to another, not from `null` to one.
 * - There is no `tail` needed due to iterator - it'll go until there's no `next`
 */

const PRIV = Symbol('PriorityList.internals');

/**
 * Find the value in the array and return it's index if found,
 * insert considering sort and return it's index otherwise.
 * This is necessary to find the minimum greater value
 * than the inserted one on descending sorted array.
 *
 * @param {Array<number>} array The array to traverse through
 * @param {number} value The value to find or create
 */
function findOrInsertAndGetIndex(array, value) {
  const len = array.length;

  let i = 0;
  for (; i < len; i += 1) {
    if (array[i] === value) {
      // found
      break;
    }

    if (array[i] < value) {
      array.splice(i, 0, value);
      // inserted
      break;
    }
  }

  if (array.length === len) {
    // wasn't inserted due to `value` is the lowest value
    array.push(value);
    // inserted value's index is the old lenght
    i = len;
  }

  return i;
}

/**
 * Create a new node
 *
 * @param {any} value The item to hold on the list
 * @param {number} priority New node's priority
 * @returns {Node}
 */
function createNode(value, priority) {
  return { value, priority, next: null };
}

class PriorityList {
  constructor() {
    this[PRIV] = {
      head: null,
      length: 0,
      priorities: [], // sort array of priorities that the list contains
      priorityChangePoints: {}, // { priority: number -> node }
    };
  }

  get length() {
    return this[PRIV].length;
  }

  /**
   * Add a new item to the list considering it's priority
   *
   * @param {any} item Item to add to the list
   * @param {number} priority Priority of the item in the list
   * @returns {number} List length
   */
  add(item, priority) {
    if (typeof priority !== 'number') {
      throw new TypeError('Priority must be a number');
    }

    const { priorities, priorityChangePoints } = this[PRIV];

    if (this[PRIV].head === null) {
      // adding the first and only item to the list (A9)
      priorities.push(priority);
      // No change on `priorityChangePoints` - which should be an empty object as of now
      this[PRIV].head = createNode(item, priority);
      this[PRIV].length += 1;

      return this[PRIV].length;
    }

    if (priorities.includes(priority)) {
      /** @type {Node} */
      let nodeToAddAfter;

      if (!Object.prototype.hasOwnProperty.call(priorityChangePoints, priority)) {
        // start from `head` until there's no `next`
        nodeToAddAfter = this[PRIV].head; // B9, C9
      } else {
        // start from `minimumGreater` until there's no `next`
        nodeToAddAfter = priorityChangePoints[priority]; // E7
      }

      while (nodeToAddAfter.next !== null && nodeToAddAfter.next.priority >= priority) {
        nodeToAddAfter = nodeToAddAfter.next;
      }

      const node = createNode(item, priority);
      node.next = nodeToAddAfter.next;
      nodeToAddAfter.next = node;

      this[PRIV].length += 1;

      return this[PRIV].length;
    }

    {
      // also add new priority (D7, H5)
      const insertedAt = findOrInsertAndGetIndex(priorities, priority);
      const minimumGreater = (insertedAt === 0) // minimum priority greater than this `priority`
        ? priority // In this case `priorityChangePoints` should be an empty object TODO Should it?
        : priorities[insertedAt - 1];

      /** @type {Node} */
      let nodeToAddAfter;

      if (!Object.prototype.hasOwnProperty.call(priorityChangePoints, minimumGreater)) {
        // start from `head` until there's no `next`
        nodeToAddAfter = this[PRIV].head; // D7
      } else {
        // start from `minimumGreater` until there's no `next`
        nodeToAddAfter = priorityChangePoints[minimumGreater]; // H5
      }

      while (nodeToAddAfter.next !== null && nodeToAddAfter.next.priority >= priority) {
        nodeToAddAfter = nodeToAddAfter.next;
      }

      const node = createNode(item, priority);
      node.next = nodeToAddAfter.next;
      nodeToAddAfter.next = node;

      priorityChangePoints[priority] = node;

      this[PRIV].length += 1;

      return this[PRIV].length;
    }
  }

  // TODO remove

  get iterator() {
    const self = this;

    return {
      next() {
        if (this.currentNode === null) {
          return { done: true };
        }

        const { value } = this.currentNode;

        this.currentNode = this.currentNode.next;

        return { value, done: false };
      },
      currentNode: self[PRIV].head,
    };
  }

  [Symbol.iterator]() {
    return this.iterator;
  }
}

module.exports = PriorityList;


/**
 * @typedef {object} Node
 * @property {any} value
 * @property {number} priority
 * @property {Node} next
 */
