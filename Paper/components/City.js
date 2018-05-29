'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var City = function () {
  function City() {
    _classCallCheck(this, City);

    this.mark = null;
    this.wrapDom = null;
    this.cityQueue = null;

    this.mark = true;
    this.cityQueue = [];
    this.wrapDom = $('#myscroll');
  }

  //挂载websocket传来的数据


  _createClass(City, [{
    key: 'mount',
    value: function mount(message) {
      var _cityQueue;

      var users = JSON.parse(decodeURIComponent(message.data)).Users;
      (_cityQueue = this.cityQueue).push.apply(_cityQueue, _toConsumableArray(users));
      if (this.cityQueue.length > 100) this.cityQueue = this.cityQueue.slice(-100);

      if (this.mark) this.active();
    }
  }, {
    key: 'active',
    value: function active() {
      var _this = this;

      this.mark = false;
      var animatation = setInterval(function () {
        if (_this.cityQueue.length == 0) {
          _this.mark = true;
          clearInterval(animatation);
          return;
        }
        _this.rollUp(_this.cityQueue[0]);
        _this.cityQueue.shift();
      }, 1000);
    }

    //向上滚动

  }, {
    key: 'rollUp',
    value: function rollUp(data) {
      var htmlStr = '<li class="content-item">\n      <div>' + data.ProviceName + '</div>\n      <div>' + data.Name + '</div>\n      <div>' + data.Amount + '</div>\n      <div>' + data.Time + '</div>\n    </li>';
      this.wrapDom.append(htmlStr);
      if (this.wrapDom.children().length > 3) {
        this.wrapDom.css('top', '-30px').children().get(0).remove();
        this.wrapDom.css('top', '0px');
      }
    }
  }]);

  return City;
}();
