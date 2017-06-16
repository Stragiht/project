/**
 * Created by 张玉良 on 2016-4-3.
 */
//拦截http请求的拦截器
app.factory('factoryFilters', function($sessionStorage,$location) {
    var sessionInjector = {
        request: function(config) { 
//            $("#bgMack").show();
//            $("#showMack").show();
            //请求之前
            if($sessionStorage.ustu){
                config.headers['b-us-up-biduke'] = $sessionStorage.ustu;
            }
            return config;
        },
        response: function(config,header,header1,header2) {
//            $("#bgMack").hide();
//            $("#showMack").hide();
            //请求成功之后
            if(config.headers("b-us-dw-biduke")){
                $location.path("/login");
            }
            return config;
        },
        requestError : function(config) {
//            $("#bgMack").hide();
//            $("#showMack").hide();
            //请求之前错误
            return config;
        },
        responseError: function(config) {
//            $("#bgMack").hide();
//            $("#showMack").hide();
            //请求之后错误
            return config;
        }
    };
    return sessionInjector;
});
app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('factoryFilters');
}]);