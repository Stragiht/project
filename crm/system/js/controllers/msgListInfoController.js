app.controller('msgListInfoController',function($scope, $stateParams, $http, $state, comApi, $sessionStorage) {

	$scope.init = function() {

		var id = $stateParams.id;
		var curStatus = $stateParams.curStatus;
		$scope.msgListData = {
			"pageNum": 1,
			"pageSize": 0,
			"params":{
				"status": "1"
			}
		};
		$scope.msgListInfo = {};

		comApi.post('msgList/msgListInfo',{id: id},function(data){
			if (curStatus == 1) {
				//查询未读msg剩余数量
				comApi.post('msgList/msgListSelect', $scope.msgListData, function(data){
					if (data.currentSize > 0) {
						$scope.$emit('unReadMsgNum', data.currentSize);
					} else {
						$scope.$emit('unReadMsgNum', '');
					}
				});
			}
			$scope.msgListInfo = data;
		});
	};

	$scope.init();
    
    //返回
    $scope.goBack = function(){
        $state.go("app.system.msgListSelect",
                {id: $stateParams.id, status: $stateParams.status});
    }
    
});