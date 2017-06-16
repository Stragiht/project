
app.controller('memRevisitRecCtrl',['$scope','$http','NgTableParams','$element','comApi', '$filter','$sessionStorage','$stateParams',function($scope,$http,NgTableParams,element,comApi,$filter,$sessionStorage,$stateParams){
    $scope.oneAtATime = true;
    $scope.status = {

        open: true

    };
    
    var counts = comApi.getPageCounts();
    var pageNum = 1;
    var pageSize = counts[0];
    var isBack = $stateParams.isBack && ($stateParams.isBack == "true" || $stateParams.isBack == true);

    //日期转换成时间戳
    function timeToTimestamp(dateStr) {
        if (dateStr == null || dateStr == '' || dateStr == undefined) {
            return '';
        } else {
            //只能识别xxxx/02/01这种形式
            var date = dateStr.replace(/-/g,'/');
            return new Date(date).getTime();
        }
    }

    //angular中日期格式化
    function angularDateFor(date){
        return $filter('date')(date,'yyyy-MM-dd');
    }

    //时间格式化
    function timeFormat(time) {
        var newTime = time.split(' ');
        return newTime[0]+' '+newTime[1].split('.')[0];
    }


    $scope.selectMembRevisitRecList = {
        "pageNum": 1,
        "pageSize": '',
        "params": {
            "membNm": "",
            "membNum": "",
            "phone": "",
            "revisitEndTime": '',
            "revisitStartTime": '',
            "stfNm": "",
            "stfNum": "",
            "tskEndTime": '',
            "tskStartTime": ''
        }
    };

    //设置$scope.gydst的默认值为0
    $scope.gydst = 0;
    $scope.searchMemRevRecList = function() {
    	pageSize = $sessionStorage.selectMembRevisitRecListPageSizeCopy > 0 ? angular.copy($sessionStorage.selectMembRevisitRecListPageSizeCopy) : pageSize;
        if(isBack == true){
         	$scope.selectMembRevisitRecList = angular.copy($sessionStorage.selectMembRevisitRecListCopy);
         	$scope.gydst = angular.copy($sessionStorage.selectMembRevisitRecListDataLengthCopy);
         	pageNum = $sessionStorage.selectMembRevisitRecListPageNumCopy > 0 ? angular.copy($sessionStorage.selectMembRevisitRecListPageNumCopy) : pageNum;
        	$scope.tableParams = getTableParams(pageNum, pageSize, angular.copy($sessionStorage.memRevRecData), counts);
         	isBack = false;
        }else{
        	pageNum = 1;
	        $scope.selectMembRevisitRecList.params.tskStartTime = comApi.dateToTimeStamp( $scope.selectMembRevisitRecList.params.tskStartTime);
	        $scope.selectMembRevisitRecList.params.tskEndTime = comApi.dateToTimeStamp( $scope.selectMembRevisitRecList.params.tskEndTime);
	        $scope.selectMembRevisitRecList.params.revisitStartTime = comApi.dateToTimeStamp( $scope.selectMembRevisitRecList.params.revisitStartTime);
	        $scope.selectMembRevisitRecList.params.revisitEndTime = comApi.dateToTimeStamp( $scope.selectMembRevisitRecList.params.revisitEndTime);
	        $sessionStorage.selectMembRevisitRecListCopy = angular.copy($scope.selectMembRevisitRecList);
	        comApi.post('membRevisitRec/selectMembRevisitRecList', $scope.selectMembRevisitRecList, function(data){
	            //存储会员回访数据，在查看页面需要使用
	            data = data.data;
	            $scope.gydst=data.length;
	            $scope.tableParams = getTableParams(pageNum, pageSize, data, counts);
	            $sessionStorage.memRevRecData = angular.copy(data);
	            $sessionStorage.selectMembRevisitRecListDataLengthCopy = angular.copy($scope.gydst);
	        });
        }
    }
    
    
    function getTableParams(pageNum, pageSize, data, counts){
    	var arr = comApi.buildTableParams(pageNum, pageSize, data, counts, function(pageIndex, pageCount){
        	pageNum = pageIndex;
	        pageSize = pageCount;
	        $sessionStorage.selectMembRevisitRecListPageNumCopy = angular.copy(pageIndex);
	        $sessionStorage.selectMembRevisitRecListPageSizeCopy = angular.copy(pageCount);
        });
    	var tableParams = new NgTableParams(arr[0], arr[1]);
    	return tableParams;
    }
    

    if(isBack == true){
    	var url = window.location.href;
    	url = url.indexOf("?") == -1 ? url : url.substring(0, url.indexOf('?'));
    	window.history.pushState({}, "", url);
    	$scope.searchMemRevRecList();
    }

}]);
