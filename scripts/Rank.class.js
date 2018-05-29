'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Rank = function () {
  function Rank() {
    _classCallCheck(this, Rank);

    this.ratio = null;
    this.count = null;
    this.itemDoms = null;

    this.count = 0;
    this.ratio = {};
    this.itemDoms = $('#rank').children();
  }

  _createClass(Rank, [{
    key: 'mount',
    value: function mount(message) {
      var _this = this;

      var provinces = JSON.parse(decodeURIComponent(message.data)).Provinces;
      provinces.forEach(function (item, index) {

        if (!_this.ratio[item.ProviceNo]) _this.ratio[item.ProviceNo] = 0;
        if ($(_this.itemDoms.get(index)).hasClass('hide')) $(_this.itemDoms.get(index)).removeClass('hide');

        $(_this.itemDoms.get(index)).find('.item-name').text(item.ProviceName);

        var numDom = $(_this.itemDoms.get(index)).find('.item-num');
        var railDom = $(_this.itemDoms.get(index)).find('.link-rail');
        var end = parseInt(item.Proportion * 100);

        _this.animatation(end, item, numDom, railDom);
        _this.count = index;
      });

      this.itemDoms.each(function (index, item) {
        if (index > _this.count && !$(item).hasClass('hide')) $(item).addClass('hide');
      });
    }
  }, {
    key: 'animatation',
    value: function animatation(end, item, numDom, railDom) {
      var _this2 = this;

      setTimeout(function () {
        if (end == _this2.ratio[item.ProviceNo]) return;
        if (end > _this2.ratio[item.ProviceNo]) {
          _this2.ratio[item.ProviceNo]++;
        }
        if (end < _this2.ratio[item.ProviceNo]) {
          _this2.ratio[item.ProviceNo]--;
        }

        numDom.text(_this2.ratio[item.ProviceNo] + '%');
        railDom.css('width', _this2.ratio[item.ProviceNo] + '%');
        return _this2.animatation(end, item, numDom, railDom);
      }, Math.abs(end - this.ratio[item.ProviceNo]) * 20);
    }
  }]);

  return Rank;
}();
