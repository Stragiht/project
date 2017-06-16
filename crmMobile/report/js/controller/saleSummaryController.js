/**
 * Created by 王健 on 2016-4-20.
 * 销售概况画面
 */
app.controller('saleSummaryController', function ($scope, comApi, $state) {
	
	var navMenu = comApi.showFooterMenu("reportShow","1");
	$scope.$emit('navMenu.type', navMenu); 
	
    // 初始化方法
	$scope.init = function(){
		
		// 取得销售概况
        comApi.get("saleData/selectMobileSaleSummary", function(data) {
            $scope.saleSummary = data;
        });
		
        $scope.isBaShow = true;
	}
	
	// 调用页面初始化
	$scope.init();
	
    // TAB切换
    $scope.tabClick = function(isBaShow) {
        $scope.isBaShow = isBaShow;
    };
    
    // 跳转到【日常销售报表明细】页面
    $scope.gotoDailyReportList = function(startDate, endDate) {
        $state.go("dailyReportList", {saleStartDate : startDate, saleEndDate : endDate, prePageFlg : '0'});
    };
});