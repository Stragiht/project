/**
 * Created by 王健 on 2016-5-3.
 * 汇总详情画面
 */
app.controller('saleAmountSumDetailController', function ($scope, comApi, $sessionStorage, $filter) {
   
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	// 初始化方法
	$scope.init = function(){
        // 取得前画面传过来的人员销售业绩汇总信息
        var param = $sessionStorage.PGREPM0220002;
        // 检索人员销售业绩汇总详情画面的数据
        comApi.get("saleData/selectMobileSaleAmountSumDetail/" + param.saleAmountSumInfo.stfNum, function(data) {
            $scope.saleAmountSumDetail = data;
            if (param.isToday) {
                $scope.saleAmountSumDetail.saleDate = "今天";
            } else {
                $scope.saleAmountSumDetail.saleDate = $filter("date")(param.saleStartDate, 'MM-dd')
                                                          + " ~ " + $filter("date")(param.saleEndDate, 'MM-dd');
            }
            $scope.saleAmountSumDetail.saleAmt = param.saleAmountSumInfo.saleAmt;
            $scope.saleAmountSumDetail.ranking = param.saleAmountSumInfo.ranking;
            $scope.saleAmountSumDetail.stfUnderQty = param.saleAmountSumInfo.stfUnderQty;
            $scope.saleAmountSumDetail.avgAmt = param.saleAmountSumInfo.avgAmt;
        });
	}
	
	// 调用页面初始化
	$scope.init();
});