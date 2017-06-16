/**
 *  Created by dxm 
 *  修改密码画面_修改密码Controller
 *  2016/05/05
 */
app.controller('modPwdNxtStpCtrl', function ($scope, $http,$sessionStorage,$ionicPopup,$ionicLoading,$timeout,$state,comApi) {
    
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	//取得登录用户员工编号
    var userId = $sessionStorage.userId;
    //页面初始化
    $scope.newpasstype = "password";    //新密码框初始状态为密码
    $scope.conpasstype = "password";    //确认密码框初始状态为密码
    $scope.upd = {};
    
    // 修改密码保存
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
            if(newPassFaild){
            	comApi.showMessage([ "error", "新密码" ], "msg.common.10002", 3000);
                return;
            }
            
            if(conPassFaild){
                comApi.showMessage([ "error", "确认密码" ], "msg.common.10002", 3000);
                return;
            }
            //弹出错误消息
            var alertPopup = $ionicPopup.alert({
                 title: '<span class="popheader"><i class="fa fa-times-circle-o"></i> 修改密码失败</span>',
                 template: msg,
                 okText:'我知道了'
               });
            
            return;
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

        	//comApi.showMessage([ "error", "" ], "msg.common.10021", 3000);
        	comApi.showErrorMessage("msg.common.10021");
            return;
        }
        
        //两个密码一致性验证
        if($scope.upd.newPassword != $scope.upd.conPassword){
            //弹出错误消息
        	//comApi.showMessage([ "error", "" ], "msg.common.10022", 3000);
            comApi.showErrorMessage("msg.common.10022");
            return;
        }
        
        //保存参数
        var updateParam = { userId : userId , newPassword : $scope.upd.newPassword}
        
        //保存
        comApi.post('ModPwd/updatePassword', {
        	userId : userId , newPassword : $scope.upd.newPassword
    	    }, function(data) {
    	    	if(angular.fromJson(data) > 0){
                    //保存成功显示消息
                    $ionicLoading.show({
                        template: '<div style=" width:100px; height:100px;text-align: center;"><img src="common/images/dui.png" width="40" class="mt_20"><p class="mt_20">您已成功保存</p></div>',
                        duration :1000,
                        hideOnStateChange:true
                     });
                    //一秒后跳转
                    $timeout(function(){
                      $state.go("personalCenter");
                    },1000);
                   
                }else{
                     //弹出错误消息
                     var alertPopup = $ionicPopup.alert({
                         title: '<span class="popheader"><i class="fa fa-times-circle-o"></i> 修改密码失败</span>',
                         template: '系统错误。',
                         okText:'我知道了'
                      });
                }
    	    });
        
    };
    
    // 查看密码
    $scope.showPassword = function(flag)
    {   
        if(flag==1){
          if($scope.newpasstype == "password"){
            $scope.newpasstype = "text";
          }else{
              $scope.newpasstype = "password";
          }
        }else if(flag==2){
          if($scope.conpasstype == "password"){
            $scope.conpasstype = "text";
          }else{
              $scope.conpasstype = "password";
          }
        }
    };
});