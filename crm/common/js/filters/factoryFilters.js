/**
 * Created by 张玉良 on 2016-4-3.
 */
//拦截http请求的拦截器
app.factory('factoryFilters', function ($sessionStorage, $location) {
    var sessionInjector = {
        request: function (config) {
            if(config.url.indexOf("HomeController/selectLOGMSGCount") < 0 && config.url.indexOf("staff/insertStfsalary") < 0 && config.url.indexOf("staff/updateStfSalaryApplOpen") < 0
                && config.url.indexOf("GenAttendReport/genAttendReport") < 0 && config.url.indexOf("StfRptSaleInfoReport/openAudit") < 0 && config.url.indexOf("GenAttendReport/insertAttendanceProcess") <0 ){
                $("#bgMack").show();
                $("#showMack").show();
            }
            //请求之前
            //判断是否登陆.登陆后将token放到请求头部
            if ($sessionStorage.ustu) {
                config.headers['b-us-up-biduke'] = $sessionStorage.ustu;
            }
            return config;
        },
        response: function (config, header, header1, header2) {
            $("#bgMack").hide();
            $("#showMack").hide();
            //请求成功之后
            //从返回头部获跳转
            if (config.headers("b-us-dw-biduke")) {
                $location.path(config.headers("b-us-dw-biduke"));
            }
            return config;
        },
        requestError: function (config) {
            $("#bgMack").hide();
            $("#showMack").hide();
            //请求之前错误
            return config;
        },
        responseError: function (config) {
            $("#bgMack").hide();
            $("#showMack").hide();
            //请求之后错误
            return config;
        }
    };
    return sessionInjector;
});
app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('factoryFilters');
}]);