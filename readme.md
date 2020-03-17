| 项目名称 | 项目描述 |
| :-----   | :----   |
| 神软项目的资讯页首页 | 封装一个popup弹窗的栏目编辑  |
 ##
| 框架和插件 | 框架和插件描述 |
| :-----   | :----   |
| jQuery | 一个函数库  |
| flexable | 移动端适配插件 |
| sortab.js | 排序插件  |

| 功能 | 功能描述 | 功能目前实现状态 | 备注 |
| :-----   | :----   | :----   | :----   | 

| 1.1一二级栏目 | 呈现一二级栏目可以点击滑动  |完成 | 暂无 |
| 1.2栏目编辑 | 点击呈现弹窗呈现一级栏目数据可以拖拽顺序排序 点击栏目关闭弹窗跳转到栏目相对应的位置  | 完成 | 暂无 |


## 弹窗可拖拽栏目编辑插件

### 1. 首先 建立一个html文件 引入以下文件

```javascript
<link rel="stylesheet" href="./css/tabsEdit.css" />
<script src="js/jquery-3.3.1.js"></script>
<script sc="js/flexible.js"></script>
<script src="js/Sortable.js"></script>
<script src="js/tabsEdit.js"></script>
```

### 2. 然后 书写以下代码(id请不要改动 样式如果要改请到TabsEdit.css 更改源码)

```javascript
 <div id="openTabsEdit"><img src="./img/edit.png" alt="" /></div>
    <div id="popup" style="display:none;">
      <div id="close"><img src="./img/close.png" alt="" /></div>
      <!--关注频道-->
      <div class="mine">
        <div class="mineFirstDiv">
          <div class="mineChannel">我的频道</div>
          <div class="clickChnnel">点击进入频道</div>
        </div>
        <div class="editOrCompelete" id="editOrCompelete">编辑</div>
      </div>
      <div class="wrap" id="gridDemo1"></div>
      <!--推荐频道-->
      <div class="recommend">
        <div class="mineFirstDiv">
          <div class="mineChannel">频道推荐</div>
          <div class="clickChnnel">点击添加频道</div>
        </div>
      </div>
      <div class="wrap" id="gridDemo2"></div>
    </div>
```

### 3. 然后新建一个script 里面写下如下代码

#### 3.1 首先是数据格式

####       数据对象格式 

####       name是栏目名字 

####       id是对应的id值 

####       dragable是布尔值 控制对应栏目是否可以拖拽

```javascript
    // 演示写的假数据
    // 关注频道的假数据
    let data1 = [
      { name: "宽度宽度宽度", id: "1", dragable: false },
      { name: "自动", id: "2", dragable: false },
      { name: "收缩", id: "3", dragable: true },
      { name: "导致", id: "4", dragable: true },
      { name: "这个", id: "5", dragable: true },
      { name: "元素", id: "6", dragable: true },
      { name: "宽度", id: "7", dragable: true }
    ];
    // 推荐频道的假数据
    let data2 = [
      { name: "虽然", id: "8", dragable: true },
      { name: "也是", id: "9", dragable: true },
      { name: "两端", id: "10", dragable: true },
      { name: "单位", id: "11", dragable: true },
      { name: "备份", id: "12", dragable: true },
      { name: "分为虽然虽然", id: "13", dragable: true }
    ];
   // 然后获取关注频道推荐频道的dom对象
   let gridDemo1 = document.getElementById("gridDemo1");
   let gridDemo2 = document.getElementById("gridDemo2");
```

#### 3.2 实例对象 传入如下值

```javascript
    // 关注频道实例的对象 传入获取的dom对象 对象 数据
    let edit1 = new editSortMine(gridDemo1,{
        animation: 150,
        ghostClass: "blue-background-class",
        draggable: ".drag"
      },data1);
    // 推荐频道实例的对象 传入获取的dom对象 对象 数据
    let edit2 = new editSortRecommend(gridDemo2,{
        animation: 150,
        ghostClass: "blue-background-class",
        draggable: ".drag"
     },data2);
```

#### 3.3 绑定打开popupEdit事件

```javascript
    // 初始化当前id 
    edit1.currentID = "1";
    // 绑定打开popupEdit事件
    $("#openTabsEdit").on("click", function() {
      // 显示弹窗 栏目编辑
      $("#popup").fadeIn();
      // 关闭打开按钮
      $(this).css("display",'none');
      // 执行实例对象edit1的giveToCurrentID方法 传入当前对应栏目id
      // 为了让对应id的栏目显示红色 可以不传 也可以不执行这个方法
      edit1.giveToCurrentID(edit1.currentID);
    });
```

![Image](http://192.168.4.10:8083/freestyle/frontend-development/frontend-information/blob/ShengRuan_ChinaAirplane_newsByjQuery8/1.png)

#### 3.4 绑定关闭popupEdit事件

```javascript
 $("#close").on("click", function() {
      // 关闭弹窗
      $("#popup").fadeOut();
      // 打开按钮显示  
      $("#openTabsEdit").fadeIn();
      // 执行返回最新数据的方法
      let res = edit1.getResult();
      console.log(res);
      // 更新实例对象edit1 edit2的数据
      edit1.data = res.mine;
      edit1.currentID = res.currentID;
      edit2.data = res.recommend;
      console.log(edit1, edit2);
    });
```

![Image](http://192.168.4.10:8083/freestyle/frontend-development/frontend-information/blob/ShengRuan_ChinaAirplane_newsByjQuery8/2.png)

### 4. 实例对象的事件介绍

```javascript
4.1 实例对象.giveToCurrentID(实例对象.currentID)
给实例对象的currentID赋上你想要赋值的id
执行这个方法就可以在我的频道中出现红色栏目的提醒功能

4.2 实例对象.getResult();
执行这个方法会返回一个包含最新的我的频道+推荐频道+当前id的对象集合
```

### 5. 注意点

```javascript
 // 获取了最新的数据集合 别忘了更新数据
 edit1.data = res.mine;
 edit1.currentID = res.currentID;
 edit2.data = res.recommend;
```
