/**
 * 入职流程列表
 */
app.controller('schedulingForApproval', function($scope, $sessionStorage,$ionicScrollDelegate,
    $ionicPopup, $state, comApi) {
	$scope.pageNum = 0; // 第几页
	$scope.pageSize = 15; // 每页显示件数
	$scope.moredata = true; // 上拉加载是否可用 
	var datalist=[];
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	$scope.apprStatCnd = "0000";
  // 初始化
  $scope.init = function() {
    // 取得审批状态列表
    comApi.getSelectBoxDic("C018", 2).then(function(data) {
      $scope.apprStatList = data;
      // 执行查询
      $scope.apprStatCnd = data[0].key;
      datalist = [];
      $scope.scheduleList = [];
    });
  }

  $scope.insertSchedule = function() {
      comApi.get('staff/selectMobileShiftMngRespectPhaNum',function(data) {
        if (data.count == 0) {
          $state.go("insertSchedule");
        } else if (data.count == 1) {
          $state.go("insertSchedule");
        } else {
          comApi.showMessage("error", "msg.common.10014", 3000);
          return;
        }

      },true)
  }

  // 查询
  $scope.selectBAShiftMngAppl = function(apprStat) {
	  $scope.moredata = true;
	  // 回到顶部
	  $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
	  // 保存查询时的审批状态
	  $scope.apprStatCnd = apprStat;
	  $scope.pageNum = 0;
	  datalist = [];
      $scope.scheduleList = [];
    
  }
  // 执行初始化方法
  $scope.init();
  
  // 下拉刷新
  $scope.doRefresh = function() {
  	$scope.pageNum = 0;
  	comApi.post('staff/bAShiftMngSelectM', {
  		pageSize : $scope.pageSize,
          pageNum : $scope.pageNum + 1,
          params : {
        	  bySchStf : $sessionStorage.userId,
    	      apprRslt : $scope.apprStatCnd
          }
  	}, function(data) {
  		datalist = [];
  		Array.prototype.push.apply(datalist, data.list);
  	   var blphaStartTm;
	       var blphaEndTm;
	       var scheduleList = [];
	       var list = [];
	       if(datalist.length>0){
 	        blphaStartTm = datalist[0].phaStartTm; 
 	        blphaEndTm = datalist[0].phaEndTm; 
 	      }
 	      for(var i =0;i<datalist.length;i++){
 	        if(blphaEndTm==datalist[i].phaEndTm && blphaStartTm==datalist[i].phaStartTm){
 	          list[list.length] = datalist[i];
 	        }else{
 	          scheduleList.push({
 	            phaStartTm : blphaStartTm,
 	            phaEndTm : blphaEndTm,
 	            list : list
 	          });
 	          blphaStartTm = datalist[i].phaStartTm; 
 	          blphaEndTm = datalist[i].phaEndTm; 
 	          list = [];
 	          list[list.length] = datalist[i];
 	        }
 	      }
 	      if(datalist.length>0){
 	        scheduleList.push({
 	          phaStartTm : blphaStartTm,
 	          phaEndTm : blphaEndTm,
 	          list : list
 	        });
 	      }
  		$scope.scheduleList = scheduleList;
  		$scope.moredata = data.hasNextPage;
        $scope.pageNum = data.pageNum;
  		$scope.$broadcast("scroll.refreshComplete");
  	});
  }
  var blphaStartTm = "";
  var blphaEndTm = "";
// 上拉加载
  $scope.loadMore = function() {
  	comApi.post('staff/bAShiftMngSelectM', {
  		pageSize : $scope.pageSize,
          pageNum : $scope.pageNum + 1,
          params : {
        	  bySchStf : $sessionStorage.userId,
    	      apprRslt : $scope.apprStatCnd
          }
  	}, function(data) {
  		Array.prototype.push.apply(datalist, data.list);
  		var list = [];
  		var scheduleList = [];
	    	   if(datalist.length>0){
	    		   blphaStartTm = datalist[0].phaStartTm; 
	    		   blphaEndTm = datalist[0].phaEndTm; 
	    	   }
  	      for(var i =0;i<datalist.length;i++){
  	        if(blphaEndTm==datalist[i].phaEndTm && blphaStartTm==datalist[i].phaStartTm){
  	          list[list.length] = datalist[i];
  	        }else{
  	          scheduleList.push({
  	            phaStartTm : blphaStartTm,
  	            phaEndTm : blphaEndTm,
  	            list : list
  	          });
  	          blphaStartTm = datalist[i].phaStartTm; 
  	          blphaEndTm = datalist[i].phaEndTm; 
  	          list = [];
  	          list[list.length] = datalist[i];
  	        }
  	      }
  	      if(datalist.length>0){
  	        scheduleList.push({
  	          phaStartTm : blphaStartTm,
  	          phaEndTm : blphaEndTm,
  	          list : list
  	        });
  	      }
  		$scope.scheduleList = scheduleList;
  		$scope.moredata = data.hasNextPage;
	        $scope.pageNum = data.pageNum;
  		$scope.$broadcast("scroll.infiniteScrollComplete");
  	});
  }
});