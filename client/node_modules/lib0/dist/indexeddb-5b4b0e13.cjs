'use strict';

var promise = require('./promise-1a9fe712.cjs');
var error = require('./error-873c9cbf.cjs');

/* eslint-env browser */

/* istanbul ignore next */
/**
 * IDB Request to Promise transformer
 *
 * @param {IDBRequest} request
 * @return {Promise<any>}
 */
const rtop = request => promise.create((resolve, reject) => {
  /* istanbul ignore next */
  // @ts-ignore
  request.onerror = event => reject(new Error(event.target.error));
  /* istanbul ignore next */
  // @ts-ignore
  request.onblocked = () => location.reload();
  // @ts-ignore
  request.onsuccess = event => resolve(event.target.result);
});

/* istanbul ignore next */
/**
 * @param {string} name
 * @param {function(IDBDatabase):any} initDB Called when the database is first created
 * @return {Promise<IDBDatabase>}
 */
const openDB = (name, initDB) => promise.create((resolve, reject) => {
  const request = indexedDB.open(name);
  /**
   * @param {any} event
   */
  request.onupgradeneeded = event => initDB(event.target.result);
  /* istanbul ignore next */
  /**
   * @param {any} event
   */
  request.onerror = event => reject(error.create(event.target.error));
  /* istanbul ignore next */
  request.onblocked = () => location.reload();
  /**
   * @param {any} event
   */
  request.onsuccess = event => {
    /**
     * @type {IDBDatabase}
     */
    const db = event.target.result;
    /* istanbul ignore next */
    db.onversionchange = () => { db.close(); };
    /* istanbul ignore if */
    if (typeof addEventListener !== 'undefined') {
      addEventListener('unload', () => db.close());
    }
    resolve(db);
  };
});

/* istanbul ignore next */
/**
 * @param {string} name
 */
const deleteDB = name => rtop(indexedDB.deleteDatabase(name));

/* istanbul ignore next */
/**
 * @param {IDBDatabase} db
 * @param {Array<Array<string>|Array<string|IDBObjectStoreParameters|undefined>>} definitions
 */
const createStores = (db, definitions) => definitions.forEach(d =>
  // @ts-ignore
  db.createObjectStore.apply(db, d)
);

/**
 * @param {IDBDatabase} db
 * @param {Array<string>} stores
 * @param {"readwrite"|"readonly"} [access]
 * @return {Array<IDBObjectStore>}
 */
const transact = (db, stores, access = 'readwrite') => {
  const transaction = db.transaction(stores, access);
  return stores.map(store => getStore(transaction, store))
};

/* istanbul ignore next */
/**
 * @param {IDBObjectStore} store
 * @param {IDBKeyRange} [range]
 * @return {Promise<number>}
 */
const count = (store, range) =>
  rtop(store.count(range));

/* istanbul ignore next */
/**
 * @param {IDBObjectStore} store
 * @param {String | number | ArrayBuffer | Date | Array<any> } key
 * @return {Promise<String | number | ArrayBuffer | Date | Array<any>>}
 */
const get = (store, key) =>
  rtop(store.get(key));

/* istanbul ignore next */
/**
 * @param {IDBObjectStore} store
 * @param {String | number | ArrayBuffer | Date | IDBKeyRange | Array<any> } key
 */
const del = (store, key) =>
  rtop(store.delete(key));

/* istanbul ignore next */
/**
 * @param {IDBObjectStore} store
 * @param {String | number | ArrayBuffer | Date | boolean} item
 * @param {String | number | ArrayBuffer | Date | Array<any>} [key]
 */
const put = (store, item, key) =>
  rtop(store.put(item, key));

/* istanbul ignore next */
/**
 * @param {IDBObjectStore} store
 * @param {String | number | ArrayBuffer | Date | boolean}  item
 * @param {String | number | ArrayBuffer | Date | Array<any>}  key
 * @return {Promise<any>}
 */
const add = (store, item, key) =>
  rtop(store.add(item, key));

/* istanbul ignore next */
/**
 * @param {IDBObjectStore} store
 * @param {String | number | ArrayBuffer | Date}  item
 * @return {Promise<number>} Returns the generated key
 */
const addAutoKey = (store, item) =>
  rtop(store.add(item));

/* istanbul ignore next */
/**
 * @param {IDBObjectStore} store
 * @param {IDBKeyRange} [range]
 * @return {Promise<Array<any>>}
 */
const getAll = (store, range) =>
  rtop(store.getAll(range));

/* istanbul ignore next */
/**
 * @param {IDBObjectStore} store
 * @param {IDBKeyRange} [range]
 * @return {Promise<Array<any>>}
 */
const getAllKeys = (store, range) =>
  rtop(store.getAllKeys(range));

/**
 * @param {IDBObjectStore} store
 * @param {IDBKeyRange|null} query
 * @param {'next'|'prev'|'nextunique'|'prevunique'} direction
 * @return {Promise<any>}
 */
const queryFirst = (store, query, direction) => {
  /**
   * @type {any}
   */
  let first = null;
  return iterateKeys(store, query, key => {
    first = key;
    return false
  }, direction).then(() => first)
};

/**
 * @param {IDBObjectStore} store
 * @param {IDBKeyRange?} [range]
 * @return {Promise<any>}
 */
const getLastKey = (store, range = null) => queryFirst(store, range, 'prev');

/**
 * @param {IDBObjectStore} store
 * @param {IDBKeyRange?} [range]
 * @return {Promise<any>}
 */
const getFirstKey = (store, range = null) => queryFirst(store, range, 'next');

/**
 * @typedef KeyValuePair
 * @type {Object}
 * @property {any} k key
 * @property {any} v Value
 */

/* istanbul ignore next */
/**
 * @param {IDBObjectStore} store
 * @param {IDBKeyRange} [range]
 * @return {Promise<Array<KeyValuePair>>}
 */
const getAllKeysValues = (store, range) =>
  // @ts-ignore
  promise.all([getAllKeys(store, range), getAll(store, range)]).then(([ks, vs]) => ks.map((k, i) => ({ k, v: vs[i] })));

/* istanbul ignore next */
/**
 * @param {any} request
 * @param {function(IDBCursorWithValue):void|boolean} f
 * @return {Promise<void>}
 */
const iterateOnRequest = (request, f) => promise.create((resolve, reject) => {
  /* istanbul ignore next */
  request.onerror = reject;
  /**
   * @param {any} event
   */
  request.onsuccess = event => {
    const cursor = event.target.result;
    if (cursor === null || f(cursor) === false) {
      return resolve()
    }
    cursor.continue();
  };
});

/* istanbul ignore next */
/**
 * Iterate on keys and values
 * @param {IDBObjectStore} store
 * @param {IDBKeyRange|null} keyrange
 * @param {function(any,any):void|boolean} f Callback that receives (value, key)
 * @param {'next'|'prev'|'nextunique'|'prevunique'} direction
 */
const iterate = (store, keyrange, f, direction = 'next') =>
  iterateOnRequest(store.openCursor(keyrange, direction), cursor => f(cursor.value, cursor.key));

/* istanbul ignore next */
/**
 * Iterate on the keys (no values)
 *
 * @param {IDBObjectStore} store
 * @param {IDBKeyRange|null} keyrange
 * @param {function(any):void|boolean} f callback that receives the key
 * @param {'next'|'prev'|'nextunique'|'prevunique'} direction
 */
const iterateKeys = (store, keyrange, f, direction = 'next') =>
  iterateOnRequest(store.openKeyCursor(keyrange, direction), cursor => f(cursor.key));

/* istanbul ignore next */
/**
 * Open store from transaction
 * @param {IDBTransaction} t
 * @param {String} store
 * @returns {IDBObjectStore}
 */
const getStore = (t, store) => t.objectStore(store);

/* istanbul ignore next */
/**
 * @param {any} lower
 * @param {any} upper
 * @param {boolean} lowerOpen
 * @param {boolean} upperOpen
 */
const createIDBKeyRangeBound = (lower, upper, lowerOpen, upperOpen) => IDBKeyRange.bound(lower, upper, lowerOpen, upperOpen);

/* istanbul ignore next */
/**
 * @param {any} upper
 * @param {boolean} upperOpen
 */
const createIDBKeyRangeUpperBound = (upper, upperOpen) => IDBKeyRange.upperBound(upper, upperOpen);

/* istanbul ignore next */
/**
 * @param {any} lower
 * @param {boolean} lowerOpen
 */
const createIDBKeyRangeLowerBound = (lower, lowerOpen) => IDBKeyRange.lowerBound(lower, lowerOpen);

var indexeddb = /*#__PURE__*/Object.freeze({
  __proto__: null,
  rtop: rtop,
  openDB: openDB,
  deleteDB: deleteDB,
  createStores: createStores,
  transact: transact,
  count: count,
  get: get,
  del: del,
  put: put,
  add: add,
  addAutoKey: addAutoKey,
  getAll: getAll,
  getAllKeys: getAllKeys,
  queryFirst: queryFirst,
  getLastKey: getLastKey,
  getFirstKey: getFirstKey,
  getAllKeysValues: getAllKeysValues,
  iterate: iterate,
  iterateKeys: iterateKeys,
  getStore: getStore,
  createIDBKeyRangeBound: createIDBKeyRangeBound,
  createIDBKeyRangeUpperBound: createIDBKeyRangeUpperBound,
  createIDBKeyRangeLowerBound: createIDBKeyRangeLowerBound
});

exports.add = add;
exports.addAutoKey = addAutoKey;
exports.count = count;
exports.createIDBKeyRangeBound = createIDBKeyRangeBound;
exports.createIDBKeyRangeLowerBound = createIDBKeyRangeLowerBound;
exports.createIDBKeyRangeUpperBound = createIDBKeyRangeUpperBound;
exports.createStores = createStores;
exports.del = del;
exports.deleteDB = deleteDB;
exports.get = get;
exports.getAll = getAll;
exports.getAllKeys = getAllKeys;
exports.getAllKeysValues = getAllKeysValues;
exports.getFirstKey = getFirstKey;
exports.getLastKey = getLastKey;
exports.getStore = getStore;
exports.indexeddb = indexeddb;
exports.iterate = iterate;
exports.iterateKeys = iterateKeys;
exports.openDB = openDB;
exports.put = put;
exports.queryFirst = queryFirst;
exports.rtop = rtop;
exports.transact = transact;
//# sourceMappingURL=indexeddb-5b4b0e13.cjs.map
