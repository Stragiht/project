/**
 * Created by Fupenglu 登录画面Controller 2016/03/28
 */
app.controller('loginCtrl', function ($scope, $http, $location, $state, $ionicPopup, $ionicLoading, $sessionStorage, comApi, $timeout) {

	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 

    //页面初始化
	$scope.passtype = "password";	//密码框初始状态为密码
	$scope.isUserLogin = false;	//初始状态登录按钮不可点击
	$scope.isPassLogin = false;	//初始状态登录按钮不可点击
	$scope.loginform = {}; //初始化form
    $scope.startPageShow = true;
    $scope.loginPageShow = false;

    $timeout(function() {
        $scope.startPageShow = false;
        $scope.loginPageShow = true;
    }, 2000);

	$scope.loginform.remember = true; //记住密码

          // 查看密码
          $scope.showPassword = function() {
            if ($scope.passtype == "password") {
              $scope.passtype = "text";
            } else {
              $scope.passtype = "password";
            }
          };
          
          
          // 清空输入框
          $scope.clearInput = function(type) {
            if(type == '1'){
            	$scope.loginform.name ="";
            }else{
                $scope.loginform.password = "";
            }
          };
          
	     //监视用户名是否被输入
	     $scope.$watch("loginform.name", function(newValue,oldValue,scope) {
	    	 if(newValue != "" && newValue != null && newValue != undefined ){
	    		 $scope.isUserLogin = true;
	    		 comApi.mobileInputUserName().save(newValue);
		     }else{
		    	 $scope.isUserLogin = false;
		     }
	      });

          // 监视密码是否被输入
          $scope.$watch("loginform.password", function(newValue, oldValue,
              scope) {
            if (newValue != "" && newValue != null && newValue != undefined) {
              $scope.isPassLogin = true;
            } else {
              $scope.isPassLogin = false;
            }
          });

          // 登陆
          $scope.checkLogin = function() {

            //window.bdk.checkUpdate('{"forceCheck":"0"}');

            // 账号转大写
            $scope.loginform.name = angular.uppercase($scope.loginform.name);
            window.loading.show();
            // 保存
            comApi
                .post(
                    'login/mobileLogin',
                    $scope.loginform,
                    function(data) {
                      if (data.status == "1") {

                          //加载渠道
                          comApi.selectChnlInfoALL();

                          //登录时获取数据列表
                          comApi.selectDicALL();

                          //获取地址信息
                          //comApi.selectAddressALL();

                          //登录是获取文件路径
                          comApi.getFileServerUrl();

                          //获取下属人员
                          comApi.selectMySubStfList();

                          //获取提示消息
                          comApi.selectMessageALL();

                          comApi.myConsoleLog("登录时返回的数据", $scope.loginform, "===");
                          $sessionStorage.userId = data.name;
                        $sessionStorage.ustu = data.logStatus;
                        // 取得当前用户权限
                        comApi.selectUserPower(function(value) {
                          $sessionStorage.userPower = value;
                          comApi.powerRefresh();
                          comApi.selectMobileMenuPowerALL();
                              comApi.getFileServerUrl();
                              // 从消息文件中取得前台使用的消息
                              comApi.selectMessageALL();

                              var flagpram = "1";
                              // 是否记住密码 TODO
                              if ($scope.loginform.remember) {
                                flagpram = "2";
                              }
                  	    //TODO 浏览器登录时需注释var data
                              // 调用原生保存账号密码
                              var data = '{"username" : "' + $scope.loginform.name
                                  + '","password" : "' + $scope.loginform.password + '","flag":"'
                                  + flagpram + '"}';

                              //var resultJson = JSON.parse(window.bdk.savePassword(data));
                              // 跳转到登录画面
                              $state.go("home", {});
                          });
                      } else if(data.status == "-1"){
                    	  window.loading.hide();
                          // 弹出错误消息
                          var templateParam = '<div class="tcc_2"><img src="common/images/error.png" width="30" class="mt_40"><p style="padding-left: 24px;padding-right: 20px;text-align: left;margin-top: 10px;">';
                          templateParam = templateParam + '用户没有登录权限</p></div>';
                          $ionicLoading.show({
                            template : templateParam,
                            duration : 3000,
                            hideOnStateChange : true,
                            showBackdrop : false
                          });
                      }  else if(data.status == "-2"){
                    	  window.loading.hide();
                          // 弹出错误消息
                          var templateParam = '<div class="tcc_2"><img src="common/images/error.png" width="30" class="mt_40"><p style="padding-left: 24px;padding-right: 20px;text-align: left;margin-top: 10px;">';
                          templateParam = templateParam + '用户没有被分配角色或权限</p></div>';
                          $ionicLoading.show({
                            template : templateParam,
                            duration : 3000,
                            hideOnStateChange : true,
                            showBackdrop : false
                          });
                      } else {
                    	window.loading.hide();
                        // 弹出错误消息
                        var templateParam = '<div class="tcc_2"><img src="common/images/error.png" width="30" class="mt_40"><p style="padding-left: 24px;padding-right: 20px;text-align: left;margin-top: 10px;">';
                        templateParam = templateParam + '工号或密码错误</p></div>';
                        $ionicLoading.show({
                          template : templateParam,
                          duration : 3000,
                          hideOnStateChange : true,
                          showBackdrop : false
                        });
                      }
                    });
          };

          // 调用原生获取记住的用户名密码
          $scope.getPassword = function() {
            var dataJson = JSON.parse(window.bdk.getPassword());
            if (dataJson.success) {
              $scope.loginform.name = dataJson.result.username;
              $scope.loginform.password = dataJson.result.password;
              var flag = dataJson.result.flag;
              if (flag == "2") {
                // 登陆
                $scope.checkLogin();
              }
            } else {
                $scope.loginform.name = comApi.mobileInputUserName().get();
            }
          };
          
          // TODO 调用原生 （需在本地浏览器访问时可注释掉）
          //$scope.getPassword();
        });