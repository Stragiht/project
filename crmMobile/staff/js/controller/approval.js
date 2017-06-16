/**
 * Created by JiaZhaoYang on 2016-4-21.
 * 人员信息详情画面
 */
app.controller('approvalCtrl',['$timeout','$state','$scope', '$http', '$location','$sessionStorage','$ionicPopup','$stateParams','comApi',function ($timeout,$state,$scope, $http, $location,$sessionStorage,$ionicPopup,$stateParams,comApi) {
  
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	$scope.list = {};
    //初始化方法
	$scope.init = function(){
	  //初始化条件查询列表
	  $scope.applNum = $stateParams.applNum;
	}

	//调用页面初始化
	$scope.init();
	//apprStat:审核状态(50通过，20不通过)
	$scope.update=function(apprStat){
	    
	    var oid = $stateParams.oid;
	    $scope.list.oId=oid;
	    $scope.list.applNum = $stateParams.applNum;
	    $scope.list.updtTm = $stateParams.updtTm;
	    if(apprStat == "50"){
	        $scope.list.apprRst = "1";
	    }else{
	        $scope.list.apprRst = "0";
	    }
	    comApi.post("staff/stfSalaryApplAppr", $scope.list, function(data){//直接调取web端的审批
	    	comApi.showMessage("success", "msg.common.10010", 3000);
            	
            	$timeout(function() {
                    // 跳转到入职流程页面
                    $state.go("approvalDetails", {
                        applNum:$stateParams.applNum
                    });
                  }, 1000);
	    })
	}
}]);