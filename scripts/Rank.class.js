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
        var end = item.Proportion * 100;

        var animatation = setInterval(function () {
          if (end == _this.ratio[item.ProviceNo]) {
            _this.ratio[item.ProviceNo] = end;
            clearInterval(animatation);
            return;
          }
          _this.ratio[item.ProviceNo]++;

          numDom.text(_this.ratio[item.ProviceNo] + '%');
          railDom.css('width', _this.ratio[item.ProviceNo] + '%');
        }, (end - _this.ratio[item.ProviceNo] * 100) * 1);
        _this.count = index;
      });

      this.itemDoms.each(function (index, item) {
        if (index > _this.count && !$(item).hasClass('hide')) $(item).addClass('hide');
      });
    }
  }]);

  return Rank;
}();
