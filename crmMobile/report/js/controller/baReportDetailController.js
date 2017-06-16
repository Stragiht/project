/**
 * Created by 王健 on 2016-4-22.
 * 提交报表详情画面
 */
app.controller('baReportDetailController', function ($scope, comApi, $stateParams, $state) {
    
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	// 初始化方法
	$scope.init = function(){
		// 设定检索条件
	    $scope.cond = {
	        stfNum : $stateParams.stfNum,
	        saleDate : $stateParams.saleDate,
	        strNum : $stateParams.strNum
        }
	    $scope.pageFlg = $stateParams.pageFlg;
	    // 列表的前画面判断用FLG（0：销售概况页面；1：销售数据页面）
        $scope.prePageFlg = $stateParams.prePageFlg;
        // 取得用户提交的报表数据
	    comApi.post("saleData/selectMobileBaReportInfo", $scope.cond, function(data) {
            $scope.baReportInfo = data.baReportInfo;
            $scope.goodsDetail = data.goodsDetail;
            $scope.editShow = data.editShow;
	    });
	}
	
	// 调用页面初始化
	$scope.init();
	
	// 返回方法
    $scope.back = function(){
        if ($scope.pageFlg == "0") {
            // 返回【提交报表列表】画面
            $state.go("baReportList");
        } else {
            // 返回【日常销售报表明细】画面
            $state.go("dailyReportList", {prePageFlg : $scope.prePageFlg});
        }
    }
    
    // 跳转到【商品购买者】页面
    $scope.gotoGdsBuyerView = function(stfNum, saleDate, strNum, gdsSpecDtlNum) {
        $state.go("gdsBuyerView", {
          stfNum : stfNum,
          saleDate : saleDate,
          strNum : strNum,
          gdsSpecDtlNum : gdsSpecDtlNum,
          pageFlg : $scope.pageFlg,
          prePageFlg : $scope.prePageFlg});
    };
});