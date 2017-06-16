/**
 * created by zhaoq
 * 查看门店排班
 */
app.controller('baShiftMngController', function($stateParams,$scope,$sessionStorage,$ionicPopup,$http,
    $state,$ionicScrollDelegate,comApi){
	 
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	  //加载档期
		  comApi.get("staff/selectSchedule",function(data) {

		    	$scope.screens = [];
		        if(data.length == 0){
		            $scope.screens = [];
		            $scope.moredata = false; // 上拉加载是否可用
		            return;
		          }
		        for(var i = 0;i<data.length;i++){
		        	$scope.screens.push({
		        		phaNum:data[i].oId,
		        		schend:data[i].schend,
		        		phaStartTm:data[i].phaStartTm,
		        		phaEndTm:data[i].phaEndTm
		        	})
		        }
		        //如果没有数据只有个全部
		        if($scope.screens.length==0){
		     	     $scope.screens.push({
		  	        	phaNum:"当前档期",
		  	        	schend:"当前档期",
		  	        	phaStartTm:"",
		  	        	phaEndTm:""
		  	        })
		  	        
		  	     $scope.screens.push({
			        	phaNum:"上一档期",
			        	schend:"上一档期",
			        	phaStartTm:"",
			        	phaEndTm:""
			        })
			        
		  	     $scope.screens.push({
			        	phaNum:"下一档期",
			        	schend:"下一档期",
			        	phaStartTm:"",
			        	phaEndTm:""
			        })
		        }else{
		        	var b=false;
//			        //如果档期数据不全则补全数据
			        for(var k=0;k<$scope.screens.length;k++){
			           if($scope.screens[k].schend.indexOf("当前档期") !=-1){
			        	       b=true;
			        	       break; 
			     	   }
			        }
			        if(!b){
		        	     $scope.screens.push({phaNum:"当前档期",schend:"当前档期",phaStartTm:"",phaEndTm:""});
			        }
			        for(var k=0;k<$scope.screens.length;k++){
				        if($scope.screens[k].schend.indexOf("上一档期")
				        		   !=-1){
				        	   b=true;break; 
				     	}
				     }
				     if(!b){
			        	 $scope.screens.push({phaNum:"上一档期",schend:"上一档期",phaStartTm:"",phaEndTm:""});
				     }
				     for(var k=0;k<$scope.screens.length;k++){
					    if($scope.screens[k].schend.indexOf("下一档期")
					        	   !=-1){
					           b=true;break; 
					     	}
					  }
					  if(!b){
				        	 $scope.screens.push({phaNum:"下一档期",schend:"下一档期",phaStartTm:"",phaEndTm:""});
					  }
		        }

		        //默认选中当前档期
		        for(var k=0;k<$scope.screens.length;k++){
		  	        if($scope.screens[k].schend.indexOf("当前档期")!=-1){
		  	        	//清空刷新
		  	        	$scope.phaNum="";
		  		        $scope.phaNum=$scope.screens[k].phaNum;
		  		        $scope.chaxunyong = $scope.screens[k].phaNum;
		  	        }
	            }
				$scope.pageNum = 0; // 第几页
	  			$scope.pageSize = 15; // 每页显示件数
	  			$scope.bAShiftMngList = []; // 结果集
		        $scope.moredata = true; // 上拉加载是否可用
                $scope.attendreport = [];
        });
	//筛选
	$scope.screen = function(){
	  if($scope.flag){
	    $scope.flag = false;
	  }else{
	    $scope.flag = true;
	    // 设定【筛选】的高度
        var height = document.body.clientHeight - 48;
        $scope.shaixuanBoxHeight = height + "px";
	  }
	}
	//筛选查询
	$scope.screenSelect = function(phaNum){
    	// 回到顶部
    	$ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
		//清空刷新列表集合
		$scope.bAShiftMngList=[];
	    $scope.moredata = true;
		$scope.pageNum = 0; // 还原第几页
		$scope.chaxunyong = phaNum;
        $scope.flag = false;
	}
    // 下拉刷新
    $scope.doRefresh = function() {
    	// 回到顶部
//    	$ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
		$scope.pageNum = 0; // 还原第几页
		var scheduleList=[];
		comApi.post('staff/selectbAShiftMng', {
		      pageSize : $scope.pageSize,
		      pageNum : $scope.pageNum + 1, // 下一页
		      params : {
		        phaNum : $scope.phaNum
		      }
		    }, function(data) {
		      var list = [];
		      if(data.list.length>0){
		        blphaStartTm = data.list[0].phaStartTm; 
		        blphaEndTm = data.list[0].phaEndTm; 
		      }
		      for(var i =0;i<data.list.length;i++){
		        if(blphaEndTm==data.list[i].phaEndTm && blphaStartTm==data.list[i].phaStartTm){
		          list[list.length] = data.list[i];
		        }else{
		          scheduleList.push({
		            time : blphaStartTm+"~"+blphaEndTm,
		            list : list
		          });
		          blphaStartTm = data.list[i].phaStartTm; 
		          blphaEndTm = data.list[i].phaEndTm; 
		          list = [];
		          list[list.length] = data.list[i];
		        }
		      }
		      if(data.list.length>0){
		        scheduleList.push({
		          time : blphaStartTm+"~"+blphaEndTm,
		          list : list
		        });
		      }
		      $scope.bAShiftMngList = scheduleList; // 拼接结果集
		      $scope.moredata = data.hasNextPage;
		      $scope.pageNum = data.pageNum;
		      $scope.$broadcast("scroll.refreshComplete");
		    });
   };
   // 上拉加载
   $scope.loadMore = function() {
	   var scheduleList=[];
	    $scope.phaNum = $scope.chaxunyong;
	    comApi.post('staff/selectbAShiftMng', {
	      pageSize : $scope.pageSize,
	      pageNum : $scope.pageNum + 1, // 下一页
	      params : {
	        phaNum : $scope.phaNum
	      }
	    }, function(data) {
	      var list = [];
	      if(data.list.length>0){
	        blphaStartTm = data.list[0].phaStartTm; 
	        blphaEndTm = data.list[0].phaEndTm; 
	      }
	      for(var i =0;i<data.list.length;i++){
	        if(blphaEndTm==data.list[i].phaEndTm && blphaStartTm==data.list[i].phaStartTm){
	          list[list.length] = data.list[i];
	        }else{
	          scheduleList.push({
	            time : blphaStartTm+"~"+blphaEndTm,
	            list : list
	          });
	          blphaStartTm = data.list[i].phaStartTm; 
	          blphaEndTm = data.list[i].phaEndTm; 
	          list = [];
	          list[list.length] = data.list[i];
	        }
	      }
	      if(data.list.length>0){
	        scheduleList.push({
	          time : blphaStartTm+"~"+blphaEndTm,
	          list : list
	        });
	      }
	      data.list = scheduleList;
	      Array.prototype.push.apply($scope.bAShiftMngList, data.list); // 拼接结果集
	      $scope.moredata = data.hasNextPage;
	      $scope.pageNum = data.pageNum;
	      $scope.$broadcast("scroll.infiniteScrollComplete");
	    });
  };
})