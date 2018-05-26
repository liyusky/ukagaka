$(function () {
  var fontEvent = {
    // 例 510,085.00
    number: function (digit) {
      var num_arr = [];
      for (var i = 0; i < digit.length; i++) {
        // 每一个装到数组里
        num_arr.push(digit.charAt(i));
      }
      return num_arr;
    },
    dom: function (arr) {
      var str = '';
      for (var i = 0; i < arr.length; i++) {
        // 数字
        if (parseInt(arr[i]) >= 0) {
          str += '<div class="l js-l-box digit-container boxs" data-show=' + arr[i] + '>' +
            '<span>0</span>' +
            '<span>1</span>' +
            '<span>2</span>' +
            '<span>3</span>' +
            '<span>4</span>' +
            '<span>5</span>' +
            '<span>6</span>' +
            '<span>7</span>' +
            '<span>8</span>' +
            '<span>9</span>' +
            '</div>';
        } else {
          // 标点符号
          str += '<div class="sign-box l"><span>' + arr[i] + '</span></div>';
        }
      }
      return str;
    },
    animation: function () {
      var height = $(".today-trade").height();
      $(".js-l-box").each(function (i) {
        // 取到每一个字符
        var num = parseInt($(this).data("show"));
        var scrollTop = 0;
        // 移动高度乘以字符
        var scrollTop = height * num;
        $(this).animate({
          marginTop: -scrollTop
        }, 1500);
      });
    }
  };

  var onece = true;
  console.log(1)

  function moveFont(fontEvent, data) {
    var obj = {};
    obj = data;
    if (onece) {
      onece = false;
      var final_arr = fontEvent.number(String(data.TradingVolume).getAns()); // 今日交易额
      $(".today-trade").html(fontEvent.dom(final_arr));
      var final_arr = fontEvent.number(String(data.TotalAmount).getAns()); // 累计交易额
      $(".accumulate-trade").html(fontEvent.dom(final_arr));
      var final_arr = fontEvent.number(String(data.AvgAmount).getAns()); // 平均每笔交易
      $(".average-trade").html(fontEvent.dom(final_arr));
      var final_arr = fontEvent.number(String(data.RegUserMin1).getAns()); // 近1分钟注册用户
      $(".nearlyone").html(fontEvent.dom(final_arr));
      var final_arr = fontEvent.number(String(data.TradesMin1).getAns()); // 近1分钟交易笔数
      $(".transaction-t").html(fontEvent.dom(final_arr));
      var final_arr = fontEvent.number(String(data.NumberTrades).getAns()); // 今日交易笔数
      $(".today-count").html(fontEvent.dom(final_arr));
      var final_arr = fontEvent.number(String(data.TotalTrades).getAns()); // 累计交易笔数
      $(".accumutrans").html(fontEvent.dom(final_arr));
      var final_arr = fontEvent.number(String(data.TodayRegUser).getAns()); // 今日注册用户
      $(".today-register").html(fontEvent.dom(final_arr));
      var final_arr = fontEvent.number(String(data.TotalRegCount).getAns()); // 累计交易用户
      $(".accumulatedUser").html(fontEvent.dom(final_arr));
      fontEvent.animation();
    } else {

      twoExecute('today-trade', data, obj);
      twoExecute('accumulate-trade', data, obj);
      twoExecute('average-trade', data, obj);
      twoExecute('nearlyone', data, obj);
      twoExecute('transaction', data, obj);
      twoExecute('today-count', data, obj);
      twoExecute('accumutrans', data, obj);
      twoExecute('today-register', data, obj);
      twoExecute('accumulatedUser', data, obj);

      function twoExecute(dom, data, obj) {
        var newTrading = 50000 - obj.TradingVolume;
        var newAmount = data.TotalAmount - obj.TotalAmount;
        var newAvgAmount = data.AvgAmount - obj.AvgAmount;
        var newRegUserMin = data.RegUserMin1 - obj.RegUserMin1;
        var newTradesMin1 = data.TradesMin1 - obj.TradesMin1;
        var newNumberTrades = data.NumberTrades - obj.NumberTrades;
        var newTotalTrades = data.TotalTrades - obj.TotalTrades;
        var newTodayRegUser = data.TodayRegUser - obj.TodayRegUser;
        var newTotalRegCount = data.TotalRegCount - obj.TotalRegCount;
        var arr = [newTrading, newAmount, newAvgAmount, newRegUserMin, newTradesMin1, newNumberTrades, newTotalTrades, newTotalTrades, newTodayRegUser, newTotalRegCount];

        for (var i = 0; i < arr.length; i++) {
          if (arr[i] == 0) {
            return
          } else {
            console.log(arr[i]);
            
            var len = (String(arr[i]).split(',')[0].split(''));
            var arrHtml = [];
            var child = document.getElementById(dom).children[0].children;
            for (var i = 0; i < child.length; i++) {
              arrHtml.push(child[i]);
            };
            var obj = arrHtml.splice(-len.length);
            if (child.length - 1 < len.length) {
              document.getElementById(dom).children[0].innerHTML = '<div class="l js-l-box digit-container boxs"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span></div>'
            };
            for (var j = 0; j < obj.length; j++) {
              // console.log(len)
              $(obj[j]).animate({
                marginTop: -len[j] * 44
              });
            }
          }
        }

      }
    }

  }


  String.prototype.getAns = function () {
    var pattern = /(?=((?!\b)\d{3})+$)/g;
    return this.replace(pattern, ',');
  };


  ws.addEventListener('message', message => {
    var data = JSON.parse(decodeURIComponent(message.data));
    moveFont(fontEvent, data);
    // try {
    // } catch (error) {
    //   location.reload();
    // }
  });


});