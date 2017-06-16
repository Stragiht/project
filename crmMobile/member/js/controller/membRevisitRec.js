
app.controller("membRevisitRecCtrl", function ($rootScope, $scope, $http, $location, $sessionStorage, $ionicPopup, $window, $ionicScrollDelegate, comApi, ionicDatePicker, $filter, $state) {

	//控制底部菜单栏的显示
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit("navMenu.type", navMenu);

	//BA回访/membRevisitRec/selectMembRevisitRecList4App
	$scope.membRevRec = {
		"pageNum": $rootScope.PAGE_NUM,
		"pageSize": $rootScope.PAGE_SIZE,
		"params": {
			"revisitEndTime": "",
			"revisitStartTime": ""
			//"stfNum":"BA0001"
		}
	};

	$scope.selectMembRevisitRec = function(flg, loadFlg){
		$scope.dataShow = false;
		comApi.post("membRevisitRec/selectMembRevisitRecList4App", $scope.membRevRec, function(data){
			comApi.myConsoleLog("BA回访记录====", data,"===");

			if (comApi.isNotNullAndUndefined(data.data)) {

				if (data.currnetPage < data.totalPage) {
					$scope.hasNextPage = true;
				} else {
					$scope.hasNextPage = false;
				}

				if (flg ==1 ) {
					$scope.membRevRecList = angular.copy(data.data);
				} else if (flg == 2) {

					$scope.membRevRecList = $scope.membRevRecList.concat(data.data);
					//表示上拉结束(隐藏转圈的效果)
					$scope.$broadcast("scroll.infiniteScrollComplete");
				}

			} else {
				$scope.hasNextPage = false;

				if ($scope.membRevRec.pageNum == 1) {
					$scope.dataShow = true;
				}
			}

		}, loadFlg);
	};

	//===================数据刷新============================
	//下拉更新(初始化数据)  flg = 1表示下拉更新
	$scope.doRefresh=function(){
		//$scope.dataShow = false;
		//$scope.hasNextPage = true;
		$scope.membRevRec.pageNum = 1;
		$scope.selectMembRevisitRec(1, false);
		$scope.$broadcast("scroll.refreshComplete");
	};

	// 上拉加载  flg = 2 标识上拉加载
	$scope.loadMore = function() {
		if ($scope.hasNextPage) {
			$scope.membRevRec.pageNum = $scope.membRevRec.pageNum+1;
			$scope.selectMembRevisitRec(2, true);
			//表示上拉结束(隐藏转圈的效果)
			// $scope.$broadcast("scroll.infiniteScrollComplete");
		} else {
			console.log("已经是最后一页咯");
		}

	};
	//==================================


	//设置toggleStatus的初始值
	$scope.toggleStatus = {
		dateChecked : false,
		staffChecked : false
	};

	//初始化方法
	$scope.init = function(){

		//定义上拉加载的标识，true可以上拉，false不能上拉，数据已经加载完成
		$scope.hasNextPage = true;
		$scope.membRevRecList = [];
		$scope.createPersonnel = angular.copy(comApi.getMySubStfList());
		//页面一上来加载loadMore
		$scope.membRevRec.pageNum = 1;

		$scope.dataShow = false;


		//快捷字母
		var cheight = document.body.clientHeight;
		$scope.liheight = ((cheight - 92)/27).toFixed(2);

		//初始化变量
		var stfNum = $sessionStorage.userId;
		//回访时间
		$scope.titleTime = "实际回访时间";
		//回访人员
		$scope.titlePerson = "回访人员";

		//是否回访时间
		$scope.selectTime = false;
		//是否回访人员
		$scope.selectPerson = false;

		//上次的自定义时间状态
		//$scope.previousState = null;

		//var todytody = new Date();

		//初始化回访时间
		$scope.revTime = {
			all: "",
			today : new Date().getTime(),
			selectedDate : ""
		};

		//初始化回访人员
		$scope.revPerson = {
			all:"",
			mySelf:stfNum,
			selectedPerNum:""
		};

		//初始化回访状态
		$scope.search = {
			rgnNum : "000000",
			strNum  : "000000",
			posNum : ""
		};

		$scope.selectMembRevisitRec(2, true);

	};

	//调用页面初始化
	$scope.init();

	//定义回退按钮的返回状态
	$scope.backState = true;


	$scope.backHideSelect = function() {

		if ($scope.backState) {

			if ($rootScope.REVREC_FLG) {

				$state.go('home');

			} else {

				$state.go("membRevisitMenu");
			}


		} else {
			$scope.backState = true;
			$scope.selectPerson = false;
			$scope.selectTime = false;
			/*if ($scope.previousState != null) {
				$scope.revTime.selectedDate = angular.copy($scope.previousState);
				$scope.toggleStatus.dateChecked = false;
			}*/
		}

	};


	//点击回访时间
	$scope.timeSelect = function() {

		$scope.backState = !angular.copy($scope.backState);

		$scope.selectPerson = false;
		if ($scope.selectTime){
			$scope.selectTime = false;
		}else{
			$scope.selectTime = true;
		}
	};

	//点击回访人员选择按钮
	$scope.personSelect = function() {

		$scope.backState = !angular.copy($scope.backState);

		$scope.selectTime = false;
		if($scope.selectPerson){
			$scope.selectPerson = false;
		}else{
			$scope.selectPerson = true;
		}
	};

	function dataInit() {
		$scope.membRevRec.pageNum = 1;
		//清空之前的数据
		$scope.membRevRecList = [];
	}

	//点击指定回访时间
	$scope.timeChange = function(start, end, title) {

		var stfNum = $sessionStorage.userId;

		if(title != 'CUSTOM'){
			$scope.titleTime = title;
			//$scope.previousState = null;
			dataInit();
		}

		if (title == 'CUSTOM' && $scope.toggleStatus.dateChecked) {
			//$scope.titleTime = "自定义";
			//$scope.previousState = angular.copy($scope.revTime.selectedDate);
			$scope.revTime.selectedDate = null;
			return;
		} else if (title == 'CUSTOM' && !$scope.toggleStatus.dateChecked) {
			dataInit();
			$scope.titleTime = "实际回访时间";
			$scope.membRevRec.params.revisitStartTime = "";
			$scope.membRevRec.params.revisitEndTime = "";
			$scope.revTime.selectedDate = "";
			$scope.selectMembRevisitRec(1, true);
			return;
		} else if (title == "自定义") {
			$scope.revTime.selectedDate = null;
		} else {
			$scope.revTime.inputStartDate = "";
			$scope.revTime.inputEndDate = "";
			$scope.toggleStatus.dateChecked = false;
			$scope.revTime.selectedDate = start;
		}

		$scope.membRevRec.params.revisitStartTime = start;
		$scope.membRevRec.params.revisitEndTime = end;

		$scope.timeSelect();

		// 回到顶部
		$ionicScrollDelegate.$getByHandle('contentScrollSearch').scrollTop();

		$scope.selectMembRevisitRec(1, true);

		//设定查询条件
		/*var searchParam = {
		 stfNum  : stfNum,
		 rgnNum : rgnNum,
		 posNum : $scope.search.posNum
		 }
		 */

	};

	//点击指定回访人员
	$scope.personChange = function(perNum,perNm) {

		dataInit();

		var stfNum = $sessionStorage.userId;

		if(perNum == ''){
			delete $scope.membRevRec.params["stfNum"];
			$scope.titlePerson = "回访人员";
		}else{
			$scope.membRevRec.params.stfNum = perNum;
			$scope.titlePerson = perNm;
		}

		$scope.revPerson.selectedPerNum = perNum;

		$scope.personSelect();

		// 回到顶部
		$ionicScrollDelegate.$getByHandle("contentScrollSearch").scrollTop();

		$scope.selectMembRevisitRec(1, true);

		//设定查询条件
		/*var searchParam = {
		 stfNum  : stfNum,
		 rgnNum : $scope.search.rgnNum,
		 strNum : strNum,
		 posNum : $scope.search.posNum
		 }
		 */
	};

	$scope.curDate = new Date();
	$scope.openDatePicker = function(flg) {
		ionicDatePicker.openDatePicker({
			//val为一个时间戳
			callback : function(val) {
				$scope.curDate = new Date(val);
				if (flg == 1) {
					$scope.membRevRec.params.startTime = val;
					$scope.revTime.inputStartDate = $filter("date")(val, "yyyy-MM-dd");
				} else if(flg == 2) {
					$scope.membRevRec.params.endTime = val;
					$scope.revTime.inputEndDate = $filter("date")(val, "yyyy-MM-dd");
				}
			},
			inputDate:$scope.curDate
		});
	};

	$scope.searchsearchMembRevRecDet = function(oid) {

		//状态
		$rootScope.REVRECDET_FLG = true;

		$state.go("membRevisitRecDetail", {
			curMembOid : oid
		});
	};

});