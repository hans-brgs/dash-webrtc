/*! For license information please see async-DashWebrtc.js.LICENSE.txt */
"use strict";(self.webpackChunkdash_webrtc=self.webpackChunkdash_webrtc||[]).push([[349],{698:(e,t,n)=>{n.r(t),n.d(t,{default:()=>M});var r=n(609),o=n(120),i=n.n(o);const a={NEW:"new",CONNECTING:"connecting",CONNECTED:"connected",FAILED:"failed",CLOSED:"closed"};function s(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return{log:function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"log";(t||"error"===n)&&function(t,n,r){var o=console[t]||console.log,i="[".concat(e,"] ").concat((new Date).toISOString().slice(11,23)," -");r?o(i,n,r):o(i,n)}(n,arguments.length>1?arguments[1]:void 0,arguments.length>2?arguments[2]:void 0)}}}function c(e){return c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},c(e)}function l(){l=function(){return t};var e,t={},n=Object.prototype,r=n.hasOwnProperty,o=Object.defineProperty||function(e,t,n){e[t]=n.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",s=i.asyncIterator||"@@asyncIterator",u=i.toStringTag||"@@toStringTag";function g(e,t,n){return Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{g({},"")}catch(e){g=function(e,t,n){return e[t]=n}}function h(e,t,n,r){var i=t&&t.prototype instanceof b?t:b,a=Object.create(i.prototype),s=new D(r||[]);return o(a,"_invoke",{value:L(e,n,s)}),a}function f(e,t,n){try{return{type:"normal",arg:e.call(t,n)}}catch(e){return{type:"throw",arg:e}}}t.wrap=h;var d="suspendedStart",p="suspendedYield",v="executing",m="completed",y={};function b(){}function w(){}function S(){}var k={};g(k,a,(function(){return this}));var E=Object.getPrototypeOf,C=E&&E(E(j([])));C&&C!==n&&r.call(C,a)&&(k=C);var x=S.prototype=b.prototype=Object.create(k);function M(e){["next","throw","return"].forEach((function(t){g(e,t,(function(e){return this._invoke(t,e)}))}))}function O(e,t){function n(o,i,a,s){var l=f(e[o],e,i);if("throw"!==l.type){var u=l.arg,g=u.value;return g&&"object"==c(g)&&r.call(g,"__await")?t.resolve(g.__await).then((function(e){n("next",e,a,s)}),(function(e){n("throw",e,a,s)})):t.resolve(g).then((function(e){u.value=e,a(u)}),(function(e){return n("throw",e,a,s)}))}s(l.arg)}var i;o(this,"_invoke",{value:function(e,r){function o(){return new t((function(t,o){n(e,r,t,o)}))}return i=i?i.then(o,o):o()}})}function L(t,n,r){var o=d;return function(i,a){if(o===v)throw Error("Generator is already running");if(o===m){if("throw"===i)throw a;return{value:e,done:!0}}for(r.method=i,r.arg=a;;){var s=r.delegate;if(s){var c=T(s,r);if(c){if(c===y)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(o===d)throw o=m,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);o=v;var l=f(t,n,r);if("normal"===l.type){if(o=r.done?m:p,l.arg===y)continue;return{value:l.arg,done:r.done}}"throw"===l.type&&(o=m,r.method="throw",r.arg=l.arg)}}}function T(t,n){var r=n.method,o=t.iterator[r];if(o===e)return n.delegate=null,"throw"===r&&t.iterator.return&&(n.method="return",n.arg=e,T(t,n),"throw"===n.method)||"return"!==r&&(n.method="throw",n.arg=new TypeError("The iterator does not provide a '"+r+"' method")),y;var i=f(o,t.iterator,n.arg);if("throw"===i.type)return n.method="throw",n.arg=i.arg,n.delegate=null,y;var a=i.arg;return a?a.done?(n[t.resultName]=a.value,n.next=t.nextLoc,"return"!==n.method&&(n.method="next",n.arg=e),n.delegate=null,y):a:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,y)}function I(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function P(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function D(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(I,this),this.reset(!0)}function j(t){if(t||""===t){var n=t[a];if(n)return n.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,i=function n(){for(;++o<t.length;)if(r.call(t,o))return n.value=t[o],n.done=!1,n;return n.value=e,n.done=!0,n};return i.next=i}}throw new TypeError(c(t)+" is not iterable")}return w.prototype=S,o(x,"constructor",{value:S,configurable:!0}),o(S,"constructor",{value:w,configurable:!0}),w.displayName=g(S,u,"GeneratorFunction"),t.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===w||"GeneratorFunction"===(t.displayName||t.name))},t.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,S):(e.__proto__=S,g(e,u,"GeneratorFunction")),e.prototype=Object.create(x),e},t.awrap=function(e){return{__await:e}},M(O.prototype),g(O.prototype,s,(function(){return this})),t.AsyncIterator=O,t.async=function(e,n,r,o,i){void 0===i&&(i=Promise);var a=new O(h(e,n,r,o),i);return t.isGeneratorFunction(n)?a:a.next().then((function(e){return e.done?e.value:a.next()}))},M(x),g(x,u,"Generator"),g(x,a,(function(){return this})),g(x,"toString",(function(){return"[object Generator]"})),t.keys=function(e){var t=Object(e),n=[];for(var r in t)n.push(r);return n.reverse(),function e(){for(;n.length;){var r=n.pop();if(r in t)return e.value=r,e.done=!1,e}return e.done=!0,e}},t.values=j,D.prototype={constructor:D,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(P),!t)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=e)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var n=this;function o(r,o){return s.type="throw",s.arg=t,n.next=r,o&&(n.method="next",n.arg=e),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],s=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var c=r.call(a,"catchLoc"),l=r.call(a,"finallyLoc");if(c&&l){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!l)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(e,t){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=e,a.arg=t,i?(this.method="next",this.next=i.finallyLoc,y):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),y},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.finallyLoc===e)return this.complete(n.completion,n.afterLoc),P(n),y}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.tryLoc===e){var r=n.completion;if("throw"===r.type){var o=r.arg;P(n)}return o}}throw Error("illegal catch attempt")},delegateYield:function(t,n,r){return this.delegate={iterator:j(t),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=e),y}},t}function u(e,t,n,r,o,i,a){try{var s=e[i](a),c=s.value}catch(e){return void n(e)}s.done?t(c):Promise.resolve(c).then(r,o)}function g(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var i=e.apply(t,n);function a(e){u(i,r,o,a,s,"next",e)}function s(e){u(i,r,o,a,s,"throw",e)}a(void 0)}))}}function h(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,f(r.key),r)}}function f(e){var t=function(e){if("object"!=c(e)||!e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var n=t.call(e,"string");if("object"!=c(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==c(t)?t:t+""}var d=function(){return e=function e(t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:3,o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1e3,i=arguments.length>5&&void 0!==arguments[5]?arguments[5]:null;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.url=t,this.debugMode=n,this.maxRetries=r,this.retryInterval=o,this.openingMessage=i,this.logger=s("SignalingWsClient",n),this.ws=null,this.connectionStatus=null,this.onMessage=null,this.onConnectionStatusChange=null},t=[{key:"connect",value:(n=g(l().mark((function e(){var t,n,r=this;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=0,n=function(){var e=g(l().mark((function e(){return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r.logger.log("info","Attempting to connect to WebSocket server",{url:r.url}),e.prev=1,e.next=4,new Promise((function(e,t){var n=new WebSocket(r.url);r.connectionStatus="CONNECTING",r.onConnectionStatusChange&&r.onConnectionStatusChange(r.connectionStatus),r.logger.log("info","WebSocket connection in progress"),n.onopen=function(){r.logger.log("info","WebSocket connection established"),r.connectionStatus="CONNECTED",r.onConnectionStatusChange&&r.onConnectionStatusChange(r.connectionStatus),r.ws=n,r.openingMessage&&(r.logger.log("info","Sending opening message"),r.send(r.openingMessage)),r._setupEventListeners(n),e(n)},n.onerror=function(e){return t(e)},setTimeout((function(){n.readyState!==WebSocket.OPEN&&(n.close(),r.connectionStatus="FAILED",r.onConnectionStatusChange&&r.onConnectionStatusChange(r.connectionStatus),t(new Error("Connection timeout")))}),3e3)}));case 4:return e.abrupt("return",e.sent);case 7:if(e.prev=7,e.t0=e.catch(1),!(t>=r.maxRetries)){e.next=13;break}throw new Error("Failed to connect after ".concat(t," attempts: ").concat(e.t0.message));case 13:return r.logger.log("warn","Failed to connect: ".concat(e.t0.message,". Retrying in ").concat(r.retryInterval,"ms")),t++,e.next=17,new Promise((function(e){return setTimeout(e,r.retryInterval)}));case 17:return e.abrupt("return",n());case 18:case 19:case"end":return e.stop()}}),e,null,[[1,7]])})));return function(){return e.apply(this,arguments)}}(),e.abrupt("return",n());case 3:case"end":return e.stop()}}),e)}))),function(){return n.apply(this,arguments)})},{key:"_setupEventListeners",value:function(e){var t=this;e.onmessage=function(e){t.logger.log("info","Received message",{event:e}),t.onMessage&&t.onMessage(JSON.parse(e.data))},e.onclose=function(e){t.logger.log("info","WebSocket connection closed",{event:e}),t.connectionStatus="CLOSED",t.onConnectionStatusChange&&t.onConnectionStatusChange(t.connectionStatus)},e.onerror=function(e){t.logger.log("error","WebSocket connection error",{event:e}),t.connectionStatus="FAILED",t.onConnectionStatusChange&&t.onConnectionStatusChange(t.connectionStatus)}}},{key:"send",value:function(e){if(this.ws&&this.ws.readyState===WebSocket.OPEN){var t="object"===c(e)?JSON.stringify(e):e;this.ws.send(t),this.logger.log("info","Sending message",e)}else this.logger.log("warn","WebSocket connection is not open. Cannot send message",{message:e})}},{key:"close",value:function(){this.ws&&(this.logger.log("info","Closing WebSocket connection"),this.connectionStatus="CLOSING",this.onConnectionStatusChange&&this.onConnectionStatusChange(this.connectionStatus),this.ws.close(),this.logger.log("info","WebSocket connection closed"),this.connectionStatus="CLOSED",this.onConnectionStatusChange&&this.onConnectionStatusChange(this.connectionStatus),this.url=null,this.ws=null,this.onConnectionStatusChange=null,this.onMessage=null)}}],t&&h(e.prototype,t),Object.defineProperty(e,"prototype",{writable:!1}),e;var e,t,n}();function p(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=function(e,t){if(e){if("string"==typeof e)return v(e,t);var n={}.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?v(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0,o=function(){};return{s:o,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return a=e.done,e},e:function(e){s=!0,i=e},f:function(){try{a||null==n.return||n.return()}finally{if(s)throw i}}}}function v(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function m(){m=function(){return t};var e,t={},n=Object.prototype,r=n.hasOwnProperty,o=Object.defineProperty||function(e,t,n){e[t]=n.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",s=i.asyncIterator||"@@asyncIterator",c=i.toStringTag||"@@toStringTag";function l(e,t,n){return Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{l({},"")}catch(e){l=function(e,t,n){return e[t]=n}}function u(e,t,n,r){var i=t&&t.prototype instanceof b?t:b,a=Object.create(i.prototype),s=new D(r||[]);return o(a,"_invoke",{value:L(e,n,s)}),a}function g(e,t,n){try{return{type:"normal",arg:e.call(t,n)}}catch(e){return{type:"throw",arg:e}}}t.wrap=u;var h="suspendedStart",f="suspendedYield",d="executing",p="completed",v={};function b(){}function w(){}function S(){}var k={};l(k,a,(function(){return this}));var E=Object.getPrototypeOf,C=E&&E(E(j([])));C&&C!==n&&r.call(C,a)&&(k=C);var x=S.prototype=b.prototype=Object.create(k);function M(e){["next","throw","return"].forEach((function(t){l(e,t,(function(e){return this._invoke(t,e)}))}))}function O(e,t){function n(o,i,a,s){var c=g(e[o],e,i);if("throw"!==c.type){var l=c.arg,u=l.value;return u&&"object"==y(u)&&r.call(u,"__await")?t.resolve(u.__await).then((function(e){n("next",e,a,s)}),(function(e){n("throw",e,a,s)})):t.resolve(u).then((function(e){l.value=e,a(l)}),(function(e){return n("throw",e,a,s)}))}s(c.arg)}var i;o(this,"_invoke",{value:function(e,r){function o(){return new t((function(t,o){n(e,r,t,o)}))}return i=i?i.then(o,o):o()}})}function L(t,n,r){var o=h;return function(i,a){if(o===d)throw Error("Generator is already running");if(o===p){if("throw"===i)throw a;return{value:e,done:!0}}for(r.method=i,r.arg=a;;){var s=r.delegate;if(s){var c=T(s,r);if(c){if(c===v)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(o===h)throw o=p,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);o=d;var l=g(t,n,r);if("normal"===l.type){if(o=r.done?p:f,l.arg===v)continue;return{value:l.arg,done:r.done}}"throw"===l.type&&(o=p,r.method="throw",r.arg=l.arg)}}}function T(t,n){var r=n.method,o=t.iterator[r];if(o===e)return n.delegate=null,"throw"===r&&t.iterator.return&&(n.method="return",n.arg=e,T(t,n),"throw"===n.method)||"return"!==r&&(n.method="throw",n.arg=new TypeError("The iterator does not provide a '"+r+"' method")),v;var i=g(o,t.iterator,n.arg);if("throw"===i.type)return n.method="throw",n.arg=i.arg,n.delegate=null,v;var a=i.arg;return a?a.done?(n[t.resultName]=a.value,n.next=t.nextLoc,"return"!==n.method&&(n.method="next",n.arg=e),n.delegate=null,v):a:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,v)}function I(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function P(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function D(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(I,this),this.reset(!0)}function j(t){if(t||""===t){var n=t[a];if(n)return n.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,i=function n(){for(;++o<t.length;)if(r.call(t,o))return n.value=t[o],n.done=!1,n;return n.value=e,n.done=!0,n};return i.next=i}}throw new TypeError(y(t)+" is not iterable")}return w.prototype=S,o(x,"constructor",{value:S,configurable:!0}),o(S,"constructor",{value:w,configurable:!0}),w.displayName=l(S,c,"GeneratorFunction"),t.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===w||"GeneratorFunction"===(t.displayName||t.name))},t.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,S):(e.__proto__=S,l(e,c,"GeneratorFunction")),e.prototype=Object.create(x),e},t.awrap=function(e){return{__await:e}},M(O.prototype),l(O.prototype,s,(function(){return this})),t.AsyncIterator=O,t.async=function(e,n,r,o,i){void 0===i&&(i=Promise);var a=new O(u(e,n,r,o),i);return t.isGeneratorFunction(n)?a:a.next().then((function(e){return e.done?e.value:a.next()}))},M(x),l(x,c,"Generator"),l(x,a,(function(){return this})),l(x,"toString",(function(){return"[object Generator]"})),t.keys=function(e){var t=Object(e),n=[];for(var r in t)n.push(r);return n.reverse(),function e(){for(;n.length;){var r=n.pop();if(r in t)return e.value=r,e.done=!1,e}return e.done=!0,e}},t.values=j,D.prototype={constructor:D,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(P),!t)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=e)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var n=this;function o(r,o){return s.type="throw",s.arg=t,n.next=r,o&&(n.method="next",n.arg=e),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],s=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var c=r.call(a,"catchLoc"),l=r.call(a,"finallyLoc");if(c&&l){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!l)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(e,t){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=e,a.arg=t,i?(this.method="next",this.next=i.finallyLoc,v):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),v},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.finallyLoc===e)return this.complete(n.completion,n.afterLoc),P(n),v}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.tryLoc===e){var r=n.completion;if("throw"===r.type){var o=r.arg;P(n)}return o}}throw Error("illegal catch attempt")},delegateYield:function(t,n,r){return this.delegate={iterator:j(t),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=e),v}},t}function y(e){return y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},y(e)}function b(e,t,n,r,o,i,a){try{var s=e[i](a),c=s.value}catch(e){return void n(e)}s.done?t(c):Promise.resolve(c).then(r,o)}function w(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var i=e.apply(t,n);function a(e){b(i,r,o,a,s,"next",e)}function s(e){b(i,r,o,a,s,"throw",e)}a(void 0)}))}}function S(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,k(r.key),r)}}function k(e){var t=function(e){if("object"!=y(e)||!e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var n=t.call(e,"string");if("object"!=y(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==y(t)?t:t+""}function E(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return(E=function(){return!!e})()}function C(e){return C=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},C(e)}function x(e,t){return x=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},x(e,t)}var M=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=function(e,t,n){return t=C(t),function(e,t){if(t&&("object"==y(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}(e,E()?Reflect.construct(t,n||[],C(e).constructor):t.apply(e,n))}(this,t,[e])).iceConfig=n.props.iceServersConfig||{iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"},{urls:"turn:openrelay.metered.ca:80",username:"openrelayproject",credential:"openrelayproject"}],iceCandidatePoolSize:10,iceTransportPolicy:"all"},n.pc=new RTCPeerConnection(n.iceConfig),n.pc.onicecandidate=n.handleIceCandidate.bind(n),n.pc.onconnectionstatechange=n.handleConnectionStateChange.bind(n),n.pc.onnegotiationneeded=n.handleNegotiationNeeded.bind(n),n.pc.ontrack=n.handleAddTrack.bind(n),n.pc.onicegatheringstatechange=n.handleIceGatheringStateChange.bind(n),n.signalingClient=new d(n.props.signalingUrl,n.props.signalingServerProtocols,n.props.debug,n.props.signalingServerMaxRetries,n.props.signalingServerRetryInterval,n.props.signalingServerOpeningMessage),n.signalingClient.onConnectionStatusChange=n.handleSignalingConnectionStatusChange.bind(n),n.signalingClient.onMessage=n.handleSignalingMessage.bind(n),n.logger=s("DashWebrtc",n.props.debug),n.state={status:a.CLOSED,error:null},n.incomingMediaStreams=new Map,n.outgoingMediaStreams=null,n.makingOffer=!1,n.ignoreIncomingOffer=!1,n.isSettingRemoteAnswerPending=!1,n.polite=n.props.polite||null,n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&x(e,t)}(t,e),n=t,r=[{key:"handleSignalingMessage",value:(f=w(m().mark((function e(t){var n,r,o,i,s,c;return m().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,this.pc){e.next=3;break}return e.abrupt("return");case 3:if(n=t.description,r=t.candidate,o=t.role,!n){e.next=24;break}if(this.logger.log("log","Received description signaling message:",n),i=!this.makingOffer&&("stable"===this.pc.signalingState||this.isSettingRemoteAnswerPending),s="offer"===n.type&&!i,this.polite&&"boolean"!==!y(this.polite)){e.next=10;break}throw new Error("Invalid politeness mode. Must be a boolean value. This property is required. Should be set by the user or the signaling server.");case 10:if(this.ignoreIncomingOffer=!this.polite&&s,!this.ignoreIncomingOffer){e.next=13;break}return e.abrupt("return");case 13:return this.isSettingRemoteAnswerPending="answer"===n.type,e.next=16,this.pc.setRemoteDescription(n);case 16:if(this.isSettingRemoteAnswerPending=!1,"offer"!==n.type){e.next=22;break}return e.next=20,this.pc.setLocalDescription();case 20:this.logger.log("log","Sending answer to remote peer:",this.pc.localDescription),this.signalingClient.send({description:this.pc.localDescription});case 22:e.next=38;break;case 24:if(!r){e.next=37;break}return this.logger.log("log","Received candidate signaling message:",r),e.prev=26,e.next=29,this.pc.addIceCandidate(r);case 29:e.next=35;break;case 31:if(e.prev=31,e.t0=e.catch(26),this.ignoreIncomingOffer){e.next=35;break}throw e.t0;case 35:e.next=38;break;case 37:o?(c=o.polite)?"boolean"===!y(c)?this.logger.log("warn","Invalid role signaling message. `polite` must be a boolean :",t):(this.polite=c,this.logger.log("log","Politeness mode updated:",this.polite)):this.logger.log("warn","Invalid role signaling message. No `polite` found :",t):this.logger.log("warn","Invalid signaling message. No `description` or `candidate` found:",t);case 38:e.next=44;break;case 40:e.prev=40,e.t1=e.catch(0),this.logger.log("error","Error handling signaling message:",e.t1),this.setState({status:a.ERROR,error:"Signaling error: ".concat(e.t1.message)});case 44:case"end":return e.stop()}}),e,this,[[0,40],[26,31]])}))),function(e){return f.apply(this,arguments)})},{key:"handleSignalingConnectionStatusChange",value:function(e){this.logger.log("log","Signaling connection status:",e)}},{key:"handleIceCandidate",value:function(e){this.logger.log("log","handleIceCandidate event:",e),this.signalingClient.send({candidate:e.candidate})}},{key:"handleConnectionStateChange",value:function(e){if(this.pc){var t=this.pc.connectionState;switch(this.logger.log("log","RTCPeerConnection state:",t),t){case"new":this.setState({status:a.NEW});break;case"connecting":this.setState({status:a.CONNECTING});break;case"connected":this.setState({status:a.CONNECTED});break;case"failed":this.setState({status:a.FAILED});break;case"closed":this.setState({status:a.CLOSED})}}}},{key:"handleNegotiationNeeded",value:(h=w(m().mark((function e(t){return m().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.pc){e.next=2;break}return e.abrupt("return");case 2:return this.logger.log("log","handleNegotiationNeeded event:",t),e.prev=3,this.makingOffer=!0,e.next=7,this.pc.setLocalDescription();case 7:this.logger.log("log","Sending offer to remote peer:",this.pc.localDescription),this.signalingClient.send({description:this.pc.localDescription}),e.next=15;break;case 11:e.prev=11,e.t0=e.catch(3),this.logger.log("error","Error during negotiation:",e.t0),this.setState({status:a.FAILED,error:"Error during negotiation: ".concat(e.t0.message)});case 15:return e.prev=15,this.makingOffer=!1,e.finish(15);case 18:case"end":return e.stop()}}),e,this,[[3,11,15,18]])}))),function(e){return h.apply(this,arguments)})},{key:"handleIceGatheringStateChange",value:function(e){if(this.pc){var t=this.pc.iceGatheringState;this.logger.log("log","IceGathering state:",t)}}},{key:"handleAddTrack",value:function(e){var t=this,n=e.track,r=e.streams;this.logger.log("log","Received track: ".concat(n.id,", kind: ").concat(n.kind)),this.logger.log("log","Streams received with track: ".concat(r.length));try{if(!r||0===r.length)return void this.logger.log("warn","No streams found for the track:",n.kind);this.logger.log("log","First stream ID: ".concat(r[0].id,", track count: ").concat(r[0].getTracks().length)),n.onunmute=function(){t.logger.log("log","Track is unmuted: ".concat(n.kind,", id: ").concat(n.id)),t.connectStreamsToElements(r[0],t.props.incomingMediaElementsId)}}catch(e){this.logger.log("error","Error handling new track:",e),this.setState({status:a.ERROR,error:"Error handling new track: ".concat(e.message)})}}},{key:"connectStreamsToElements",value:function(e,t){var n=this;if(e&&t)try{var r=e.getAudioTracks();r.length>1&&this.logger.log("warn","Multiple audio tracks found. Only the first one will be used.");var o=e.getVideoTracks();o.length>1&&this.logger.log("warn","Multiple video tracks found. Separate them into different streams.");var i=0;o.forEach((function(e){n.incomingMediaStreams.set(i,new MediaStream),n.incomingMediaStreams.get(i).addTrack(e)}));var a=!0;i=0,r.forEach((function(e){n.incomingMediaStreams.get(i)||n.incomingMediaStreams.set(i,new MediaStream),a&&r.length>i?(n.incomingMediaStreams.get(i).addTrack(e),a=!1):a||n.logger.log("warn","Multiple audio tracks found. This implementation only supports one audio track.")})),this.incomingMediaStreams.size>t.length&&this.logger.log("warn","Not enough media elements to connect all tracks"),t.forEach((function(e,t){document.getElementById(e)&&(document.getElementById(e).srcObject=n.incomingMediaStreams.get(t),n.logger.log("log","Media element ".concat(e," connected to stream:"),n.incomingMediaStreams.get(t)))}))}catch(t){this.logger.log("error","Error connecting stream ".concat(e.id," to element:"),t)}else this.logger.log("warn","No incoming media streams or element IDs to connect")}},{key:"disconnectStreamsToElements",value:function(e){var t=this;console.log("disconnectStreamsToElements",e),e?e.forEach((function(e){if(document.getElementById(e)){var n=document.getElementById(e);n.srcObject&&n.pause(),n.srcObject=null,t.logger.log("log","Media element disconnected:",e)}})):this.logger.log("warn","No incoming media elements to disconnect")}},{key:"validateContraints",value:function(){var e=this.props.mediaDevicesConstraints;if(console.log("validateContraints",e),!e.audio&&!e.video)throw new Error("At least one media type must be requested. Modify the `mediaDevicesConstraints` prop.");if(e.audio&&"boolean"!=typeof e.audio&&"object"!==y(e.audio))throw new Error("Invalid audio constraints format. Modify the `mediaDevicesConstraints` prop.");if(e.video&&"boolean"!=typeof e.video&&"object"!==y(e.video))throw new Error("Invalid video constraints format. Modify the `mediaDevicesConstraints` prop.")}},{key:"updateOutgoingMediaStreams",value:(g=w(m().mark((function e(){var t,n,r,o,i,s,c,l,u,g,h,f,d,v,y,b,w,S,k,E,C;return m().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,this.validateContraints(),e.next=4,navigator.mediaDevices.getUserMedia(this.props.mediaDevicesConstraints);case 4:if(n=e.sent,r=(null===(t=this.outgoingMediaStreams)||void 0===t?void 0:t.getTracks())||[],o=n.getVideoTracks(),i=n.getAudioTracks(),this.logger.log("log","New media stream acquired: ".concat(o.length," video tracks, ").concat(i.length," audio tracks")),this.pc){e.next=12;break}return this.logger.log("warn","No RTCPeerConnection available for track update"),e.abrupt("return");case 12:s=this.pc.getSenders(),c=[],l=[],u=p(s),e.prev=16,u.s();case 18:if((g=u.n()).done){e.next=40;break}if((h=g.value).track){e.next=22;break}return e.abrupt("continue",38);case 22:if(!("video"===h.track.kind&&o.length>0)){e.next=31;break}if(f=o.find((function(e){return!c.includes(e.id)})),!f){e.next=29;break}return this.logger.log("log","Replacing video track ".concat(h.track.id," with ").concat(f.id)),e.next=28,h.replaceTrack(f);case 28:c.push(f.id);case 29:e.next=38;break;case 31:if(!("audio"===h.track.kind&&i.length>0)){e.next=38;break}if(d=i.find((function(e){return!l.includes(e.id)})),!d){e.next=38;break}return this.logger.log("log","Replacing audio track ".concat(h.track.id," with ").concat(d.id)),e.next=37,h.replaceTrack(d);case 37:l.push(d.id);case 38:e.next=18;break;case 40:e.next=45;break;case 42:e.prev=42,e.t0=e.catch(16),u.e(e.t0);case 45:return e.prev=45,u.f(),e.finish(45);case 48:v=p(o);try{for(v.s();!(y=v.n()).done;)b=y.value,c.includes(b.id)||(this.logger.log("log","Adding new video track: ".concat(b.id)),this.pc.addTrack(b,n))}catch(e){v.e(e)}finally{v.f()}w=p(i);try{for(w.s();!(S=w.n()).done;)k=S.value,l.includes(k.id)||(this.logger.log("log","Adding new audio track: ".concat(k.id)),this.pc.addTrack(k,n))}catch(e){w.e(e)}finally{w.f()}this.outgoingMediaStreams=n,this.connectStreamsToElements(this.outgoingMediaStreams,this.props.outgoingMediaElementsId),E=p(r);try{for(E.s();!(C=E.n()).done;)C.value.stop()}catch(e){E.e(e)}finally{E.f()}e.next=62;break;case 58:e.prev=58,e.t1=e.catch(0),this.logger.log("error","Error updating media stream:",e.t1),this.setState({status:a.ERROR,error:"Error updating media stream: ".concat(e.t1.message)});case 62:case"end":return e.stop()}}),e,this,[[0,58],[16,42,45,48]])}))),function(){return g.apply(this,arguments)})},{key:"addMediaTracksToPeerConnection",value:(u=w(m().mark((function e(){var t,n,r;return m().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,navigator.mediaDevices.getUserMedia(this.props.mediaDevicesConstraints);case 3:if(this.outgoingMediaStreams=e.sent,this.logger.log("log","Media devices enumerated:",this.outgoingMediaStreams),this.outgoingMediaStreams){t=p(this.outgoingMediaStreams.getTracks());try{for(t.s();!(n=t.n()).done;)r=n.value,this.logger.log("log","Adding track to connection:",r.kind,r.id),this.pc.addTrack(r,this.outgoingMediaStreams)}catch(e){t.e(e)}finally{t.f()}}else this.logger.log("warn","No media devices available");e.next=12;break;case 8:e.prev=8,e.t0=e.catch(0),this.logger.log("error","Error adding media tracks to peer connection:",e.t0),this.setState({status:a.ERROR,error:"Error adding media tracks to peer connection: ".concat(e.t0.message)});case 12:case"end":return e.stop()}}),e,this,[[0,8]])}))),function(){return u.apply(this,arguments)})},{key:"connectToSignalingServer",value:(l=w(m().mark((function e(){return m().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,this.signalingClient){e.next=3;break}throw new Error("SignalingClient is not initialized");case 3:return this.logger.log("log","Connecting to signaling server..."),e.next=6,this.signalingClient.connect();case 6:e.next=12;break;case 8:e.prev=8,e.t0=e.catch(0),this.logger.log("error","Connection to signaling server failed:",e.t0),this.setState({status:a.ERROR,error:"Connection to signaling server failed: ".concat(e.t0.message)});case 12:case"end":return e.stop()}}),e,this,[[0,8]])}))),function(){return l.apply(this,arguments)})},{key:"start",value:(c=w(m().mark((function e(){return m().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,this.validateContraints(),e.next=4,this.addMediaTracksToPeerConnection();case 4:this.connectStreamsToElements(this.outgoingMediaStreams,this.props.outgoingMediaElementsId),e.next=11;break;case 7:e.prev=7,e.t0=e.catch(0),this.logger.log("error","Error starting WebRTC:",e.t0),this.setState({status:a.ERROR,error:"Error starting WebRTC: ".concat(e.t0.message)});case 11:case"end":return e.stop()}}),e,this,[[0,7]])}))),function(){return c.apply(this,arguments)})},{key:"getMediaDevices",value:(i=w(m().mark((function e(){var t,n,r,o,i;return m().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,this.logger.log("log","Getting available media devices..."),navigator.mediaDevices&&navigator.mediaDevices.enumerateDevices){e.next=4;break}throw new Error("MediaDevices API not supported in this browser");case 4:return t=null,e.prev=5,e.next=8,navigator.mediaDevices.getUserMedia({audio:!0,video:!0});case 8:t=e.sent,e.next=14;break;case 11:e.prev=11,e.t0=e.catch(5),this.logger.log("warn","Could not get media access to enumerate devices with labels:",e.t0);case 14:return e.next=16,navigator.mediaDevices.enumerateDevices();case 16:return n=e.sent,t&&t.getTracks().forEach((function(e){return e.stop()})),r=n.filter((function(e){return"videoinput"===e.kind})).map((function(e){return{deviceId:e.deviceId,label:e.label||"Caméra ".concat(e.deviceId.slice(0,8),"..."),groupId:e.groupId}})),o=n.filter((function(e){return"audioinput"===e.kind})).map((function(e){return{deviceId:e.deviceId,label:e.label||"Microphone ".concat(e.deviceId.slice(0,8),"..."),groupId:e.groupId}})),i={videoDevices:r,audioDevices:o},this.props.setProps&&this.props.setProps({availableMediaDevices:i}),this.logger.log("log","Media devices enumerated:",i),e.abrupt("return",i);case 26:return e.prev=26,e.t1=e.catch(0),this.logger.log("error","Error enumerating media devices:",e.t1),this.props.setProps&&this.props.setProps({hasError:!0,errorMessage:"Error enumerating media devices: ".concat(e.t1.message)}),e.abrupt("return",{videoDevices:[],audioDevices:[],error:e.t1.message});case 31:case"end":return e.stop()}}),e,this,[[0,26],[5,11]])}))),function(){return i.apply(this,arguments)})},{key:"stop",value:function(){try{this.outgoingMediaStreams&&this.outgoingMediaStreams.getTracks().forEach((function(e){return e.stop()})),this.pc&&(this.pc.close(),this.pc=null),this.signalingClient&&(this.signalingClient.close(),this.signalingClient=null),this.props.incomingMediaElementsId&&this.disconnectStreamsToElements(this.props.incomingMediaElementsId),this.props.outgoingMediaElementsId&&this.disconnectStreamsToElements(this.props.outgoingMediaElementsId),this.setState({status:a.CLOSED,error:null})}catch(e){this.logger.log("error","Error stopping capture:",e),this.setState({status:a.ERROR,error:"Error stopping capture: ".concat(e.message)})}}},{key:"componentDidMount",value:function(){this.connectToSignalingServer(),this.props.autoStart&&this.start()}},{key:"componentDidUpdate",value:(o=w(m().mark((function e(t,n){return m().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.props.capture!==t.capture&&(!0===this.props.capture?this.start():this.stop()),this.props.mediaDevicesConstraints===t.mediaDevicesConstraints){e.next=5;break}return this.logger.log("log","Media constraints changed:",this.props.mediaDevicesConstraints),e.next=5,this.updateOutgoingMediaStreams();case 5:if(this.props.incomingSignalingMessage===t.incomingSignalingMessage){e.next=10;break}if(null===this.props.incomingSignalingMessage){e.next=10;break}return this.logger.log("log","Signaling message received:",this.props.incomingSignalingMessage),e.next=10,this.handleSignalingMessage(this.props.incomingSignalingMessage);case 10:this.state.status!==n.status&&this.props.setProps&&this.props.setProps({status:this.state.status}),this.props.refreshMediaDevices!==t.refreshMediaDevices&&(this.logger.log("log","Media devices refresh triggered"),this.getMediaDevices()),this.props.polite!==t.polite&&(this.logger.log("log","Politeness mode changed:",this.props.polite),this.polite=this.props.polite),this.state.error!==n.error&&this.props.setProps&&this.props.setProps({hasError:!0,errorMessage:this.state.error});case 14:case"end":return e.stop()}}),e,this)}))),function(e,t){return o.apply(this,arguments)})},{key:"componentWillUnmount",value:function(){this.stop()}},{key:"render",value:function(){return null}}],r&&S(n.prototype,r),Object.defineProperty(n,"prototype",{writable:!1}),n;var n,r,o,i,c,l,u,g,h,f}(r.Component);M.defaultProps={debug:!1,polite:!0,autoStart:!1,capture:!1,refreshMediaDevices:0,availableMediaDevices:null,mediaDevicesConstraints:{audio:!0,video:!0},iceServersConfig:null,incomingMediaElementsId:null,outgoingMediaElementsId:null,signalingUrl:null,signalingMaxRetries:3,signalingRetryInterval:1e3},M.propTypes={id:i().string,debug:i().bool,hasError:i().bool,errorMessage:i().string,status:i().string,setProps:i().func,iceServersConfig:i().shape({iceServers:i().arrayOf(i().shape({urls:i().oneOfType([i().string,i().arrayOf(i().string)]).isRequired,username:i().string,credential:i().string})),iceCandidatePoolSize:i().number,iceTransportPolicy:i().oneOf(["all","relay"])}),polite:i().bool,mediaDevicesConstraints:i().object,autoStart:i().bool,capture:i().bool,incomingMediaElementsId:i().array,outgoingMediaElementsId:i().array,availableMediaDevices:i().object,refreshMediaDevices:i().number,signalingUrl:i().string.isRequired,signalingMaxRetries:i().number,signalingRetryInterval:i().number,signalingOpeningMessage:i().object}}}]);
//# sourceMappingURL=async-DashWebrtc.js.map