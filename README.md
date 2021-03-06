# lotteryRotate
矩形转盘抽奖插件
# 使用说明
## 引用

```html
    <!--引用zepto或者jquery都行，移动端使用zepto-->
    <script type="text/javascript" src="js/zepto.min.js"></script>
    <script type="text/javascript" src="js/lotteryRotate.js"></script>
```

## HTML结构要求

```html
<div class="lottery-content">
    <div class="chooseBox gifted">      <!--这是该奖品的选中状态，比未选中状态多一个gifted-->
        <img src="images/gift0.png" alt=""/>
    </div>
    <div class="chooseBox ">            <!--这是该奖品的未选中状态-->
        <img src="images/gift1.png" alt=""/>
    </div>
    <div class="chooseBox ">
        <img src="images/gift2.png" alt=""/>
    </div>
    <div class="chooseBox ">
        <img src="images/gift3.png" alt=""/>
    </div>
    <div class="chooseBox ">
        //empty
    </div>
    <div class="chooseBox ">
        <img src="images/gift4.png" alt=""/>
    </div>
    <div class="chooseBox ">
        <img src="images/gift5.png" alt=""/>
    </div>
    <div class="chooseBox ">
        <img src="images/gift6.png" alt=""/>
    </div>
    <div class="chooseBox ">
        <img src="images/gift7.png" alt=""/>
    </div>
</div>

 <div class="start">
        <a></a>
 </div>
```
说明：
1. .lottery-content是外部父元素包裹抽奖选项
2. .gifted是中奖了的样式，用于切换
3. .chooseBox是基本样式
4. 选中状态是直接添加.gifted样式，权重在css中处理

## CSS要求
1. css自定义实现抽奖框排布换行，插件内不做处理

## js使用
```javascript
//初始化抽奖框
 window.rotateBox = $('.lottery-content').lotteryRotate({
     rowNumber: 3,                      //行数
     columnNumber: 3,                   //列数
     onChangeClassName: "gifted",       //写法1：选中状态的class统一名字
     onChangeClassName:  ['gifted1', 'gifted2', 'gifted3'],       //写法2：选中状态的class不同名字为顺时针
     staticRotatTime: 100,              //旋转速度控制
     endCallBack: function(endNumber) { //抽完奖之后的回调函数
         var $endDom = $('[data-index="' + endNumber + '"]');
         Dialog.alert(['恭喜你', ('获得' + $endDom.attr('data-title'))]);
     }
 });
 
 window.rotateBox.startNewRotate();      //调用执行旋转方法
 window.rotateBox.set_endNumber(index);  //结束旋转，计数从0开始，顺时针计数
```
