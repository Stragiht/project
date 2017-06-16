
app.controller('membRevisitTskCtrl', function ($scope, $http, $location, $sessionStorage, $ionicPopup, $window, $ionicScrollDelegate, comApi, $rootScope, $filter, ionicDatePicker, $state) {

	//控制底部菜单栏的显示
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu);

	//BA回访任务列表
	//membRevisitTsk/selectMembRevisitTskList4App
	//BA回访任务的参数
	$scope.membRevTsk = {
		"pageNum": $rootScope.PAGE_NUM,
		"pageSize": $rootScope.PAGE_SIZE,
		"params": {
			"endTime": "",
			"rtnStat": "",
			"startTime": ""
			//"stfNum": ""
		}
	};

	/*comApi.post('membRevisitTsk/selectMembRevisitTskList4App',$scope.membRevTsk,function(data){
		comApi.myConsoleLog("==回访任务列表数据====",data.data, "====");
		$scope.membRevTskList = angular.copy(data.data);
		$sessionStorage.membRevTskSto = angular.copy(data.data);
	});
*/

	//会员信息列表 comApi  /membBas/selectMembBas4App
	$scope.selectMembRevisitTsk = function (flg, loadFlg) {

		$scope.dataShow = false;

		comApi.post('membRevisitTsk/selectMembRevisitTskList4App',$scope.membRevTsk,function(data){

			comApi.myConsoleLog("==回访任务列表数据====",data, "====");

			if (comApi.isNotNullAndUndefined(data.data)) {
				if (data.currnetPage < data.totalPage) {
					$scope.hasNextPage = true;
				} else {
					$scope.hasNextPage = false;
				}

				if (flg == 1) {
					$scope.membRevTskList = angular.copy(data.data);
				} else if (flg == 2) {

					$scope.membRevTskList = $scope.membRevTskList.concat(data.data);
					//表示上拉结束(隐藏转圈的效果)
					$scope.$broadcast("scroll.infiniteScrollComplete");
				}

				$sessionStorage.membRevTskSto = angular.copy(data.data);

			} else {
				$scope.hasNextPage = false;
				if ($scope.membRevTsk.pageNum == 1) {
					$scope.dataShow = true;
				}

			}

		}, loadFlg);

	};


	//=====================数据刷新===================================
	//下拉更新(初始化数据)  flg = 1表示下拉更新
	$scope.doRefresh=function(){//membRevTsk
		$scope.membRevTsk.pageNum = 1;
		$scope.selectMembRevisitTsk(1, false);
		$scope.$broadcast("scroll.refreshComplete");
	};

	// 上拉加载  flg = 2 标识上拉加载
	$scope.loadMore = function() {
		if ($scope.hasNextPage) {
			$scope.membRevTsk.pageNum = $scope.membRevTsk.pageNum+1;
			$scope.selectMembRevisitTsk(2, true);
			//表示上拉结束(隐藏转圈的效果)
			// $scope.$broadcast("scroll.infiniteScrollComplete");
		} else {
			console.log("已经是最后一页咯");
		}

	};

	//设置toggleStatus的初始值
	$scope.toggleStatus = {
		dateChecked : false,
		staffChecked : false
	};

	//初始化方法
	$scope.init = function() {

		//定义上拉加载的标识，true可以上拉，false不能上拉，数据已经加载完成
		$scope.hasNextPage = true;
		$scope.membRevTskList = [];
		$scope.createPersonnel = angular.copy(comApi.getMySubStfList());
		//初始化时页码为1
		$scope.membRevTsk.pageNum = 1;

		$scope.dataShow = false;

		//快捷字母
		var cheight = document.body.clientHeight;
		$scope.liheight = ((cheight - 92)/27).toFixed(2);
		
		//初始化变量
		var stfNum = $sessionStorage.userId;
		//回访时间
		$scope.titleTime = "应回访时间";
		//回访人员
		$scope.titlePerson = "回访人员";
		//回访状态
		$scope.titleState = "回访状态";


		//是否显示回访时间
		$scope.selectTime = false;
		//是否显示回访人员
		$scope.selectPerson = false;
		//是否显示回访状态
		$scope.selectState = false;

		//var todytody = new Date();

		//初始化回访时间
		$scope.revTime = {
			all: "",
			today : new Date().getTime(),
			inputStartDate: "",
			inputEndDate: "",
			selectedDate : ""
		};

		//初始化回访人员
		$scope.revPerson = {
			all: "",
			mySelf: stfNum,
			selectedPerNum: ""
		};


		//获取回访状态初始化
		$scope.selRtnStats = comApi.dicKeyToValue("C024", 3);
		$scope.revStats = "";
		$scope.selRtnStats[0].key = "";

		comApi.myConsoleLog("根据key查value===", $scope.selRtnStats,"====");

		//初始化加载的数据
		//$scope.membRevTsk.pageNum = $scope.membRevTsk.pageNum+1;
		$scope.selectMembRevisitTsk(2, true);
	};
	
	//调用页面初始化
	$scope.init();

	//定义回退按钮的返回状态
	$scope.backState = true;

	$scope.backHideSelect = function() {

		if ($scope.backState) {

			if ($rootScope.REVTSK_FLG) {

				$state.go("home");

			} else {

				$state.go("membRevisitMenu");
			}


		} else {
			$scope.backState = true;
			$scope.selectState = false;
			$scope.selectPerson = false;
			$scope.selectTime = false;
		}

	};
	
	//点击回访时间
    $scope.timeSelect = function() {

		$scope.backState = !angular.copy($scope.backState);

    	$scope.selectState = false;
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

    	$scope.selectState = false;
    	$scope.selectTime = false;
    	if($scope.selectPerson){
    		$scope.selectPerson = false;
    	}else{
    		$scope.selectPerson = true;
    	}
    };

	//点击回访状态选择按钮
	$scope.stateSelect = function() {

		$scope.backState = !angular.copy($scope.backState);

		$scope.selectPerson = false;
		 $scope.selectTime = false;
		if($scope.selectState){
			$scope.selectState = false;
		}else{
			$scope.selectState = true;
		}
	};
    
	//点击跳转到指定地区标签
    $scope.goToLetter = function(letter) {
    	var scroll = document.getElementById(letter).offsetTop;
    	$ionicScrollDelegate.resize();
    	$ionicScrollDelegate.scrollTo(0,scroll,true);
    };
    
	//点击跳转到顶部
    $scope.goToTop = function() {
    	$ionicScrollDelegate.scrollTop(true);
    };

	//筛选时初始化
	function dataInit(){
		$scope.membRevTsk.pageNum = 1;
		//清空之前的数据
		$scope.membRevTskList = [];
	}


    //点击指定回访时间
    $scope.timeChange = function(start, end, title) {

		if(title != "CUSTOM"){
			$scope.titleTime = title;
			dataInit();
		}

		if (title == "CUSTOM" && $scope.toggleStatus.dateChecked) {
			//$scope.titleTime = "自定义";
			$scope.revTime.selectedDate = null;
			return;
		}  else if (title == "CUSTOM" && !$scope.toggleStatus.dateChecked) {
			dataInit();
			$scope.titleTime = "应回访时间";
			$scope.membRevTsk.params.startTime = "";
			$scope.membRevTsk.params.endTime = "";
			$scope.revTime.selectedDate = "";
			$scope.selectMembRevisitTsk(1, true);
			return;
		} else if (title == "自定义") {
			$scope.revTime.selectedDate = null;
		} else {
			$scope.revTime.inputStartDate = "";
			$scope.revTime.inputEndDate = "";
			$scope.toggleStatus.dateChecked = false;
			$scope.revTime.selectedDate = start;
		}
		$scope.membRevTsk.params.startTime = start;
		$scope.membRevTsk.params.endTime = end;
		//变化标志
		$scope.timeSelect();

		// 回到顶部
		$ionicScrollDelegate.$getByHandle("contentScrollSearch").scrollTop();

		//加载数据
		$scope.selectMembRevisitTsk(1, true);

    };
    
    //点击指定回访人员
	$scope.personChange = function(perNum,perNm) {

		dataInit();
    	
    	var stfNum = $sessionStorage.userId;

		if(perNum == ""){
			$scope.titlePerson = "回访人员";
			delete $scope.membRevTsk.params["stfNum"];
			comApi.myConsoleLog("请求的参数===", $scope.membRevTsk, "===");
		}else{
			$scope.membRevTsk.params.stfNum = perNum;
			$scope.titlePerson = perNm;
		}

		//$scope.revPerson.selectedPerNum = perNum;

		//初始化首页
		$scope.membRevTsk.pageNum = 1;

		//重置标识
		$scope.personSelect();

		// 回到顶部
		$ionicScrollDelegate.$getByHandle("contentScrollSearch").scrollTop();

		//加载数据
		$scope.selectMembRevisitTsk(1, true);

    };
    
    //点击指定回访状态
    $scope.stateChange = function(rtnNum,rtnNm) {

		dataInit();

		var stfNum = $sessionStorage.userId;

		if(rtnNum == ""){
			$scope.titleState = "回访状态";
		}else{
			$scope.titleState = rtnNm;
		}

		$scope.stateSelect();

		$scope.membRevTsk.params.rtnStat = rtnNum;

		// 回到顶部
		$ionicScrollDelegate.$getByHandle("contentScrollSearch").scrollTop();

		//加载数据
		$scope.selectMembRevisitTsk(1, true);

    };

	$scope.curDate = new Date();
	$scope.openDatePicker = function(flg) {
		ionicDatePicker.openDatePicker({
			//val为一个时间戳
			callback : function(val) {
				$scope.curDate = new Date(val);
				if (flg == 1) {
					$scope.membRevTsk.params.startTime = val;
					$scope.revTime.inputStartDate = $filter("date")(val, "yyyy-MM-dd");
				} else if(flg == 2) {
					$scope.membRevTsk.params.endTime = val;
					$scope.revTime.inputEndDate = $filter("date")(val, "yyyy-MM-dd");
				}
			},
			inputDate:$scope.curDate
		});
	};
});