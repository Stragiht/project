
app.controller('memBatUpdateCtrl',['$scope','$http','NgTableParams','$element','comApi','$filter', '$rootScope', '$state', '$stateParams', '$sessionStorage', function($scope,$http,NgTableParams,element,comApi,$filter,$rootScope,$state,$stateParams,$sessionStorage){
    $scope.oneAtATime = true;
    $scope.status = {

        open: true
    };

    var counts = comApi.getPageCounts();
    var pageNum = 1;
    var pageSize = counts[0];
    var isBack = $stateParams.isBack && ($stateParams.isBack == "true" || $stateParams.isBack == true);
    
    //定义查询会员列表传递的参数
    $scope.selectMembList = {
        "pageNum": '1',
        "pageSize": '',
        "params": {
            "C025": "",
            "C026": "",
            "C027": "",
            "C028": "",
            "crtdStfNm": "",
            "endTime": '',  //"endTime": '2016-01-01',
            "grpId": "",    //组别id
            "membNm": "",
            "membNum": "",
            "phone": "",
            "provChnl": "",  //渠道
            "startTime": ''  // "startTime": '2016-01-01'
        }
    }

    var self = this;
    //设置$scope.gydst的默认值为0
    $scope.gydst = 0;
    
    
    //搜索
    $scope.searchMemblist = function(){
        self.checkboxes = {
            checked : false,
            items : {}
        };
        angular.element(".select-all").prop("indeterminate",false);
        pageSize = $sessionStorage.memBatUpdatePageSizeCopy > 0 ? angular.copy($sessionStorage.memBatUpdatePageSizeCopy) : pageSize;//全局保存此页面设置的每页记录数
        if(isBack == true){
        	$scope.selectMembList = angular.copy($sessionStorage.memBatUpdateSelectParamsCopy);
        	$scope.gydst = angular.copy($sessionStorage.memBatUpdateDataLengthCopy);
        	$scope.list = angular.copy($sessionStorage.memBatUpdateDataCopy);
        	pageNum = $sessionStorage.memBatUpdatePageNumCopy > 0 ? angular.copy($sessionStorage.memBatUpdatePageNumCopy) : pageNum;
        	$scope.tableParams = getTableParams(pageNum, pageSize, $scope.list, counts);
        	isBack = false;
        }else{
        	pageNum = 1;
	        $scope.selectMembList.params.startTime = timeToTimestamp(angularDateFor($scope.selectMembList.params.startTime));  //1451577600000
	        $scope.selectMembList.params.endTime = timeToTimestamp(angularDateFor($scope.selectMembList.params.endTime)); //1461945600000
	        $sessionStorage.memBatUpdateSelectParamsCopy = angular.copy($scope.selectMembList);
	        //会员列表
	        comApi.post('membBas/selectMembBas', $scope.selectMembList, function(data){
	            data = data.data;
	            $scope.gydst=data.length;
	            $scope.list=data;
	            $scope.tableParams = getTableParams(pageNum, pageSize, data, counts);
	            $sessionStorage.memBatUpdateDataLengthCopy = angular.copy($scope.gydst);
	            $sessionStorage.memBatUpdateDataCopy = angular.copy($scope.list);
	        });
        }
    };

    
    function getTableParams(pageNum, pageSize, data, counts){
    	var arr = comApi.buildTableParams(pageNum, pageSize, data, counts, function(pageIndex, pageCount){
        	pageNum = pageIndex;
	        pageSize = pageCount;
	        $sessionStorage.memBatUpdatePageNumCopy = angular.copy(pageIndex);
	        $sessionStorage.memBatUpdatePageSizeCopy = angular.copy(pageCount);
        });
    	var tableParams = new NgTableParams(arr[0], arr[1]);
    	return tableParams;
    }
    
    
    if(isBack == true){
    	var url = window.location.href;
    	url = url.indexOf("?") == -1 ? url : url.substring(0, url.indexOf('?'));
    	window.history.pushState({}, "", url); 
    	$scope.searchMemblist();
    }
    
    self.checkboxes = {
        checked : false,
        items : {}
    };

    // 点击全选 的事件
    $scope.checkAll = function() {
        // angular 循环的方法
        angular
            .forEach(
            $scope.list,
            function(item) {
                self.checkboxes.items[item.membNum] = self.checkboxes.checked;
            });
    };

    // 單選 的事件
    $scope.checkItem = function() {
        var checked = 0, unchecked = 0, total = $scope.gydst;
        angular
            .forEach(
            $scope.list,
            function(item) {
                checked += (self.checkboxes.items[item.membNum]) || 0;
                unchecked += (!self.checkboxes.items[item.membNum]) || 0;
            });
       /* if ((unchecked == 0) || (checked == 0)) {
            self.checkboxes.checked = (checked == total);
        }*/

        if (unchecked > 0) {
            self.checkboxes.checked = false;
        }

        angular.element(".select-all").prop(
            "indeterminate",
            (checked != 0 && unchecked != 0));
    };

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

    $rootScope.editMembStr = '';


    //统一编辑
    $rootScope.membNumAndUpdtTmList = [
        /*{
            membNum:'',
            updtTm:''
        }*/
    ];  //memBatUpdateOneByOne

    //一个一个编辑
    $rootScope.memBatUpdateOBO = [];

    var curDate = new Date();
    $scope.allEdit = function() {
        //选中事件
        angular.forEach($scope.list, function (item) {
            if (self.checkboxes.items[item.membNum] == true) {
                $rootScope.editMembStr += item.membNum + "." + item.membNm + '，';
                $rootScope.membNumAndUpdtTmList.push({membNum:item.membNum,updtTm:item.updtTm});
            }
        });

        if ($rootScope.membNumAndUpdtTmList == undefined || $rootScope.membNumAndUpdtTmList == '' || $rootScope.membNumAndUpdtTmList == null) {
        	comApi.errorMessage("msg.member.10003");
        } else {
            $state.go('app.member.memBatUpdateAll');
        }
    }

    $scope.oneByOneEdit = function() {

        //选中事件
        angular.forEach($scope.list, function (item) {
            if (self.checkboxes.items[item.membNum] == true) {
                $rootScope.memBatUpdateOBO.push(item);
            }
        });

        if ($rootScope.memBatUpdateOBO == undefined || $rootScope.memBatUpdateOBO == '' || $rootScope.memBatUpdateOBO == null) {
        	comApi.errorMessage("msg.member.10003");
        } else {
            $state.go('app.member.memBatUpdateOneByOne');

        }

    }

}]);
