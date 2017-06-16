
    app.controller('GdsBrdCtrl',['$scope','$http','NgTableParams','comApi', '$sessionStorage', '$stateParams', function($scope,$http,NgTableParams,comApi,$sessionStorage,$stateParams){
    	
    	var counts = comApi.getPageCounts();
	    var pageNum = 1;
	    var pageSize = counts[0];
	    var isBack = $stateParams.isBack && ($stateParams.isBack == "true" || $stateParams.isBack == true);
    	
        $scope.selectAllGdsBrd = function() {
        	pageSize = $sessionStorage.gdsBrdPageSizeCopy > 0 ? angular.copy($sessionStorage.gdsBrdPageSizeCopy) : pageSize;
        	if(isBack == true){
        		$scope.gydst = angular.copy($sessionStorage.gdsBrdDataLengthCopy);
        		pageNum = $sessionStorage.gdsBrdPageNumCopy > 0 ? angular.copy($sessionStorage.gdsBrdPageNumCopy) : pageNum;
            	$scope.tableParams = getTableParams(pageNum, pageSize, angular.copy($sessionStorage.gdsBrdDataCopy), counts);
        		isBack = false;
        	}else{
        		pageNum = 1;
        		comApi.get("gdsBrd/selectAllGdsBrd", function(data){
        			//如果商品品牌描述超过80个子，后面的用省略号
        			for (var i=0; i< data.length; i++) {
        				if((data[i].brdDesc+"").length> 80) {
        					data[i].brdDesc = (data[i].brdDesc+'').substring(0, 80) + '...';
        				}
        				if(data[i].brdLogo !='' && data[i].brdLogo != null) {
        					data[i].brdLogo = comApi.getFileServerPath() + data[i].brdLogo;
        				}
        			}
        			$scope.gydst=data.length;
        			$scope.tableParams = getTableParams(pageNum, pageSize, data, counts);
        			$sessionStorage.gdsBrdDataCopy = angular.copy(data);
        			$sessionStorage.gdsBrdDataLengthCopy = angular.copy($scope.gydst);
        		});
        	}
        }
        
        
        function getTableParams(pageNum, pageSize, data, counts){
        	var arr = comApi.buildTableParams(pageNum, pageSize, data, counts, function(pageIndex, pageCount){
            	pageNum = pageIndex;
    	        pageSize = pageCount;
    	        $sessionStorage.gdsBrdPageNumCopy = angular.copy(pageIndex);
    	        $sessionStorage.gdsBrdPageSizeCopy = angular.copy(pageCount);
            });
        	var tableParams = new NgTableParams(arr[0], arr[1]);
        	return tableParams;
        }
        
        
        $scope.selectAllGdsBrd();

        
        // 删除品牌
        $scope.delGdsBrd = function(oId){
            comApi.openDelWindow(function(){
                comApi.get("gdsBrd/deleteGdsBrd/"+oId, function(data){
                    $scope.selectAllGdsBrd();})
            });
        };

        /*
        * 限定字符的个数
        * */

        //一个汉字相当于2个字符
        function get_length(s){
            var char_length = 0;
            for (var i = 0; i < s.length; i++){
                var son_char = s.charAt(i);
                encodeURI(son_char).length > 2 ? char_length += 1 : char_length += 0.5;
            }
            return char_length;
        }
        function cut_str(str, len){
            var char_length = 0;
            for (var i = 0; i < str.length; i++){
                var son_str = str.charAt(i);
                encodeURI(son_str).length > 2 ? char_length += 1 : char_length += 0.5;
                if (char_length >= len){
                    var sub_len = char_length == len ? i+1 : i;
                    return str.substr(0, sub_len);
                    break;
                }
            }
        }

    }]);
