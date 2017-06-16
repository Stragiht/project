/**
 *  Created by dxm 
 *  修改密码画面_验证原密码 Controller
 *  2016/05/05
 */
app.controller('modPwdCtrl', function ($scope, $http,$location,$sessionStorage, $ionicPopup,$state,comApi) {
    
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	//取得登录用户员工编号
    var userId = $sessionStorage.userId;
    $scope.passtype = "password";   //密码框初始状态为密码
    
    $scope.mod = {};
    // 点击下一步
    $scope.next = function()
    {   
        //密码必须输入验证
        if($scope.mod.oldPassword == null || $scope.mod.oldPassword == "" || $scope.mod.oldPassword == undefined){
         // 弹出消息
            comApi.showMessage([ "error", "原密码" ], "msg.common.10002", 3000);
            return;
        }else{
        	//验证密码是否正确
        	comApi.get("ModPwd/checkCode/"+userId+"/"+$scope.mod.oldPassword, function(data) {
                if(angular.fromJson(data) == '1'){
                    $state.go("modPwdNextStep");
                  }else{
                       //弹出错误消息
                       var alertPopup = $ionicPopup.alert({
                           title: '<span class="popheader"><i class="fa fa-times-circle-o"></i> 修改密码失败</span>',
                           template: '密码输入错误，请重新输入。',
                           okText:'我知道了'
                        });
                  }
              });
            
            
        }
    };
    
    // 查看密码
    $scope.showPassword = function()
    {
        if($scope.passtype == "password"){
            $scope.passtype = "text";
        }else{
            $scope.passtype = "password";
        }
    };
});