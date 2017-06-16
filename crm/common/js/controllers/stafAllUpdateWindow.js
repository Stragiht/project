app.controller("stafAllUpdateWindow", function($scope, $modal, NgTableParams,
		$location, $stateParams, $state, $log, comApi, toaster, $modalInstance) {

	$scope.stfbas = {};
	$scope.stfbas.job=true;
	$scope.stfbas.posGrdNum=true;
	$scope.stfbas.workStat=true;
	/**
	 * 确定按钮
	 */
	$scope.ok = function() {

		/**
		 * 向父页面传递参数
		 */
	  if($scope.stfbas.job == false && $scope.stfbas.posGrdNum == false && $scope.stfbas.workStat == false){
	    comApi.HintMessage( "error", "错误", "msg.common.21006",0, "");
	    return;
      }
		$modalInstance.close($scope.stfbas);
	};
	
	
	/**
	 * 
	 * 关闭当前子画面
	 * 
	 * 
	 */
	$scope.cancel = function() {
		$modalInstance.dismiss();
	};

	
	
 
 


	

});
