
app.controller('memRevisitTskCtrl',['$scope','$http','NgTableParams','$element','comApi','$filter','$sessionStorage','$stateParams',function($scope,$http,NgTableParams,element,comApi,$filter,$sessionStorage,$stateParams){
    $scope.oneAtATime = true;
    $scope.status = {

        open: true,
        checkopen:false
    };

    //定义样式数组
    $scope.memVisitStyle=[];

    var counts = comApi.getPageCounts();
    var pageNum = 1;
    var pageSize = counts[0];
    var isBack = $stateParams.isBack && ($stateParams.isBack == "true" || $stateParams.isBack == true);

    //初始化
    if(isBack == true){
        $scope.memVisitStyle = angular.copy($sessionStorage.memVisitStyleSto);
    } else {
        $scope.memVisitStyle[0] = 'current';
    }

    //查看回访任务请求的参数
    $scope.selectMembRevisitList = {
        pageNum:'1',
        pageSize:'',
        params:{
            membNm:'',
            membNum:'',
            phone:'',
            rtnStat:'',
            stfNm:'',
            stfNum:'',
            startTime:'',
            endTime:''
        }
    };


    //回访状态  获取回访状态         //dicNameFilter
    $scope.memRevStates =  comApi.getSelectBoxDic('C024',2);

    //设置$scope.gydst的默认值为0
    $scope.gydst = 0;

    $scope.searchMemRevList = function(rtnKey, index) {

        pageSize = $sessionStorage.selectMembRevisitListPageSizeCopy > 0 ? angular.copy($sessionStorage.selectMembRevisitListPageSizeCopy) : pageSize;
        if(isBack == true){
        	$scope.selectMembRevisitList = angular.copy($sessionStorage.selectMembRevisitListParamsCopy);
        	$scope.gydst = angular.copy($sessionStorage.selectMembRevisitListDataLengthCopy);
        	pageNum = $sessionStorage.selectMembRevisitListPageNumCopy > 0 ? angular.copy($sessionStorage.selectMembRevisitListPageNumCopy) : pageNum;
        	$scope.tableParams = getTableParams(pageNum, pageSize, angular.copy($sessionStorage.memRevData), counts);
        	isBack = false;
        }else{
            if (comApi.isNotNullAndUndefined(rtnKey)) {
                //控制选中样式
                $scope.memVisitStyle = [];
                $scope.memVisitStyle[index] = 'current';
                $scope.selectMembRevisitList.params.rtnStat = rtnKey;
            }
        	pageNum = 1;
	        $scope.selectMembRevisitList.params.startTime = comApi.dateToTimeStamp($scope.selectMembRevisitList.params.startTime);  //1451577600000
	        $scope.selectMembRevisitList.params.endTime = comApi.dateToTimeStamp($scope.selectMembRevisitList.params.endTime); //1461945600000
	        $sessionStorage.selectMembRevisitListParamsCopy = angular.copy($scope.selectMembRevisitList);
	        comApi.post('membRevisitTsk/selectMembRevisitTskList', $scope.selectMembRevisitList, function(data){
	            //存储会员回访数据，在查看页面需要使用
	            data = data.data;
	            $scope.gydst=data.length;
	            $scope.tableParams = getTableParams(pageNum, pageSize, data, counts);
                $sessionStorage.selectMembRevisitListDataLengthCopy = angular.copy($scope.gydst);
                $sessionStorage.memRevData = angular.copy(data);
                $sessionStorage.memVisitStyleSto = angular.copy($scope.memVisitStyle);
	        });
        }

    };


    function getTableParams(pageNum, pageSize, data, counts){
    	var arr = comApi.buildTableParams(pageNum, pageSize, data, counts, function(pageIndex, pageCount){
        	pageNum = pageIndex;
	        pageSize = pageCount;
	        $sessionStorage.selectMembRevisitListPageNumCopy = angular.copy(pageIndex);
	        $sessionStorage.selectMembRevisitListPageSizeCopy = angular.copy(pageCount);
        });
    	var tableParams = new NgTableParams(arr[0], arr[1]);
    	return tableParams;
    }
    
    
    if(isBack == true){
    	var url = window.location.href;
    	url = url.indexOf("?") == -1 ? url : url.substring(0, url.indexOf('?'));
    	window.history.pushState({}, "", url);
    	$scope.searchMemRevList();
    }
    

}]);
