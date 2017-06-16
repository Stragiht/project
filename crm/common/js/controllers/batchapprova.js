app.controller("batchapprovalController", function($scope, $modal,
		NgTableParams, $location, $stateParams, $state, $log, comApi, toaster,
		$modalInstance) {
	
	$scope.qfFlag = "1";
	
	
	$scope.clickRad = function(flag){
		$scope.qfFlag = flag;
	}
	
	
	$scope.ok = function() {
		
		$modalInstance.close($scope.qfFlag);
		
	};
	
	
	$scope.cancel = function() {
		$modalInstance.dismiss();
	};

});
