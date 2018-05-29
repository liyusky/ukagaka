'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Balance = function () {
  function Balance() {
    _classCallCheck(this, Balance);

    this.option = null;
    this.previousBalance = null;

    this.option = {
      TradingVolume: 'today-trade',
      TotalAmount: 'accumulate-trade',
      AvgAmount: 'average-trade',
      RegUserMin1: 'nearlyone',
      NumberTrades: 'today-count',
      TotalTrades: 'accumutrans',
      TodayRegUser: 'today-register',
      TotalRegCount: 'accumulatedUser',
      TradesMin1: 'transaction-one'
    };

    this.previousBalance = {
      TradingVolume: 0,
      TotalAmount: 0,
      AvgAmount: 0,
      RegUserMin1: 0,
      NumberTrades: 0,
      TotalTrades: 0,
      TodayRegUser: 0,
      TotalRegCount: 0,
      TradesMin1: 0
    };

    this.init();
  }

  _createClass(Balance, [{
    key: 'init',
    value: function init() {
      var htmlStr = '<div class="l js-l-box digit-container boxs" data-show="0">\n        <span>0</span>\n        <span>1</span>\n        <span>2</span>\n        <span>3</span>\n        <span>4</span>\n        <span>5</span>\n        <span>6</span>\n        <span>7</span>\n        <span>8</span>\n        <span>9</span>\n      </div>';
      for (var key in this.option) {
        $('#' + this.option[key]).append(htmlStr);
      }
    }
  }, {
    key: 'setHtml',
    value: function setHtml(len) {
      var htmlStr = '';
      var numStr = '<div class="l js-l-box digit-container boxs" data-show="0">\n        <span>0</span>\n        <span>1</span>\n        <span>2</span>\n        <span>3</span>\n        <span>4</span>\n        <span>5</span>\n        <span>6</span>\n        <span>7</span>\n        <span>8</span>\n        <span>9</span>\n      </div>';
      var signStr = '<div class="sign-box l"><span>,</span></div>';
      for (var i = 0; i < len; i++) {
        if (i > 0 && i % 3 == 0) {
          htmlStr = signStr + htmlStr;
        }
        htmlStr = numStr + htmlStr;
      }
      return htmlStr;
    }
  }, {
    key: 'active',
    value: function active(key, newPrice) {
      var _this = this;

      var id = this.option[key];
      var oldPrice = this.previousBalance[key];
      var newArr = String(newPrice).split('');
      var oldArr = String(oldPrice).split('');
      var newLen = newArr.length;
      var newCount = newArr.length + Math.ceil(newArr.length / 3) - 1;
      var oldCount = oldArr.length + Math.ceil(oldArr.length / 3) - 1;
      var wrapDom = $('#' + id);
      wrapDom.html(this.setHtml(newLen));
      var itemDoms = wrapDom.find('.digit-container');
      itemDoms.each(function (index, item) {
        $(item).css('margin-top', oldArr[index] * -44 + 'px');
      });

      itemDoms.each(function (index, item) {
        $(item).animate({
          marginTop: newArr[index] * -44 + 'px'
        }, 1500, function () {
          _this.previousBalance[key] = newPrice;
          for (var i = 0; i < oldCount - newCount; i++) {
            itemDoms.get(i).remove();
          }
        });
      });
    }
  }, {
    key: 'mount',
    value: function mount(message) {
      var data = JSON.parse(decodeURIComponent(message.data));
      for (var key in data) {
        if (this.previousBalance.hasOwnProperty(key)) {
          if (key == 'AvgAmount') data[key] = Math.ceil(data[key]);
          this.active(key, data[key]);
        }
      }
    }
  }]);

  return Balance;
}();
