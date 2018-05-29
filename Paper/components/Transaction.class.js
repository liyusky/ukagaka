class Transaction {
  mark = null;
  wrapDom = null
  cityQueue = null;
  constructor() {
    this.mark = true;
    this.cityQueue = [];
    this.wrapDom = $('#transaction-content');
  }

  //挂载websocket传来的数据
  mount(message) {
    let users = JSON.parse(decodeURIComponent(message.data)).Users;
    this.cityQueue.push(...users);
    if (this.cityQueue.length > 100) this.cityQueue = this.cityQueue.slice(-100);

    if (this.mark) this.active();
  }

  active() {
    this.mark = false;
    var animatation = setInterval(() => {
      if (this.cityQueue.length == 0) {
        this.mark = true;
        clearInterval(animatation);
        return;
      }
      this.rollUp(this.cityQueue[0]);
      this.cityQueue.shift();
    }, 1000);
  }

  //向上滚动
  rollUp(data) {
    let htmlStr = `<li class="content-item">
      <div>${data.ProviceName}</div>
      <div>${data.Name}</div>
      <div>${data.Amount}</div>
      <div>${data.Time}</div>
    </li>`;
    this.wrapDom.append(htmlStr);
    if (this.wrapDom.children().length < 3) return;
    this.wrapDom.animate(
      {top: '-45px'},
      1500,
      () => {
        this.wrapDom.children().get(0).remove();
        this.wrapDom.css('top', '0px');
      }
    );
  }
}