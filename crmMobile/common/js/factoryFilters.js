/**
 * Created by 张玉良 on 2016-4-3.
 */
//拦截http请求的拦截器
app.factory('factoryFilters', function($sessionStorage,$location,$q,$injector) {
	var errorIsShowing = false;
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
        requestError : function(err) {
//            $("#bgMack").hide();
//            $("#showMack").hide();
            //请求之前错误
      	    window.loading.hide();
            return $q.reject(err);;
        },
        responseError: function(err) {
//            $("#bgMack").hide();
//            $("#showMack").hide();
            //请求之后错误
      	  window.loading.hide();
          if(err.status <= 0) {
            // 远程服务器无响应
            //弹出错误消息
        	if (!errorIsShowing) {
                var $ionicPopup = $injector.get('$ionicPopup');
                var alertPopup = $ionicPopup.alert({
                  title: '<span class="popheader"><i class="fa fa-times-circle-o"></i>网络错误 </span>',
                  template: "网络异常，请稍后重试",
                  okText: '我知道了'
                });
                errorIsShowing = true;
                //用户点击“我知道了”按钮后的操作
                alertPopup.then(function (res) {
                	errorIsShowing = false;
                });
        	}
          } else {
            // 其他服务器处理错误
            //弹出错误消息

          	if (!errorIsShowing) {
                var $ionicPopup = $injector.get('$ionicPopup');
                var alertPopup = $ionicPopup.alert({
                  title: '<span class="popheader"><i class="fa fa-times-circle-o"></i>系统错误 </span>',
                  template: "服务器无法处理您的请求",
                  okText: '我知道了'
                });
                errorIsShowing = true;
                //用户点击“我知道了”按钮后的操作
                alertPopup.then(function (res) {
                	errorIsShowing = false;
                });
          	}
          }
          return $q.reject(err);
        }
    };
    return sessionInjector;
});
app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('factoryFilters');
}]);
