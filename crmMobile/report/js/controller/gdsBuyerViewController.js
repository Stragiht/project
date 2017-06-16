/**
 * Created by 王健 on 2016-4-25.
 * 商品购买者画面
 */
app.controller('gdsBuyerViewController', function ($scope, comApi, $stateParams) {
   
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	// 初始化方法
	$scope.init = function(){
		// 设定检索条件
	    $scope.cond = {
	        stfNum : $stateParams.stfNum,
	        saleDate : $stateParams.saleDate,
	        strNum : $stateParams.strNum,
	        gdsSpecDtlNum : $stateParams.gdsSpecDtlNum
        }
	    $scope.pageFlg = $stateParams.pageFlg;
	    // 列表的前画面判断用FLG（0：销售概况页面；1：销售数据页面）
        $scope.prePageFlg = $stateParams.prePageFlg;
        // 取得用户提交的报表数据
        comApi.post("saleData/selectMobileGoodsBoughtDetail", $scope.cond, function(data) {
            $scope.boughtDetailList = data;
        });
	}
	
	// 调用页面初始化
	$scope.init();
});