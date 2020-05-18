(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/*
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License
  Simple object to keep track of FPS
 */
module.exports = function() {
  var filter_strength, frame_time, last_loop;
  filter_strength = 20;
  frame_time = 0;
  last_loop = new Date();
  return {
    tick: function() {
      var this_loop, this_time;
      this_loop = new Date;
      this_time = this_loop - last_loop;
      frame_time += (this_time - frame_time) / filter_strength;
      return last_loop = this_loop;
    },
    getFps: function() {
      return 1000 / frame_time;
    }
  };
};


},{}],2:[function(require,module,exports){

/*
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License
  Calculates the width and height that gives approximately the total area at the ratio of the screen size
 */
module.exports = function(width, height, ideal) {

  /*
  if(width > height)
    s1 = Math.round((width/height)*100)/100
    s2 = Math.floor(ideal/s1)
    s3 = Math.floor(Math.sqrt(s2))
    dx = Math.floor(s1*s3)
    dy = s3
  else
    s1 = Math.round((height/width)*100)/100
    s2 = Math.floor(ideal/s1)
    s3 = Math.floor(Math.sqrt(s2))
    dy = Math.floor(s1*s3)
    dx = s3
  [dx, dy]
   */
  var l, ref, s;
  ref = width > height ? [width, height] : [height, width], l = ref[0], s = ref[1];
  return [Math.floor((l / s) * Math.sqrt(ideal / (width / height))), Math.sqrt(ideal / (width / height))];
};


},{}],3:[function(require,module,exports){

/*
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License
  Handles the adjustment of options
 */
var OptionManager;

OptionManager = (function() {
  function OptionManager(listener) {
    this.listener = listener;
    this.variables = {};
    this.option_holder = document.getElementById('options');
  }

  OptionManager.prototype.clearOptions = function() {
    return this.option_holder.innerHTML = "";
  };

  OptionManager.prototype.addOptions = function() {
    var header, holder, input, label, option, options, ref, self, type, value;
    this.clearOptions();
    self = this;
    ref = this.variables;
    for (type in ref) {
      options = ref[type];
      holder = document.createElement('div');
      holder.classList.add('type');
      header = document.createElement('h2');
      header.textContent = type;
      holder.appendChild(header);
      for (option in options) {
        value = options[option];
        label = document.createElement('label');
        label.textContent = option.replace(/_/g, ' ');
        label.style.textTransform = 'capitalize';
        input = document.createElement('input');
        input.setAttribute('type', 'number');
        input.value = value;
        input.dataset['type'] = type;
        input.dataset['option'] = option;
        input.addEventListener('input', function() {
          var element;
          element = this;
          if (element.dataset.updateTimeout) {
            clearTimeout(element.dataset.updateTimeout);
          }
          return element.dataset.updateTimeout = setTimeout((function() {
            self.writeValue(element.dataset.type, element.dataset.option, element.value);
            element.dataset.updateTimeout = null;
            element.style.backgroundColor = '#ddd';
            return setTimeout((function() {
              return element.style.backgroundColor = '#fff';
            }), 100);
          }), 500);
        });
        holder.appendChild(label);
        holder.appendChild(document.createElement('br'));
        holder.appendChild(input);
        holder.appendChild(document.createElement('br'));
      }
      this.option_holder.appendChild(holder);
    }
    return null;
  };

  OptionManager.prototype.writeValue = function(type, option, value) {
    return this.listener(type, option, parseFloat(value));
  };

  OptionManager.prototype.setVariables = function(variables) {
    this.variables = variables;
    return this.addOptions();
  };

  return OptionManager;

})();

module.exports = OptionManager;


},{}],4:[function(require,module,exports){

/*
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License
  Simple renderer. More to come here in time
 */
var canvas, context, holder, image_data;

holder = document.getElementById('main_holder');

canvas = document.getElementById('main');

canvas.style.backgroundColor = 'rgba(0, 0, 0, 255)';

context = canvas.getContext('2d');

context.imageSmoothingEnabled = false;

image_data = null;

module.exports.setSize = function(width, height, x, y) {
  holder.style.width = width + "px";
  holder.style.height = height + "px";
  context.canvas.width = x;
  context.canvas.height = y;
  return image_data = context.createImageData(x, y);
};

module.exports.writeImage = function(data) {
  var i, j, len, v;
  for (i = j = 0, len = data.length; j < len; i = ++j) {
    v = data[i];
    image_data.data[i] = v;
  }
  return context.putImageData(image_data, 0, 0);
};


},{}],5:[function(require,module,exports){

/*
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License
  Does everything needed in the main browser thread, including starting the webworker. Need to move a lot
  of this logic to separate files
 */
var OptionManager, canvas, did_init, flow_selector, fps, fps_target, height, optionManager, options, ref, render, right_panel, seed, seed_holder, stats, width, worker, x, y;

fps_target = 20;

render = require('./lib/render');

fps = require('./lib/fps')();

OptionManager = require('./lib/optionManager');

worker = new Worker('build/process.js');

right_panel = document.getElementById('right_panel');

canvas = document.getElementById('main');

stats = document.getElementById('stats');

flow_selector = document.getElementById('flow');

seed_holder = document.getElementById('seed_holder');

seed = document.getElementById('seed');

options = document.getElementById('options');

seed.value = Math.round(Math.random() * 10000000);

width = height = Math.min(window.innerHeight, window.innerWidth);

ref = require('./lib/optimalResolution')(width, height, 80000), x = ref[0], y = ref[1];

stats.textContent = "TPS: ?? | FPS: ??";

render.setSize(width, height, x, y);

did_init = false;

optionManager = new OptionManager(function(type, variable, value) {
  return worker.postMessage(['updateVariable', type, variable, value]);
});

worker.postMessage(['getVariables']);

worker.onmessage = function(e) {
  switch (e.data[0]) {
    case 'imageData':
      fps.tick();
      return render.writeImage(e.data[1]);
    case 'tpm':
      return stats.textContent = "TPS: " + (Math.round(e.data[1])) + " | FPS: " + (Math.round(fps.getFps()));
    case 'initialized':
      setInterval((function() {
        return worker.postMessage(['sendTPS']);
      }), 1000);
      setInterval((function() {
        return worker.postMessage(['sendImageData']);
      }), 1000 / fps_target);
      return worker.postMessage(['start']);
    case 'variables':
      return optionManager.setVariables(e.data[1]);
  }
};

canvas.addEventListener('click', function() {
  if (right_panel.classList.contains('show')) {
    right_panel.classList.remove('show');
  } else {
    right_panel.classList.add('show');
  }
  return true;
});

document.getElementById('start').addEventListener('click', function() {
  if (did_init) {
    return worker.postMessage(['start']);
  } else {
    worker.postMessage(['init', x, y, seed.value, flow.value]);
    right_panel.classList.remove('show');
    return seed.setAttribute('readonly', 'readonly');
  }
});

document.getElementById('stop').addEventListener('click', function() {
  return worker.postMessage(['stop']);
});

document.getElementById('toggle_pixel').addEventListener('click', function() {
  if (canvas.classList.contains('pixeled')) {
    return canvas.classList.remove('pixeled');
  } else {
    return canvas.classList.add('pixeled');
  }
});

flow_selector.addEventListener('change', function() {
  return worker.postMessage(['setFlowType', this.value]);
});


},{"./lib/fps":1,"./lib/optimalResolution":2,"./lib/optionManager":3,"./lib/render":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL2Zwcy5jb2ZmZWUiLCJzcmMvbGliL29wdGltYWxSZXNvbHV0aW9uLmNvZmZlZSIsInNyYy9saWIvb3B0aW9uTWFuYWdlci5jb2ZmZWUiLCJzcmMvbGliL3JlbmRlci5jb2ZmZWUiLCJzcmMvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7Ozs7Ozs7QUFRQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBO0FBQ2YsTUFBQTtFQUFBLGVBQUEsR0FBa0I7RUFDbEIsVUFBQSxHQUFhO0VBQ2IsU0FBQSxHQUFnQixJQUFBLElBQUEsQ0FBQTtTQUNoQjtJQUNFLElBQUEsRUFBTyxTQUFBO0FBQ0wsVUFBQTtNQUFBLFNBQUEsR0FBWSxJQUFJO01BQ2hCLFNBQUEsR0FBWSxTQUFBLEdBQVk7TUFDeEIsVUFBQSxJQUFjLENBQUMsU0FBQSxHQUFZLFVBQWIsQ0FBQSxHQUEyQjthQUN6QyxTQUFBLEdBQVk7SUFKUCxDQURUO0lBTUUsTUFBQSxFQUFTLFNBQUE7YUFDUCxJQUFBLEdBQU87SUFEQSxDQU5YOztBQUplOzs7OztBQ1JqQjs7Ozs7OztBQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0IsS0FBaEI7O0FBQ2Y7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE1BQUE7RUFnQkEsTUFBWSxLQUFBLEdBQVEsTUFBWCxHQUF1QixDQUFDLEtBQUQsRUFBUSxNQUFSLENBQXZCLEdBQTRDLENBQUMsTUFBRCxFQUFTLEtBQVQsQ0FBckQsRUFBQyxVQUFELEVBQUk7U0FFSixDQUNFLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBQyxDQUFBLEdBQUUsQ0FBSCxDQUFBLEdBQVEsSUFBSSxDQUFDLElBQUwsQ0FBVSxLQUFBLEdBQU0sQ0FBQyxLQUFBLEdBQVEsTUFBVCxDQUFoQixDQUFuQixDQURGLEVBRUUsSUFBSSxDQUFDLElBQUwsQ0FBVSxLQUFBLEdBQU0sQ0FBQyxLQUFBLEdBQVEsTUFBVCxDQUFoQixDQUZGO0FBbkJlOzs7OztBQ1JqQjs7Ozs7OztBQUFBLElBQUE7O0FBUU07RUFDUyx1QkFBQyxRQUFEO0lBQUMsSUFBQyxDQUFBLFdBQUQ7SUFDWixJQUFDLENBQUEsU0FBRCxHQUFhO0lBQ2IsSUFBQyxDQUFBLGFBQUQsR0FBaUIsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsU0FBeEI7RUFGTjs7MEJBSWIsWUFBQSxHQUFjLFNBQUE7V0FDWixJQUFDLENBQUEsYUFBYSxDQUFDLFNBQWYsR0FBMkI7RUFEZjs7MEJBR2QsVUFBQSxHQUFZLFNBQUE7QUFDVixRQUFBO0lBQUEsSUFBQyxDQUFBLFlBQUQsQ0FBQTtJQUNBLElBQUEsR0FBTztBQUNQO0FBQUEsU0FBQSxXQUFBOztNQUNFLE1BQUEsR0FBUyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUNULE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBakIsQ0FBcUIsTUFBckI7TUFFQSxNQUFBLEdBQVMsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsSUFBdkI7TUFDVCxNQUFNLENBQUMsV0FBUCxHQUFxQjtNQUVyQixNQUFNLENBQUMsV0FBUCxDQUFtQixNQUFuQjtBQUVBLFdBQUEsaUJBQUE7O1FBQ0UsS0FBQSxHQUFRLFFBQVEsQ0FBQyxhQUFULENBQXVCLE9BQXZCO1FBQ1IsS0FBSyxDQUFDLFdBQU4sR0FBb0IsTUFBTSxDQUFDLE9BQVAsQ0FBZSxJQUFmLEVBQXFCLEdBQXJCO1FBQ3BCLEtBQUssQ0FBQyxLQUFLLENBQUMsYUFBWixHQUE0QjtRQUU1QixLQUFBLEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsT0FBdkI7UUFDUixLQUFLLENBQUMsWUFBTixDQUFtQixNQUFuQixFQUEyQixRQUEzQjtRQUNBLEtBQUssQ0FBQyxLQUFOLEdBQWM7UUFDZCxLQUFLLENBQUMsT0FBUSxDQUFBLE1BQUEsQ0FBZCxHQUF3QjtRQUN4QixLQUFLLENBQUMsT0FBUSxDQUFBLFFBQUEsQ0FBZCxHQUEwQjtRQUMxQixLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsT0FBdkIsRUFBZ0MsU0FBQTtBQUM5QixjQUFBO1VBQUEsT0FBQSxHQUFVO1VBQ1YsSUFBRyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQW5CO1lBQXNDLFlBQUEsQ0FBYSxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQTdCLEVBQXRDOztpQkFDQSxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWhCLEdBQWdDLFVBQUEsQ0FBVyxDQUFFLFNBQUE7WUFDM0MsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFoQyxFQUFzQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQXRELEVBQThELE9BQU8sQ0FBQyxLQUF0RTtZQUNBLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBaEIsR0FBZ0M7WUFDaEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFkLEdBQWdDO21CQUNoQyxVQUFBLENBQVcsQ0FBRSxTQUFBO3FCQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsZUFBZCxHQUFnQztZQUFuQyxDQUFGLENBQVgsRUFBeUQsR0FBekQ7VUFKMkMsQ0FBRixDQUFYLEVBSzdCLEdBTDZCO1FBSEYsQ0FBaEM7UUFZQSxNQUFNLENBQUMsV0FBUCxDQUFtQixLQUFuQjtRQUNBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLFFBQVEsQ0FBQyxhQUFULENBQXVCLElBQXZCLENBQW5CO1FBQ0EsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsS0FBbkI7UUFDQSxNQUFNLENBQUMsV0FBUCxDQUFtQixRQUFRLENBQUMsYUFBVCxDQUF1QixJQUF2QixDQUFuQjtBQXpCRjtNQTJCQSxJQUFDLENBQUEsYUFBYSxDQUFDLFdBQWYsQ0FBMkIsTUFBM0I7QUFwQ0Y7V0FxQ0E7RUF4Q1U7OzBCQTBDWixVQUFBLEdBQVksU0FBQyxJQUFELEVBQU8sTUFBUCxFQUFlLEtBQWY7V0FDVixJQUFDLENBQUEsUUFBRCxDQUFVLElBQVYsRUFBZ0IsTUFBaEIsRUFBd0IsVUFBQSxDQUFXLEtBQVgsQ0FBeEI7RUFEVTs7MEJBR1osWUFBQSxHQUFjLFNBQUMsU0FBRDtJQUNaLElBQUMsQ0FBQSxTQUFELEdBQWE7V0FDYixJQUFDLENBQUEsVUFBRCxDQUFBO0VBRlk7Ozs7OztBQUloQixNQUFNLENBQUMsT0FBUCxHQUFpQjs7Ozs7QUNqRWpCOzs7Ozs7O0FBQUEsSUFBQTs7QUFRQSxNQUFBLEdBQVMsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsYUFBeEI7O0FBQ1QsTUFBQSxHQUFTLFFBQVEsQ0FBQyxjQUFULENBQXdCLE1BQXhCOztBQUNULE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBYixHQUErQjs7QUFFL0IsT0FBQSxHQUFVLE1BQU0sQ0FBQyxVQUFQLENBQWtCLElBQWxCOztBQUNWLE9BQU8sQ0FBQyxxQkFBUixHQUFnQzs7QUFFaEMsVUFBQSxHQUFhOztBQUViLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBZixHQUF5QixTQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLENBQWhCLEVBQW1CLENBQW5CO0VBQ3ZCLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBYixHQUF3QixLQUFELEdBQU87RUFDOUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFiLEdBQXlCLE1BQUQsR0FBUTtFQUNoQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQWYsR0FBdUI7RUFDdkIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFmLEdBQXdCO1NBQ3hCLFVBQUEsR0FBYSxPQUFPLENBQUMsZUFBUixDQUF3QixDQUF4QixFQUEyQixDQUEzQjtBQUxVOztBQU96QixNQUFNLENBQUMsT0FBTyxDQUFDLFVBQWYsR0FBNEIsU0FBQyxJQUFEO0FBQzFCLE1BQUE7QUFBQSxPQUFBLDhDQUFBOztJQUFBLFVBQVUsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUFoQixHQUFtQjtBQUFuQjtTQUNBLE9BQU8sQ0FBQyxZQUFSLENBQXFCLFVBQXJCLEVBQWlDLENBQWpDLEVBQW9DLENBQXBDO0FBRjBCOzs7OztBQ3hCNUI7Ozs7Ozs7O0FBQUEsSUFBQTs7QUFTQSxVQUFBLEdBQWE7O0FBRWIsTUFBQSxHQUFTLE9BQUEsQ0FBUSxjQUFSOztBQUNULEdBQUEsR0FBTSxPQUFBLENBQVEsV0FBUixDQUFBLENBQUE7O0FBQ04sYUFBQSxHQUFnQixPQUFBLENBQVEscUJBQVI7O0FBRWhCLE1BQUEsR0FBYSxJQUFBLE1BQUEsQ0FBTyxrQkFBUDs7QUFDYixXQUFBLEdBQWMsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsYUFBeEI7O0FBQ2QsTUFBQSxHQUFTLFFBQVEsQ0FBQyxjQUFULENBQXdCLE1BQXhCOztBQUNULEtBQUEsR0FBUSxRQUFRLENBQUMsY0FBVCxDQUF3QixPQUF4Qjs7QUFDUixhQUFBLEdBQWdCLFFBQVEsQ0FBQyxjQUFULENBQXdCLE1BQXhCOztBQUNoQixXQUFBLEdBQWMsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsYUFBeEI7O0FBQ2QsSUFBQSxHQUFPLFFBQVEsQ0FBQyxjQUFULENBQXdCLE1BQXhCOztBQUNQLE9BQUEsR0FBVSxRQUFRLENBQUMsY0FBVCxDQUF3QixTQUF4Qjs7QUFFVixJQUFJLENBQUMsS0FBTCxHQUFhLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCLFFBQTNCOztBQUViLEtBQUEsR0FBUSxNQUFBLEdBQVMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxNQUFNLENBQUMsV0FBaEIsRUFBNkIsTUFBTSxDQUFDLFVBQXBDOztBQUVqQixNQUFTLE9BQUEsQ0FBUSx5QkFBUixDQUFBLENBQW1DLEtBQW5DLEVBQTBDLE1BQTFDLEVBQWtELEtBQWxELENBQVQsRUFBQyxVQUFELEVBQUk7O0FBRUosS0FBSyxDQUFDLFdBQU4sR0FBb0I7O0FBQ3BCLE1BQU0sQ0FBQyxPQUFQLENBQWUsS0FBZixFQUFzQixNQUF0QixFQUE4QixDQUE5QixFQUFpQyxDQUFqQzs7QUFFQSxRQUFBLEdBQVc7O0FBRVgsYUFBQSxHQUFvQixJQUFBLGFBQUEsQ0FBYyxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLEtBQWpCO1NBQTJCLE1BQU0sQ0FBQyxXQUFQLENBQW1CLENBQUMsZ0JBQUQsRUFBbUIsSUFBbkIsRUFBeUIsUUFBekIsRUFBbUMsS0FBbkMsQ0FBbkI7QUFBM0IsQ0FBZDs7QUFFcEIsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsQ0FBQyxjQUFELENBQW5COztBQUNBLE1BQU0sQ0FBQyxTQUFQLEdBQW1CLFNBQUMsQ0FBRDtBQUNqQixVQUFPLENBQUMsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUFkO0FBQUEsU0FDTyxXQURQO01BRUksR0FBRyxDQUFDLElBQUosQ0FBQTthQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQUMsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUF6QjtBQUhKLFNBSU8sS0FKUDthQUtJLEtBQUssQ0FBQyxXQUFOLEdBQW9CLE9BQUEsR0FBTyxDQUFDLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBQyxDQUFDLElBQUssQ0FBQSxDQUFBLENBQWxCLENBQUQsQ0FBUCxHQUE4QixVQUE5QixHQUF1QyxDQUFDLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBRyxDQUFDLE1BQUosQ0FBQSxDQUFYLENBQUQ7QUFML0QsU0FNTyxhQU5QO01BT0ksV0FBQSxDQUFZLENBQUUsU0FBQTtlQUNaLE1BQU0sQ0FBQyxXQUFQLENBQW1CLENBQUMsU0FBRCxDQUFuQjtNQURZLENBQUYsQ0FBWixFQUVHLElBRkg7TUFJQSxXQUFBLENBQVksQ0FBRSxTQUFBO2VBQ1osTUFBTSxDQUFDLFdBQVAsQ0FBbUIsQ0FBQyxlQUFELENBQW5CO01BRFksQ0FBRixDQUFaLEVBRUcsSUFBQSxHQUFPLFVBRlY7YUFHQSxNQUFNLENBQUMsV0FBUCxDQUFtQixDQUFDLE9BQUQsQ0FBbkI7QUFkSixTQWVPLFdBZlA7YUFnQkksYUFBYSxDQUFDLFlBQWQsQ0FBMkIsQ0FBQyxDQUFDLElBQUssQ0FBQSxDQUFBLENBQWxDO0FBaEJKO0FBRGlCOztBQW1CbkIsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDLFNBQUE7RUFDL0IsSUFBRyxXQUFXLENBQUMsU0FBUyxDQUFDLFFBQXRCLENBQStCLE1BQS9CLENBQUg7SUFDRSxXQUFXLENBQUMsU0FBUyxDQUFDLE1BQXRCLENBQTZCLE1BQTdCLEVBREY7R0FBQSxNQUFBO0lBR0UsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUF0QixDQUEwQixNQUExQixFQUhGOztTQUlBO0FBTCtCLENBQWpDOztBQU9BLFFBQVEsQ0FBQyxjQUFULENBQXdCLE9BQXhCLENBQWdDLENBQUMsZ0JBQWpDLENBQWtELE9BQWxELEVBQTJELFNBQUE7RUFDekQsSUFBRyxRQUFIO1dBQ0UsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsQ0FBQyxPQUFELENBQW5CLEVBREY7R0FBQSxNQUFBO0lBR0UsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsQ0FBQyxNQUFELEVBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxJQUFJLENBQUMsS0FBcEIsRUFBMkIsSUFBSSxDQUFDLEtBQWhDLENBQW5CO0lBQ0EsV0FBVyxDQUFDLFNBQVMsQ0FBQyxNQUF0QixDQUE2QixNQUE3QjtXQUNBLElBQUksQ0FBQyxZQUFMLENBQWtCLFVBQWxCLEVBQThCLFVBQTlCLEVBTEY7O0FBRHlELENBQTNEOztBQVFBLFFBQVEsQ0FBQyxjQUFULENBQXdCLE1BQXhCLENBQStCLENBQUMsZ0JBQWhDLENBQWlELE9BQWpELEVBQTBELFNBQUE7U0FBRyxNQUFNLENBQUMsV0FBUCxDQUFtQixDQUFDLE1BQUQsQ0FBbkI7QUFBSCxDQUExRDs7QUFFQSxRQUFRLENBQUMsY0FBVCxDQUF3QixjQUF4QixDQUF1QyxDQUFDLGdCQUF4QyxDQUF5RCxPQUF6RCxFQUFrRSxTQUFBO0VBQ2hFLElBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFqQixDQUEwQixTQUExQixDQUFIO1dBQ0UsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFqQixDQUF3QixTQUF4QixFQURGO0dBQUEsTUFBQTtXQUdFLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBakIsQ0FBcUIsU0FBckIsRUFIRjs7QUFEZ0UsQ0FBbEU7O0FBTUEsYUFBYSxDQUFDLGdCQUFkLENBQStCLFFBQS9CLEVBQXlDLFNBQUE7U0FDdkMsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsQ0FBQyxhQUFELEVBQWdCLElBQUksQ0FBQyxLQUFyQixDQUFuQjtBQUR1QyxDQUF6QyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIyNcbiAgY29sb3ItcG9uZFxuICBLZXZpbiBHcmF2aWVyIDIwMTZcbiAgR1BMLTMuMCBMaWNlbnNlXG5cbiAgU2ltcGxlIG9iamVjdCB0byBrZWVwIHRyYWNrIG9mIEZQU1xuIyMjXG5cbm1vZHVsZS5leHBvcnRzID0gLT5cbiAgZmlsdGVyX3N0cmVuZ3RoID0gMjBcbiAgZnJhbWVfdGltZSA9IDBcbiAgbGFzdF9sb29wID0gbmV3IERhdGUoKVxuICB7XG4gICAgdGljayA6IC0+XG4gICAgICB0aGlzX2xvb3AgPSBuZXcgRGF0ZVxuICAgICAgdGhpc190aW1lID0gdGhpc19sb29wIC0gbGFzdF9sb29wXG4gICAgICBmcmFtZV90aW1lICs9ICh0aGlzX3RpbWUgLSBmcmFtZV90aW1lKSAvIGZpbHRlcl9zdHJlbmd0aFxuICAgICAgbGFzdF9sb29wID0gdGhpc19sb29wXG4gICAgZ2V0RnBzIDogLT5cbiAgICAgIDEwMDAgLyBmcmFtZV90aW1lXG4gIH1cblxuXG4iLCIjIyNcbiAgY29sb3ItcG9uZFxuICBLZXZpbiBHcmF2aWVyIDIwMTZcbiAgR1BMLTMuMCBMaWNlbnNlXG5cbiAgQ2FsY3VsYXRlcyB0aGUgd2lkdGggYW5kIGhlaWdodCB0aGF0IGdpdmVzIGFwcHJveGltYXRlbHkgdGhlIHRvdGFsIGFyZWEgYXQgdGhlIHJhdGlvIG9mIHRoZSBzY3JlZW4gc2l6ZVxuIyMjXG5cbm1vZHVsZS5leHBvcnRzID0gKHdpZHRoLCBoZWlnaHQsIGlkZWFsKSAtPlxuICAjIyNcbiAgaWYod2lkdGggPiBoZWlnaHQpXG4gICAgczEgPSBNYXRoLnJvdW5kKCh3aWR0aC9oZWlnaHQpKjEwMCkvMTAwXG4gICAgczIgPSBNYXRoLmZsb29yKGlkZWFsL3MxKVxuICAgIHMzID0gTWF0aC5mbG9vcihNYXRoLnNxcnQoczIpKVxuICAgIGR4ID0gTWF0aC5mbG9vcihzMSpzMylcbiAgICBkeSA9IHMzXG4gIGVsc2VcbiAgICBzMSA9IE1hdGgucm91bmQoKGhlaWdodC93aWR0aCkqMTAwKS8xMDBcbiAgICBzMiA9IE1hdGguZmxvb3IoaWRlYWwvczEpXG4gICAgczMgPSBNYXRoLmZsb29yKE1hdGguc3FydChzMikpXG4gICAgZHkgPSBNYXRoLmZsb29yKHMxKnMzKVxuICAgIGR4ID0gczNcbiAgW2R4LCBkeV1cbiAgIyMjXG5cbiAgW2wsIHNdID0gaWYgd2lkdGggPiBoZWlnaHQgdGhlbiBbd2lkdGgsIGhlaWdodF0gZWxzZSBbaGVpZ2h0LCB3aWR0aF1cblxuICBbXG4gICAgTWF0aC5mbG9vcigobC9zKSAqIE1hdGguc3FydChpZGVhbC8od2lkdGggLyBoZWlnaHQpKSlcbiAgICBNYXRoLnNxcnQoaWRlYWwvKHdpZHRoIC8gaGVpZ2h0KSlcbiAgXSIsIiMjI1xuICBjb2xvci1wb25kXG4gIEtldmluIEdyYXZpZXIgMjAxNlxuICBHUEwtMy4wIExpY2Vuc2VcblxuICBIYW5kbGVzIHRoZSBhZGp1c3RtZW50IG9mIG9wdGlvbnNcbiMjI1xuXG5jbGFzcyBPcHRpb25NYW5hZ2VyXG4gIGNvbnN0cnVjdG9yOiAoQGxpc3RlbmVyKSAtPlxuICAgIEB2YXJpYWJsZXMgPSB7fVxuICAgIEBvcHRpb25faG9sZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ29wdGlvbnMnKVxuXG4gIGNsZWFyT3B0aW9uczogLT5cbiAgICBAb3B0aW9uX2hvbGRlci5pbm5lckhUTUwgPSBcIlwiXG5cbiAgYWRkT3B0aW9uczogLT5cbiAgICBAY2xlYXJPcHRpb25zKClcbiAgICBzZWxmID0gQFxuICAgIGZvciB0eXBlLCBvcHRpb25zIG9mIEB2YXJpYWJsZXNcbiAgICAgIGhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBob2xkZXIuY2xhc3NMaXN0LmFkZCgndHlwZScpXG5cbiAgICAgIGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJylcbiAgICAgIGhlYWRlci50ZXh0Q29udGVudCA9IHR5cGVcblxuICAgICAgaG9sZGVyLmFwcGVuZENoaWxkKGhlYWRlcilcblxuICAgICAgZm9yIG9wdGlvbiwgdmFsdWUgb2Ygb3B0aW9uc1xuICAgICAgICBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJylcbiAgICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSBvcHRpb24ucmVwbGFjZSgvXy9nLCAnICcpXG4gICAgICAgIGxhYmVsLnN0eWxlLnRleHRUcmFuc2Zvcm0gPSAnY2FwaXRhbGl6ZSdcblxuICAgICAgICBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JylcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ251bWJlcicpXG4gICAgICAgIGlucHV0LnZhbHVlID0gdmFsdWVcbiAgICAgICAgaW5wdXQuZGF0YXNldFsndHlwZSddID0gdHlwZVxuICAgICAgICBpbnB1dC5kYXRhc2V0WydvcHRpb24nXSA9IG9wdGlvblxuICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIC0+XG4gICAgICAgICAgZWxlbWVudCA9IEBcbiAgICAgICAgICBpZiBlbGVtZW50LmRhdGFzZXQudXBkYXRlVGltZW91dCB0aGVuIGNsZWFyVGltZW91dCBlbGVtZW50LmRhdGFzZXQudXBkYXRlVGltZW91dFxuICAgICAgICAgIGVsZW1lbnQuZGF0YXNldC51cGRhdGVUaW1lb3V0ID0gc2V0VGltZW91dCgoIC0+XG4gICAgICAgICAgICBzZWxmLndyaXRlVmFsdWUoZWxlbWVudC5kYXRhc2V0LnR5cGUsIGVsZW1lbnQuZGF0YXNldC5vcHRpb24sIGVsZW1lbnQudmFsdWUpXG4gICAgICAgICAgICBlbGVtZW50LmRhdGFzZXQudXBkYXRlVGltZW91dCA9IG51bGxcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNkZGQnXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCggLT4gZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2ZmZicpLCAxMDApXG4gICAgICAgICAgKSwgNTAwKVxuXG4gICAgICAgIClcblxuICAgICAgICBob2xkZXIuYXBwZW5kQ2hpbGQobGFiZWwpXG4gICAgICAgIGhvbGRlci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuICAgICAgICBob2xkZXIuYXBwZW5kQ2hpbGQoaW5wdXQpXG4gICAgICAgIGhvbGRlci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuXG4gICAgICBAb3B0aW9uX2hvbGRlci5hcHBlbmRDaGlsZChob2xkZXIpXG4gICAgbnVsbFxuXG4gIHdyaXRlVmFsdWU6ICh0eXBlLCBvcHRpb24sIHZhbHVlKSAtPlxuICAgIEBsaXN0ZW5lcih0eXBlLCBvcHRpb24sIHBhcnNlRmxvYXQodmFsdWUpKVxuXG4gIHNldFZhcmlhYmxlczogKHZhcmlhYmxlcykgLT5cbiAgICBAdmFyaWFibGVzID0gdmFyaWFibGVzXG4gICAgQGFkZE9wdGlvbnMoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9wdGlvbk1hbmFnZXIiLCIjIyNcbiAgY29sb3ItcG9uZFxuICBLZXZpbiBHcmF2aWVyIDIwMTZcbiAgR1BMLTMuMCBMaWNlbnNlXG5cbiAgU2ltcGxlIHJlbmRlcmVyLiBNb3JlIHRvIGNvbWUgaGVyZSBpbiB0aW1lXG4jIyNcblxuaG9sZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgJ21haW5faG9sZGVyJ1xuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgJ21haW4nXG5jYW52YXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYmEoMCwgMCwgMCwgMjU1KSdcblxuY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0ICcyZCdcbmNvbnRleHQuaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XG5cbmltYWdlX2RhdGEgPSBudWxsXG5cbm1vZHVsZS5leHBvcnRzLnNldFNpemUgPSAod2lkdGgsIGhlaWdodCwgeCwgeSkgLT5cbiAgaG9sZGVyLnN0eWxlLndpZHRoID0gXCIje3dpZHRofXB4XCJcbiAgaG9sZGVyLnN0eWxlLmhlaWdodCA9IFwiI3toZWlnaHR9cHhcIlxuICBjb250ZXh0LmNhbnZhcy53aWR0aCA9IHhcbiAgY29udGV4dC5jYW52YXMuaGVpZ2h0ID0geVxuICBpbWFnZV9kYXRhID0gY29udGV4dC5jcmVhdGVJbWFnZURhdGEgeCwgeVxuXG5tb2R1bGUuZXhwb3J0cy53cml0ZUltYWdlID0gKGRhdGEpIC0+XG4gIGltYWdlX2RhdGEuZGF0YVtpXT12IGZvciB2LCBpIGluIGRhdGFcbiAgY29udGV4dC5wdXRJbWFnZURhdGEoaW1hZ2VfZGF0YSwgMCwgMClcbiIsIiMjI1xuICBjb2xvci1wb25kXG4gIEtldmluIEdyYXZpZXIgMjAxNlxuICBHUEwtMy4wIExpY2Vuc2VcblxuICBEb2VzIGV2ZXJ5dGhpbmcgbmVlZGVkIGluIHRoZSBtYWluIGJyb3dzZXIgdGhyZWFkLCBpbmNsdWRpbmcgc3RhcnRpbmcgdGhlIHdlYndvcmtlci4gTmVlZCB0byBtb3ZlIGEgbG90XG4gIG9mIHRoaXMgbG9naWMgdG8gc2VwYXJhdGUgZmlsZXNcbiMjI1xuXG5mcHNfdGFyZ2V0ID0gMjBcblxucmVuZGVyID0gcmVxdWlyZSAnLi9saWIvcmVuZGVyJ1xuZnBzID0gcmVxdWlyZSgnLi9saWIvZnBzJykoKVxuT3B0aW9uTWFuYWdlciA9IHJlcXVpcmUoJy4vbGliL29wdGlvbk1hbmFnZXInKVxuXG53b3JrZXIgPSBuZXcgV29ya2VyKCdidWlsZC9wcm9jZXNzLmpzJyk7XG5yaWdodF9wYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyaWdodF9wYW5lbCcpXG5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpXG5zdGF0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGF0cycpXG5mbG93X3NlbGVjdG9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zsb3cnKVxuc2VlZF9ob2xkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VlZF9ob2xkZXInKVxuc2VlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWVkJylcbm9wdGlvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3B0aW9ucycpXG5cbnNlZWQudmFsdWUgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwMClcblxud2lkdGggPSBoZWlnaHQgPSBNYXRoLm1pbih3aW5kb3cuaW5uZXJIZWlnaHQsIHdpbmRvdy5pbm5lcldpZHRoKVxuXG5beCwgeV0gPSByZXF1aXJlKCcuL2xpYi9vcHRpbWFsUmVzb2x1dGlvbicpKHdpZHRoLCBoZWlnaHQsIDgwMDAwKVxuXG5zdGF0cy50ZXh0Q29udGVudCA9IFwiVFBTOiA/PyB8IEZQUzogPz9cIlxucmVuZGVyLnNldFNpemUgd2lkdGgsIGhlaWdodCwgeCwgeVxuXG5kaWRfaW5pdCA9IGZhbHNlXG5cbm9wdGlvbk1hbmFnZXIgPSBuZXcgT3B0aW9uTWFuYWdlcigodHlwZSwgdmFyaWFibGUsIHZhbHVlKSAtPiB3b3JrZXIucG9zdE1lc3NhZ2UgWyd1cGRhdGVWYXJpYWJsZScsIHR5cGUsIHZhcmlhYmxlLCB2YWx1ZV0pXG5cbndvcmtlci5wb3N0TWVzc2FnZSBbJ2dldFZhcmlhYmxlcyddXG53b3JrZXIub25tZXNzYWdlID0gKGUpIC0+XG4gIHN3aXRjaCBlLmRhdGFbMF1cbiAgICB3aGVuICdpbWFnZURhdGEnXG4gICAgICBmcHMudGljaygpXG4gICAgICByZW5kZXIud3JpdGVJbWFnZSBlLmRhdGFbMV1cbiAgICB3aGVuICd0cG0nXG4gICAgICBzdGF0cy50ZXh0Q29udGVudCA9IFwiVFBTOiAje01hdGgucm91bmQoZS5kYXRhWzFdKX0gfCBGUFM6ICN7TWF0aC5yb3VuZChmcHMuZ2V0RnBzKCkpfVwiXG4gICAgd2hlbiAnaW5pdGlhbGl6ZWQnXG4gICAgICBzZXRJbnRlcnZhbCAoIC0+XG4gICAgICAgIHdvcmtlci5wb3N0TWVzc2FnZSBbJ3NlbmRUUFMnXVxuICAgICAgKSwgMTAwMFxuXG4gICAgICBzZXRJbnRlcnZhbCAoIC0+XG4gICAgICAgIHdvcmtlci5wb3N0TWVzc2FnZSBbJ3NlbmRJbWFnZURhdGEnXVxuICAgICAgKSwgMTAwMCAvIGZwc190YXJnZXRcbiAgICAgIHdvcmtlci5wb3N0TWVzc2FnZSBbJ3N0YXJ0J11cbiAgICB3aGVuICd2YXJpYWJsZXMnXG4gICAgICBvcHRpb25NYW5hZ2VyLnNldFZhcmlhYmxlcyhlLmRhdGFbMV0pXG5cbmNhbnZhcy5hZGRFdmVudExpc3RlbmVyICdjbGljaycsIC0+XG4gIGlmIHJpZ2h0X3BhbmVsLmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpXG4gICAgcmlnaHRfcGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXG4gIGVsc2VcbiAgICByaWdodF9wYW5lbC5jbGFzc0xpc3QuYWRkKCdzaG93JylcbiAgdHJ1ZVxuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnQnKS5hZGRFdmVudExpc3RlbmVyICdjbGljaycsIC0+XG4gIGlmIGRpZF9pbml0XG4gICAgd29ya2VyLnBvc3RNZXNzYWdlIFsnc3RhcnQnXVxuICBlbHNlXG4gICAgd29ya2VyLnBvc3RNZXNzYWdlIFsnaW5pdCcsIHgsIHksIHNlZWQudmFsdWUsIGZsb3cudmFsdWVdXG4gICAgcmlnaHRfcGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXG4gICAgc2VlZC5zZXRBdHRyaWJ1dGUoJ3JlYWRvbmx5JywgJ3JlYWRvbmx5JylcblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0b3AnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIC0+IHdvcmtlci5wb3N0TWVzc2FnZSBbJ3N0b3AnXSk7XG5cbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2dnbGVfcGl4ZWwnKS5hZGRFdmVudExpc3RlbmVyICdjbGljaycsIC0+XG4gIGlmIGNhbnZhcy5jbGFzc0xpc3QuY29udGFpbnMoJ3BpeGVsZWQnKVxuICAgIGNhbnZhcy5jbGFzc0xpc3QucmVtb3ZlKCdwaXhlbGVkJylcbiAgZWxzZVxuICAgIGNhbnZhcy5jbGFzc0xpc3QuYWRkKCdwaXhlbGVkJylcblxuZmxvd19zZWxlY3Rvci5hZGRFdmVudExpc3RlbmVyICdjaGFuZ2UnLCAtPlxuICB3b3JrZXIucG9zdE1lc3NhZ2UgWydzZXRGbG93VHlwZScsIHRoaXMudmFsdWVdXG5cbiJdfQ==