// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/grid.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Grid = void 0;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CellData = function CellData(r, c, top, left, height, width, color, blocked) {
  _classCallCheck(this, CellData);

  this.r = r;
  this.c = c;
  this.previous = null;
  this.distance = Infinity;
  this.top = top;
  this.left = left;
  this.height = height;
  this.width = width;
  this.color = color || 'white';
  this.isBlockedCell = blocked || false;
  this.isStartCell = false;
  this.isEndCell = false; // this.selected = selected || false;
};

var Grid = /*#__PURE__*/function () {
  function Grid(height, width, rows, cols, start, end) {
    var _this = this;

    _classCallCheck(this, Grid);

    _defineProperty(this, "registerStartChange", function (callback) {
      _this.startChangeCallback = callback;
    });

    _defineProperty(this, "registerEndChange", function (callback) {
      _this.endChangeCallback = callback;
    });

    _defineProperty(this, "getCellId", function () {
      for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      if (Array.isArray(params[0])) {
        return "".concat(params[0][0], "-").concat(params[0][1]);
      } else {
        return "".concat(params[0], "-").concat(params[1]);
      }
    });

    _defineProperty(this, "isValidCell", function (r, c) {
      return r >= 0 && r <= _this.gridRows - 1 && c >= 0 && c <= _this.gridCols - 1;
    });

    this.cells = {};
    this.gridHeight = height;
    this.gridWidth = width;
    this.gridRows = rows;
    this.gridCols = cols;
    this.start = start;
    this.end = end;
    this.drawGrid();
  }

  _createClass(Grid, [{
    key: "changeStart",
    value: function changeStart(newStart) {
      var oldStart = this.start;
      document.getElementById(this.getCellId(oldStart)).classList.remove('start');
      this.start = newStart;
      document.getElementById(this.getCellId(this.start)).classList.add('start');
      document.getElementById(this.getCellId(newStart)).appendChild(document.getElementById('start'));
      this.resetCellData();
    }
  }, {
    key: "changeEnd",
    value: function changeEnd(newEnd) {
      var oldEnd = this.end;
      document.getElementById(this.getCellId(oldEnd)).classList.remove('end');
      this.end = newEnd;
      document.getElementById(this.getCellId(this.end)).classList.add('end');
      document.getElementById(this.getCellId(newEnd)).appendChild(document.getElementById('end'));
      this.resetCellData();
    }
  }, {
    key: "resetCellData",
    value: function resetCellData() {
      var _this2 = this;

      var ctr = 1;

      var _loop = function _loop(r) {
        var _loop2 = function _loop2(c) {
          var cellData = _this2.cells["".concat(r, "-").concat(c)];

          if (r === _this2.start[0] && c === _this2.start[1]) {
            cellData.distance = 0;
            cellData.isStartCell = true;
          } else if (r === _this2.end[0] && c === _this2.end[1]) {
            cellData.isEndCell = true;
          } else {
            cellData.distance = Infinity;
            cellData.isStartCell = false;
            cellData.isEndCell = false;
          }

          setTimeout(function () {
            document.getElementById(_this2.getCellId(r, c)).classList.remove('visited');
            document.getElementById(_this2.getCellId(r, c)).classList.remove('path');
          }, 5 * ctr);
          ctr++;
        };

        for (var c = 0; c < _this2.gridCols; c++) {
          _loop2(c);
        }
      };

      for (var r = 0; r < this.gridRows; r++) {
        _loop(r);
      }
    }
  }, {
    key: "drawGrid",
    value: function drawGrid() {
      // Grid creation.
      var grid = document.getElementById('grid'); // grid.style.position = 'relative'; // Parent Position
      // Cells creation.

      var top = 0;
      var left = 0;
      var cellHeight = this.gridHeight / this.gridRows;
      var cellWidth = this.gridWidth / this.gridCols;

      for (var r = 0; r < this.gridRows; r++) {
        for (var c = 0; c < this.gridCols; c++) {
          var cellData = new CellData(r, c, top, left, cellHeight, cellWidth, '#0089BA');

          if (r === this.start[0] && c === this.start[1]) {
            cellData.distance = 0;
            cellData.isStartCell = true;
          } else if (r === this.end[0] && c === this.end[1]) {
            cellData.isEndCell = true;
          }

          this.cells["".concat(r, "-").concat(c)] = cellData;
          var newCell = this.drawCell(cellData);
          grid.appendChild(newCell);
          left += cellWidth;
        }

        left = 0;
        top += cellHeight;
      } // document.getElementById(this.getCellId(this.start)).classList.add('start');
      // document.getElementById(this.getCellId(this.end)).classList.add('finish');

    }
  }, {
    key: "drawCell",
    value: function drawCell(cellData) {
      var _this3 = this;

      var rowStyle = {
        height: '50%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row'
      };

      var subCellStyle = function subCellStyle(width) {
        return {
          height: '100%',
          width: width + '%',
          fontSize: '10px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Arial, Helvetica, sans-serif'
        };
      };

      var imgStyle = {
        width: '50%',
        height: '50%',
        top: '25%',
        left: '25%',
        position: 'absolute'
      };

      var drag = function drag(e) {
        e.dataTransfer.setData('source', e.target.id);
      };

      var drop = function drop(e) {
        var _e$dataTransfer;

        e.preventDefault();
        var target = e.target.id;
        var img = (_e$dataTransfer = e.dataTransfer) === null || _e$dataTransfer === void 0 ? void 0 : _e$dataTransfer.getData("source");

        if (img === 'start') {
          _this3.startChangeCallback(target);
        } else if (img === 'end') {
          _this3.endChangeCallback(target);
        }
      };

      var dragOver = function dragOver(e) {
        e.preventDefault();
      };

      var cell = document.getElementById("".concat(cellData.r, "-").concat(cellData.c));

      if (!cell) {
        cell = document.createElement('div');
        cell.id = this.getCellId(cellData.r, cellData.c);
      } else {
        while (cell.firstChild) {
          // remove all children, to be add again.
          cell.removeChild(cell.firstChild);
        }
      } // cell.classList.add('visited');


      cell.addEventListener("drop", drop);
      cell.addEventListener("dragover", dragOver);
      cell.style.top = cellData.top + 'px';
      cell.style.left = cellData.left + 'px';
      cell.style.height = cellData.height + 'px';
      cell.style.width = cellData.width + 'px';
      cell.style.position = 'absolute'; // Cell Position

      cell.style.border = '0.5px solid DodgerBlue';
      cell.style.display = 'flex';
      cell.style.flexDirection = 'column';
      cell.style.backgroundColor = cellData.blocked ? 'black' : cellData.color;
      var row1 = document.createElement('div');
      Object.assign(row1.style, rowStyle);
      var row2 = document.createElement('div');
      Object.assign(row2.style, rowStyle);
      var subCell1 = document.createElement('div'); // Current cell

      subCell1.innerText = "".concat(cellData.r, "-").concat(cellData.c);
      Object.assign(subCell1.style, subCellStyle(50));
      var subCell2 = document.createElement('div'); // Current previous

      subCell2.innerText = cellData.previous ? "".concat(cellData.previous[0], "-").concat(cellData.previous[1]) : '-';
      Object.assign(subCell2.style, subCellStyle(50));
      var subCell3 = document.createElement('div'); // Distance

      subCell3.innerText = cellData.distance;
      Object.assign(subCell3.style, subCellStyle(100));
      row1.appendChild(subCell1);
      row1.appendChild(subCell2);
      row2.appendChild(subCell3); // cell.appendChild(row1);
      // cell.appendChild(row2);

      if (cellData.isStartCell) {
        var img = document.createElement('img');
        img.id = "start"; // img.src = '../images/play-button.png';

        img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAJFAAACRQGs5fN8AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAJBQTFRF////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPUIf2wAAAC90Uk5TAAMKDBAbHygvMDU8QEhKTE5QYmNkaHB0h4qMjpOWpKewtr7Ay9XY5efq8vP4+f6s7ZJDAAABe0lEQVRYw62X2VaDMBCGf4rUpVawsogoLWsFgXn/t/Oi6mltEiad/rfJfOdMMiugkRvEaV62fd+WeRoHLqzkRcVAJxqKyONaL5J6IoWmOlkwzJ1wT1rtQ2fO3m/IqMY3mi8rmlW11NuvOmKoW+nsNyOxNG7Ur5cRW5niLZ0dWWh3TsjIStmZ/2Spf++wGm0B48lfLDuyVnccDxVdoOoofuki/UW101wGaH7/MlQeTx8v/nYyEsKf/Ffm79czADx8mgD7Q31IlIdvB/qtkZAAAGrl2SMYhBoAPLWfN2AQJg9ARGaAkRABKOYAJkIBuMMswEAYXAQ0DzAQAsQcgJ4QI2UBtIQUOQ+gI+QomQDcK2tOiZYLUDvbomcD1qprvRwgdkH8iOJvFAeSOJTFySROZ3FBkZc0cVEVl3V5YzG1tjtOa9M11/en9evIaa7y9i4eMOQjjnzIEo958kFTPurKh23xuC9fOK6w8siXLvnad4XFU776XmH5tlv/vwH54wah77IAgAAAAABJRU5ErkJggg==';
        img.draggable = true;
        Object.assign(img.style, imgStyle);
        img.addEventListener("dragstart", drag);
        cell.classList.add('start');
        cell.appendChild(img);
      } else if (cellData.isEndCell) {
        var _img = document.createElement('img');

        _img.id = "end"; // img.src = '../images/finish.png';

        _img.src = 'data:image/png;base64,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';
        _img.draggable = true;
        Object.assign(_img.style, imgStyle);

        _img.addEventListener("dragstart", drag);

        cell.classList.add('end');
        cell.appendChild(_img);
      }

      return cell;
    }
  }]);

  return Grid;
}();

exports.Grid = Grid;
},{}],"src/dijkstra.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dijkstra = Dijkstra;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PriorityQueue = function PriorityQueue(_vertex, _weight) {
  var _this = this;

  _classCallCheck(this, PriorityQueue);

  _defineProperty(this, "Enqueue", function (vertex, weight) {
    _this.queue.push({
      vertex: vertex,
      weight: weight
    });

    _this.queue.sort(function (a, b) {
      return a.weight - b.weight;
    });
  });

  _defineProperty(this, "Dequeue", function () {
    return _this.queue.shift().vertex;
  });

  _defineProperty(this, "Empty", function () {
    _this.queue = [];
  });

  this.queue = [{
    vertex: _vertex,
    weight: _weight
  }];
};

function Dijkstra(grid) {
  var visited = [];
  var idx = 0;
  var start = grid.start;
  var end = grid.end;
  var queue = new PriorityQueue(start, 0);

  while (queue.queue.length > 0) {
    var current = queue.Dequeue();

    if (current[0] == end[0] && current[1] == end[1]) {
      queue.Empty();
      drawPath(start, end, idx);
    } else {
      var r = current[0];
      var c = current[1];
      var neighbours = [// [r - 1, c - 1], // top-left
      [r - 1, c], // top
      // [r - 1, c + 1], // top-right
      [r, c + 1], // right
      // [r + 1, c + 1], // bottom-right
      [r + 1, c], // bottom
      // [r + 1, c - 1], // bottom-left
      [r, c - 1] // left
      ];

      for (var i = 0; i < neighbours.length; i++) {
        var neighbour = neighbours[i];

        if (grid.isValidCell(neighbour[0], neighbour[1])) {
          if (!visited.includes(grid.getCellId(neighbour))) {
            if (grid.cells[grid.getCellId(neighbour)].distance > grid.cells[grid.getCellId(current)].distance + 1) {
              grid.cells[grid.getCellId(neighbour)] = _objectSpread(_objectSpread({}, grid.cells[grid.getCellId(neighbour)]), {}, {
                distance: grid.cells[grid.getCellId(current)].distance + 1,
                previous: current
              });
              grid.drawCell(grid.cells[grid.getCellId(neighbour)]);
              setTimeout(function (neighbour) {
                document.getElementById(grid.getCellId(neighbour)).classList.add('visited');
              }, 20 * idx, neighbour);
              visited.push(grid.getCellId(neighbour));
              queue.Enqueue(neighbour, grid.cells[grid.getCellId(current)].distance + 1);
              idx++;
            }
          }

          if (neighbour[0] === end[0] && neighbour[1] === end[1]) {
            queue.Empty();
            drawPath(grid, start, end, idx);
            break;
          }
        }
      }

      ;
    }
  }
}

function drawPath(grid, start, end, idx) {
  var pathFound = false;
  var vertex = grid.cells[grid.getCellId(end)];
  var path = [vertex];

  while (!pathFound) {
    if (vertex[0] == start[0] && vertex[1] == start[1]) {
      pathFound = true;
    }

    var previous = grid.cells[grid.getCellId(vertex.r, vertex.c)].previous;

    if (previous) {
      vertex = grid.cells[grid.getCellId(previous)];
      path.push(vertex);
    } else {
      pathFound = true;
    }
  }

  while (path.length) {
    var next = path.pop();
    setTimeout(function (next) {
      var _document$getElementB, _document$getElementB2;

      document.getElementById(grid.getCellId(next.r, next.c)).classList.remove(['visited']);
      (_document$getElementB = document.getElementById(grid.getCellId(next.r, next.c))) === null || _document$getElementB === void 0 ? void 0 : (_document$getElementB2 = _document$getElementB.classList) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.add('path');
    }, 20 * idx, next);
    idx++;
  }
}
},{}],"src/index.js":[function(require,module,exports) {
"use strict";

var _grid = require("./grid.js");

var _dijkstra = require("./dijkstra.js");

window.onload = function () {
  var header = document.getElementById('header');
  var btnDijkstra = document.getElementById("dijkstra");
  var btnReset = document.getElementById("reset");
  var height = window.innerHeight - header.offsetHeight - 2;
  var width = window.innerWidth - 2;
  var rows = Math.floor(height / 50);
  var cols = Math.floor(width / (height / rows));
  var start = [Math.floor(rows / 2) - 1, Math.floor(rows / 2)];
  var end = [Math.floor(rows / 2) - 1, cols - Math.floor(rows / 2) - 1];
  var grid = new _grid.Grid(height, width, rows, cols, start, end);

  var onStartChange = function onStartChange(newStart) {
    var startIdx = newStart.split('-');
    grid.changeStart([Number(startIdx[0]), Number(startIdx[1])]);
  };

  var onEndChange = function onEndChange(newEnd) {
    var endIdx = newEnd.split('-');
    grid.changeEnd([Number(endIdx[0]), Number(endIdx[1])]);
  };

  grid.registerStartChange(onStartChange);
  grid.registerEndChange(onEndChange); // grid.changeStart([8, 30]);
  // grid.changeEnd([8, 2]);

  btnDijkstra.addEventListener("click", function () {
    btnDijkstra.disabled = (0, _dijkstra.Dijkstra)(grid);
  });
  btnReset.addEventListener("click", function () {
    grid.resetCellData();
  });
};
},{"./grid.js":"src/grid.js","./dijkstra.js":"src/dijkstra.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62154" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map