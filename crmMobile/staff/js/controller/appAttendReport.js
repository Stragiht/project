/**
 * 请假管理
 */
app.controller('appAttendReportController', function ($scope,$ionicScrollDelegate, $sessionStorage, $ionicPopup, $state, comApi) {
    
	var navMenu = comApi.showFooterMenu("");
	var list = [];
	$scope.$emit('navMenu.type', navMenu); 
	
	$scope.pageNum = 0; // 第几页
    $scope.pageSize = 15; // 每页显示件数
    $scope.moredata = true; // 上拉加载是否可用
    $scope.apprStatCnd = "0000";
    $scope.dqsjxs = false;
    // 初始化
    $scope.init = function () {
        // 取得审批状态列表
        comApi.getSelectBoxDic("C018", 2).then(function (data) {
            $scope.apprRsltList = data;
            // 执行查询
            $scope.selectLeaveAppl(data[0].key);
        });
    };
    // 查询
    $scope.selectLeaveAppl = function (apprRslt) {
    	list = [];
        // 保存查询时的审批状态
        $scope.apprStatCnd = apprRslt;
        $scope.pageNum = 0;
        $scope.moredata = true;
        $scope.attendreport = [];
        // 回到顶部
        $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
    };
    // 执行初始化方法
    $scope.init();
    // 下拉刷新
    $scope.doRefresh = function() {
    	list = [];
      $scope.pageNum = 0; // 还原第几页
      comApi.post('GenAttendReport/selectAppAttendReportMobile', {
        pageSize : $scope.pageSize,
        pageNum : $scope.pageNum + 1, // 下一页
        params : {
          apprStat : $scope.apprStatCnd
        }
      }, function(data) {
    	  Array.prototype.push.apply(list, data.list);
    	  var datalist = [];
    	  var attendreport = [];
    	  var dqdq = "";
    	  if(list.length > 0){
    		  dqdq = list[0].dqsjxs;
    		  for(var i=0;i<list.length;i++){
    			  if(dqdq == list[i].dqsjxs){
    				  datalist[datalist.length] = list[i];
    			  }else{
    				  attendreport.push({
    					  dqsjxs : dqdq,
    					  datalist : datalist
    				  });
    				  dqdq = list[i].dqsjxs
    				  datalist = [];
    				  datalist[datalist.length] = list[i];
    			  }
    		  }
    		  attendreport.push({
    			  dqsjxs : dqdq,
				  datalist : datalist
			  });
    	  }
	    $scope.attendreport = attendreport;
        $scope.moredata = data.hasNextPage;
        $scope.pageNum = data.pageNum;

        $scope.$broadcast("scroll.refreshComplete");
      });
    };
    // 上拉加载
    $scope.loadMore = function() {
      comApi.post('GenAttendReport/selectAppAttendReportMobile', {
        pageSize : $scope.pageSize,
        pageNum : $scope.pageNum + 1, // 下一页
        params : {
          apprStat : $scope.apprStatCnd
        }
      }, function(data) {
    	  Array.prototype.push.apply(list, data.list);
    	  var datalist = [];
    	  var attendreport = [];
    	  var dqdq = "";
    	  if(list.length > 0){
    		  dqdq = list[0].dqsjxs;
    		  for(var i=0;i<list.length;i++){
    			  if(dqdq == list[i].dqsjxs){
    				  datalist[datalist.length] = list[i];
    			  }else{
    				  attendreport.push({
    					  dqsjxs : dqdq,
    					  datalist : datalist
    				  });
    				  dqdq = list[i].dqsjxs
    				  datalist = [];
    				  datalist[datalist.length] = list[i];
    			  }
    		  }
    		  attendreport.push({
    			  dqsjxs : dqdq,
				  datalist : datalist
			  });
    	  }
	    $scope.attendreport = attendreport;
        $scope.moredata = data.hasNextPage;
        $scope.pageNum = data.pageNum;
        $scope.$broadcast("scroll.infiniteScrollComplete");
      });
    };
});