app.controller('approvalSalesReportCtrl',['$scope','$state', '$http', '$location','$sessionStorage','$ionicPopup','$stateParams','comApi',function ($scope,$state, $http, $location,$sessionStorage,$ionicPopup,$stateParams,comApi) {
  
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	$scope.list = {};
    //初始化方法
	$scope.init = function(){
	  //初始化条件查询列表
	  $scope.list.repApplNum = $stateParams.repApplNum;
	}

	//调用页面初始化
	$scope.init();
	//apprStat:审核状态(50通过，20不通过)
	$scope.update=function(apprStat){
	    
	    $scope.list.repApplNum = $stateParams.repApplNum;
	    $scope.list.updtTm = $stateParams.updtTm;
	    if(apprStat == "50"){
	        $scope.list.apprRst = "1";
	    }else{
	        $scope.list.apprRst = "0";
	    }
	    comApi.post("RepApplReport/apprReportManagement", $scope.list, function(data){//直接调取web端的审批
	      comApi.showMessage("success", "msg.common.10010", 3000);
	      $state.go("reportApproval");
	    })
	}
}]);