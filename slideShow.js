DBFX.RegisterNamespace("DBFX.Web.Controls");
DBFX.RegisterNamespace("DBFX.Web.NavControls");
DBFX.RegisterNamespace("DBFX.Design");
DBFX.RegisterNamespace("DBFX.Serializer");
DBFX.RegisterNamespace("DBFX.Design.ControlDesigners");

//轮播图控件
DBFX.Web.NavControls.SlideShow = function () {

    var ss = new DBFX.Web.Controls.Control("SlideShow");
    ss.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.SlideShowDesigner");
    ss.ClassDescriptor.Serializer = "DBFX.Serializer.SlideShowSerializer";
    ss.VisualElement = document.createElement("DIV");
    //当前页
    ss.curIndex = 0;
    ss.pageIndicators = [];
    ss.images = [];
    //通过正则表达式判断是否为手机端运行
    ss.isPhone = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);

    ss.OnCreateHandle();
    ss.OnCreateHandle = function () {
        ss.Class = "NavControls_SlideShow";
        ss.VisualElement.innerHTML = "<DIV class=\"NavControls_SlideShowDiv\"></DIV><DIV class=\"NavControls_SlideShowSwitchDiv\"><DIV class=\"NavControls_SlideShowSwitchLeft\"><IMG class=\"NavControls_SlideShowSwitchLeftImg\"></IMG></DIV><DIV class=\"NavControls_SlideShowSwitchRight\"><IMG class=\"NavControls_SlideShowSwitchRightImg\"></IMG></DIV></DIV><DIV class=\"NavControls_SlideShowIdcDiv\"></DIV>";
        ss.PageDiv = ss.VisualElement.querySelector("DIV.NavControls_SlideShowDiv");
        ss.PIDiv = ss.VisualElement.querySelector("DIV.NavControls_SlideShowIdcDiv");
        ss.SwitchDiv = ss.VisualElement.querySelector("DIV.NavControls_SlideShowSwitchDiv");
        ss.LeftBtn = ss.VisualElement.querySelector("DIV.NavControls_SlideShowSwitchLeft");
        ss.RightBtn = ss.VisualElement.querySelector("DIV.NavControls_SlideShowSwitchRight");

        ss.LeftBtnImg = ss.VisualElement.querySelector("IMG.NavControls_SlideShowSwitchLeftImg");
        ss.RightBtnImg = ss.VisualElement.querySelector("IMG.NavControls_SlideShowSwitchRightImg");
        //TODO：集成到平台需要更改路径
        ss.LeftBtnImg.src = "Themes/" + app.CurrentTheme + "/Images/prebtn.png";
        ss.RightBtnImg.src = "Themes/" + app.CurrentTheme + "/Images/nextbtn.png";

        //左右按钮点击绑定事件
        ss.LeftBtn.onmousedown = ss.handleLBtnClick;
        ss.RightBtn.onmousedown = ss.handleRBtnClick;

        // console.log("是否是移动端"+ss.isPhone);
        if (ss.isPhone) {
            ss.VisualElement.removeChild(ss.SwitchDiv);
        }

        ss.SwitchDiv.onmousedown = function (e) {
            e.cancelBubble = false;
        }
    }
    //处理左侧按钮点击事件
    ss.handleLBtnClick = function (e) {
        // console.log("上一页按钮点击");
        switch (ss.animationStyle) {
            case 0:
                if (ss.curIndex == 0) {
                    ss.curIndex = ss.pageIndicators.length;
                    ss.PageDiv.style.left = -ss.curIndex * ss.cWidth + "px";
                    ss.cur = -ss.curIndex * ss.cWidth;
                }
                ss.curIndex -= 1;
                ss.animate(ss.PageDiv, -ss.curIndex * ss.cWidth);
                ss.activatePage(ss.pageIndicators[ss.curIndex]);
                break;
            case 1:
                ss.preIndex = ss.curIndex;
                if (ss.curIndex > 0) {
                    ss.curIndex -= 1;
                } else {
                    ss.curIndex = ss.pageIndicators.length - 1;
                }

                ss.animate(ss.PageDiv, -ss.curIndex * ss.cWidth);
                ss.activatePage(ss.pageIndicators[ss.curIndex]);

                break;
            default:
                break;
        }


    }
    //处理右侧按钮点击事件
    ss.handleRBtnClick = function (e) {
        // console.log("下一页按钮点击");
        switch (ss.animationStyle) {
            case 0:
                if (ss.curIndex == ss.pageIndicators.length) {
                    ss.curIndex = 0;
                    ss.cur = 0;
                    ss.PageDiv.style.left = "0px";
                }
                ss.curIndex++;
                ss.animate(ss.PageDiv, -ss.curIndex * ss.cWidth);

                if (ss.curIndex == ss.pageIndicators.length) {
                    ss.activatePage(ss.pageIndicators[0]);
                } else {
                    ss.activatePage(ss.pageIndicators[ss.curIndex]);
                }
                break;
            case 1:
                ss.preIndex = ss.curIndex;
                ss.curIndex++;
                if (ss.curIndex == ss.pageIndicators.length) {
                    ss.curIndex = 0;
                }
                ss.animate(ss.PageDiv, -ss.curIndex * ss.cWidth);
                ss.activatePage(ss.pageIndicators[ss.curIndex]);

                break;
            default:
                break;
        }

    }

    ss.firstExecuteAni = 1;
    ss.preIndex = 0;

    //动画方法1：
    ss.animate_roll = function (element, target) {

        //清理定时器
        clearInterval(ss.timeId);
        ss.step = ss.cur > target ? 0 - Math.abs(ss.step) : Math.abs(ss.step);

        ss.timeId = setInterval(function () {
            ss.cur += ss.step;
            if (Math.abs(target - ss.cur) > Math.abs(ss.step)) {
                element.style.left = ss.cur + "px";
            } else {
                clearInterval(ss.timeId);
                element.style.left = target + 'px';
                // console.log("动画结束");
                ss.cur = target;
                if (ss.originStep != undefined) {
                    ss.step = ss.originStep;
                }
            }
        }, ss.interval);

    }

    //动画方法2：
    ss.animate_fade = function (element, target) {
        if (ss.firstExecuteAni == 1) {
            ss.PageDiv.removeChild(ss.PageDiv.lastChild);
            ss.firstExecuteAni = 0;
        }


        // ss.images.forEach(function (item) {
        //     item.className = "NavControls_SlideShowImgContainer_pre";
        // });

        element.style.left = target + 'px';

        ss.images[ss.preIndex].className = "NavControls_SlideShowImgContainer_pre";
        ss.images[ss.curIndex].className = "NavControls_SlideShowImgContainer_next";
    }

    ss.animate = ss.animate_fade;
    //动画方式 测试动画效果
    ss.animationStyle = 1;

    //切换间隔-ms
    ss.switchTime = 3000;
    Object.defineProperty(ss, "SwitchTime", {
        get: function () {
            return ss.switchTime;
        },
        set: function (v) {
            var t = v * 1;
            ss.switchTime = !isNaN(t) ? t : 3000;
        }
    });

    //切换方式
    ss.switchStyle = "fade";
    Object.defineProperty(ss, "SwitchStyle", {
        get: function () {
            return ss.switchStyle;
        },
        set: function (v) {
            ss.switchStyle = v;
            switch (v) {
                case "roll":
                    ss.animate = ss.animate_roll;
                    ss.animationStyle = 0;
                    break;
                case "fade":
                    ss.animate = ss.animate_fade;
                    ss.animationStyle = 1;
                    break;
                default:
                    break;
            }

        }
    });

    //指示标识位置
    ss.pageIndicatorP = "bottom-center";
    Object.defineProperty(ss, "PageIndicatorP", {
        get: function () {
            return ss.pageIndicatorP;
        },
        set: function (v) {
            ss.pageIndicatorP = v;
            ss.PIDiv.className = "NavControls_SlideShowIdcDiv_" + v;
        }
    });

    //初始化动画相关参数
    // ss.timeId = 0;
    ss.cur = 0;
    ss.step = 50;
    ss.interval = 40;


    //处理鼠标悬停
    ss.VisualElement.onmouseover = function (e) {
        e.cancelBubble = true;
        e.stopPropagation();
        if (ss.isOnePage) return;
        // console.log("mouseover");
        // console.log(e.target.tagName);
        if (e.target.tagName != "IMG") {
            return;
        }
        if (!ss.isPhone) {
            ss.SwitchDiv.style.display = "block";
        }
        clearInterval(ss.aniTimeId);
    }

    ss.VisualElement.onmouseout = function (e) {
        e.cancelBubble = true;
        e.stopPropagation();
        console.log("VisualElement.onmouseout");
        if (e.target.tagName != "IMG") {
            return;
        }
        if (ss.isOnePage) return;
        if (!ss.isPhone) {
            ss.SwitchDiv.style.display = "none";
        }
        ss.aniTimeId = setInterval(ss.handleRBtnClick, ss.switchTime);
    }

    // 手指拖拽事件绑定
    ss.VisualElement.ontouchstart = function (e) {
        // console.log("手指触摸");
        if (ss.isOnePage) return;
        // e.preventDefault();
        // e.stopPropagation();
        // e.cancelBubble = true;
        ss.start_x = e.targetTouches[0].pageX;
        ss.start_y = e.targetTouches[0].pageY;
        clearInterval(ss.aniTimeId);
    }

    ss.VisualElement.ontouchmove = function (e) {
        // console.log("手指move");
        if (ss.isOnePage) return;
        e.preventDefault();
        ss.moved_x = e.targetTouches[0].pageX;
        ss.moved_y = e.targetTouches[0].pageY;
    }

    ss.VisualElement.ontouchend = function (e) {
        if (ss.isOnePage) return;
        ss.handleTouchEnd(e);
    };

    ss.VisualElement.ontouchcancel = function (e) {
        if (ss.isOnePage) return;
        ss.handleTouchEnd(e);
    };

    //FIXME:处理手指触摸结束
    ss.handleTouchEnd = function (e) {
        // console.log("handleTouchEnd");

        e.preventDefault();
        if (ss.moved_x - ss.start_x > 60) {
            ss.handleLBtnClick();
        } else if (ss.moved_x - ss.start_x < -60) {
            ss.handleRBtnClick();
        } else {
            ss.OnSlideClick(e);
        }

        ss.moved_x = ss.start_x = undefined;

        clearTimeout(ss.timeOutId);
        ss.timeOutId = setTimeout(function () {
            clearInterval(ss.aniTimeId);
            ss.aniTimeId = setInterval(ss.handleRBtnClick, ss.switchTime);
            clearTimeout(ss.timeOutId);
        }, 500);
    }

    //幻灯片源
    Object.defineProperty(ss, "ItemSource", {
        get: function () {
            return ss.itemSource;
        },
        set: function (v) {
            ss.itemSource = v;

            ss.createSlideView();

            if (ss.aniTimeId)
                clearInterval(ss.aniTimeId);

            ss.aniTimeId = undefined;

            if (ss.isOnePage) return;

            ss.aniTimeId = setInterval(ss.handleRBtnClick, ss.switchTime);
        }
    });

    //项目成员
    Object.defineProperty(ss, "ItemSourceMember", {
        get: function () {
            return ss.itemSourceMember;
        },
        set: function (v) {

            ss.itemSourceMember = v;
        }
    });

    //数据绑定
    ss.DataBind = function (v) {

        try {
            if (ss.dataContext != undefined && ss.itemSourceMember != undefined && ss.itemSourceMember != "") {
                var isource = eval("ss.dataContext." + ss.itemSourceMember);
                if (Array.isArray(isource))
                    ss.ItemSource = isource;
            }
        } catch (ex) { }
        finally { }

    }

    ss.OnSlideClick = function (ev) {
        // console.log(ev.target.dataContext);
        var cmd = ev.target;
        if (!cmd) {
            return;
        }

        //FIXME:处理点击事件
        if (ss.SlideClick != undefined) {

            if (ss.SlideClick.GetType() == "Command") {
                ss.SlideClick.Sender = cmd;
                ss.SlideClick.Execute();
            }

            if (ss.SlideClick.GetType() == "function") {
                ss.SlideClick(ev, cmd);
            }

        }

        if (cmd.dataContext.ResourceUri != undefined && cmd.dataContext.ResourceUri != "") {

            var mode = 0;
            if (!isNaN(cmd.dataContext.Mode * 1))
                mode = cmd.dataContext.Mode * 1;
            app.LoadAppResource(cmd.dataContext.ResourceUri, cmd.dataContext.ResourceText, cmd.dataContext, mode);
        }

        //临时设置
        if (ss.switchTime * 1 > 10000)
            DBFX.Web.Controls.Image.ShowByFullScreen(cmd.src);

    }

    //创建幻灯片
    ss.createSlideView = function () {
        ss.images = [];
        ss.pageIndicators = [];
        ss.PIDiv.innerText = "";
        ss.PageDiv.innerText = "";

        var datas = ss.itemSource;
        // var bcr = ss.PageDiv.getBoundingClientRect();
        var bcr = window.getComputedStyle(ss.VisualElement, null);
        // console.log(bcr.height);
        // console.log(bcr.width);
        ss.cWidth = parseFloat(bcr.width);

        ss.PageDiv.style.width = parseFloat(bcr.width) * (datas.length + 1) + 100 + "px";
        for (var i = 0; i < datas.length; i++) {
            //创建图片展示区
            var imgContainerE = document.createElement("DIV");
            imgContainerE.className = "NavControls_SlideShowImgContainer";
            var imageE = document.createElement("IMG");
            ss.images.push(imgContainerE);

            imageE.dataContext = datas[i];

            imageE.onmousedown = function (ev) {
                ev.stopPropagation();
                // console.log("点击图片");

                //TODO:处理点击事件
                ss.OnSlideClick(ev);
            }

            imageE.ontouchstart = function (ev) {

            }


            imgContainerE.appendChild(imageE);
            imageE.className = "NavControls_SlideShowImg";
            imageE.src = datas[i].ImageUrl;
            ss.PageDiv.appendChild(imgContainerE);
            imageE.style.width = parseFloat(bcr.width) + "px";

            if (datas.length == 1) {
                ss.isOnePage = true;
                return;
            } else {//20191127
                ss.isOnePage = false;
            }

            //创建指示按钮
            var pageIndicatorE = document.createElement("DIV");
            pageIndicatorE.index = i;
            ss.pageIndicators.push(pageIndicatorE);
            //处理鼠标悬停
            pageIndicatorE.onmouseover = ss.handlePIMouserOver;

            //FIXME：
            pageIndicatorE.onmouseout = function (ev) {
                // console.log("鼠标离开 timeId："+ss.timeId);
                // ss.step = ss.originStep;
            }
            ss.PIDiv.appendChild(pageIndicatorE);
            if (i == 0) {
                pageIndicatorE.className = "NavControls_SlideShowIndicatorC";
            } else {
                pageIndicatorE.className = "NavControls_SlideShowIndicator";
            }

        }

        ss.PageDiv.appendChild(ss.PageDiv.children[0].cloneNode(true));
        if (ss.animationStyle == 1) {
            ss.images.forEach(function (item) {
                item.className = "NavControls_SlideShowImgContainer_pre";
            });
            ss.images[0].className = "NavControls_SlideShowImgContainer_next";
        }
    }

    //处理页面指示器鼠标悬停
    ss.handlePIMouserOver = function (e) {
        if (ss.animationStyle == 0) {
            ss.cur = -ss.curIndex * ss.cWidth;
            ss.originStep = ss.step;
            var gap = ss.curIndex - this.index;
            ss.step = Math.abs(ss.originStep * Math.abs(gap));
            ss.animate(ss.PageDiv, -this.index * ss.cWidth);
            ss.activatePage(this);
            ss.curIndex = this.index;

        }
        if (ss.animationStyle == 1) {
            ss.preIndex = ss.curIndex;
            ss.curIndex = this.index;
            ss.animate(ss.PageDiv, -this.index * ss.cWidth);
            ss.activatePage(this);

        }

    }

    //激活某一个选项
    ss.activatePage = function (pi) {
        // ss.PageDiv.style.left = -pi.index * ss.cWidth +"px";

        ss.pageIndicators.forEach(function (item) {
            item.className = "NavControls_SlideShowIndicator";
        });
        pi.className = "NavControls_SlideShowIndicatorC";
    }


    //20191016-界面卸载时清除定时器
    ss.UnLoad = function () {
        clearInterval(ss.aniTimeId);
    }

    ss.OnCreateHandle();
    return ss;
}
{

    var ss = new DBFX.Web.Controls.Control("SlideShow");
    ss.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.SlideShowDesigner");
    ss.ClassDescriptor.Serializer = "DBFX.Serializer.SlideShowSerializer";
    ss.VisualElement = document.createElement("DIV");
    //当前页
    ss.curIndex = 0;
    ss.pageIndicators = [];
    ss.images = [];
    //通过正则表达式判断是否为手机端运行
    ss.isPhone = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);

    ss.OnCreateHandle();
    ss.OnCreateHandle = function () {
        ss.Class = "NavControls_SlideShow";
        ss.VisualElement.innerHTML = "<DIV class=\"NavControls_SlideShowDiv\"></DIV><DIV class=\"NavControls_SlideShowSwitchDiv\"><DIV class=\"NavControls_SlideShowSwitchLeft\"><IMG class=\"NavControls_SlideShowSwitchLeftImg\"></IMG></DIV><DIV class=\"NavControls_SlideShowSwitchRight\"><IMG class=\"NavControls_SlideShowSwitchRightImg\"></IMG></DIV></DIV><DIV class=\"NavControls_SlideShowIdcDiv\"></DIV>";
        ss.PageDiv = ss.VisualElement.querySelector("DIV.NavControls_SlideShowDiv");
        ss.PIDiv = ss.VisualElement.querySelector("DIV.NavControls_SlideShowIdcDiv");
        ss.SwitchDiv = ss.VisualElement.querySelector("DIV.NavControls_SlideShowSwitchDiv");
        ss.LeftBtn = ss.VisualElement.querySelector("DIV.NavControls_SlideShowSwitchLeft");
        ss.RightBtn = ss.VisualElement.querySelector("DIV.NavControls_SlideShowSwitchRight");

        ss.LeftBtnImg = ss.VisualElement.querySelector("IMG.NavControls_SlideShowSwitchLeftImg");
        ss.RightBtnImg = ss.VisualElement.querySelector("IMG.NavControls_SlideShowSwitchRightImg");
        //TODO：集成到平台需要更改路径
        ss.LeftBtnImg.src = "Themes/" + app.CurrentTheme + "/Images/prebtn.png";
        ss.RightBtnImg.src = "Themes/" + app.CurrentTheme + "/Images/nextbtn.png";

        //左右按钮点击绑定事件
        ss.LeftBtn.onmousedown = ss.handleLBtnClick;
        ss.RightBtn.onmousedown = ss.handleRBtnClick;

        // console.log("是否是移动端"+ss.isPhone);
        if(ss.isPhone){
            ss.VisualElement.removeChild(ss.SwitchDiv);
        }

        ss.SwitchDiv.onmousedown = function (e) {
            e.cancelBubble = false;
        }
    }
    //处理左侧按钮点击事件
    ss.handleLBtnClick = function (e) {
        // console.log("上一页按钮点击");
        switch (ss.animationStyle){
            case 0:
                if(ss.curIndex == 0){
                    ss.curIndex = ss.pageIndicators.length;
                    ss.PageDiv.style.left = -ss.curIndex * ss.cWidth +"px";
                    ss.cur = -ss.curIndex * ss.cWidth;
                }
                ss.curIndex -= 1;
                ss.animate(ss.PageDiv,-ss.curIndex * ss.cWidth);
                ss.activatePage(ss.pageIndicators[ss.curIndex]);
                break;
            case 1:
                ss.preIndex = ss.curIndex;
                if(ss.curIndex >0){
                    ss.curIndex -=1;
                }else {
                    ss.curIndex = ss.pageIndicators.length-1;
                }

                ss.animate(ss.PageDiv,-ss.curIndex*ss.cWidth);
                ss.activatePage(ss.pageIndicators[ss.curIndex]);

                break;
            default:
                break;
        }


    }
    //处理右侧按钮点击事件
    ss.handleRBtnClick = function (e) {
        // console.log("下一页按钮点击");
        switch (ss.animationStyle){
            case 0:
                if(ss.curIndex == ss.pageIndicators.length){
                    ss.curIndex = 0;
                    ss.cur= 0;
                    ss.PageDiv.style.left = "0px";
                }
                ss.curIndex ++;
                ss.animate(ss.PageDiv,-ss.curIndex*ss.cWidth);

                if(ss.curIndex == ss.pageIndicators.length){
                    ss.activatePage(ss.pageIndicators[0]);
                }else {
                    ss.activatePage(ss.pageIndicators[ss.curIndex]);
                }
                break;
            case 1:
                ss.preIndex = ss.curIndex;
                ss.curIndex ++;
                if(ss.curIndex == ss.pageIndicators.length){
                    ss.curIndex = 0;
                }
                ss.animate(ss.PageDiv,-ss.curIndex*ss.cWidth);
                ss.activatePage(ss.pageIndicators[ss.curIndex]);

                break;
            default:
                break;
        }

    }

    ss.firstExecuteAni = 1;
    ss.preIndex = 0;

    //动画方法1：
    ss.animate_roll = function (element,target) {

        //清理定时器
        clearInterval(ss.timeId);
        ss.step = ss.cur > target ? 0-Math.abs(ss.step) : Math.abs(ss.step);

        ss.timeId = setInterval(function () {
            ss.cur += ss.step;
            if(Math.abs(target-ss.cur)>Math.abs(ss.step)){
                element.style.left = ss.cur+"px";
            }else {
                clearInterval(ss.timeId);
                element.style.left = target + 'px';
                // console.log("动画结束");
                ss.cur = target;
                if(ss.originStep != undefined){
                    ss.step = ss.originStep;
                }
            }
        },ss.interval);

    }

    //动画方法2：
    ss.animate_fade = function (element,target) {
        if(ss.firstExecuteAni == 1){
            ss.PageDiv.removeChild(ss.PageDiv.lastChild);
            ss.firstExecuteAni = 0;
        }


        // ss.images.forEach(function (item) {
        //     item.className = "NavControls_SlideShowImgContainer_pre";
        // });

        element.style.left = target + 'px';

        ss.images[ss.preIndex].className = "NavControls_SlideShowImgContainer_pre";
        ss.images[ss.curIndex].className = "NavControls_SlideShowImgContainer_next";
    }

    ss.animate = ss.animate_fade;
    //动画方式 测试动画效果
    ss.animationStyle = 1;

    //切换间隔-ms
    ss.switchTime = 3000;
    Object.defineProperty(ss, "SwitchTime", {
        get: function () {
            return ss.switchTime;
        },
        set: function (v) {
            var t = v*1;
            ss.switchTime = !isNaN(t)?t:3000;
        }
    });

    //切换方式
    ss.switchStyle = "fade";
    Object.defineProperty(ss, "SwitchStyle", {
        get: function () {
            return ss.switchStyle;
        },
        set: function (v) {
            ss.switchStyle = v;
            switch (v){
                case "roll":
                    ss.animate = ss.animate_roll;
                    ss.animationStyle = 0;
                    break;
                case "fade":
                    ss.animate = ss.animate_fade;
                    ss.animationStyle = 1;
                    break;
                default:
                    break;
            }

        }
    });

    //指示标识位置
    ss.pageIndicatorP = "bottom-center";
    Object.defineProperty(ss, "PageIndicatorP", {
        get: function () {
            return ss.pageIndicatorP;
        },
        set: function (v) {
            ss.pageIndicatorP = v;
            ss.PIDiv.className = "NavControls_SlideShowIdcDiv_"+v;
        }
    });

    //初始化动画相关参数
    // ss.timeId = 0;
    ss.cur = 0;
    ss.step = 50;
    ss.interval = 40;


    //处理鼠标悬停
    ss.VisualElement.onmouseover = function (e) {
        e.cancelBubble = true;
        e.stopPropagation();
        if(ss.isOnePage) return;
        // console.log("mouseover");
        // console.log(e.target.tagName);
        if(e.target.tagName != "IMG"){
            return;
        }
        if(!ss.isPhone){
            ss.SwitchDiv.style.display = "block";
        }
        clearInterval(ss.aniTimeId);
    }

    ss.VisualElement.onmouseout = function (e) {
        e.cancelBubble = true;
        e.stopPropagation();
        console.log("VisualElement.onmouseout");
        if(e.target.tagName != "IMG"){
            return;
        }
        if(ss.isOnePage) return;
        if(!ss.isPhone){
            ss.SwitchDiv.style.display = "none";
        }
        ss.aniTimeId = setInterval(ss.handleRBtnClick,ss.switchTime);
    }
    
    // 手指拖拽事件绑定
    ss.VisualElement.ontouchstart = function (e) {
        // console.log("手指触摸");
        if(ss.isOnePage) return;
        // e.preventDefault();
        // e.stopPropagation();
        // e.cancelBubble = true;
        ss.start_x = e.targetTouches[0].pageX;
        ss.start_y = e.targetTouches[0].pageY;
        clearInterval(ss.aniTimeId);
    }

    ss.VisualElement.ontouchmove = function (e) {
        // console.log("手指move");
        if(ss.isOnePage) return;
        e.preventDefault();
        ss.moved_x = e.targetTouches[0].pageX;
        ss.moved_y = e.targetTouches[0].pageY;
    }

    ss.VisualElement.ontouchend = function (e) {
        if(ss.isOnePage) return;
        ss.handleTouchEnd(e);
    };

    ss.VisualElement.ontouchcancel = function (e) {
        if(ss.isOnePage) return;
        ss.handleTouchEnd(e);
    };

    //FIXME:处理手指触摸结束
    ss.handleTouchEnd = function (e) {
        // console.log("handleTouchEnd");

        e.preventDefault();
        if(ss.moved_x-ss.start_x >60){
            ss.handleLBtnClick();
        }else if (ss.moved_x-ss.start_x < -60){
            ss.handleRBtnClick();
        }else {
            ss.OnSlideClick(e);
        }

        ss.moved_x = ss.start_x = undefined;

        clearTimeout(ss.timeOutId);
        ss.timeOutId = setTimeout(function () {
            clearInterval(ss.aniTimeId);
            ss.aniTimeId = setInterval(ss.handleRBtnClick,ss.switchTime);
            clearTimeout(ss.timeOutId);
        },500);
    }

    //幻灯片源
    Object.defineProperty(ss, "ItemSource", {
        get: function () {
            return ss.itemSource;
        },
        set: function (v) {
            ss.itemSource = v;

            ss.createSlideView();
            if(ss.isOnePage) return;
            clearInterval(ss.aniTimeId);
            ss.aniTimeId = setInterval(ss.handleRBtnClick,ss.switchTime);
        }
    });

    //项目成员
    Object.defineProperty(ss, "ItemSourceMember", {
        get: function () {
            return ss.itemSourceMember;
        },
        set: function (v) {

            ss.itemSourceMember = v;
        }
    });

    //数据绑定
    ss.DataBind = function (v) {

        try{
            if (ss.dataContext != undefined && ss.itemSourceMember != undefined && ss.itemSourceMember != "") {
                var isource = eval("ss.dataContext." + ss.itemSourceMember);
                if (Array.isArray(isource))
                    ss.ItemSource = isource;
            }
        } catch (ex)
        { }
        finally { }

    }

    ss.OnSlideClick = function (ev) {
        // console.log(ev.target.dataContext);
        var cmd = ev.target;
        if(!cmd){
            return;
        }

        //FIXME:处理点击事件
        if (ss.SlideClick != undefined) {

            if (ss.SlideClick.GetType() == "Command") {
                ss.SlideClick.Sender = cmd;
                ss.SlideClick.Execute();
            }

            if (ss.SlideClick.GetType() == "function") {
                ss.SlideClick(ev,cmd);
            }

        }

        if (cmd.dataContext.ResourceUri != undefined && cmd.dataContext.ResourceUri != "") {

            var mode = 0;
            if (!isNaN(cmd.dataContext.Mode*1))
                mode = cmd.dataContext.Mode*1;
            app.LoadAppResource(cmd.dataContext.ResourceUri, cmd.dataContext.ResourceText, cmd.dataContext, mode);
        }

    }

    //创建幻灯片
    ss.createSlideView = function () {
        ss.images = [];
        ss.pageIndicators = [];
        ss.PIDiv.innerText = "";
        ss.PageDiv.innerText = "";

        var datas = ss.itemSource;
        // var bcr = ss.PageDiv.getBoundingClientRect();
        var bcr = window.getComputedStyle(ss.VisualElement,null);
        // console.log(bcr.height);
        // console.log(bcr.width);
        ss.cWidth = parseFloat(bcr.width);

        ss.PageDiv.style.width = parseFloat(bcr.width)*(datas.length+1)+100+"px";
        for(var i=0;i<datas.length;i++){
            //创建图片展示区
            var imgContainerE = document.createElement("DIV");
            imgContainerE.className = "NavControls_SlideShowImgContainer";
            var imageE = document.createElement("IMG");
            ss.images.push(imgContainerE);

            imageE.dataContext = datas[i];

            imageE.onmousedown = function (ev){
                ev.stopPropagation();
                // console.log("点击图片");

                //TODO:处理点击事件
                ss.OnSlideClick(ev);
            }

            imageE.ontouchstart = function (ev) {

            }


            imgContainerE.appendChild(imageE);
            imageE.className = "NavControls_SlideShowImg";
            imageE.src = datas[i].ImageUrl;
            ss.PageDiv.appendChild(imgContainerE);
            imageE.style.width = parseFloat(bcr.width) + "px";

            if(datas.length == 1){
                ss.isOnePage = true;
                return;
            }else{//20191127
                ss.isOnePage = false;
            }

            //创建指示按钮
            var pageIndicatorE = document.createElement("DIV");
            pageIndicatorE.index = i;
            ss.pageIndicators.push(pageIndicatorE);
            //处理鼠标悬停
            pageIndicatorE.onmouseover = ss.handlePIMouserOver;

            //FIXME：
            pageIndicatorE.onmouseout = function (ev) {
                // console.log("鼠标离开 timeId："+ss.timeId);
                // ss.step = ss.originStep;
            }
            ss.PIDiv.appendChild(pageIndicatorE);
            if(i==0){
                pageIndicatorE.className = "NavControls_SlideShowIndicatorC";
            }else {
                pageIndicatorE.className = "NavControls_SlideShowIndicator";
            }

        }

        ss.PageDiv.appendChild(ss.PageDiv.children[0].cloneNode(true));
        if(ss.animationStyle ==1){
            ss.images.forEach(function (item) {
               item.className = "NavControls_SlideShowImgContainer_pre";
            });
            ss.images[0].className = "NavControls_SlideShowImgContainer_next";
        }
    }

    //处理页面指示器鼠标悬停
    ss.handlePIMouserOver = function (e) {
        if(ss.animationStyle ==0){
            ss.cur = -ss.curIndex*ss.cWidth;
            ss.originStep = ss.step;
            var gap = ss.curIndex - this.index;
            ss.step = Math.abs(ss.originStep*Math.abs(gap));
            ss.animate(ss.PageDiv,-this.index*ss.cWidth);
            ss.activatePage(this);
            ss.curIndex = this.index;

        }
         if(ss.animationStyle == 1){
             ss.preIndex = ss.curIndex;
             ss.curIndex = this.index;
             ss.animate(ss.PageDiv,-this.index*ss.cWidth);
             ss.activatePage(this);

         }

    }

    //激活某一个选项
    ss.activatePage = function (pi) {
        // ss.PageDiv.style.left = -pi.index * ss.cWidth +"px";

        ss.pageIndicators.forEach(function (item) {
            item.className = "NavControls_SlideShowIndicator";
        });
        pi.className = "NavControls_SlideShowIndicatorC";
    }


    //20191016-界面卸载时清除定时器
    ss.UnLoad = function () {
        clearInterval(ss.aniTimeId);
    }

    ss.OnCreateHandle();
    return ss;
}

DBFX.Serializer.SlideShowSerializer = function () {
    //系列化
    this.Serialize = function (c, xe, ns) {
        DBFX.Serializer.SerialProperty("ItemSourceMember", c.ItemSourceMember, xe);
        DBFX.Serializer.SerialProperty("SwitchStyle", c.SwitchStyle, xe);
        DBFX.Serializer.SerialProperty("SwitchTime", c.SwitchTime, xe);
        DBFX.Serializer.SerialProperty("PageIndicatorP", c.PageIndicatorP, xe);

    }

    //反系列化
    this.DeSerialize = function (c, xe, ns) {
        DBFX.Serializer.DeSerialProperty("SwitchStyle", c, xe);
        DBFX.Serializer.DeSerialProperty("SwitchTime", c, xe);
        DBFX.Serializer.DeSerialProperty("PageIndicatorP", c, xe);
    }
}

DBFX.Design.ControlDesigners.SlideShowDesigner = function () {
    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {

        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/SlideShowDesigner.scrp", function (od) {

            od.DataContext = obdc.dataContext;

        }, obdc);

    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "轮播图设置";
    return obdc;
}