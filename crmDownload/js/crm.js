$(document).ready(function(){
    
    var pathName = window.location.pathname.substring(1);
    var webName = pathName == "" ? "" : pathName.substring(0, pathName.indexOf("/"));
    var urlCom = webName == "" ? "/api/commonDataController/getAppVersion" : "/" + webName + "/api/commonDataController/getAppVersion";
    //var iosFixedUrl = "itms-services://?action=download-manifest&amp;url=";
    var iosFixedUrl = "";



    var oPcDiv = document.getElementById("pcDiv");
    var oMobileDiv = document.getElementById("mobileDiv");

    var currentOsName = '';
    var updUrl = '';
    var androidUrl = '';
    var iosUrl = '';
    var localUrl = window.location.href;

    //调用接口
    $.ajax({
        type: "GET",
        url: urlCom,
        data: {},
        dataType: "json",
        success: function(data){//updtTm
            currentOsName = data.data.currentOsName;
            console.log(JSON.stringify(data));
            if (data.data.currentOsName == 'pc') {
                oPcDiv.style.display = "";
                oMobileDiv.style.display = "none";
                $("#androidQrCode").qrcode(data.data.android.updUrl);
                $("#iosQrCode").qrcode(localUrl);
                androidUrl = data.data.android.updUrl;
                iosUrl = data.data.ios.updUrl;
            } else if(data.data.currentOsName == 'android' || data.data.currentOsName == "ios") {
                oPcDiv.style.display = "none";
                oMobileDiv.style.display = "";
                if (data.data.currentOsName == 'android') {
                    $("#updtTm").html(data.data.android.updtTm);
                    $("#verNo").html(data.data.android.verNo);
                    updUrl = data.data.android.updUrl;
                } else if (data.data.currentOsName == 'ios') {
                    $("#updtTm").html(data.data.ios.updtTm);
                    $("#verNo").html(data.data.ios.verNo);
                    updUrl = data.data.ios.updUrl;
                }
            }
        }
    });

    //网页版下载安装
    $("#androidImg").click(function(){
        window.location.href = androidUrl;
    });

    $("#iosImg").click(function(){
        //window.location.href = iosUrl;
        window.location.href = localUrl;
    });

    //下载安装
    $("#downInstall").click(function(){

        var isWX = is_weixin();
        if (isWX) {
            $('.weixin').height($(window).height()).fadeIn(400);
        } else {
            if (is_ios()) {
                $('.ios').height($(window).height()).fadeIn(400);
                window.location.href = iosFixedUrl + updUrl;
            } else {
                window.location.href = updUrl;
            }
        }

    });

    //判断是否在微信浏览器中打开
    function is_weixin(){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
            return true;
        } else {
            return false;
        }
    }

    //判断是否是ios
    function is_ios() {
        if(currentOsName == 'ios') {
            return true;
        }
    }

    $("#downloadDiv").click(function(){
        $("#downloadDiv").hide();
    });
});