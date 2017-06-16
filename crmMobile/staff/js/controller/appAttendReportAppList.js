app.controller("appAttendReportAppListController", function ($scope, $sessionStorage, $ionicPopup, $state, $timeout, $ionicLoading, comApi) {
    
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	$scope.pageNum = 0;
    $scope.pageSize = 15;
    $scope.moredata = true;
    $scope.attendreport = [];
    $scope.checkStatus = true;

    $scope.checkAll = function () {
        for (var i = 0; i < $scope.attendreport.length; i++) {
            $scope.attendreport[i].isCheck = $scope.checkStatus
        }
    };
    $scope.apprEntryAppl = function (apprRst) {
        var stnum = [];
        var stnos = [];
        for (var i = 0; i < $scope.attendreport.length; i++) {
            if ($scope.attendreport[i].isCheck) {
                var obj  = new Object();
                obj.oid = $scope.attendreport[i].oid;
                obj.updtTm = $scope.attendreport[i].updtTm;
                stnum.push(obj);
            }
        }
        if(stnum.length == 0){
          comApi.showMessage([ "error", "审批" ], "msg.common.10005", 3000);
        } else {
            comApi.post("GenAttendReport/updateApprAttendReportList", {"appList":stnum,"apprRst":apprRst}, function (data) {
              comApi.showMessage("success", "msg.common.10010", 3000);
                $state.go("appAttendReport");
            });
        }
    }
    //
    $scope.check=function(check){ 
      if(!check){
        $scope.checkStatus = false;
      }else{
        $scope.checkStatus = true;
        for(var i=0;i<$scope.attendreport.length;i++){
          if(!$scope.attendreport[i].isCheck){
            $scope.checkStatus = false;
            return;
          }
        }
      }
    }
    
    // 下拉刷新
    $scope.doRefresh = function() {
      $scope.pageNum = 0; // 还原第几页
      comApi.post('GenAttendReport/selectAppAttendReportMobiles', {
        pageSize : $scope.pageSize,
        pageNum : $scope.pageNum + 1, // 下一页
        params : {
          apprStat : '30'
        }
      }, function(data) {
        $scope.checkStatus = true;
        for(var i=0;i<data.list.length;i++){
          data.list[i].isCheck = $scope.checkStatus;
        }
        $scope.attendreport = data.list;
        $scope.moredata = data.hasNextPage;
        $scope.pageNum = data.pageNum;

        $scope.$broadcast("scroll.refreshComplete");
      });
    };
    // 上拉加载
    $scope.loadMore = function() {
      comApi.post('GenAttendReport/selectAppAttendReportMobiles', {
        pageSize : $scope.pageSize,
        pageNum : $scope.pageNum + 1, // 下一页
        params : {
          apprStat : '30'
        }
      }, function(data) {
        for(var i=0;i<data.list.length;i++){
          data.list[i].isCheck = $scope.checkStatus;
        }
        Array.prototype.push.apply($scope.attendreport, data.list);
        $scope.moredata = data.hasNextPage;
        $scope.pageNum = data.pageNum;
        $scope.$broadcast("scroll.infiniteScrollComplete");
      });
    };
    
});