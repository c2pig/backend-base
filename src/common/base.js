'use strict';
var inherits = require('util').inherits;
var emitter = require('events').EventEmitter;

(function() {
  inherits(Action, emitter);
})();

class Base {
  constructor(mixin) {
      this.mixin = mixin;
      let _this = this;
	  /*
      this.mixin.action.on('emit-next', function(stage, param) {
        console.log(`[DEBUG] - base.js emit: ${_this._getRoute(stage)}`);
        _this.mixin.action.emit(_this._getRoute(stage), param);
      });
	  */
  }

  _this() {
    return this;
  }
  _getRoute(stage) {
	/* TODO: bypass [init] and [input] multiple stage for time being */
	if(stage === "output") {
		return this.mixin.route() + "-" + stage;
	}
	return stage;
  }

  emitNext(stage, param) {
	console.log(`base.js going to ${stage}`);
    if(stage === "init") {
      this.mixin.action.emit('init', stage, param);
    } else {
      this.mixin.action.emit('emit-next', stage, param);
    }
  }

  done() {
    let _this = this;
    try {
      return function(event, context, callback) {
	    console.log('going to emit [init]');
        _this.emitNext('init');
		console.log('going to emit [input]');
        _this.emitNext('input', {event: event, context:context, callback:callback});
      };
    } catch(e) {
      console.log(e.stack);
      _this.mixin.action.emit('error', e);
    }
  }

  _use() {
    /* leave it as it is for time being */
    console.log('Unsupported call for time being');
  }

  _init(ctx, fn) {
    ctx.mixin.init(fn);
    return {
      input: (name, fn) => ctx._input(ctx, name, fn),
      output: (name, fn) => ctx._output(ctx, name, fn),
      error: (fn) => ctx._error(ctx, fn),
      done: (fn) => ctx.done(ctx, fn)
    };
  }

  _input(ctx, name, fn) {
    ctx.mixin.input(name, fn);
    return {
      init: (fn) => this._init(ctx, fn),
      input: (name, fn) => ctx._input(ctx, name, fn),
      output: (name, fn) => ctx._output(ctx, name, fn),
      error: (fn) => ctx._error(ctx, fn),
      done: (fn) => ctx.done(ctx, fn)
    };
  }

  _output(ctx, name, fn) {
    ctx.mixin.output(name, fn);
    return {
      init: (fn) => this._init(ctx, fn),
      input: (name, fn) => ctx._input(ctx, name, fn),
      output: (name, fn) => ctx._output(ctx, name, fn),
      error: (fn) => ctx._error(ctx, name, fn),
      done: (fn) => ctx.done(ctx, name, fn)
    };
  }

  _error(ctx, fn) {
    ctx.mixin.error(fn);
    return {
      done: (fn) => ctx.done(ctx, fn)
    };
  }

  ready() {
    let _this = this;
    return {
      init: (fn) => this._init(_this, fn),
      input: (name, fn) => this._input(_this, name, fn),
      output: (name, fn) => this._output(_this, name, fn),
      error: (fn) => this._error(_this, fn),
    }
  }
}
exports.Base = Base;

function Action() {
  if (! (this instanceof Action)) return new Action();
  emitter.call(this);
}

let action = new Action();
process.on('uncaughtException', (err) => {
  action.emit('error', err);
});

exports.action = action;
