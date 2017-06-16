/**
 *  Created by Fupenglu 
 *  忘记密码画面Controller
 *  2016/03/30
 */
app.controller('forgetPasswordCtrl', function ($scope, $http, $location,$ionicPopup,$ionicLoading,$interval,$state,$timeout,comApi) {
	
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
    //页面初始化
	$scope.isNext = false;	//是否点击下一步
	$scope.isSend = false;	//是否发送短信
	$scope.isInput = false; //是否成功接收短信
	$scope.newpasstype = "password";	//新密码框初始状态为密码
	$scope.conpasstype = "password";	//确认密码框初始状态为密码
	$scope.upd = {};
		
	// 查看密码
	$scope.showPassword = function(typeId)
	{
		if(typeId == 1){
			if($scope.newpasstype == "password"){
				$scope.newpasstype = "text";
			}else{
				$scope.newpasstype = "password";
			}
		}else{
			if($scope.conpasstype == "password"){
				$scope.conpasstype = "text";
			}else{
				$scope.conpasstype = "password";
			}
		}
	};
	
	// 返回
	$scope.goBack = function()
	{
		$scope.isNext = false;	//是否点击下一步
	};
	
	// 发送短信
	$scope.SendSms = function()
	{
		//手机号码必须输入验证
		if($scope.upd.mobile == null || $scope.upd.mobile == "" || $scope.upd.mobile == undefined){

			//comApi.showErrorMessage("msg.common.10026");
			
            // 弹出错误消息
      	  var templateParam = '<div class="tcc_2"><img src="common/images/error.png" width="30" class="mt_40"><p style="padding-left: 24px;padding-right: 20px;text-align: left;margin-top: 10px;">';
      	  templateParam = templateParam + '手机号码不能为空</p></div>';
            $ionicLoading.show({
                template: templateParam,
                duration : 3000,
                hideOnStateChange: true,
                showBackdrop: false
            });
		}else{
			
			//验证手机格式
			var reg =/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
			if(!reg.test($scope.upd.mobile)){

				//comApi.showErrorMessage("msg.common.10027");
				
	            // 弹出错误消息
		      	  var templateParam = '<div class="tcc_2"><img src="common/images/error.png" width="30" class="mt_40"><p style="padding-left: 24px;padding-right: 20px;text-align: left;margin-top: 10px;">';
		      	  templateParam = templateParam + '输入手机号码错误</p></div>';
		            $ionicLoading.show({
		                template: templateParam,
		                duration : 3000,
		                hideOnStateChange: true,
		                showBackdrop: false
		            });
			}else{
				
				//验证手机号码是否存在。
				comApi.get( 'forgetPassword/checkMobile/'+$scope.upd.mobile,function(data){
					if(data == 0){
						//comApi.showErrorMessage("msg.common.10028");
			            // 弹出错误消息
				      	  var templateParam = '<div class="tcc_2"><img src="common/images/error.png" width="30" class="mt_40"><p style="padding-left: 24px;padding-right: 20px;text-align: left;margin-top: 10px;">';
				      	  templateParam = templateParam + '手机号码没有绑定用户</p></div>';
				            $ionicLoading.show({
				                template: templateParam,
				                duration : 3000,
				                hideOnStateChange: true,
				                showBackdrop: false
				            });
					}else{
						
						// 倒计时设定
						var countdown = 60;
						$scope.isSend = true;

						// 倒计时按钮显示
						var updateBtn = function(){
							if (countdown == 0) {
								$interval.cancel(timeouter);
								$scope.isSend = false;
								return;
							}else{
								$scope.showtime = countdown;
								countdown --;
							}
						}

						// 倒计时定时器
						var timeouter = $interval(function(){
							updateBtn();
						},1000);

						// 执行倒计时
						updateBtn();
						
						//发送短信
						comApi.get( 'forgetPassword/sendMsg/'+$scope.upd.mobile,function(data){
							if(angular.fromJson(data).success == 'true'){
					            // 弹出成功消息
						      	  var templateParam = '<div class="tcc_2"><img src="common/images/dui.png" width="30" class="mt_40"><p style="padding-left: 24px;padding-right: 20px;text-align: left;margin-top: 10px;">';
						      	  templateParam = templateParam + '发送短信成功</p></div>';
						            $ionicLoading.show({
						                template: templateParam,
						                duration : 3000,
						                hideOnStateChange: true,
						                showBackdrop: false
						            });
						            
						            $scope.isInput = true;
							}else{
					            // 弹出错误消息
						      	  var templateParam = '<div class="tcc_2"><img src="common/images/error.png" width="30" class="mt_40"><p style="padding-left: 24px;padding-right: 20px;text-align: left;margin-top: 10px;">';
						      	  templateParam = templateParam + '发送短信失败</p></div>';
						            $ionicLoading.show({
						                template: templateParam,
						                duration : 3000,
						                hideOnStateChange: true,
						                showBackdrop: false
						            });
							}
						});
					}
				});
			}
		}
	};

	// 点击下一步
	$scope.next = function()
	{		
		//手机号码必须输入验证
		if($scope.upd.code == null || $scope.upd.code == "" || $scope.upd.code == undefined){
			
            // 弹出错误消息
	      	  var templateParam = '<div class="tcc_2"><img src="common/images/error.png" width="30" class="mt_40"><p style="padding-left: 24px;padding-right: 20px;text-align: left;margin-top: 10px;">';
	      	  templateParam = templateParam + '没有输入验证码</p></div>';
	            $ionicLoading.show({
	                template: templateParam,
	                duration : 3000,
	                hideOnStateChange: true,
	                showBackdrop: false
	            });
		}else{
			//验证验证码
			comApi.get( 'forgetPassword/checkCode/'+$scope.upd.mobile+'/'+$scope.upd.code,function(data){
				if(angular.fromJson(data).success == 'true'){
					$scope.isNext = true;	
				    $scope.isSend = false;
				}else{
		            // 弹出错误消息
			      	  var templateParam = '<div class="tcc_2"><img src="common/images/error.png" width="30" class="mt_40"><p style="padding-left: 24px;padding-right: 20px;text-align: left;margin-top: 10px;">';
			      	  templateParam = templateParam + angular.fromJson(data).error+'</p></div>';
			            $ionicLoading.show({
			                template: templateParam,
			                duration : 3000,
			                hideOnStateChange: true,
			                showBackdrop: false
			            });
				}
			});
		}
	};
	
	// 重置密码保存
	$scope.save = function()
	{		
		
		var newPassFaild = false;//新密码是否有错
		var conPassFaild = false;//确认密码是否有错
		
		//新密码为空
		if($scope.upd.newPassword == null || $scope.upd.newPassword == "" || $scope.upd.newPassword == undefined){
			newPassFaild = true;
		}
		
		//确认密码为空
		if($scope.upd.conPassword == null || $scope.upd.conPassword == "" || $scope.upd.conPassword == undefined){
			conPassFaild = true;
		}
		
		//必须输入验证
		if(newPassFaild || conPassFaild){
			var  msg = "";
			if(newPassFaild){
				msg = msg + "新密码必须输入。</br>"
				//弹出错误消息
		      	  var templateParam = '<div class="tcc_2"><img src="common/images/error.png" width="30" class="mt_40"><p style="padding-left: 24px;padding-right: 20px;text-align: left;margin-top: 10px;">';
		      	  templateParam = templateParam + msg+'</p></div>';
		            $ionicLoading.show({
		                template: templateParam,
		                duration : 3000,
		                hideOnStateChange: true,
		                showBackdrop: false
		            });
					return;
			}
			if(conPassFaild){
				msg = msg + "确认密码必须输入。</br>"
				//弹出错误消息
		      	  var templateParam = '<div class="tcc_2"><img src="common/images/error.png" width="30" class="mt_40"><p style="padding-left: 24px;padding-right: 20px;text-align: left;margin-top: 10px;">';
		      	  templateParam = templateParam + msg+'</p></div>';
		            $ionicLoading.show({
		                template: templateParam,
		                duration : 3000,
		                hideOnStateChange: true,
		                showBackdrop: false
		            });
					return;
			}
		}
		
		//6到18位字符正则
		var reg =/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/; 
		if(!reg.test($scope.upd.newPassword)){
			newPassFaild = true;
		}
		if(!reg.test($scope.upd.conPassword)){
			conPassFaild = true;
		}
		
		//密码格式验证
		if(newPassFaild || conPassFaild){
			
			//弹出错误消息
	      	  /*var templateParam = '<div class="tcc_2"><img src="common/images/error.png" width="30" class="mt_40"><p style="padding-left: 24px;padding-right: 20px;text-align: left;margin-top: 10px;">';
	      	  templateParam = templateParam +'密码为6~18位字符</p></div>';
	            $ionicLoading.show({
	                template: templateParam,
	                duration : 3000,
	                hideOnStateChange: true,
	                showBackdrop: false
	            });*/
			comApi.showErrorMessage("msg.common.10021");
			return;
		}
		
		//两个密码一致性验证
		if($scope.upd.newPassword != $scope.upd.conPassword){
			//弹出错误消息
	      	  var templateParam = '<div class="tcc_2"><img src="common/images/error.png" width="30" class="mt_40"><p style="padding-left: 24px;padding-right: 20px;text-align: left;margin-top: 10px;">';
	      	  templateParam = templateParam +'两次输入密码不匹配</p></div>';
	            $ionicLoading.show({
	                template: templateParam,
	                duration : 3000,
	                hideOnStateChange: true,
	                showBackdrop: false
	            });
			return;
		}
		
		//保存参数
		var updateParam = { mobile : $scope.upd.mobile,newPassword:$scope.upd.newPassword}
		
		//保存
		comApi.post( 'forgetPassword/resetPassword',updateParam,function(data){
			if(data > 0){
		        //保存成功显示消息
		      	  var templateParam = '<div class="tcc_2"><img src="common/images/dui.png" width="30" class="mt_40"><p style="padding-left: 24px;padding-right: 20px;text-align: left;margin-top: 10px;">';
		      	  templateParam = templateParam + '密码重置成功</p></div>';
		            $ionicLoading.show({
		                template: templateParam,
		                duration : 3000,
		                hideOnStateChange: true,
		                showBackdrop: false
		            });
			    //一秒后跳转
			    $timeout(function(){
				    //跳转到登录画面
				    $state.go("login",{});
			    },1000);

			}else{
			     //弹出错误消息
		      	  var templateParam = '<div class="tcc_2"><img src="common/images/error.png" width="30" class="mt_40"><p style="padding-left: 24px;padding-right: 20px;text-align: left;margin-top: 10px;">';
		      	  templateParam = templateParam +'密码重置失败</p></div>';
		            $ionicLoading.show({
		                template: templateParam,
		                duration : 3000,
		                hideOnStateChange: true,
		                showBackdrop: false
		            });
			}
		});
	};
});