'use strict';

/* Controllers */

angular.module('app')
    .controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$sessionStorage', '$window', "$http", "$state", '$location', 'comApi',
        function ($scope, $translate, $localStorage, $sessionStorage, $window, $http, $state, $location, comApi) {
            // add 'ie' classes to html
            var isIE = !!navigator.userAgent.match(/MSIE/i);
            isIE && angular.element($window.document.body).addClass('ie');
            isSmartDevice($window) && angular.element($window.document.body).addClass('smart');
            //window.localStorage.clear()
            // config 主题初始化设置
            
            $scope.urlCom = comApi.getUrlCom();
            
            $scope.app = {
                name: '比度克CRM系统',
                version: '1.0.2',
                // for chart colors
                color: {
                    primary: '#7266ba',
                    info: '#23b7e5',
                    success: '#27c24c',
                    warning: '#fad733',
                    danger: '#f05050',
                    light: '#e8eff0',
                    dark: '#3a3f51',
                    black: '#1c2b36'
                },
                settings: {
                    themeID: 1,
                    navbarHeaderColor: 'bg-info dker',
                    navbarCollapseColor: 'bg-info dker',//bg-white-only白色  dk
                    asideColor: 'bg-light dker b-r',//bg-black黑色  //bg-dark灰色
                    headerFixed: true,
                    asideFixed: true,
                    asideFolded: false,
                    asideDock: false,
                    container: true
                }
            }
            $scope.app.settings.container = true;
            if ($scope.app.settings.asideFolded == false) {
                $scope.app.settings.asideFolded = !$scope.app.settings.asideFolded;

            }
            
            $scope.abc = function () {
                if ($scope.app.settings.asideFolded == false) {
                    $scope.app.settings.asideFolded = !$scope.app.settings.asideFolded;
                    $('#type').attr('href', 'common/css/app.css');
                } else {
                    $scope.app.settings.asideFolded = !$scope.app.settings.asideFolded;
                    $('#type').attr('href', 'common/css/app2.css');
                }
            }
            // angular translate
            $scope.lang = {isopen: false};
            $scope.langs = {en: 'English', de_DE: 'German', it_IT: 'Italian', zh: '中文'};
            $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "中文";
            $scope.setLang = function (langKey, $event) {
                // set the current lang
                $scope.selectLang = $scope.langs[langKey];
                // You can change the language during runtime
                $translate.use(langKey);
                $scope.lang.isopen = !$scope.lang.isopen;
            };

            function isSmartDevice($window) {
                // Adapted from http://www.detectmobilebrowsers.com
                var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
                // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
            }

            function time() {
            	
            	$scope.userName = "";
            	
                if ($sessionStorage.ustu != null && $sessionStorage.ustu != "" && $sessionStorage.ustu != undefined) {
                    $scope.NAVDATA = $sessionStorage.NAVDATA;
                    $scope.userName = $sessionStorage.userName;
                }
                return true;
                //setTimeout(time,1000);
                //var timeouter =  $interval(function(){time()}, 1000); //time是指本身,延时递归调用自己,1000为间隔调用时间,单位毫秒
            }

            function logmsg() {
                if ($sessionStorage.ustu != null && $sessionStorage.ustu != "" && $sessionStorage.ustu != undefined) {
                    comApi.get("HomeController/selectLOGMSGCount", function (data) {
                        $scope.LOGINCON = data.LOGINCON;
                        $scope.MSGCON = data.MSGCON;
                    });
                    return true;
                }
                //setTimeout(logmsg,5000);
                //var timeouter = $interval(function(){logmsg();}, 5000);
            }

            $scope.$on('unReadMsgNum', function(event, msgCon){
                $scope.MSGCON = msgCon;
            });
            
            time();
            logmsg();
            setInterval(logmsg,60000);

            //监听事件 判断没有登录  进入登录页面
            $scope.$on('login.signupComplete', function (evt, data) {
            	time();
            	logmsg();
            });
            
            //监听阅读信息后更新未读消息数目
            $scope.$on('readMsg', function (evt, data) {
            	logmsg();
            });
            
            //监听事件 判断没有登录  进入登录页面
            $scope.$on('$stateChangeSuccess', function (evt, toState, toParams, fromState, fromParams) {
                if (toState.name != 'system.signin' && toState.name != 'system.signup' && toState.name != 'system.404' && toState.name != 'system.forgotpwd') {
                    if ($sessionStorage.ustu == null || $sessionStorage.ustu == "" || $sessionStorage.ustu == undefined) {
                        $location.path("/system/signin");
                    }
                }
                var head = toState.name.split(".")[0] + '.' + toState.name.split(".")[1];
                $scope.NAVURL = head;
            });
            $scope.gotoFirstPage = function (moduleNum) {
                var data = $scope.NAVDATA;
                for (var i = 0; i < data.CRMNAV.length; i++) {
                    if (moduleNum == data.CRMNAV[i].FM) {
                        for (var k = 0; k < data.CRMNAV[i].VALUE.length; k++) {
                            for (var m = 0; m < data.CRMNAV[i].VALUE[k].VALUE.length; m++) {
                                if (data.CRMNAV[i].VALUE[k].VALUE[m].IF) {
                                    $state.go(data.CRMNAV[i].VALUE[k].VALUE[m].URL);
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }]);