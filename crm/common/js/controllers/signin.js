'use strict';

/* Controllers */
// signin controller
app.controller('SigninFormController', [ '$scope', '$http', '$state',
		'$sessionStorage','comApi', function($scope, $http, $state, $sessionStorage, comApi ) {
			$scope.user = {};
			$scope.authError = null;
			$scope.login = function() {
				$scope.authError = null;
				// 账号转大写
				$scope.user.name = angular.uppercase($scope.user.name);

				comApi.post('login/login',$scope.user,function(data){
                    if(data.status == "0"){
                        $scope.authError = "用户名或密码错误!";
                    } else if(data.status == "-1"){
                    	$scope.authError = "用户没有登录权限!";
                    } else if(data.status == "-2"){
                    	$scope.authError = "用户没有被角色或权限!";
                    } else if(data.status == "1"){

                        $sessionStorage.ustu = data.logStatus;

                        //先获取权限 获取权限之后获取菜单. 最后在加载字典.
                        comApi.selectUserPower(function(value){
                            $sessionStorage.userPower = value;
                            $http.get('jsonData/nav.json')
                                .success(function (data, status, headers, config) {
                                    var userPowerData = TAFFY($sessionStorage.userPower);
                                    for(var i = 0,j = data.CRMNAV.length;i<j;i++){
                                        for(var k = 0,s = data.CRMNAV[i].VALUE.length;k<s;k++){
                                            for(var m = 0,h = data.CRMNAV[i].VALUE[k].VALUE.length;m<h;m++){
                                                if(userPowerData({fp:data.CRMNAV[i].VALUE[k].VALUE[m].FP}).first()){
                                                    data.CRMNAV[i].VALUE[k].VALUE[m].IF = true;
                                                    data.CRMNAV[i].VALUE[k].IF = true;
                                                }
                                            }
                                        }
                                    }
                                    $sessionStorage.NAVDATA = data;
                                    //取得用户登陆名字
                                    comApi.get("commonDataController/selectUserName",function(data){
                                    	$sessionStorage.userName  = data;
                                    	$scope.$emit("login.signupComplete");
                                    });

                                    comApi.selectDicALL();
                                    comApi.selectDepartmentALL();
                                    comApi.selectJobPosALL();
                                    comApi.selectPosRelPosLvlALL();
                                    comApi.selectChnlConfigALL();
                                    comApi.selectMajRegALL();
                                    comApi.selectMajRegCityReALL();
                                    comApi.selectAddressALL();
                                    comApi.selectUrbDistricALL();
                                    comApi.selectStoresALL();
                                    comApi.selectphaALL();
                                    comApi.selectMessageALL();
				    

                                    //为跟中科软代码风格一致，读取所有商品和会员的初始化也放在这里，建议初始化可做一统一接口，由登录模块调用
                                    comApi.selectAllGdsCls();
                                    //获取远程文件服务器地址
                                    comApi.getFileServerUrl();

                                    //获取回访事项
                                    comApi.selectAllMembRtnRuleRtn();


                                    comApi.selectChnlInfoALL(function(){ $state.go('app.home');});
                                })
                                .error(function (data, status, headers, config) {
                                    console.log('执行失败 错误消息: ' + data);
                                });
                        });
                    }
                });
			}
		} ]);
