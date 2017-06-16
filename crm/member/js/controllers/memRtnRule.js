
app.controller('memRtnRuleCtrl',['$scope','$http','NgTableParams','$element','comApi','$filter','$stateParams','$sessionStorage',function($scope,$http,NgTableParams,element,comApi,$filter,$stateParams,$sessionStorage){
    $scope.oneAtATime = true;
    $scope.status = {

        open: true

    };

    
    var counts = comApi.getPageCounts();
    var pageNum = 1;
    var pageSize = counts[0];
    var isBack = $stateParams.isBack && ($stateParams.isBack == "true" || $stateParams.isBack == true);
    
    
    $scope.selectMemRtnRule = function () {
    	pageSize = $sessionStorage.selectAllMembRtnRuleListPageSizeCopy > 0 ? angular.copy($sessionStorage.selectAllMembRtnRuleListPageSizeCopy) : pageSize;
        if(isBack == true){
        	$scope.gydst = angular.copy($sessionStorage.selectAllMembRtnRuleListDataLengthCopy);
        	$scope.membRtnRule= angular.copy($sessionStorage.selectAllMembRtnRuleListDataCopy);
        	pageNum = $sessionStorage.selectAllMembRtnRuleListPageNumCopy > 0 ? angular.copy($sessionStorage.selectAllMembRtnRuleListPageNumCopy) : pageNum;
        	$scope.tableParams = getTableParams(pageNum, pageSize, angular.copy($sessionStorage.selectAllMembRtnRuleListDataCopy), counts);
        	isBack = false;
        }else{
        	pageNum = 1;
	        comApi.get('membRtnRule/selectAllMembRtnRuleList', function(data){
	            $scope.membRtnRule = data;
	            $scope.gydst=data.length;
	            for (var i=0; i<data.length; i++) {
	                var memRtnRuleStr = '';
	                for (var j=0; j<data[i].posNumList.length; j++){
	                    if (data[i].posNumList.length <2 || j==0) {
	                        memRtnRuleStr += $filter('stfBasPosNum')(data[i].posNumList[j]);
	                    }else {
	                        memRtnRuleStr += ',' + $filter('stfBasPosNum')(data[i].posNumList[j]);
	                    }
	                }
	                $scope.membRtnRule[i].posNumList = memRtnRuleStr;
	            }
	            $scope.tableParams = getTableParams(pageNum, pageSize, data, counts);
	            $sessionStorage.selectAllMembRtnRuleListTableParamsCopy = angular.copy($scope.tableParams);
                $sessionStorage.selectAllMembRtnRuleListDataLengthCopy = angular.copy($scope.gydst);
                $sessionStorage.selectAllMembRtnRuleListDataCopy = angular.copy($scope.membRtnRule);
	        });
        }
    };
    
    
    function getTableParams(pageNum, pageSize, data, counts){
    	var arr = comApi.buildTableParams(pageNum, pageSize, data, counts, function(pageIndex, pageCount){
        	pageNum = pageIndex;
	        pageSize = pageCount;
	        $sessionStorage.selectAllMembRtnRuleListPageNumCopy = angular.copy(pageIndex);
	        $sessionStorage.selectAllMembRtnRuleListPageSizeCopy = angular.copy(pageCount);
        });
    	var tableParams = new NgTableParams(arr[0], arr[1]);
    	return tableParams;
    }

	//初始化页面
	$scope.initMemRtnRule = function() {
		//初始化数据
		$scope.selectMemRtnRule();
		comApi.selectAllMembRtnRuleRtn();
	};

	$scope.initMemRtnRule();
    

    // 删除回访规则
    $scope.delMemRtnRule = function(oId){  ///membRtnRule/deleteMembRtnRuleByOId/{oId}

        comApi.openDelWindow(function(){
            comApi.get("membRtnRule/deleteMembRtnRuleByOId/"+oId, function(data){
                $scope.selectMemRtnRule();})
        });
    }


}]);
