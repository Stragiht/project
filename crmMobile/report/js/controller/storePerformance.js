/**
 * Created by JiaZhaoYang on 2016-4-21.
 * 人员信息详情画面
 */
app.controller('storePerformanceCtrl', ['$scope', '$http', '$location','$sessionStorage','$ionicPopup','$stateParams','comApi',function ($scope, $http, $location,$sessionStorage,$ionicPopup,$stateParams,comApi) {
   
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	$scope.pageNum = 0; // 第几页
    $scope.pageSize = 15; // 每页显示件数
    $scope.moredata = true; // 上拉加载是否可用
    $scope.list={};  
    $scope.list.stfNm = $stateParams.stfNm;
    $scope.stfList=[];
    $scope.list.repApplNum = $stateParams.repApplNum;
	// 上拉加载
    $scope.loadMore = function() {
      comApi.post('repAppl/selectThisShopMobileList', {
        pageSize : $scope.pageSize,
        pageNum : $scope.pageNum + 1, // 下一页
        params : {
          stfNum : $stateParams.apprStfNum,
          strNum : $stateParams.strNum,
          repApprStartDt : $stateParams.repApprStartDt,
          repApprEndDt : $stateParams.repApprEndDt
        }
      }, function(data) {
        if(data.data.length > 0){
          Array.prototype.push.apply($scope.stfList, data.data); // 拼接结果集
          $scope.moredata = data.currnetPage < data.totalPage;
          $scope.pageNum = data.pageNum;
        }else{
          $scope.moredata = false; // 上拉加载是否可用
          $scope.stfList=[];
        }
        $scope.$broadcast("scroll.infiniteScrollComplete");
      });
    }
}]);