module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1701461773767, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.tryAcquire = exports.withTimeout = exports.Semaphore = exports.Mutex = void 0;
var tslib_1 = require("tslib");
var Mutex_1 = require("./Mutex");
Object.defineProperty(exports, "Mutex", { enumerable: true, get: function () { return Mutex_1.default; } });
var Semaphore_1 = require("./Semaphore");
Object.defineProperty(exports, "Semaphore", { enumerable: true, get: function () { return Semaphore_1.default; } });
var withTimeout_1 = require("./withTimeout");
Object.defineProperty(exports, "withTimeout", { enumerable: true, get: function () { return withTimeout_1.withTimeout; } });
var tryAcquire_1 = require("./tryAcquire");
Object.defineProperty(exports, "tryAcquire", { enumerable: true, get: function () { return tryAcquire_1.tryAcquire; } });
tslib_1.__exportStar(require("./errors"), exports);

}, function(modId) {var map = {"./Mutex":1701461773768,"./Semaphore":1701461773769,"./withTimeout":1701461773771,"./tryAcquire":1701461773772,"./errors":1701461773770}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1701461773768, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Semaphore_1 = require("./Semaphore");
var Mutex = /** @class */ (function () {
    function Mutex(cancelError) {
        this._semaphore = new Semaphore_1.default(1, cancelError);
    }
    Mutex.prototype.acquire = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, releaser;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._semaphore.acquire()];
                    case 1:
                        _a = _b.sent(), releaser = _a[1];
                        return [2 /*return*/, releaser];
                }
            });
        });
    };
    Mutex.prototype.runExclusive = function (callback) {
        return this._semaphore.runExclusive(function () { return callback(); });
    };
    Mutex.prototype.isLocked = function () {
        return this._semaphore.isLocked();
    };
    Mutex.prototype.waitForUnlock = function () {
        return this._semaphore.waitForUnlock();
    };
    Mutex.prototype.release = function () {
        if (this._semaphore.isLocked())
            this._semaphore.release();
    };
    Mutex.prototype.cancel = function () {
        return this._semaphore.cancel();
    };
    return Mutex;
}());
exports.default = Mutex;

}, function(modId) { var map = {"./Semaphore":1701461773769}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1701461773769, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errors_1 = require("./errors");
var Semaphore = /** @class */ (function () {
    function Semaphore(_value, _cancelError) {
        if (_cancelError === void 0) { _cancelError = errors_1.E_CANCELED; }
        this._value = _value;
        this._cancelError = _cancelError;
        this._weightedQueues = [];
        this._weightedWaiters = [];
    }
    Semaphore.prototype.acquire = function (weight) {
        var _this = this;
        if (weight === void 0) { weight = 1; }
        if (weight <= 0)
            throw new Error("invalid weight ".concat(weight, ": must be positive"));
        return new Promise(function (resolve, reject) {
            if (!_this._weightedQueues[weight - 1])
                _this._weightedQueues[weight - 1] = [];
            _this._weightedQueues[weight - 1].push({ resolve: resolve, reject: reject });
            _this._dispatch();
        });
    };
    Semaphore.prototype.runExclusive = function (callback, weight) {
        if (weight === void 0) { weight = 1; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, value, release;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.acquire(weight)];
                    case 1:
                        _a = _b.sent(), value = _a[0], release = _a[1];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, , 4, 5]);
                        return [4 /*yield*/, callback(value)];
                    case 3: return [2 /*return*/, _b.sent()];
                    case 4:
                        release();
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Semaphore.prototype.waitForUnlock = function (weight) {
        var _this = this;
        if (weight === void 0) { weight = 1; }
        if (weight <= 0)
            throw new Error("invalid weight ".concat(weight, ": must be positive"));
        return new Promise(function (resolve) {
            if (!_this._weightedWaiters[weight - 1])
                _this._weightedWaiters[weight - 1] = [];
            _this._weightedWaiters[weight - 1].push(resolve);
            _this._dispatch();
        });
    };
    Semaphore.prototype.isLocked = function () {
        return this._value <= 0;
    };
    Semaphore.prototype.getValue = function () {
        return this._value;
    };
    Semaphore.prototype.setValue = function (value) {
        this._value = value;
        this._dispatch();
    };
    Semaphore.prototype.release = function (weight) {
        if (weight === void 0) { weight = 1; }
        if (weight <= 0)
            throw new Error("invalid weight ".concat(weight, ": must be positive"));
        this._value += weight;
        this._dispatch();
    };
    Semaphore.prototype.cancel = function () {
        var _this = this;
        this._weightedQueues.forEach(function (queue) { return queue.forEach(function (entry) { return entry.reject(_this._cancelError); }); });
        this._weightedQueues = [];
    };
    Semaphore.prototype._dispatch = function () {
        var _a;
        for (var weight = this._value; weight > 0; weight--) {
            var queueEntry = (_a = this._weightedQueues[weight - 1]) === null || _a === void 0 ? void 0 : _a.shift();
            if (!queueEntry)
                continue;
            var previousValue = this._value;
            var previousWeight = weight;
            this._value -= weight;
            weight = this._value + 1;
            queueEntry.resolve([previousValue, this._newReleaser(previousWeight)]);
        }
        this._drainUnlockWaiters();
    };
    Semaphore.prototype._newReleaser = function (weight) {
        var _this = this;
        var called = false;
        return function () {
            if (called)
                return;
            called = true;
            _this.release(weight);
        };
    };
    Semaphore.prototype._drainUnlockWaiters = function () {
        for (var weight = this._value; weight > 0; weight--) {
            if (!this._weightedWaiters[weight - 1])
                continue;
            this._weightedWaiters[weight - 1].forEach(function (waiter) { return waiter(); });
            this._weightedWaiters[weight - 1] = [];
        }
    };
    return Semaphore;
}());
exports.default = Semaphore;

}, function(modId) { var map = {"./errors":1701461773770}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1701461773770, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.E_CANCELED = exports.E_ALREADY_LOCKED = exports.E_TIMEOUT = void 0;
exports.E_TIMEOUT = new Error('timeout while waiting for mutex to become available');
exports.E_ALREADY_LOCKED = new Error('mutex already locked');
exports.E_CANCELED = new Error('request for lock canceled');

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1701461773771, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.withTimeout = void 0;
var tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
var errors_1 = require("./errors");
function withTimeout(sync, timeout, timeoutError) {
    var _this = this;
    if (timeoutError === void 0) { timeoutError = errors_1.E_TIMEOUT; }
    return {
        acquire: function (weight) {
            if (weight !== undefined && weight <= 0) {
                throw new Error("invalid weight ".concat(weight, ": must be positive"));
            }
            return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var isTimeout, handle, ticket, release, e_1;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            isTimeout = false;
                            handle = setTimeout(function () {
                                isTimeout = true;
                                reject(timeoutError);
                            }, timeout);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, sync.acquire(weight)];
                        case 2:
                            ticket = _a.sent();
                            if (isTimeout) {
                                release = Array.isArray(ticket) ? ticket[1] : ticket;
                                release();
                            }
                            else {
                                clearTimeout(handle);
                                resolve(ticket);
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            if (!isTimeout) {
                                clearTimeout(handle);
                                reject(e_1);
                            }
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        },
        runExclusive: function (callback, weight) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var release, ticket;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            release = function () { return undefined; };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, , 7, 8]);
                            return [4 /*yield*/, this.acquire(weight)];
                        case 2:
                            ticket = _a.sent();
                            if (!Array.isArray(ticket)) return [3 /*break*/, 4];
                            release = ticket[1];
                            return [4 /*yield*/, callback(ticket[0])];
                        case 3: return [2 /*return*/, _a.sent()];
                        case 4:
                            release = ticket;
                            return [4 /*yield*/, callback()];
                        case 5: return [2 /*return*/, _a.sent()];
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            release();
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        },
        release: function (weight) {
            sync.release(weight);
        },
        cancel: function () {
            return sync.cancel();
        },
        waitForUnlock: function (weight) {
            if (weight !== undefined && weight <= 0) {
                throw new Error("invalid weight ".concat(weight, ": must be positive"));
            }
            return new Promise(function (resolve, reject) {
                sync.waitForUnlock(weight).then(resolve);
                setTimeout(function () { return reject(timeoutError); }, timeout);
            });
        },
        isLocked: function () { return sync.isLocked(); },
        getValue: function () { return sync.getValue(); },
        setValue: function (value) { return sync.setValue(value); },
    };
}
exports.withTimeout = withTimeout;

}, function(modId) { var map = {"./errors":1701461773770}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1701461773772, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.tryAcquire = void 0;
var errors_1 = require("./errors");
var withTimeout_1 = require("./withTimeout");
// eslint-disable-next-lisne @typescript-eslint/explicit-module-boundary-types
function tryAcquire(sync, alreadyAcquiredError) {
    if (alreadyAcquiredError === void 0) { alreadyAcquiredError = errors_1.E_ALREADY_LOCKED; }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (0, withTimeout_1.withTimeout)(sync, 0, alreadyAcquiredError);
}
exports.tryAcquire = tryAcquire;

}, function(modId) { var map = {"./errors":1701461773770,"./withTimeout":1701461773771}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1701461773767);
})()
//miniprogram-npm-outsideDeps=["tslib"]
//# sourceMappingURL=index.js.map