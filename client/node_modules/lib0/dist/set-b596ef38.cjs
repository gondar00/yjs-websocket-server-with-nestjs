'use strict';

/**
 * Utility module to work with sets.
 *
 * @module set
 */

const create = () => new Set();

/**
 * @template T
 * @param {Set<T>} set
 * @return {Array<T>}
 */
const toArray = set => Array.from(set);

/**
 * @template T
 * @param {Set<T>} set
 * @return {T}
 */
const first = set => {
  return set.values().next().value || undefined
};

/**
 * @template T
 * @param {Iterable<T>} entries
 * @return {Set<T>}
 */
const from = entries => {
  return new Set(entries)
};

var set = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create,
  toArray: toArray,
  first: first,
  from: from
});

exports.create = create;
exports.first = first;
exports.from = from;
exports.set = set;
exports.toArray = toArray;
//# sourceMappingURL=set-b596ef38.cjs.map
