'use strict';
let Base = require('./base').Base;
let action = require('./base').action;
let resource = require('./resources');
let _this = this;
let params, route;

let next = (name, p) => {
  /* TODO: improve checking */
  if(typeof name !== "string") {
	p = name;
    name = "default";
  }
  console.log(`next : update route from ${_this.route} to ${name}`);
  _this.route = name;

  _this.params = p;
};

let emitNext = (stage, arg, to) => {

  return function(name, params) {
    if(typeof name !== "string") {
	  params = name;
      name = "default";
    }
	console.log(`emitNext is going ${stage}`);
	console.log(`emitNext : update route from ${_this.route} to ${name}`);
    _this.route = name;
    _this.params = params;
	action.emit('emit-next', stage, arg);
  }
}

let getRoute = (name, stage) => {
  if(typeof name !== "string") {
    name = "default";
  }
  return name + "-" + stage;
}

let emitRoute = (stage) => {
	/* TODO: bypass [init] and [input] multiple stage for time being */
	if(stage === "output") {
		return _this.route + "-" + stage;
	}
	return stage;
 }

 action.on('emit-next', function(stage, param) {
    console.log(`[DEBUG] - app.js emit: ${emitRoute(stage)}`);
    action.emit(emitRoute(stage), param);
});

let app = new Base({
    action: action,
    route: () => {
      return _this.route || "default";
    },
    init: (fn) => {
      action.on('init', function() {
        fn(resource, next, () => {
          /* dummy implementation, leave it as it is*/
        } , _this.params);
      });
    },
    input: (name, fn) => {
      if(typeof name === "function") {
        fn = name;
        name = "default";
      }
	  /*TODO: does not support multiple input yet */
      action.on('input', function(params) {
        /* params pass down from init -> input -> output */
		console.log('going to emit [output]');
        fn(params.event, emitNext('output', {context: params.context, callback: params.callback}), _this.params, () => {
          /* dummy implementation, leave it as it is*/
        });
      });
    },
    output: (name, fn) => {
      if(typeof name === "function") {
        fn = name;
        name = "default";
      }
      action.on(getRoute(name, 'output'), function(cb) {
        fn( _this.params, cb);
      });
    },
    error: (fn) => {
      action.on('error', function(e) {
        console.log(e.stack);
      //  fn(e);
      });
    }
  });
module.exports = app.ready();
