// 零 insertAdjacentHTML 兼容火狐
if (
  typeof HTMLElement != "undefined" &&
  !HTMLElement.prototype.insertAdjacentElement
) {
  HTMLElement.prototype.insertAdjacentElement = function(where, parsedNode) {
    switch (where) {
      case "beforeBegin":
        this.parentNode.insertBefore(parsedNode, this);
        break;
      case "afterBegin":
        this.insertBefore(parsedNode, this.firstChild);
        break;
      case "beforeEnd":
        this.appendChild(parsedNode);
        break;
      case "afterEnd":
        if (this.nextSibling)
          this.parentNode.insertBefore(parsedNode, this.nextSibling);
        else this.parentNode.appendChild(parsedNode);
        break;
    }
  };
  HTMLElement.prototype.insertAdjacentHTML = function(where, htmlStr) {
    var r = this.ownerDocument.createRange();
    r.setStartBefore(this);
    var parsedHTML = r.createContextualFragment(htmlStr);
    this.insertAdjacentElement(where, parsedHTML);
  };

  HTMLElement.prototype.insertAdjacentText = function(where, txtStr) {
    var parsedText = document.createTextNode(txtStr);
    this.insertAdjacentElement(where, parsedText);
  };
}

// 一 我的频道的类
var that1;
class editSortMine {
  constructor(dom, obj, data) {
    that1 = this;
    this.dom = dom;
    this.obj = obj;
    this.data = data;
    // 控制是否可以删除
    that1.isDelete = false;
    // 控制滑动还是关闭弹窗
    that1.isMove = false;
    // 获取当前显示红色的id
    this.currentID = "";
    // 获取控制编辑或完成状态的开关dom
    this.editOrCompelete = document.querySelector("#editOrCompelete");
    // 赋于拖拽功能
    new Sortable(this.dom, this.obj);
  }
  // 1.获取当前id
  giveToCurrentID(currentID) {
    console.log(currentID);
    if (currentID) {
      that1.currentID = currentID;
    }
    // 删除原先的旧的dom
    that1.dom.innerHTML = "";
    // 渲染数据
    this.render();
  }
  // 2.渲染数据
  render() {
    if (that1.data.length > 0) {
      // 渲染dom
      let html = ``;
      for (let i = 0; i < that1.data.length; i++) {
        html += `<div class="${that1.data[i].dragable && that1.data[i].dragable ==true?'drag':''}">
          <div class="item1" data-id = "${that1.data[i].id}" >${that1.data[i].name}</div>
          <div class="closeX">X</div>
        </div>`;
      }
      this.dom.insertAdjacentHTML("beforeend", html);

      // 如果有当前显示红色id 执行getCurrentId 方法
      if (that1.currentID) {
        this.getCurrentId();
      }

      // 获取我的频道里面的item1并且绑定事件
      that1.item1s = document.querySelectorAll(".item1");
      for (let i = 0; i < that1.item1s.length; i++) {
        that1.item1s[i].onclick = this.delete; // 删
        that1.item1s[i].ontouchmove = this.sort; // 拖拽
        that1.item1s[i].ontouchend = this.isGoback; // 关闭弹窗
      }

      // 绑定事件
      this.init();

      // 如果处于编辑状态
      if (that1.isDelete === true) {
        // 要有关闭按钮
        let closeXs = document.querySelectorAll(".closeX");
        for (let i = 0; i < closeXs.length; i++) {
          closeXs[i].style.display = "block";
        }
      }
    }
  }
  // 3.绑定事件
  init() {
    // 绑定切换状态事件
    this.editOrCompelete.onclick = this.toggle;
  }
  // 4.第一次(或者后面n次)获取当前id 让它显示红色
  getCurrentId() {
    let dom = document.querySelectorAll(".item1");
    for (let i = 0; i < dom.length; i++) {
      if (dom[i].getAttribute("data-id") == that1.currentID) {
        dom[i].style.color = "red";
        break;
      }
    }
  }
  // 5.切换编辑/完成状态
  toggle() {
    // 获取开关dom
    let switchIdentifier = document.querySelector("#editOrCompelete");
    if (switchIdentifier.innerText == "编辑") {
      // 进入编辑状态 可以删除
      that1.isDelete = true;
      switchIdentifier.innerText = "完成";
      let closeXs = document.querySelectorAll(".closeX");
      for (let i = 0; i < closeXs.length; i++) {
        closeXs[i].style.display = "block";
      }
    } else if (switchIdentifier.innerText == "完成") {
      // 进入完成状态 不可以删除
      that1.isDelete = false;
      switchIdentifier.innerText = "编辑";
      let closeXs = document.querySelectorAll(".closeX");
      for (let i = 0; i < closeXs.length; i++) {
        closeXs[i].style.display = "none";
      }
    }
  }
  // 6.删除并且重新渲染
  delete(e) {
    // 阻止冒泡
    e.stopPropagation();
    // 如果处于编辑状态
    if (that1.isDelete) {
      // 删除数据
      let id = this.getAttribute("data-id"); // 1.获取删除对象的id值
      let name = this.innerText; // 2.删除对象的名字
      console.log("删除id", id, "删除名字", name);
      console.log("删除之前的我的频道", that1.data);

      // 执行红色转移方法 传入当前dom 和 当前数据
      that1.gotoNextRed(this, that1.data);

      // 根据id删除数组中的对应的对象
      let deleteData = null;
      for (let i = 0; i < that1.data.length; i++) {
        if (that1.data[i].id == id) {
          // 先获取删除的对象
          deleteData = that1.data[i];
          console.log("删除的对象是", deleteData);
          // 再删除
          that1.data.splice(i, 1);
          break;
        }
      }
      console.log("删除之后的我的频道", that1.data);

      // 移动数据到推荐频道
      that2.data.push(deleteData);
      console.log("删除之后的推荐频道", that2.data);

      // 删除dom
      this.parentNode.remove();

      // 删除推荐频道之前的旧的dom
      that2.dom.innerHTML = "";

      // 重新渲染that2
      that2.render();
    }
  }
  // 7.拖拽
  sort() {
    // 如果拖拽 处于拖拽状态
    that1.isMove = true;
    console.log(that1.data);
  }
  // 8.touchend后 判断是否关闭弹窗并且返回当前currentID
  isGoback() {
    // 如果处于完成状态
    if (that1.isDelete == false) {
      // 如果是拖拽状态结束的
      if (that1.isMove == true) {
        // 改回结束拖拽状态
        that1.isMove = false;
        // 更新dom和data
        // that1.updateDomAndData();
      } else if (that1.isMove == false) {
        // 执行goback方法
        // alert("执行goback方法");
        let close = document.querySelector("#close")
        close.click()
      }
    }
    that1.updateDomAndData();
  }
  // 9.更新dom和data
  updateDomAndData() {
    let timer = setTimeout(() => {
      // 并且更新dom和数据
      // 更新dom
      that1.item1s = document.querySelectorAll(".item1");
      
      // 更新数据
      let newThat1Data = []
      for (let i = 0; i < that1.data.length; i++) {
        // 获取名字和id
        let obj = {};
        obj.name = that1.data[i].name;
        obj.id = that1.data[i].id;
        obj.dragable = that1.data[i].dragable;
        newThat1Data.push(obj);
      }
      // 清空原数组
      that1.data = []
      // 复制新的数组
      that1.data = newThat1Data

      console.log(that1.data, that1.item1s);
      clearTimeout(timer);
    }, 100);
  }
  // 10.删除后跳转红色跳转
  gotoNextRed(currentDOM, currentData) {
    console.log("当前dom和我的频道的数据", currentDOM, currentData);
    let currentID = currentDOM.getAttribute("data-id");
    // 判断是否是红色对应id
    if (currentID == that1.currentID) {
      // 判断是否是最后一个对象对应id
      if (currentID != currentData[currentData.length - 1].id) {
        // 如果不是话 删除红色id 找数组对象中下一个的对象的id赋值给that.currentID
        for (let i = 0; i < currentData.length; i++) {
          if (currentData[i].id == currentID) {
            // 更改当前红色id
            that1.currentID = currentData[i + 1].id;
            // 执行变红色
            that1.getCurrentId();
          }
        }
      }
    }
  }
  // 11.返回数据
  getResult() {
    let result = {};
    result.mine = that1.data;
    result.recommend = that2.data;
    result.currentID = that1.currentID || null;
    return result;
  }
}

// 二 推荐频道的类
var that2;
class editSortRecommend {
  constructor(dom, obj, data) {
    that2 = this;
    this.dom = dom;
    this.obj = obj;
    this.data = data;
    new Sortable(that2.dom, that2.obj);
    this.render();
  }
  // 1.渲染数据
  render() {
    if (that2.data.length > 0) {
      // 根据数据渲染出dom
      let html = ``;
      for (let i = 0; i < that2.data.length; i++) {
        html += `<div class="${that2.data[i].dragable && that2.data[i].dragable ==true?'drag':''}">
        <div class="item2">
          <div class="closeAdd" data-id = "${that2.data[i].id}">+</div>
          <div>${that2.data[i].name}</div>
        </div>
      </div>`;
      }
      this.dom.insertAdjacentHTML("beforeend", html);
      // 获取推荐频道里面的item2并且绑定事件
      that2.item2s = document.querySelectorAll(".item2");
      for (let i = 0; i < that2.item2s.length; i++) {
        that2.item2s[i].onclick = this.delete; // 删
      }
    }
  }
  // 2.删除推荐频道数据和dom 并且渲染我的频道
  delete(e) {
    // 阻止冒泡
    e.stopPropagation();
    // 获取删除dom的id和名字
    let id = this.firstElementChild.getAttribute("data-id");
    let name = this.innerText.slice(1); //
    console.log("删除id", id, "删除名字", name);
    console.log("删除之前推荐频道", that2.data);
    // 获取当前id的对应的对象
    let deleteData = null;
    for (let i = 0; i < that2.data.length; i++) {
      if (that2.data[i].id == id) {
        // 先获取删除的对象
        deleteData = that2.data[i];
        console.log("删除的对象是", deleteData);
        // 再删除
        that2.data.splice(i, 1);
        break;
      }
    }
    console.log("删除之后推荐频道", that2.data);
    console.log("删除之后我的频道", that1.data);
    // 移动数据到我的频道
    that1.data.push(deleteData);
    // 删除当前dom
    this.parentNode.remove();
    // 删除我的频道之前旧的所有dom
    that1.dom.innerHTML = "";
    // 重新渲染我的频道
    that1.render();
  }
}
