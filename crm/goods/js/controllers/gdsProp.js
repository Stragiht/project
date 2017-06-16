
    app.controller('GdsPropCtrl',['$scope','$http','NgTableParams','comApi','$modal', '$sessionStorage', '$stateParams', function($scope,$http,NgTableParams,comApi,$modal,$sessionStorage,$stateParams){

    	
    	var counts = comApi.getPageCounts();
	    var pageNum = 1;
	    var pageSize = counts[0];
	    var isBack = $stateParams.isBack && ($stateParams.isBack == "true" || $stateParams.isBack == true);
    	
    	
        $scope.selectAllGdsProp = function(){
        	pageSize = $sessionStorage.gdsPropPageSizeCopy > 0 ? angular.copy($sessionStorage.gdsPropPageSizeCopy) : pageSize;
        	if(isBack == true){
            	$scope.gydst = angular.copy($sessionStorage.gdsPropDataLengthCopy);
            	pageNum = $sessionStorage.gdsPropPageNumCopy > 0 ? angular.copy($sessionStorage.gdsPropPageNumCopy) : pageNum;
            	$scope.tableParams = getTableParams(pageNum, pageSize, angular.copy($sessionStorage.gdsPropDataCopy), counts);
        		isBack = false;
        	}else{
        		pageNum = 1;
        		comApi.get("gdsProp/selectAllGdsPropGrp", function(data){
        			var obj = {gdsProStr:''};
        			$scope.gydst=data.length;
        			//数据格式化
        			for(var i=0; i<data.length; i++) {
        				var gdsProStr = '';
        				for(var j=0; j<data[i].gdsPropList.length; j++) {
        					if (data[i].gdsPropList.length<2 || j==0) {
        						gdsProStr += data[i].gdsPropList[j].gdsPropNm;
        					} else {
        						gdsProStr += ','+data[i].gdsPropList[j].gdsPropNm;
        					}
        				}
        				obj.gdsProStr =gdsProStr;
        				data[i].gdsProMos = gdsProStr;
        			}
        			$scope.tableParams = getTableParams(pageNum, pageSize, data, counts);
        			$sessionStorage.gdsPropDataLengthCopy = angular.copy($scope.gydst);
        			$sessionStorage.gdsPropDataCopy = angular.copy(data);
        		});
        	}
        }
        
        
        function getTableParams(pageNum, pageSize, data, counts){
        	var arr = comApi.buildTableParams(pageNum, pageSize, data, counts, function(pageIndex, pageCount){
            	pageNum = pageIndex;
    	        pageSize = pageCount;
    	        $sessionStorage.gdsPropPageNumCopy = angular.copy(pageIndex);
    	        $sessionStorage.gdsPropPageSizeCopy = angular.copy(pageCount);
            });
        	var tableParams = new NgTableParams(arr[0], arr[1]);
        	return tableParams;
        }
        
        
        $scope.selectAllGdsProp();
        
        // 删除商品
        $scope.delGdsProp = function(oId){
            comApi.openDelWindow(function(){
                comApi.get("gdsProp/deleteGdsPropGrp/"+oId, function(data){
                    $scope.selectAllGdsProp();})
            });
        }

    }]);
