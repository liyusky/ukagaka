class Rank {
  ratio = null;
  count = null;
  itemDoms = null;
  constructor() {
    this.count = 0;
    this.ratio = {};
    this.itemDoms = $('#rank').children();
  }

  mount(message) {
    let provinces = JSON.parse(decodeURIComponent(message.data)).Provinces;
    provinces.forEach((item, index) => {
    
      if (!(this.ratio[item.ProviceNo])) this.ratio[item.ProviceNo] = 0;
      if ($(this.itemDoms.get(index)).hasClass('hide')) $(this.itemDoms.get(index)).removeClass('hide');
      
      $(this.itemDoms.get(index)).find('.item-name').text(item.ProviceName);

      var numDom = $(this.itemDoms.get(index)).find('.item-num');
      var railDom = $(this.itemDoms.get(index)).find('.link-rail');
      var end = parseInt(item.Proportion * 100);

      this.animatation(end, item, numDom, railDom);
      this.count = index;
    });

    this.itemDoms.each((index, item) => {
      if (index > this.count && !$(item).hasClass('hide')) $(item).addClass('hide');
    });
  }


  animatation(end, item, numDom, railDom) {
    setTimeout(() => {
      if (end == this.ratio[item.ProviceNo]) return;
      if (end > this.ratio[item.ProviceNo]) {
        this.ratio[item.ProviceNo]++;
      }
      if (end < this.ratio[item.ProviceNo]) {
        this.ratio[item.ProviceNo]--;
      }
  
      numDom.text(this.ratio[item.ProviceNo] + '%');
      railDom.css('width', this.ratio[item.ProviceNo] + '%');
      return this.animatation(end, item, numDom, railDom);
    }, Math.abs(end - this.ratio[item.ProviceNo]) * 20);
  }
}