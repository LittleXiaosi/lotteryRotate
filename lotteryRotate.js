/**
 *本插件用于实现抽奖的转盘效果
 * 使用demo
 *
 */
(function($) {
    var defaults = {
        rowNumber: 3,
        columnNumber: 3,
        interval_start: 0,
        interval_end: 0,
        nowIndex: 0,
        staticRotatTime: 100,
        rotatTime: 0,
        regexp: /^[0-9]+[0-9]*]*$/,
        startButton: ".startButton",
        onChangeClassName: [],
        beChangedCLassName: [],
        endNumber: NaN,
        nowChooseDom: undefined,
        endCallBack: function() {
            if (window.console) {
                console.log("endCallBack回调函数是空的");
            }
        },
        //function:init----用于初始化页面
        init: function($dom) {
            if (this.rowNumber < 3 || this.columnNumber < 3) {
                if (window.console) {
                    console.log("本插件需要至少3*3的选择框才能运行");
                }
                return 0;
            }

            //如果用户自己定义了子元素，就不会自动生成
            if (($dom).children().length == 0) {
                for (var i = 0; i < this.rowNumber * this.columnNumber; i++) {
                    $dom.append("<div>");
                }
            }

            var $childDoms = $dom.children();                 //获取一级子元素

            $dom.css({"display": "inline-block", "overflow": "hidden", "position": "relative"});
            $childDoms.css({"float": "left"});     //给一级子元素横向排列

            this.defaultClassName = $dom.attr("class");

            var $childArray = new Array(this.columnNumber);

            //实现给滚动块换行功能 begin
            for (var i = 1, j = 0; i <= this.columnNumber, j < this.columnNumber; i++, j++) {
                if (window.jQuery) {
                    $childDoms.filter(":eq(" + (i * this.rowNumber - 1) + ")").after("<br style='clear: both'>");
                } else if (window.Zepto) {
                    $childDoms.eq(i * this.rowNumber - 1).after("<br style='clear: both'>");
                }
                $childArray[j] = $childDoms.slice(j * this.rowNumber, i * this.rowNumber);
            }
            //实现给滚动块换行功能 end

            //实现给滚动块分层并且隐藏显示功能 begin
            var $childArrayLength = $childArray.length;

            //实现第一行连续排序
            for (var i = 0; i < this.rowNumber; i++) {
                if (window.jQuery) {
                    $childArray[0].filter(":eq(" + i + ")").attr("data-index", i);
                } else if (window.Zepto) {
                    $childArray[0].eq(i).attr("data-index", i);
                }

            }
            //实现最后一行连续排序
            for (var j = this.rowNumber - 1; j >= 0; j--) {
                if (window.jQuery) {
                    $childArray[$childArrayLength - 1].filter(":eq(" + j + ")").attr("data-index", (this.rowNumber * 2 + this.columnNumber - 3 - j));
                } else if (window.Zepto) {
                    $childArray[$childArrayLength - 1].eq(j).attr("data-index", (this.rowNumber * 2 + this.columnNumber - 3 - j));
                }
            }

            //实现中间行跨行排序
            for (var i = 1; i < this.columnNumber - 1; i++) {
                if (window.jQuery) {
                    $childArray[i].filter(":first").attr("data-index", (this.rowNumber * 2 + this.columnNumber * 2 - 4 - i));
                    $childArray[i].filter(":last").attr("data-index", ( this.rowNumber + i - 1));
                } else if (window.Zepto) {
                    $childArray[i].first().attr("data-index", (this.rowNumber * 2 + this.columnNumber * 2 - 4 - i));
                    $childArray[i].last().attr("data-index", ( this.rowNumber + i - 1));
                }
            }

            //实现给滚动块分层并且隐藏显示功能 end

            //console.log($childArray);

            var sortArray = new Array();

            //初始化旋转速度
            this.rotatTime = this.staticRotatTime;
        }
    }

    function lotteryRotateFunction($dom, options) {

        if (!(this instanceof lotteryRotateFunction)) {
            return new lotteryRotateFunction($dom, options);
        }
        if ($dom == undefined || options == undefined) {
            if (window.console) {
                console.log("请检查lotteryRotateFunction的参数");
            }
        }
        var that = this;

        that.opts = $.extend({}, defaults, options || {});

        var rotatCount = that.opts.rowNumber * 2 + that.opts.columnNumber * 2 - 4;


        //初始化页面，生成旋转元素 begin
        var $this = $dom;

        //console.log($this);

        that.opts.init($this);
        //初始化页面，生成旋转元素 end

        //旋转实现 begin
        var beChangedClassName = that.opts.beChangedCLassName;
        var onChangeClassName = that.opts.onChangeClassName;

        //定义抽奖旋转函数
        that.rotation = function(index) {
            if (beChangedClassName.length == onChangeClassName.length && beChangedClassName.length > 0) {
                var classNameLength = beChangedClassName.length;
                var nextDom = $this.children().filter("[data-index='" + index + "']");

                for (var i = 0; i < classNameLength; i++) {
                    $this.children().removeClass(onChangeClassName[i]);
                }
                for (var i = 0; i < classNameLength; i++) {
                    if (nextDom.hasClass(beChangedClassName[i])) {
                        nextDom.addClass(onChangeClassName[i]);
                    }
                }
                $this.children().filter("[data-index='" + index + "']").addClass(onChangeClassName[i]);

            } else if (typeof beChangedClassName == 'string' && typeof onChangeClassName == 'string') {
                var nextDom = $this.children().filter("[data-index='" + index + "']");
                $this.children().removeClass(onChangeClassName);
                if (nextDom.hasClass(beChangedClassName)) {
                    nextDom.addClass(onChangeClassName);
                }
                $this.children().filter("[data-index='" + index + "']").addClass(onChangeClassName);
            } else {
                if (window.console) {
                    console.log("错误：beChangedClassName数组长度应该要等于onChangeClassName长度");
                }
            }
        }

        //开始抽奖旋转函数
        that.startRotat = function() {
            //console.log(that.opts);  测试时候调用
            //开始匀速旋转，抽奖起始阶段

            that.opts.nowIndex = ++that.opts.nowIndex % rotatCount;
            //                alert(that.opts.nowIndex);   //调试时使用
            that.rotation(that.opts.nowIndex);

            var endNumber = typeof (that.opts.endNumber) == "number" ? that.opts.endNumber : NaN;      //endNumber 的获取方式需要后期更改,更改为ajax

            if (that.opts.regexp.test(endNumber) && endNumber <= (rotatCount - 1) && endNumber >= 0) {
                clearTimeout(that.opts.interval_start);
                that.endRotat(endNumber);
            } else {
                clearTimeout(that.opts.interval_start);
                that.opts.interval_start = setTimeout(function() {
                    that.startRotat();
                }, that.opts.rotatTime);
            }
        }

        //结束抽奖旋转函数
        that.endRotat = function(endNumber) {
            if (that.opts.nowIndex < (endNumber + rotatCount)) {
                //                    alert("that.opts.nowIndex:" + that.opts.nowIndex + "endNumber:" + endNumber);       //调试时使用
                that.opts.rotatTime = that.opts.rotatTime + 50;
                that.opts.nowIndex = ++that.opts.nowIndex;
                that.rotation((that.opts.nowIndex % rotatCount));
                that.opts.interval_end = window.setTimeout(function() {
                    that.endRotat(endNumber);
                }, that.opts.rotatTime);
            } else {
                clearTimeout(that.opts.interval_end);
                $.fn.lotteryRotate.onRotate = false;
                that.opts.endCallBack.call(this, endNumber);
            }
        }

        //旋转实现 end

        //结束抽奖时候调用的函数
        that.set_endNumber = function(endNumber) {
            that.opts.endNumber = endNumber;
            that.opts.nowChooseDom = $dom.children().filter('[data-index="' + endNumber + '"]');
            return that.opts.nowChooseDom;
        }
        //开启抽奖时候调用函数
        that.startNewRotate = function() {
            if (!$.fn.lotteryRotate.onRotate) {

                $.fn.lotteryRotate.onRotate = true;
                that.opts.rotatTime = that.opts.staticRotatTime;        //重置旋转延迟时间
                that.opts.endNumber = NaN;                                        //重置抽奖结果

                if (window.console) {
                    console.log(that.opts);
                }
                that.opts.nowIndex = 0;
                clearTimeout(that.opts.interval_start);
                clearTimeout(that.opts.interval_end);
                that.startRotat();
            } else {
                if (window.console) {
                    console.log("正在抽奖中，请稍等片刻");
                }
            }
        }
    }

    $.fn.lotteryRotate = function(options) {

        var newRotateBox = new lotteryRotateFunction($(this), options);//实例化的新插件对象
        //点击开始抽奖
        //基于抽奖前状态判断，由使用插件者自行在ajax回调函数调用抽奖函数  $.fn.lotteryRotate.aNewRotate
        return newRotateBox;
    }
    $.fn.lotteryRotate.onRotate = false;

}(window.Zepto || window.jQuery));
