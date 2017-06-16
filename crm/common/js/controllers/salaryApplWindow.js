app.controller("salaryApplWindow", function($scope, $modal, NgTableParams,
		$location, $stateParams, $state, $log, comApi, toaster, $modalInstance) {
    $scope.salarybykey ={};
	// 取得是否通过选项列表
    var apprRstDataList = comApi.getSelectBoxDic("C002", "0");
    $scope.apprRstList = apprRstDataList;
    // 设置是否通过初始值
    $scope.salarybykey.apprRst = apprRstDataList[0].key;
	/**
	 * 确定按钮
	 */
	$scope.ok = function() {
		$modalInstance.close($scope.salarybykey.apprRst);
	};
	
	/**
	 * 关闭当前子画面
	 */
	$scope.cancel = function() {
		$modalInstance.dismiss();
	};
});
