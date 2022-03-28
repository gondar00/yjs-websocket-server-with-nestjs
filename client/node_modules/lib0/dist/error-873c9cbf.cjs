'use strict';

/**
 * Error helpers.
 *
 * @module error
 */

/* istanbul ignore next */
/**
 * @param {string} s
 * @return {Error}
 */
const create = s => new Error(s);

/* istanbul ignore next */
/**
 * @throws {Error}
 * @return {never}
 */
const methodUnimplemented = () => {
  throw create('Method unimplemented')
};

/* istanbul ignore next */
/**
 * @throws {Error}
 * @return {never}
 */
const unexpectedCase = () => {
  throw create('Unexpected case')
};

var error = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create,
  methodUnimplemented: methodUnimplemented,
  unexpectedCase: unexpectedCase
});

exports.create = create;
exports.error = error;
exports.methodUnimplemented = methodUnimplemented;
exports.unexpectedCase = unexpectedCase;
//# sourceMappingURL=error-873c9cbf.cjs.map
