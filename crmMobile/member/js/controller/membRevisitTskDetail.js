/**
 * 会员回访详情画面
 */
app.controller("membRevisitTskDetailCtrl", function ($scope, $ionicPopover, comApi, $stateParams, $sessionStorage, $state, $rootScope) {

	//控制底部菜单栏的显示
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit("navMenu.type", navMenu);

	//初始化加载的数据
	//回访任务列表  /membRevisitTsk/selectMembRevisitTskList4App
	$scope.curIndex = $stateParams.curMembIndex;
	$scope.membRevTskDeatil = $sessionStorage.membRevTskSto[$scope.curIndex];
	comApi.myConsoleLog("当前回访列表===",$scope.membRevTskDeatil,"===");

	//页面数据出事化
	$scope.initMembRevTskDtl = function() {

		//清空
		$sessionStorage.membRevTskIndex = "";

		//根据membNum、stfNum查询回访指导  /membRevisitTsk/selectMembRevisitFbkList
		$scope.membRevFbk = {
			"membNum": $scope.membRevTskDeatil.membNum,
			"rtnTm": $scope.membRevTskDeatil.rtnTm,
			"stfNum": $scope.membRevTskDeatil.stfNum
		};

		comApi.post("membRevisitTsk/selectMembRevisitFbkList", $scope.membRevFbk, function(data){
			comApi.myConsoleLog("回访指导列表===",data, "====");
			$scope.membRevFbkList = angular.copy(data);
			//保存数据
			$sessionStorage.membRevFbkListSto = angular.copy(data);
		});

		comApi.post("/membRevisitTsk/selectMembRevisitTskDtlList", $scope.membRevFbk, function(data){
			comApi.myConsoleLog("相关商品===",data, "====");
			$scope.membRevTskDtlList = angular.copy(data);
			//保存数据
			$sessionStorage.membRevTskDtlListSto = angular.copy(data);
		});

	};

	$scope.initMembRevTskDtl();

	$ionicPopover.fromTemplateUrl("ez-popover.html", {
		scope: $scope
	})
		.then(function(popover){
			$scope.popover = popover;
		})
	$scope.openPopover = function($event) {
		$scope.popover.show($event);
	};
	$scope.closePopover = function() {
		$scope.popover.hide();
	};
	//销毁事件回调处理：清理popover对象
	$scope.$on("$destroy", function() {
		$scope.popover.remove();
	});
	// 隐藏事件回调处理
	$scope.$on("popover.hidden", function() {
		// Execute action
	});
	//删除事件回调处理
	$scope.$on("popover.removed", function() {
		// Execute action
	});

	//拨打电话
	$scope.callPhone = function(){
		var data = '{"phone" : ' + $scope.membRevTskDeatil.phone + '}';
		window.bdk.callNumber(data);
	};

	//调用微信
	$scope.callWx = function() {
		window.bdk.openWeChat();
	};

	//回访指导membRevisitFbk({curMembIndex:curIndex})
	$scope.searchMemRevFbk = function() {
		$scope.closePopover();
		$state.go("membRevisitFbk", {
			curMembIndex : $scope.curIndex
		});
	};

	//回访记录
	$scope.searchRevRec = function() {
		comApi.get('membRevisitRec/selectMembRevisitRecByTskId/'+$scope.membRevTskDeatil.tskId, function(data) {

			if (data == null || data == "") {
				comApi.showErrorMessage("msg.member.10016");
			} else {

				//状态
				$rootScope.REVRECDET_FLG = false;

				$scope.closePopover();

				//存储查询数据的下标
				$sessionStorage.membRevTskIndex = angular.copy($scope.curIndex);

				$state.go("membRevisitRecDetail", {
					curMembOid : data
				});
			}
		})
	};
});