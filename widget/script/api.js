/*
 * APICloud JavaScript Library
 * Copyright (c) 2014 apicloud.com
 */

//尾端不带/
//var myurl="http://www.renqibaoapp.com";
//var myurl="http://youkequan.istbk.com";
// var myurl = "http://linhuabaohou.net";
// 测试
var myurl = "http://www.cpcmgy.com";

(function(window) {
    var u = {};
    var isAndroid = (/android/gi).test(navigator.appVersion);
    var uzStorage = function() {
        var ls = window.localStorage;
        if (isAndroid) {
            ls = os.localStorage();
        }
        return ls;
    };

    function parseArguments(url, data, fnSuc, dataType) {
        if (typeof(data) == 'function') {
            dataType = fnSuc;
            fnSuc = data;
            data = undefined;
        }
        if (typeof(fnSuc) != 'function') {
            dataType = fnSuc;
            fnSuc = undefined;
        }
        return {
            url: url,
            data: data,
            fnSuc: fnSuc,
            dataType: dataType
        };
    }
    u.trim = function(str) {
        if (String.prototype.trim) {
            return str == null ? "" : String.prototype.trim.call(str);
        } else {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
    };
    u.trimAll = function(str) {
        return str.replace(/\s*/g, '');
    };
    u.isElement = function(obj) {
        return !!(obj && obj.nodeType == 1);
    };
    u.isArray = function(obj) {
        if (Array.isArray) {
            return Array.isArray(obj);
        } else {
            return obj instanceof Array;
        }
    };
    u.isEmptyObject = function(obj) {
        if (JSON.stringify(obj) === '{}') {
            return true;
        }
        return false;
    };
    u.addEvt = function(el, name, fn, useCapture) {
        if (!u.isElement(el)) {
            console.warn('$api.addEvt Function need el param, el param must be DOM Element');
            return;
        }
        useCapture = useCapture || false;
        if (el.addEventListener) {
            el.addEventListener(name, fn, useCapture);
        }
    };
    u.rmEvt = function(el, name, fn, useCapture) {
        if (!u.isElement(el)) {
            console.warn('$api.rmEvt Function need el param, el param must be DOM Element');
            return;
        }
        useCapture = useCapture || false;
        if (el.removeEventListener) {
            el.removeEventListener(name, fn, useCapture);
        }
    };
    u.one = function(el, name, fn, useCapture) {
        if (!u.isElement(el)) {
            console.warn('$api.one Function need el param, el param must be DOM Element');
            return;
        }
        useCapture = useCapture || false;
        var that = this;
        var cb = function() {
            fn && fn();
            that.rmEvt(el, name, cb, useCapture);
        };
        that.addEvt(el, name, cb, useCapture);
    };
    u.dom = function(el, selector) {
        if (arguments.length === 1 && typeof arguments[0] == 'string') {
            if (document.querySelector) {
                return document.querySelector(arguments[0]);
            }
        } else if (arguments.length === 2) {
            if (el.querySelector) {
                return el.querySelector(selector);
            }
        }
    };
    u.domAll = function(el, selector) {
        if (arguments.length === 1 && typeof arguments[0] == 'string') {
            if (document.querySelectorAll) {
                return document.querySelectorAll(arguments[0]);
            }
        } else if (arguments.length === 2) {
            if (el.querySelectorAll) {
                return el.querySelectorAll(selector);
            }
        }
    };
    u.byId = function(id) {
        return document.getElementById(id);
    };
    u.first = function(el, selector) {
        if (arguments.length === 1) {
            if (!u.isElement(el)) {
                console.warn('$api.first Function need el param, el param must be DOM Element');
                return;
            }
            return el.children[0];
        }
        if (arguments.length === 2) {
            return this.dom(el, selector + ':first-child');
        }
    };
    u.last = function(el, selector) {
        if (arguments.length === 1) {
            if (!u.isElement(el)) {
                console.warn('$api.last Function need el param, el param must be DOM Element');
                return;
            }
            var children = el.children;
            return children[children.length - 1];
        }
        if (arguments.length === 2) {
            return this.dom(el, selector + ':last-child');
        }
    };
    u.eq = function(el, index) {
        return this.dom(el, ':nth-child(' + index + ')');
    };
    u.not = function(el, selector) {
        return this.domAll(el, ':not(' + selector + ')');
    };
    u.prev = function(el) {
        if (!u.isElement(el)) {
            console.warn('$api.prev Function need el param, el param must be DOM Element');
            return;
        }
        var node = el.previousSibling;
        if (node.nodeType && node.nodeType === 3) {
            node = node.previousSibling;
            return node;
        }
    };
    u.next = function(el) {
        if (!u.isElement(el)) {
            console.warn('$api.next Function need el param, el param must be DOM Element');
            return;
        }
        var node = el.nextSibling;
        if (node.nodeType && node.nodeType === 3) {
            node = node.nextSibling;
            return node;
        }
    };
    u.closest = function(el, selector) {
        if (!u.isElement(el)) {
            console.warn('$api.closest Function need el param, el param must be DOM Element');
            return;
        }
        var doms, targetDom;
        var isSame = function(doms, el) {
            var i = 0,
                len = doms.length;
            for (i; i < len; i++) {
                if (doms[i].isSameNode(el)) {
                    return doms[i];
                }
            }
            return false;
        };
        var traversal = function(el, selector) {
            doms = u.domAll(el.parentNode, selector);
            targetDom = isSame(doms, el);
            while (!targetDom) {
                el = el.parentNode;
                if (el != null && el.nodeType == el.DOCUMENT_NODE) {
                    return false;
                }
                traversal(el, selector);
            }

            return targetDom;
        };

        return traversal(el, selector);
    };
    u.contains = function(parent, el) {
        var mark = false;
        if (el === parent) {
            mark = true;
            return mark;
        } else {
            do {
                el = el.parentNode;
                if (el === parent) {
                    mark = true;
                    return mark;
                }
            } while (el === document.body || el === document.documentElement);

            return mark;
        }

    };
    u.remove = function(el) {
        if (el && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    };
    u.attr = function(el, name, value) {
        if (!u.isElement(el)) {
            console.warn('$api.attr Function need el param, el param must be DOM Element');
            return;
        }
        if (arguments.length == 2) {
            return el.getAttribute(name);
        } else if (arguments.length == 3) {
            el.setAttribute(name, value);
            return el;
        }
    };
    u.removeAttr = function(el, name) {
        if (!u.isElement(el)) {
            console.warn('$api.removeAttr Function need el param, el param must be DOM Element');
            return;
        }
        if (arguments.length === 2) {
            el.removeAttribute(name);
        }
    };
    u.hasCls = function(el, cls) {
        if (!u.isElement(el)) {
            console.warn('$api.hasCls Function need el param, el param must be DOM Element');
            return;
        }
        if (el.className.indexOf(cls) > -1) {
            return true;
        } else {
            return false;
        }
    };
    u.addCls = function(el, cls) {
        if (!u.isElement(el)) {
            console.warn('$api.addCls Function need el param, el param must be DOM Element');
            return;
        }
        if ('classList' in el) {
            el.classList.add(cls);
        } else {
            var preCls = el.className;
            var newCls = preCls + ' ' + cls;
            el.className = newCls;
        }
        return el;
    };
    u.removeCls = function(el, cls) {
        if (!u.isElement(el)) {
            console.warn('$api.removeCls Function need el param, el param must be DOM Element');
            return;
        }
        if ('classList' in el) {
            el.classList.remove(cls);
        } else {
            var preCls = el.className;
            var newCls = preCls.replace(cls, '');
            el.className = newCls;
        }
        return el;
    };
    u.toggleCls = function(el, cls) {
        if (!u.isElement(el)) {
            console.warn('$api.toggleCls Function need el param, el param must be DOM Element');
            return;
        }
        if ('classList' in el) {
            el.classList.toggle(cls);
        } else {
            if (u.hasCls(el, cls)) {
                u.removeCls(el, cls);
            } else {
                u.addCls(el, cls);
            }
        }
        return el;
    };
    u.val = function(el, val) {
        if (!u.isElement(el)) {
            console.warn('$api.val Function need el param, el param must be DOM Element');
            return;
        }
        if (arguments.length === 1) {
            switch (el.tagName) {
                case 'SELECT':
                    var value = el.options[el.selectedIndex].value;
                    return value;
                    break;
                case 'INPUT':
                    return el.value;
                    break;
                case 'TEXTAREA':
                    return el.value;
                    break;
            }
        }
        if (arguments.length === 2) {
            switch (el.tagName) {
                case 'SELECT':
                    el.options[el.selectedIndex].value = val;
                    return el;
                    break;
                case 'INPUT':
                    el.value = val;
                    return el;
                    break;
                case 'TEXTAREA':
                    el.value = val;
                    return el;
                    break;
            }
        }

    };
    u.prepend = function(el, html) {
        if (!u.isElement(el)) {
            console.warn('$api.prepend Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('afterbegin', html);
        return el;
    };
    u.append = function(el, html) {
        if (!u.isElement(el)) {
            console.warn('$api.append Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('beforeend', html);
        return el;
    };
    u.before = function(el, html) {
        if (!u.isElement(el)) {
            console.warn('$api.before Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('beforebegin', html);
        return el;
    };
    u.after = function(el, html) {
        if (!u.isElement(el)) {
            console.warn('$api.after Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('afterend', html);
        return el;
    };
    u.html = function(el, html) {
        if (!u.isElement(el)) {
            console.warn('$api.html Function need el param, el param must be DOM Element');
            return;
        }
        if (arguments.length === 1) {
            return el.innerHTML;
        } else if (arguments.length === 2) {
            el.innerHTML = html;
            return el;
        }
    };
    u.text = function(el, txt) {
        if (!u.isElement(el)) {
            console.warn('$api.text Function need el param, el param must be DOM Element');
            return;
        }
        if (arguments.length === 1) {
            return el.textContent;
        } else if (arguments.length === 2) {
            el.textContent = txt;
            return el;
        }
    };
    u.offset = function(el) {
        if (!u.isElement(el)) {
            console.warn('$api.offset Function need el param, el param must be DOM Element');
            return;
        }
        var sl = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
        var st = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

        var rect = el.getBoundingClientRect();
        return {
            l: rect.left + sl,
            t: rect.top + st,
            w: el.offsetWidth,
            h: el.offsetHeight
        };
    };
    u.css = function(el, css) {
        if (!u.isElement(el)) {
            console.warn('$api.css Function need el param, el param must be DOM Element');
            return;
        }
        if (typeof css == 'string' && css.indexOf(':') > 0) {
            el.style && (el.style.cssText += ';' + css);
        }
    };
    u.cssVal = function(el, prop) {
        if (!u.isElement(el)) {
            console.warn('$api.cssVal Function need el param, el param must be DOM Element');
            return;
        }
        if (arguments.length === 2) {
            var computedStyle = window.getComputedStyle(el, null);
            return computedStyle.getPropertyValue(prop);
        }
    };
    u.jsonToStr = function(json) {
        if (typeof json === 'object') {
            return JSON && JSON.stringify(json);
        }
    };
    u.strToJson = function(str) {
        if (typeof str === 'string') {
            return JSON && JSON.parse(str);
        }
    };
    u.setStorage = function(key, value) {
        if (arguments.length === 2) {
            var v = value;
            if (typeof v == 'object') {
                v = JSON.stringify(v);
                v = 'obj-' + v;
            } else {
                v = 'str-' + v;
            }
            var ls = uzStorage();
            if (ls) {
                ls.setItem(key, v);
            }
        }
    };
    u.getStorage = function(key) {
        var ls = uzStorage();
        if (ls) {
            var v = ls.getItem(key);
            if (!v) {
                return;
            }
            if (v.indexOf('obj-') === 0) {
                v = v.slice(4);
                return JSON.parse(v);
            } else if (v.indexOf('str-') === 0) {
                return v.slice(4);
            }
        }
    };
    u.rmStorage = function(key) {
        var ls = uzStorage();
        if (ls && key) {
            ls.removeItem(key);
        }
    };
    u.clearStorage = function() {
        var ls = uzStorage();
        if (ls) {
            ls.clear();
        }
    };
    u.fixIos7Bar = function(el) {
        return u.fixStatusBar(el);
    };
    u.fixStatusBar = function(el) {
        if (!u.isElement(el)) {
            console.warn('$api.fixStatusBar Function need el param, el param must be DOM Element');
            return 0;
        }
        el.style.paddingTop = api.safeArea.top + 'px';
        return el.offsetHeight;
    };
    u.fixTabBar = function(el) {
        if (!u.isElement(el)) {
            console.warn('$api.fixTabBar Function need el param, el param must be DOM Element');
            return 0;
        }
        el.style.paddingBottom = api.safeArea.bottom + 'px';
        return el.offsetHeight;
    };
    u.toast = function(title, text, time) {
        var opts = {};
        var show = function(opts, time) {
            api.showProgress(opts);
            setTimeout(function() {
                api.hideProgress();
            }, time);
        };
        if (arguments.length === 1) {
            var time = time || 500;
            if (typeof title === 'number') {
                time = title;
            } else {
                opts.title = title + '';
            }
            show(opts, time);
        } else if (arguments.length === 2) {
            var time = time || 500;
            var text = text;
            if (typeof text === "number") {
                var tmp = text;
                time = tmp;
                text = null;
            }
            if (title) {
                opts.title = title;
            }
            if (text) {
                opts.text = text;
            }
            show(opts, time);
        }
        if (title) {
            opts.title = title;
        }
        if (text) {
            opts.text = text;
        }
        time = time || 500;
        show(opts, time);
    };
    u.post = function( /*url,data,fnSuc,dataType*/ ) {
        var argsToJson = parseArguments.apply(null, arguments);
        var json = {};
        var fnSuc = argsToJson.fnSuc;
        argsToJson.url && (json.url = argsToJson.url);
        argsToJson.data && (json.data = argsToJson.data);
        if (argsToJson.dataType) {
            var type = argsToJson.dataType.toLowerCase();
            if (type == 'text' || type == 'json') {
                json.dataType = type;
            }
        } else {
            json.dataType = 'json';
        }
        json.method = 'post';
        api.ajax(json,
            function(ret, err) {
                if (ret) {
                    fnSuc && fnSuc(ret);
                }
            }
        );
    };
    u.get = function( /*url,fnSuc,dataType*/ ) {
        var argsToJson = parseArguments.apply(null, arguments);
        var json = {};
        var fnSuc = argsToJson.fnSuc;
        argsToJson.url && (json.url = argsToJson.url);
        //argsToJson.data && (json.data = argsToJson.data);
        if (argsToJson.dataType) {
            var type = argsToJson.dataType.toLowerCase();
            if (type == 'text' || type == 'json') {
                json.dataType = type;
            }
        } else {
            json.dataType = 'text';
        }
        json.method = 'get';
        api.ajax(json,
            function(ret, err) {
                if (ret) {
                    fnSuc && fnSuc(ret);
                }
            }
        );
    };

    /*end*/


    window.$api = u;

})(window);




//拍照和从相册中选择
function showAction(tit, id) {
    var has = hasPermission_global('camera');
    if (!has || !has[0] || !has[0].granted) {
        api.confirm({
            title: '提醒',
            msg: '没有获得' + '相机' + "权限\n是否前往设置？",
            buttons: ['去设置', '取消']
        }, function(ret, err) {
            if (1 == ret.buttonIndex) {
                reqPermission_global('camera');
            }
        });
        return false;
    }

    var has = hasPermission_global('storage');
    if (!has || !has[0] || !has[0].granted) {
        api.confirm({
            title: '提醒',
            msg: '没有获得' + '储存' + "权限\n是否前往设置？",
            buttons: ['去设置', '取消']
        }, function(ret, err) {
            if (1 == ret.buttonIndex) {
                reqPermission_global('storage');
            }
        });
        return false;
    }

    var items = ['拍照', '从手机相册选择'];
    var reg = new RegExp("^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$");
    var imageUrl = $api.attr($api.byId(id), "src");
    if (reg.test(imageUrl)) //是url
    {
        items = ['拍照', '从手机相册选择', '查看大图'];
    }

    api.actionSheet({
        title: tit,
        cancelTitle: '取消',
        buttons: items
    }, function(ret, err) {
        if (ret) {
            getImages(ret.buttonIndex, id, items.length);
        }
    });
}

function getImages(sourceType, id, cc) {
    if (sourceType == 1) { // 拍照
        //获取一张图片
        api.getPicture({
            sourceType: 'camera', //拍照
            encodingType: 'png',
            mediaValue: 'pic',
            allowEdit: false,
            destinationType: 'base64', //返回base64地址
            quality: 80,
            saveToPhotoAlbum: true
        }, function(ret, err) {
            //var imgSrc = ret.base64Data;  如果是base64，要用这个属性获取地址
            // 获取拍照数据并处理
            if (ret) {
                //alert( JSON.stringify(ret ))
                saveImg(ret.base64Data, id);
                // var imgSrc = ret.data;
                // if (imgSrc != "") {
                //     var ele=$api.dom('#'+id);
                //     $api.attr(ele,'src',imgSrc);
                // }
            }

        });
    } else if (sourceType == 2) { // 从相册中选择
        api.getPicture({
            sourceType: 'album', //从相册中选择
            encodingType: 'jpg',
            mediaValue: 'pic',
            allowEdit: false,
            destinationType: 'base64', //返回base64地址
            quality: 80,
            saveToPhotoAlbum: true
        }, function(ret, err) {
            // 获取拍照数据并处理
            //alert(ret.base64Data);
            //var imgSrc = ret.base64Data;  如果是base64，要用这个属性获取地址
            if (ret) {
                saveImg(ret.base64Data, id);
                // var imgSrc = ret.data;
                // if (imgSrc != "") {
                //     var ele=$api.dom('#'+id);
                //     $api.attr(ele,'src',imgSrc);
                // }
            }

        });
    } else if (sourceType == 3) { // 查看大图
        if (cc == 3) {
            openPicture(id);
        }
    }

}

function saveImg(path, id) {
    api.showProgress();
    //上传剪辑后的图像到服务器
    api.ajax({
        // report : false,
        url: myurl + '/index.php/User/Public/user_upload/',
        //这里是我们约定好的后台上传图片的位置 ，你可以根据你的需求来改
        method: 'post',
        cache: 'false',
        dataTpye: 'json',
        data: {
            values: {
                username: $api.getStorage("username"),
                userid: $api.getStorage("userid"),
                pic: path
            }
        }
    }, function(ret, err) {
        // alert(JSON.stringify(ret));
        if (ret.status == 1) {
            var ele = $api.dom('#' + id);
            $api.attr(ele, 'src', myurl + ret.picture);
            var ele1 = $api.dom('#input_' + id);
            $api.val(ele1, myurl + ret.picture);
            api.hideProgress();
        } else {
            api.hideProgress();
            api.toast({
                msg: ret.msg,
                duration: 2000,
                location: 'bottom'
            });

        }
    });
};

function openPicture(id) {
    var imageUrl = $api.attr($api.byId(id), "src");
    var imageBrowser = api.require('imageBrowser');
    imageBrowser.openImages({
        imageUrls: [imageUrl, ], //图片的URL组成的数组
        showList: false, //是否以九宫格方式显示图片,默认值：true(效果：点击某个图片后，先以九宫形式显示所有图片，然后单击哪张显示哪张)
        activeIndex: 0, //当不用九宫格方式显示时，当前要显示的图片在集合中的索引
        tapClose: false //当showList为false时，本参数有效。若本参数为true，则不显示顶部导航条，且单击图片时退出本模块。若本参数为false，则显示顶部导航条，且单击图片隐藏/显示顶部导航条
    });
}

function isempty(str) {
    if (str == null || str == undefined || str == "") {
        return true;
    } else {
        return false;
    }
}

function loadFrame() {
    //alert(api.pageParam.name);
    //将frame放到本地值中 如果存在就关闭它
    if ($api.getStorage("frameName") != "") {
        api.closeFrame({
            name: $api.getStorage("frameName")
        });

    }
    //将当前的name赋值给frameName
    $api.setStorage('frameName', api.pageParam.name);
}

function loadWin() {
    //将frame放到本地值中 如果存在就关闭它
    if ($api.getStorage("winName") != "" && $api.getStorage("winName") != "index") {
        api.closeFrame({
            name: $api.getStorage("winName")
        });

    }
    //将当前的name赋值给frameName
    $api.setStorage('winName', api.pageParam.name);
}

function geturl(url) {
    if (!isempty(url)) {
        if (url.substr(0, 7) == "http://" || url.substr(0, 8) == "https://") {
            return url;
        } else {
            if (url.substr(0, 2) == "//") {
                return "http:" + url;
            } else {
                return myurl + url;
            }
        }
    }
}

function hasPermission_global(one_per) {
    var perms = new Array();
    if (one_per) {
        perms.push(one_per);
    } else {
        var prs = document.getElementsByName("p_list");
        for (var i = 0; i < prs.length; i++) {
            if (prs[i].checked) {
                perms.push(prs[i].value);
            }
        }
    }
    var rets = api.hasPermission({
        list: perms
    });
    if (!one_per) {
        return;
    }
    return rets;
}

function reqPermission_global(one_per) {
    var perms = new Array();
    if (one_per) {
        perms.push(one_per);
    } else {
        var prs = document.getElementsByName("p_list_r");
        for (var i = 0; i < prs.length; i++) {
            if (prs[i].checked) {
                perms.push(prs[i].value);
            }
        }
    }
    api.requestPermission({
        list: perms,
        code: 100001
    }, function(ret, err) {
        if (ret['list'][0]['granted']) {

        }
    });
}

function changePswStatus(obj) {
    if ($api.hasCls(obj, 'active')) {
        $api.removeCls(obj, 'active');
        $api.attr(obj.previousElementSibling, 'type', 'password');
    } else {
        $api.addCls(obj, 'active');
        $api.attr(obj.previousElementSibling, 'type', 'text');
    }
}

// 隐藏商品价格的部分位数
function computedPrice(price) {
    var bj_price = price,
        bj_price_arr = bj_price.split(''),
        point_index = bj_price.indexOf('.'),
        bj_price_len = bj_price_arr.length,
        weishu = 1;
    if (point_index == 2) {
        weishu = 0;
    }
    for (var j = 0; j < bj_price_len; j++) {
        if (point_index == 1) {
            bj_price_arr[j] = '*';
            break;
        } else {
            if (j >= 1 && j < point_index - weishu) {
                bj_price_arr[j] = '*';
            }
        }
    }
    return bj_price_arr.join('');
}
