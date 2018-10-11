DBFX.RegisterNamespace("DBFX.Web.Controls");
DBFX.RegisterNamespace("DBFX.Web.NavControls");
DBFX.RegisterNamespace("DBFX.Design");
DBFX.RegisterNamespace("DBFX.Serializer");
DBFX.RegisterNamespace("DBFX.Design.ControlDesigners");


//幻灯片视图
DBFX.Web.NavControls.SlideShowView = function () {

    var ssv = new DBFX.Web.Controls.Control("SlideShowView");
    ssv.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.SlideShowViewDesigner");
    ssv.ClassDescriptor.Serializer = "DBFX.Serializer.SlideShowViewSerializer";
    ssv.Pages = new Array();
    ssv.VisualElement = document.createElement("DIV");
    ssv.OnCreateHandle();
    ssv.OnCreateHandle = function () {
        ssv.Class = "NavControls_SlideShowView";
        ssv.VisualElement.innerHTML = "<DIV class=\"NavControls_SlideShowViewDiv\"></DIV><DIV class=\"NavControls_SlideShowViewIdcDiv\"></DIV>";
        ssv.PageDiv = ssv.VisualElement.querySelector("DIV.NavControls_SlideShowViewDiv");
        ssv.PIDiv = ssv.VisualElement.querySelector("DIV.NavControls_SlideShowViewIdcDiv");

    }

    ssv.hideIndicator = false;
    Object.defineProperty(ssv, "HideIndicator", {

        get: function () {
            return ssv.hideIndicator;
        },
        set: function (v) {


            if (v == true) {
                v = true;
                ssv.PIDiv.style.display = "none";
            }
            else {
                v = false;
                ssv.PIDiv.style.display = "block";
            }

            ssv.hideIndicator = v;

        }

    });

    //幻灯片源
    Object.defineProperty(ssv, "ItemSource", {
        get: function () {
            return ssv.itemSource;
        },
        set: function (v) {

            ssv.itemSource = v;
            setTimeout(function () {
                ssv.CreateShowView();
                ssv.StartAni();
            }, 500);
        }
    });

    ssv.TouchStart = function (e) {

        ssv.spt = { x: e.targetTouches[0].pageX, y: e.targetTouches[0].pageY };

        if (ssv.AniTimer != undefined)
            clearInterval(ssv.AniTimer);

    }

    ssv.TouchMove = function (e) {

        var ept = { x: e.targetTouches[0].pageX, y: e.targetTouches[0].pageY };
        var ox = (ept.x - ssv.spt.x);
        var oy = (ept.y - ssv.spt.y);
        if (ox < -50)
            ssv.IncVal = 1;

        if (ox >50)
            ssv.IncVal = -1;

        if (Math.abs(ox) > 50) {
            ssv.spt = { x: e.targetTouches[0].pageX, y: e.targetTouches[0].pageY };
            ssv.CPIdx += ssv.IncVal;
            ssv.SwitchView();
            ssv.StartAni();
        }

    }

    ssv.IncVal = 1;
    ssv.CPIdx = 0;
    //开始
    ssv.StartAni = function () {

        if (ssv.AniTimer != undefined)
            clearInterval(ssv.AniTimer);

        if (ssv.Pages.length == 0)
            return;

        ssv.AniTimer = setInterval(function () {

            if (ssv.CPIdx >= ssv.Pages.length)
                ssv.IncVal = -1;

            if (ssv.CPIdx <= 0)
                ssv.IncVal = 1;

            ssv.CPIdx += ssv.IncVal;

            ssv.SwitchView();


        }, ssv.interval);



    }

    ssv.SwitchView = function () {


        if (ssv.CPIdx >= ssv.Pages.length)
            ssv.CPIdx = ssv.Pages.length-1;

        if (ssv.CPIdx < 0)
            ssv.CPIdx = 0;

        if (ssv.aniEffect == 0) {

            ssv.CurrentPage.Active(false);

            var lpos = ssv.CPIdx * ssv.PageWidth * -1;

            ssv.PageDiv.style.left = lpos + "px";
            ssv.CurrentPage = ssv.Pages[ssv.CPIdx];



        }

        if (ssv.aniEffect == 1) {


            ssv.CurrentPage.Active(false);

            var tpos = ssv.CPIdx * ssv.PageHeight * -1;
            ssv.PageDiv.style.top = tpos + "px";
            ssv.CurrentPage = ssv.Pages[ssv.CPIdx];



        }

        if (ssv.aniEffect > 1) {


            ssv.CurrentPage.Active(false);
            ssv.CurrentPage.Display = "none";

            ssv.CurrentPage = ssv.Pages[ssv.CPIdx];
            ssv.CurrentPage.Display = "block";

        }

        ssv.CurrentPage.Active(true);

    }

    ssv.interval=5000;
    //动画效果
    Object.defineProperty(ssv, "Interval", {
        get: function () {

            return ssv.interval;

        },
        set: function (v) {

            ssv.interval=v;

        }
    });

    ssv.aniEffect = 0;
    //动画效果
    Object.defineProperty(ssv, "AniEffect", {
        get: function () {

            return ssv.aniEffect;

        },
        set: function (v) {

            ssv.aniEffect = v;

            setTimeout(ssv.CreateShowView, 100);

        }
    });

    ssv.cpm = "0";
    //动画效果
    Object.defineProperty(ssv, "CPM", {
        get: function () {

            return ssv.cpm;

        },
        set: function (v) {

            ssv.cpm = v;

            switch (v) {

                case "0":
                    ssv.PIDiv.className = "NavControls_SlideShowViewIdcDiv";
                    break;

                case "1":
                    ssv.PIDiv.className = "NavControls_SlideShowViewIdcDivTL";
                    break;

                case "2":
                    ssv.PIDiv.className = "NavControls_SlideShowViewIdcDivTR";
                    break;

                default:
                    ssv.PIDiv.className = "NavControls_SlideShowViewIdcDiv";
                    break;

            }




        }
    });

    Object.defineProperty(ssv, "ItemSourceMember", {
        get: function () {
            return ssv.itemSourceMember;
        },
        set: function (v) {

            ssv.itemSourceMember = v;
        }
    });

    ssv.DataBind = function (v) {

        try{
            if (ssv.dataContext != undefined && ssv.itemSourceMember != undefined && ssv.itemSourceMember != "") {

                var isource = eval("ssv.dataContext." + ssv.itemSourceMember);
                if (Array.isArray(isource))
                    ssv.ItemSource = isource;
            }
        } catch (ex)
        { }
        finally { }

    }

    ssv.AddPage = function (c) {

        ssv.PageDiv.appendChild(c.VisualElement);
        ssv.PIDiv.appendChild(c.PIndicator);
        ssv.Pages.Add(c);

    }


    //创建Show视图
    ssv.CreateShowView = function () {

        try{
            if (ssv.AniTimer != undefined)
                clearInterval(ssv.AniTimer);

            ssv.CPIdx = 0;

            ssv.Pages = new Array();
            ssv.PageDiv.innerHTML = "";
            ssv.PIDiv.innerHTML = "";

            ssv.CurrentPage == undefined;

            if (!Array.isArray(ssv.itemSource))
                return;

            if (ssv.itemSource.length <=1)
                ssv.PIDiv.style.display = "none";
            else
                delete ssv.PIDiv.style.display;

            var rc = ssv.VisualElement.getBoundingClientRect();

            if (ssv.aniEffect == 0) {

                var w = 0;
                for (var i = 0; i < ssv.itemSource.length; i++) {
                    var item = ssv.ItemSource[i];
                    var ssp = new DBFX.Web.NavControls.SlideShowPage();
                    ssp.Class = "NavControls_SlideShowViewItemHor";
                    ssp.Width = rc.width + "px";
                    ssv.AddPage(ssp);

                    if (item.ResType == 0) {

                        var img = new DBFX.Web.Controls.Image();
                        img.Width = rc.width + "px";
                        img.ImageUrl = item.ImageUrl;
                        img.Margin = "0px";
                        ssp.AddControl(img);
                        ssp.dataContext = item;
                    }

                    if (item.ResType == 1) {

                        DBFX.Resources.LoadResource(item.ResourceUri, function (p) {
                            p.Width = rc.width;
                            p.DataContext = item;

                        }, ssp);


                    }

                    if (ssv.CurrentPage == undefined) {
                        ssv.CurrentPage = ssp;
                        ssv.CurrentPage.Active(true);
                    }

                    w += rc.width;
                }


                ssv.PageWidth = rc.width;

                ssv.PageDiv.style.width = w + "px";


            }

            if (ssv.aniEffect == 1) {

                var h = 0;
                for (var i = 0; i < ssv.itemSource.length; i++) {


                    var item = ssv.ItemSource[i];
                    var ssp = new DBFX.Web.NavControls.SlideShowPage();
                    ssp.Class = "NavControls_SlideShowViewItemVer";
                    ssp.Height = rc.height + "px";
                    ssv.AddPage(ssp);

                    if (item.ResType == 0) {

                        var img = new DBFX.Web.Controls.Image();
                        img.Width = rc.width + "px";
                        img.Height = "100%";
                        img.Margin = "0px";
                        img.ImageUrl = item.ImageUrl;
                        ssp.AddControl(img);
                        ssp.dataContext = item;
                    }

                    if (item.ResType == 1) {

                        DBFX.Resources.LoadResource(item.ResourceUri, function (p) {
                            p.Height = rc.height;
                            p.DataContext = item;

                        }, ssp);


                    }

                    if (ssv.CurrentPage == undefined) {
                        ssv.CurrentPage = ssp;
                        ssv.CurrentPage.Active(true);
                    }
                    h += rc.height;
                }

                ssv.PageHeight = rc.height;

                ssv.PageDiv.style.height = h + "px";
            }


            if (ssv.aniEffect > 1) {


                for (var i = 0; i < ssv.itemSource.length; i++) {


                    var item = ssv.ItemSource[i];
                    var ssp = new DBFX.Web.NavControls.SlideShowPage();
                    ssp.Class = "NavControls_SlideShowViewItem";
                    ssv.AddPage(ssp);

                    if (i > 0)
                        ssp.Display = "none";

                    if (item.ResType == 0) {

                        var img = new DBFX.Web.Controls.Image();
                        img.Height = ssv.Height;
                        img.Width = ssv.Width;
                        img.Display = ssv.Display;
                        img.ImageUrl = item.ImageUrl;
                        ssp.AddControl(img);
                        ssp.dataContext = item;
                    }

                    if (item.ResType == 1) {

                        DBFX.Resources.LoadResource(item.ResourceUri, function (p) {
                            p.Height = ssv.Height;
                            p.Width = ss.Width;
                            p.Display = ssv.Display;
                            p.DataContext = item;

                        }, ssp);


                    }

                    if (ssv.CurrentPage == undefined)
                        ssv.CurrentPage = ssp;

                    h += rc.height;

                }


            }

        }
        catch (ex) {

        }

    }

    ssv.Click = function (e) {

        ssv.OnSlideClick(ssv.CurrentPage);

    }

    //点击事件
    ssv.OnSlideClick = function (page) {

        if (ssv.SlideClick != undefined) {

            if (ssv.SlideClick.GetType() == "Command") {

                ssv.SlideClick.Sender = ssv;
                ssv.SlideClick.Execute();

            }
            else {
                ssv.SlideClick(ssv.CurrentPage, ssv);
            }

        }

        if (page.dataContext.ResourceUri != undefined) {

            var mode = 0;
            if (page.dataContext.Mode != undefined)
                mode = page.dataContext.Mode;
            app.LoadAppResource(page.dataContext.ResourceUri, page.dataContext.ResourceText, page.dataContext, mode);

        }

    }

    ssv.OnCreateHandle();
    return ssv;
}
//幻灯片页面
DBFX.Web.NavControls.SlideShowPage = function (ssview) {

    var ssp = new DBFX.Web.Controls.Panel("SlideShowPage");
    ssp.VisualElement = document.createElement("DIV");
    ssp.PIndicator = document.createElement("DIV");
    ssp.PIndicator.className = "NavControls_SlideShowViewIndicator";
    ssp.OnCreateHandle();
    ssp.Class = "NavControls_SlideShowViewItemHor";
    ssp.VisualElement.onclick = ssp.Click;
    ssp.Active = function (v) {

        if (v == true) {
            ssp.PIndicator.className = "NavControls_SlideShowViewIndicatorC";
        }
        else {
            ssp.PIndicator.className = "NavControls_SlideShowViewIndicator";
        }
    }

    ssp.Click = function (e) {
        e.cancelBubble = true;
        if (ssview != undefined)
            ssview.OnSlideClick(ssp);

    }

    return ssp;

}