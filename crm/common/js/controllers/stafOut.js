app.controller("stafOutffController", function($scope, $modal, NgTableParams,
		$location, $stateParams, $state, $log, comApi, toaster, $modalInstance) {

	$scope.stfbas = {};
	/**
	 * 确定按钮
	 */
	$scope.ok = function() {

		/**
		 * 向父页面传递参数
		 */
	  
	  
	  
	  
	  if($scope.stfbas.bnk||$scope.stfbas.idcard||$scope.stfbas.health){
		$modalInstance.close($scope.stfbas);
		}else{
		  comApi.HintMessage("error", "", "msg.common.00008",0, "");
          return;
		}
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
