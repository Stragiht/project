
    app.controller('GdsClsCtrl',['$scope','$http','NgTableParams','comApi', '$modal', '$sessionStorage', '$stateParams', function($scope,$http,NgTableParams,comApi,$modal,$sessionStorage,$stateParams){
    	
    	var counts = comApi.getPageCounts();
	    var pageNum = 1;
	    var pageSize = counts[0];
	    var isBack = $stateParams.isBack && ($stateParams.isBack == "true" || $stateParams.isBack == true);
    	
        $scope.allGdsCls = [];
        //查询所有的商品分类数据
        $scope.searchAllGodCls = function() {
        	pageSize = $sessionStorage.gdsClsPageSizeCopy > 0 ? angular.copy($sessionStorage.gdsClsPageSizeCopy) : pageSize;
        	if(isBack == true){
            	$scope.allGdsCls= angular.copy($sessionStorage.gdsCls);
            	$scope.gydst = angular.copy($sessionStorage.gdsClsDataLengthCopy);
            	pageNum = $sessionStorage.gdsClsPageNumCopy > 0 ? angular.copy($sessionStorage.gdsClsPageNumCopy) : pageNum;
            	$scope.tableParams = getTableParams(pageNum, pageSize, $scope.allGdsCls, counts);
            	isBack = false;
            }else{
            	pageNum = 1;
            	comApi.get("gdsCls/selectAllGdsCls", function (data) { ///gdsCls/selectAllGdsCls
            		$scope.allGdsCls = data;
            		$scope.gydst = data.length;
            		$scope.tableParams = getTableParams(pageNum, pageSize, data, counts);
            		$sessionStorage.gdsClsDataLengthCopy = angular.copy($scope.gydst);
            		$sessionStorage.gdsCls = angular.copy($scope.allGdsCls);
            	});
            }
        };

        
        function getTableParams(pageNum, pageSize, data, counts){
        	var arr = comApi.buildTableParams(pageNum, pageSize, data, counts, function(pageIndex, pageCount){
            	pageNum = pageIndex;
    	        pageSize = pageCount;
    	        $sessionStorage.gdsClsPageNumCopy = angular.copy(pageIndex);
    	        $sessionStorage.gdsClsPageSizeCopy = angular.copy(pageCount);
            });
        	var tableParams = new NgTableParams(arr[0], arr[1]);
        	return tableParams;
        }
        
        
        $scope.searchAllGodCls();

        //删除商品
        //$scope.delGdsCls = function(oId){
        //    comApi.get("gdsCls/deleteGdsCls/"+oId, function(data){
        //        $scope.searchAllGodCls();
        //    });
        //}


        // 删除商品
        $scope.delGdsCls = function(oId){
            comApi.openDelWindow(function(){
                comApi.get("gdsCls/deleteGdsCls/"+oId, function(data){
                	$scope.searchAllGodCls();
                });
            });
        }


}]);
