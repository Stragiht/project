/**
 * Created by 朱艳春 on 2016-4-22.
 * BA借调一览
 */
app.controller('stfTempTransSelectController', ['$scope', '$http', '$location','$sessionStorage','$ionicPopup','$stateParams','comApi',function ($scope, $http, $location,$sessionStorage,$ionicPopup,$stateParams,comApi) {
    
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	$scope.pageNum = 0; // 第几页
    $scope.pageSize = 15; // 每页显示件数
    $scope.moredata = true; // 上拉加载是否可用
    $scope.stfList = [];
	$scope.doRefresh=function(){
	  $scope.pageNum = 0;
      comApi.post( 'StfTempTrans/stfTempTransMobileSelect',
          {
           pageSize : $scope.pageSize,
           pageNum : $scope.pageNum + 1// 下一页
          },
          function(data){
            $scope.stfList = data.list;
            $scope.moredata = data.hasNextPage;
            $scope.pageNum = data.pageNum;
            $scope.$broadcast("scroll.refreshComplete");
      });
    };
	   // 上拉加载
	  $scope.loadMore = function() {
	    comApi.post('StfTempTrans/stfTempTransMobileSelect', {
	      pageSize : $scope.pageSize,
          pageNum : $scope.pageNum + 1// 下一页
	    }, function(data) {
	      Array.prototype.push.apply($scope.stfList, data.list); // 拼接结果集
	      $scope.moredata = data.hasNextPage;
	      $scope.pageNum = data.pageNum;

	      $scope.$broadcast("scroll.infiniteScrollComplete");
	    });
	  };
}]);