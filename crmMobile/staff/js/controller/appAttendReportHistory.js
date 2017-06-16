/**
 * 请假管理
 */
app.controller('appAttendReportHistoryController', function ($ionicScrollDelegate,$http,$scope, $sessionStorage, $ionicPopup,$state, comApi) {
    
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	$scope.moredata = false; // 上拉加载是否可用
	$scope.dqsjxs = [];
    // 初始化
    $scope.init = function () {
        $scope.filterPage = false;
        $scope.sx = {selectedDate: 0};
        $scope.pageNum = 0; // 第几页
        $scope.pageSize = 15; // 每页显示件数
        $scope.dqsjxs = [];

        //查询筛选用档期.
        comApi.get("staff/selectSchedule",function(data) {
            $scope.screens = [];
              if(data.length == 0){
                  $scope.screens = [];
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
              //如果没有数据
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
      //          //如果档期数据不全则补全数据
                  for(var k=0;k<$scope.screens.length;k++){
                     if($scope.screens[k].schend.indexOf("当前档期") !=-1){
                             b=true;break; 
                     }
                  }
                  if(!b){
                       $scope.screens.push({phaNum:"当前档期",schend:"当前档期",phaStartTm:"",phaEndTm:""});
                  }
                  for(var k=0;k<$scope.screens.length;k++){
                      if($scope.screens[k].schend.indexOf("上一档期") !=-1){
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
              $scope.moredata = true; // 上拉加载是否可用
              $scope.attendreport = [];
          })
    };
    // 查询
    $scope.selectLeaveAppl = function (phaoid) {
        $scope.chaxunyong = phaoid;
        // 查询列表数据
        $scope.attendreport = [];
        $scope.dqsjxs = [];
        $scope.moredata = true;
        $scope.filterPage = false;
        $scope.pageNum = 0;
        // 回到顶部
        $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
    };
    // 执行初始化方法
    $scope.init();
    // 下拉刷新
    $scope.doRefresh = function() {
      
      $scope.pageNum = 0;
      phaoid = $scope.chaxunyong;
      comApi.post('GenAttendReport/searchGenAttendReportHistoryMobile', {
        pageSize : $scope.pageSize,
        pageNum : $scope.pageNum + 1,
        params : {
          phaNm: phaoid,
          stfNm: ""
        }
      }, function(data) {
        $scope.dqsjxs = [];
        if (data.list.length > 0) {
          $scope.dqsjxs.push({dqsjxs:data.list[0].dqsjxs});
          for(var i = 0;i < data.list.length;i++){
            if(data.list[i].dqsjxs != $scope.dqsjxs[$scope.dqsjxs.length-1].dqsjxs){
              $scope.dqsjxs.push({dqsjxs:data.list[i].dqsjxs});
            }
          }
        }else{
          for(var i = 0; i < $scope.screens.length; i++){
            if($scope.screens[i].phaNum == $scope.chaxunyong){
              $scope.dqsjxs.push({dqsjxs:$scope.screens[i].phaStartTm +"~"+ $scope.screens[i].phaEndTm});
            }
          }
        }
        $scope.attendreport = data.list;
        $scope.moredata = data.hasNextPage;
        $scope.pageNum = data.pageNum;

        $scope.$broadcast("scroll.refreshComplete");
        
      });
    };

    // 上拉加载
    $scope.loadMore = function() {
      phaoid = $scope.chaxunyong;
      comApi.post('GenAttendReport/searchGenAttendReportHistoryMobile', {
        pageSize : $scope.pageSize,
        pageNum : $scope.pageNum + 1,
        params : {
          phaNm: phaoid,
          stfNm: ""
        }
      }, function(data) {
        if (data.list.length > 0) {
          if($scope.attendreport.length == 0){
            $scope.dqsjxs.push({dqsjxs:data.list[0].dqsjxs});
          }
          for(var i = 0;i < data.list.length;i++){
            if(data.list[i].dqsjxs != $scope.dqsjxs[$scope.dqsjxs.length-1].dqsjxs){
              $scope.dqsjxs.push({dqsjxs:data.list[i].dqsjxs});
            }
          }
        }else{
          for(var i = 0; i < $scope.screens.length; i++){
            if($scope.screens[i].phaNum == $scope.chaxunyong){
              $scope.dqsjxs.push({dqsjxs:$scope.screens[i].phaStartTm +"~"+ $scope.screens[i].phaEndTm});
            }
          }
        }
        Array.prototype.push.apply($scope.attendreport, data.list);
        $scope.moredata = data.hasNextPage;
        $scope.pageNum = data.pageNum;
        $scope.$broadcast("scroll.infiniteScrollComplete");
      });
    };
    //切换筛选状态
    $scope.showFilter = function () {
      if($scope.filterPage){
        $scope.filterPage = false;
      }else{
        $scope.filterPage = true;
        // 设定【筛选】的高度
        var height = document.body.clientHeight - 48;
        $scope.shaixuanBoxHeight = height + "px";
      }
    }
});