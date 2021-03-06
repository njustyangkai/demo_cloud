define(function (require) {

    //==============================
    // hashChange control
    //==============================
    var hashChange = function (hash) {
        var path = hash.substr(2).split('/');
        var url;
        if (path.length > 0) {
            if (path.length == 1) {
                url = 'app/' + path[0] + '/' + path[0] + '.html?v=' + version;
            }
            if (path.length > 1) {
                url = 'app/' + path[0] + '/' + path[1] + '.html?v=' + version;
            }
            $('div.content-wrapper').load(url, function () {
                var $a = $('a[href="' + hash + '"]');
                var $ul = $a.parent().parent();
                if ($ul.is('.treeview-menu') || $ul.is('.sidebar-menu')) {
                    if ($ul.is('.treeview-menu')) {
                        $ul.children('li').removeClass('active');
                    }
                    $('.sidebar li:not(.treeview) > a').parent().removeClass('active');
                    $a.parent().addClass('active');
                }
            });
            $('div.content-wrapper').css('min-height', $(window).height());
        }
    };

    //==============================
    //  is login
    //==============================
    var isLogin = function () {
        var userId = window.localStorage.userId;
        var userName = window.localStorage.userName;
        if (userId && userId.trim() != '' && userId != 'undefined' && userId != '[object object]'
            && userName && userName.trim() != '' && userName != 'undefined' && userName != '[object object]') {
            $('body').css('display', 'inherit');
        } else {
            window.location.href = 'login.html';
        }
    };

    //==============================
    // gridUtilOptions
    //==============================
    var gridUtilOptions = function () {
        return {
            strip: true,
            pagination: true,
            sidePagination: 'server',
            pageNumber: 1,
            pageSize: 10,
            pageList: [10, 25, 50, 100],
            sortable: true,
            search: true,
            strictSearch: false,
            showRefresh: true,
            showColumns: true,
            paginationDetailHAlign: 'left',
            paginationHAlign: 'right',
            clickToSelect: false
        }
    };

    //==============================
    // ajaxSetup
    //==============================
    var _ajaxSetup = function () {
        $.ajaxSetup({
            timeout: 20000,
            contentType: "application/json;charset=utf-8",
            /*beforeSend: function (xhr) {
             var accessToken = window.localStorage.accessToken;
             xhr.setRequestHeader('Access-Token', accessToken);
             },*/
            complete: function (xhr, status) {
                // status: success, error, timeout
                // xhr.status: 200, 404 500..., 0
                if (xhr.status === 404) {
                    $('.content-wrapper').load('app/util/404.html?v=' + version);
                }
                if (xhr.status === 500) {
                    $('.content-wrapper').load('app/util/500.html?v=' + version);
                }
                if (status === 'timeout') {
                    alertDialog('请求超时！');
                }
                var sessionStatus = xhr.getResponseHeader('sessionStatus');
                if (sessionStatus === 'timeout') {
                    alertDialog('登录超时，请重新登录！');
                    window.localStorage.clear();
                    setTimeout(function () {
                        window.location.href = 'login.html';
                    }, 3000);
                }
            }
        });
    };

    //====================================================
    // alertDialog
    //====================================================
    var alertDialog = function (text) {
        $('#dialog-alert p').text(text);
        $('#dialog-alert').modal({
            backdrop: true,
            keyboard: true,
            show: true
        });
    };

    //====================================================
    // confrimDialog
    //====================================================
    var confirmDialog = function (text, callback) {
        $('#dialog-confirm p').text(text);
        $('#dialog-confirm').modal({
            backdrop: true,
            keyboard: true,
            show: true
        });
        $('#dialog-confirm .btn-confirm').unbind().click(callback);
    };

    //====================================================
    // global mask
    //====================================================
    var globalMask = function (text) {
        $('#global-mask h4').text(text);
        $('#global-mask').show();
    };

    //====================================================
    // notify: default success info alert warning
    //====================================================
    var notify = function (title, content, type) {
        $.Notify({
            caption: title,
            content: content,
            type: type
        })
    };

    //====================================================
    // ip valid
    //====================================================
    var ipValid = function (ip) {
        var regExp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
        if (!regExp.test(ip)) {
            return false;
        }
        return true;
    };

    //====================================================
    // get account
    //====================================================
    var getAccounts = function () {
        var accounts = [] ;
        $.each(JSON.parse(window.localStorage.accounts), function (i, v) {
            if (v.status == 1) {
                accounts.push(v);
            }
        });
        return accounts;
    };

    return {
        hashChange: hashChange,
        gridUtilOptions: gridUtilOptions,
        _ajaxSetup: _ajaxSetup,
        alertDialog: alertDialog,
        confirmDialog: confirmDialog,
        notify: notify,
        isLogin: isLogin,
        globalMask: globalMask,
        ipValid: ipValid,
        getAccounts: getAccounts
    }
});