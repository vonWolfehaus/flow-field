var Signal = (function () {
    function Signal() {
        this._bindings = [];
        this._prevParams = null;
        this.memorize = false;
        this._shouldPropagate = true;
        this.active = true;
    }
    Signal.prototype.validateListener = function (listener, fnName) {
        if (typeof listener !== 'function') {
            throw new Error('listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName));
        }
    };

    Signal.prototype._registerListener = function (listener, isOnce, listenerContext, priority) {
        var prevIndex = this._indexOfListener(listener, listenerContext);
        var binding;

        if (prevIndex !== -1) {
            binding = this._bindings[prevIndex];

            if (binding.isOnce() !== isOnce) {
                throw new Error('You cannot add' + (isOnce ? '' : 'Once') + '() then add' + (!isOnce ? '' : 'Once') + '() the same listener without removing the relationship first.');
            }
        } else {
            binding = new SignalBinding(this, listener, isOnce, listenerContext, priority);

            this._addBinding(binding);
        }

        if (this.memorize && this._prevParams) {
            binding.execute(this._prevParams);
        }

        return binding;
    };

    Signal.prototype._addBinding = function (binding) {
        var n = this._bindings.length;

        do {
            --n;
        } while(this._bindings[n] && binding.priority <= this._bindings[n].priority);

        this._bindings.splice(n + 1, 0, binding);
    };

    Signal.prototype._indexOfListener = function (listener, context) {
        var n = this._bindings.length;
        var cur;

        while (n--) {
            cur = this._bindings[n];

            if (cur.getListener() === listener && cur.context === context) {
                return n;
            }
        }

        return -1;
    };

    Signal.prototype.has = function (listener, context) {
        if (typeof context === "undefined") { context = null; }
        return this._indexOfListener(listener, context) !== -1;
    };

    Signal.prototype.add = function (listener, listenerContext, priority) {
        if (typeof listenerContext === "undefined") { listenerContext = null; }
        if (typeof priority === "undefined") { priority = 0; }
        this.validateListener(listener, 'add');

        return this._registerListener(listener, false, listenerContext, priority);
    };

    Signal.prototype.addOnce = function (listener, listenerContext, priority) {
        if (typeof listenerContext === "undefined") { listenerContext = null; }
        if (typeof priority === "undefined") { priority = 0; }
        this.validateListener(listener, 'addOnce');

        return this._registerListener(listener, true, listenerContext, priority);
    };

    Signal.prototype.remove = function (listener, context) {
        if (typeof context === "undefined") { context = null; }
        this.validateListener(listener, 'remove');

        var i = this._indexOfListener(listener, context);

        if (i !== -1) {
            this._bindings[i]._destroy();
            this._bindings.splice(i, 1);
        }

        return listener;
    };

    Signal.prototype.removeAll = function () {
        var n = this._bindings.length;

        while (n--) {
            this._bindings[n]._destroy();
        }

        this._bindings.length = 0;
    };

    Signal.prototype.getNumListeners = function () {
        return this._bindings.length;
    };

    Signal.prototype.halt = function () {
        this._shouldPropagate = false;
    };

    Signal.prototype.dispatch = function () {
        var paramsArr = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            paramsArr[_i] = arguments[_i + 0];
        }
        if (!this.active) {
            return;
        }

        var n = this._bindings.length;
        var bindings;

        if (this.memorize) {
            this._prevParams = paramsArr;
        }

        if (!n) {
            return;
        }

        bindings = this._bindings.slice(0);

        this._shouldPropagate = true;

        do {
            n--;
        } while(bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
    };

    Signal.prototype.forget = function () {
        this._prevParams = null;
    };

    Signal.prototype.dispose = function () {
        this.removeAll();

        delete this._bindings;
        delete this._prevParams;
    };

    Signal.prototype.toString = function () {
        return '[Signal active:' + this.active + ' numListeners:' + this.getNumListeners() + ']';
    };
    Signal.VERSION = '1.0.0';
    return Signal;
})();
var SignalBinding = (function () {
    function SignalBinding(signal, listener, isOnce, listenerContext, priority) {
        if (typeof priority === "undefined") { priority = 0; }
        this.active = true;
        this.params = null;
        this._listener = listener;
        this._isOnce = isOnce;
        this.context = listenerContext;
        this._signal = signal;
        this.priority = priority || 0;
    }
    SignalBinding.prototype.execute = function (paramsArr) {
        var handlerReturn;
        var params;

        if (this.active && !!this._listener) {
            params = this.params ? this.params.concat(paramsArr) : paramsArr;

            handlerReturn = this._listener.apply(this.context, params);

            if (this._isOnce) {
                this.detach();
            }
        }

        return handlerReturn;
    };

    SignalBinding.prototype.detach = function () {
        return this.isBound() ? this._signal.remove(this._listener, this.context) : null;
    };

    SignalBinding.prototype.isBound = function () {
        return (!!this._signal && !!this._listener);
    };

    SignalBinding.prototype.isOnce = function () {
        return this._isOnce;
    };

    SignalBinding.prototype.getListener = function () {
        return this._listener;
    };

    SignalBinding.prototype.getSignal = function () {
        return this._signal;
    };

    SignalBinding.prototype._destroy = function () {
        delete this._signal;
        delete this._listener;
        delete this.context;
    };

    SignalBinding.prototype.toString = function () {
        return '[SignalBinding isOnce:' + this._isOnce + ', isBound:' + this.isBound() + ', active:' + this.active + ']';
    };
    return SignalBinding;
})();
