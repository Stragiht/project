/**
 * Created by 王健 on 2016-4-20.
 * 提交报表列表画面
 */
app.controller('baReportListController', function ($scope, comApi, $state, $ionicScrollDelegate, $rootScope) {
   
	var navMenu = comApi.showFooterMenu("reportShow","3");
	$scope.$emit('navMenu.type', navMenu); 
	
	// 初始化方法
	$scope.init = function(){
	    // 取得审批状态列表
	    comApi.getSelectBoxDic("C034", 2).then(function (data) {
  	        $scope.stateList = data;
    	    // 设定检索条件
  	        $scope.cond = {
  	            state : data[0].key
  	        }
  	        // 当前页数
  	        $scope.pageNum = 0;
  	        // 每页显示的数据件数
  	        $scope.pageSize = 15;
  	        // 上拉加载是否可用
  	        $scope.moredata = true;
  	        // 结果集
  	        $scope.baReportList = [];
	    });
	}
	
	// 调用页面初始化
	$scope.init();
	
    // 点击【提交状态】Tab的处理
    $scope.tabClick = function(flg) {
          $scope.cond.state = flg;
          // 当前页数
          $scope.pageNum = 0;
          // 上拉加载是否可用
          $scope.moredata = true;
          // 结果集
          $scope.baReportList = [];
          // 回到顶部
          $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
    };
    
    function selectMobileBaReportList(cond, isFirstFlg) {
        // 取得用户提交的报表数据
        comApi.post('saleData/selectMobileBaReportList', {
            pageSize : $scope.pageSize,
            pageNum : $scope.pageNum + 1,
            params : cond
        }, function(data) {
            $scope.moredata = data.hasNextPage;
            $scope.pageNum = data.pageNum;
            if (isFirstFlg) {
                $scope.baReportList = data.list;
                $scope.$broadcast("scroll.refreshComplete");
            } else {
                Array.prototype.push.apply($scope.baReportList, data.list);
                $scope.$broadcast("scroll.infiniteScrollComplete");
            }
        });
    }
    
    // 点击【提交报表】的方法
    $scope.gotoSubmit = function(flg) {
        // 验证是否存在没有提交销售报表的门店
        comApi.get("saleData/checkMobileStoresNoData", function(data) {
            $rootScope.SUBMIT_REPORT_FLG = false;
            $state.go("baReportSubmit");
        });
    };
    
    // 下拉刷新
    $scope.doRefresh = function() {
        $scope.pageNum = 0;
        $scope.moredata = true;
        selectMobileBaReportList($scope.cond, true);
    }
    
    // 上拉加载
    $scope.loadMore = function() {
        selectMobileBaReportList($scope.cond, false);
    };
});