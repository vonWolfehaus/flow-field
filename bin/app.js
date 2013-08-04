var Kai;
(function (Kai) {
    Kai.stage;
    Kai.renderer;

    Kai.components;

    Kai.elapsed;
})(Kai || (Kai = {}));
var Vec2 = (function () {
    function Vec2(x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        this.x = x;
        this.y = y;
    }
    Vec2.prototype.setLength = function (value) {
        var oldLength = this.getLength();
        if (oldLength !== 0 && value !== oldLength) {
            this.multiplyScalar(value / oldLength);
        }
        return this;
    };

    Vec2.prototype.getLength = function () {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    };

    Vec2.prototype.getLengthSq = function () {
        return (this.x * this.x) + (this.y * this.y);
    };

    Vec2.prototype.setAngle = function (value) {
        var len = this.getAngle();
        this.x = Math.cos(value) * len;
        this.y = Math.sin(value) * len;
        return this;
    };

    Vec2.prototype.getAngle = function () {
        return Math.atan2(this.y, this.x);
    };

    Vec2.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };

    Vec2.prototype.addScalar = function (s) {
        this.x += s;
        this.y += s;
        return this;
    };

    Vec2.prototype.subtract = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };

    Vec2.prototype.subtractScalar = function (s) {
        this.x -= s;
        this.y -= s;
        return this;
    };

    Vec2.prototype.multiply = function (v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    };

    Vec2.prototype.multiplyScalar = function (s) {
        this.x *= s;
        this.y *= s;
        return this;
    };

    Vec2.prototype.divide = function (v) {
        if (v.x === 0 || v.y === 0)
            return this;
        this.x /= v.x;
        this.y /= v.y;
        return this;
    };

    Vec2.prototype.divideScalar = function (s) {
        if (s === 0)
            return this;
        this.x /= s;
        this.y /= s;
        return this;
    };

    Vec2.prototype.perp = function () {
        this.y = -this.y;
        return this;
    };

    Vec2.prototype.negate = function () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    };

    Vec2.prototype.clamp = function (min, max) {
        if (this.x < min.x) {
            this.x = min.x;
        } else if (this.x > max.x) {
            this.x = max.x;
        }
        if (this.y < min.y) {
            this.y = min.y;
        } else if (this.y > max.y) {
            this.y = max.y;
        }
        return this;
    };

    Vec2.prototype.dotProduct = function (v) {
        return (this.x * v.x + this.y * v.y);
    };

    Vec2.prototype.crossProd = function (v) {
        return this.x * v.y - this.y * v.x;
    };

    Vec2.prototype.truncate = function (max) {
        var i, l = this.getLength();

        if (l === 0)
            return this;

        i = max / l;
        i = i < 1 ? i : 1;
        this.multiplyScalar(i);
        return this;
    };

    Vec2.prototype.angleTo = function (v) {
        var dx = this.x - v.x, dy = this.y - v.y;
        return Math.atan2(dy, dx);
    };

    Vec2.prototype.distanceTo = function (v) {
        return Math.sqrt(this.distanceToSquared(v));
    };

    Vec2.prototype.distanceToSquared = function (v) {
        var dx = this.x - v.x, dy = this.y - v.y;
        return dx * dx + dy * dy;
    };

    Vec2.prototype.lerp = function (v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        return this;
    };

    Vec2.prototype.normalize = function () {
        var length = this.getLength();
        if (length === 0)
            return this;
        this.x /= length;
        this.y /= length;
        return this;
    };

    Vec2.prototype.reset = function (x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        this.x = x;
        this.y = y;
        return this;
    };

    Vec2.prototype.equals = function (v) {
        if (this.x === v.x && this.y === v.y)
            return true;
        return false;
    };

    Vec2.prototype.copy = function (v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    };

    Vec2.prototype.clone = function () {
        return new Vec2(this.x, this.y);
    };

    Vec2.prototype.draw = function (context, startX, startY, drawingColor) {
        if (typeof startX === "undefined") { startX = 0; }
        if (typeof startY === "undefined") { startY = 0; }
        if (typeof drawingColor === "undefined") { drawingColor = 'rgb(0, 250, 0)'; }
        context.strokeStyle = drawingColor;
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(startX + this.x, startY + this.y);
        context.stroke();
    };
    return Vec2;
})();
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var von;
(function (von) {
    var Position2 = (function (_super) {
        __extends(Position2, _super);
        function Position2() {
            _super.apply(this, arguments);
            this.angle = 0;
        }
        return Position2;
    })(Vec2);
    von.Position2 = Position2;
})(von || (von = {}));
var von;
(function (von) {
    var Velocity2 = (function (_super) {
        __extends(Velocity2, _super);
        function Velocity2() {
            _super.apply(this, arguments);
            this.angle = 0;
        }
        return Velocity2;
    })(Vec2);
    von.Velocity2 = Velocity2;
})(von || (von = {}));
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
var von;
(function (von) {
    var Collider2 = (function () {
        function Collider2() {
            this.min = new Vec2();
            this.max = new Vec2();
            this.mass = 1;
            this.invmass = 0;
            this.bounce = 0;
            this.collisionSignal = new Signal();
        }
        Collider2.prototype.setMass = function (newMass) {
            this.mass = newMass;
            if (newMass <= 0) {
                this.invmass = 0;
            } else {
                this.invmass = 1 / newMass;
            }
        };

        Collider2.prototype.update = function () {
        };
        return Collider2;
    })();
    von.Collider2 = Collider2;
})(von || (von = {}));
var von;
(function (von) {
    var LocalState = (function () {
        function LocalState() {
            this.orderID = -1;
            this.groupID = -1;
            this.reachedGoal = true;
        }
        return LocalState;
    })();
    von.LocalState = LocalState;
})(von || (von = {}));
var von;
(function (von) {
    var _desiredVelocity = new Vec2();
    var _maxSpeed;

    var SteeringAI = (function () {
        function SteeringAI() {
            this.behaviors = [];
        }
        SteeringAI.prototype.configure = function (options) {
            _maxSpeed = options.maxSpeed;
        };

        SteeringAI.prototype.add = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            var i;
            for (i = 0; i < args.length; i++) {
                this.behaviors.push(args[i]);
            }
        };

        SteeringAI.prototype.update = function (vel) {
            var i, l = this.behaviors.length, result;

            _desiredVelocity.reset();

            for (i = 0; i < l; i++) {
                result = this.behaviors[i].update(vel);

                _desiredVelocity.add(result);
            }

            _desiredVelocity.subtract(vel);
            _desiredVelocity.truncate(_maxSpeed);

            return _desiredVelocity;
        };
        return SteeringAI;
    })();
    von.SteeringAI = SteeringAI;
})(von || (von = {}));
var von;
(function (von) {
    var _circleCenter = new Vec2();
    var _displacement = new Vec2();
    var _wanderAngle = 0;

    var _timer = 0;
    var _targetAngle = 0;

    var _tau = Math.PI * 2;
    var _hpi = Math.PI / 2;

    var Wander = (function () {
        function Wander(settings) {
            this.circleDistance = 30;
            this.circleRadius = 20;
            this.aggitation = 900;
            this.capriciousness = 50;
        }
        Wander.prototype.configure = function (settings) {
            this.circleDistance = settings.circleDistance;
            this.circleRadius = settings.circleRadius;
        };

        Wander.prototype.update = function (vel) {
            _circleCenter.copy(vel);
            _circleCenter.normalize();
            _circleCenter.multiplyScalar(this.circleDistance);

            _displacement.reset(0, -1);
            _displacement.multiplyScalar(this.circleRadius);

            if (_timer-- <= 0) {
                _timer = this.aggitation + (Math.random() * this.capriciousness - this.capriciousness * 0.5);
                _targetAngle = Math.random() * _tau - _tau * 0.5;
            }

            var len = _displacement.getLength();
            _displacement.x = Math.cos(_targetAngle) * len;
            _displacement.y = Math.sin(_targetAngle) * len;
            _circleCenter.add(_displacement);

            return _circleCenter;
        };
        return Wander;
    })();
    von.Wander = Wander;
})(von || (von = {}));
var von;
(function (von) {
    var _speed = Math.random() * 10 - 5;

    var Boid = (function () {
        function Boid(x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            this.position = new von.Position2();
            this.velocity = new von.Velocity2();
            this.state = new von.LocalState();
            this.steering = new von.SteeringAI();
            this.position.reset(x, y);
            this.velocity.reset(Math.random() * _speed - _speed * 0.5, Math.random() * _speed - _speed * 0.5);

            var texture = PIXI.Texture.fromImage('img/entity.png');
            this.sprite = new PIXI.Sprite(texture);

            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;

            Kai.stage.addChild(this.sprite);

            this.sprite.position = this.position;

            this.steering.add(new von.Wander());

            this.steering.configure({
                maxSpeed: _speed
            });
        }
        Boid.prototype.update = function () {
            var steerForce = this.steering.update(this.velocity);

            this.velocity.add(steerForce);

            this.velocity.normalize().multiplyScalar(_speed);

            this.position.add(this.velocity);

            this.sprite.rotation = Math.atan2(this.velocity.y, this.velocity.x);

            if (this.position.x > window.innerWidth)
                this.position.x = 0;
            if (this.position.x < 0)
                this.position.x = window.innerWidth;
            if (this.position.y > window.innerHeight)
                this.position.y = 0;
            if (this.position.y < 0)
                this.position.y = window.innerHeight;
        };
        return Boid;
    })();
    von.Boid = Boid;
})(von || (von = {}));
var von;
(function (von) {
    var allTheThings = [];
    var timer = 30;

    function update() {
        var i;
        for (i = 0; i < allTheThings.length; i++) {
            allTheThings[i].update();
        }

        Kai.renderer.render(Kai.stage);

        requestAnimFrame(update);
    }

    var Main = (function () {
        function Main(debugCanvas) {
            Kai.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
            document.body.insertBefore(Kai.renderer.view, debugCanvas);

            Kai.stage = new PIXI.Stage(0x151515);

            var i, x = 0, y = 0, amount = 20, size = 50, g = ~~(amount / 4);

            for (i = 0; i < amount; i++) {
                allTheThings.push(new von.Boid(x * size + 100, y * size + 50));
                x++;
                if (x === g) {
                    x = 0;
                    y++;
                }
            }

            update();
        }
        return Main;
    })();
    von.Main = Main;
})(von || (von = {}));
//@ sourceMappingURL=app.js.map
