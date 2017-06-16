/**
 * BA晋升督导流程
 */
app.controller('persActSelectController', function($scope, $sessionStorage, $ionicPopup,
    $state, comApi,$ionicScrollDelegate) {
  
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	$scope.apprStatCnd = "0000";
  $scope.pageNum = 0; // 第几页
  $scope.pageSize = 15; // 每页显示件数
  $scope.moredata = true; // 上拉加载是否可用
  $scope.persActList = []; // 结果集
  // 初始化
  $scope.init = function() {
    // 取得审批状态列表
    comApi.getSelectBoxDic("C018", 2).then(function (data) {
      $scope.apprRsltList = data;
      $scope.apprStatCnd = data[0].key;
    });
  }
  // 查询
  $scope.selectPersAct = function(apprStat) {
    // 保存查询时的审批状态
    $scope.apprStatCnd = apprStat;
    $scope.pageNum = 0;
    $scope.moredata = true;
    $scope.persActList = [];
    // 回到顶部
    $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
    
  }
  // 执行初始化方法
  $scope.init();
  // 上拉刷新
  $scope.doRefresh = function() {
    $scope.pageNum = 0; // 还原第几页
    comApi.post('BaPromote/selectPersActMobile', {
      pageSize : $scope.pageSize,
      pageNum : $scope.pageNum + 1, // 下一页
      params : {
        apprStat : $scope.apprStatCnd
      }
    }, function(data) {
      $scope.persActList = data.list;
      $scope.moredata = data.hasNextPage;
      $scope.pageNum = data.pageNum;

      $scope.$broadcast("scroll.refreshComplete");
    });
  };
//上拉加载
  $scope.loadMore = function() {
    comApi.post('BaPromote/selectPersActMobile', {
      pageSize : $scope.pageSize,
      pageNum : $scope.pageNum + 1, // 下一页
      params : {
        apprStat : $scope.apprStatCnd
      }
    }, function(data) {
      Array.prototype.push.apply($scope.persActList, data.list); // 拼接结果集
      $scope.moredata = data.hasNextPage;
      $scope.pageNum = data.pageNum;

      $scope.$broadcast("scroll.infiniteScrollComplete");
    });
  };
});