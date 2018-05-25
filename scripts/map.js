$(function () {
  var lastnum = "",
    lastarr = "";
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
      var height = $("#box1").height();
      $(".js-l-box").each(function (i) {
        // 取到每一个字符
        var num = parseInt($(this).data("show"));
        var scrollTop = 0;
        // 移动高度乘以字符
        var scrollTop = height * num;
        $(this).css("margin-top", 0);
        $(this).animate({
          marginTop: -scrollTop
        }, 1500);
      });
    }
  };

  var arr = [];

  function moveFont(fontEvent, message) {
    var data = JSON.parse(decodeURIComponent(message.data));
    var final_arr = fontEvent.number(String(data.TradingVolume).getAns()); // 今日交易额
    $(".box1").html(fontEvent.dom(final_arr));
    var final_arr = fontEvent.number(String(data.TotalAmount).getAns()); // 累计交易额
    $(".box2").html(fontEvent.dom(final_arr));
    var final_arr = fontEvent.number(String(data.AvgAmount).getAns()); // 平均每笔交易
    $(".box3").html(fontEvent.dom(final_arr));
    var final_arr = fontEvent.number(String(data.RegUserMin1).getAns()); // 近1分钟注册用户
    $(".box4").html(fontEvent.dom(final_arr));
    var final_arr = fontEvent.number(String(data.TradesMin1).getAns()); // 近1分钟交易笔数
    $(".box5").html(fontEvent.dom(final_arr));
    var final_arr = fontEvent.number(String(data.NumberTrades).getAns()); // 今日交易笔数
    $(".box6").html(fontEvent.dom(final_arr));
    var final_arr = fontEvent.number(String(data.TotalTrades).getAns()); // 累计交易笔数
    $(".box7").html(fontEvent.dom(final_arr));
    var final_arr = fontEvent.number(String(data.TodayRegUser).getAns()); // 今日注册用户
    $(".box8").html(fontEvent.dom(final_arr));
    var final_arr = fontEvent.number(String(data.TotalRegCount).getAns()); // 累计交易用户
    $(".box9").html(fontEvent.dom(final_arr));
    fontEvent.animation();
  }


  String.prototype.getAns = function () {
    var pattern = /(?=((?!\b)\d{3})+$)/g;
    return this.replace(pattern, ',');
  };

  function cityMove(message) {
    var data = JSON.parse(decodeURIComponent(message.data));
    var cityList = data.Users;
    var str = '<tbody class="tbody">' +
      '<tr>' +
      '<td>' + cityList[0].ProviceName + '</td>' +
      '<td>' + cityList[0].Name + '</td>' +
      '<td>' + cityList[0].Amount + '</td>' +
      '<td>' + cityList[0].Time + '</td>' +
      '</tr>' +
      '<tr>' +
      '<td>' + cityList[1].ProviceName + '</td>' +
      '<td>' + cityList[1].Name + '</td>' +
      '<td>' + cityList[1].Amount + '</td>' +
      '<td>' + cityList[1].Time + '</td>' +
      '</tr>' +
      '</tbody>';
    $('#newTransaction').append(str);

    setTimeout(function () {
      $('.tbody')[0].style.top = '166px';
      if ($('.tbody')[1]) $('.tbody')[1].style.top = '28px';
      setTimeout(function () {
        $('.tbody')[0].remove();
      }, 5000);
    }, 10000);
  };

  function rankings(message) {
    var data = JSON.parse(decodeURIComponent(message.data));
    var html = '';
    var strimg = '';
    for (var i = 0; i < data.Provinces.length; i++) {
      if (i < 3) {
        strimg = '<img src="img/' + (i + 1) + '.png">'
      } else {
        strimg = '<span class="rank">' + (i + 1) + '</span>'
      };
      html += '<li>' +
        strimg +
        '<div class="box">' +
        '<span class="province">' + data.Provinces[i].ProviceName + '</span>' +
        '<div class="process"></div>' +
        '<span class="ratio">' + data.Provinces[i].Proportion * 100 + '%</span>' +
        '</div>' +
        '</li>';
    };
    $('#province').html(html);
    for (var j = 0; j < data.Provinces.length; j++) {
      $('.process').animate({ // 进度条总长320 10分之一为32
        width: (data.Provinces[j].Proportion * 10 * 32)
      })
    }
  };
  ws.addEventListener('message', message => {
    try {
      moveFont(fontEvent, message);
    } catch (error) {
      location.reload();
    }
  });
  ws.addEventListener('message', message => {
    try {
      cityMove(message);
    } catch (error) {
      location.reload();
    }
  });
  ws.addEventListener('message', message => {
    try {
      rankings(message);
    } catch (error) {
      location.reload();
    }
  });
});