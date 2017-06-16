/**
 * Created by 王健 on 2016-5-5.
 * 日常销售报表明细画面
 */
app.controller('dailyReportListController', function ($scope, comApi, $filter, $state, $stateParams, $ionicScrollDelegate, $sessionStorage, ionicDatePicker) {
    
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	var selectedDate = "";
	var selectedStfNum = "";
	// 初始化方法
	$scope.init = function(){
        // 设定【日常销售报表明细】画面显示
        $scope.pageShow = {
            list : true,
            filter : false,
            date : false,
            staff : false
        }
        // 设定初期值
        $scope.isToday = true;
        $scope.toggleStatus = {
            dateChecked : false,
            staffChecked : false
        }
        // 当前页数
        $scope.pageNum = 0;
        // 每页显示的数据件数
        $scope.pageSize = 15;
        // 上拉加载是否可用
        $scope.moredata = true;
        // 结果集
        $scope.dailyReportList = [];
        var today =  $filter("date")(new Date(), 'yyyy-MM-dd');
        $scope.entryStfNum = $sessionStorage.userId;
	    // 设定检索条件
	    $scope.cond = {
	        condStfNum : "0000",
	        condStfNm : ""
	    }
	    if ($stateParams.saleStartDate == undefined || $stateParams.saleStartDate == null || $stateParams.saleStartDate == "") {
	        $scope.cond.saleStartDate = today;
	        $scope.cond.saleEndDate = today;
	    } else {
	        $scope.cond.saleStartDate = $filter("date")($stateParams.saleStartDate, 'yyyy-MM-dd');
	        $scope.cond.saleEndDate = $filter("date")($stateParams.saleEndDate, 'yyyy-MM-dd');
	    }
	    // 前画面判断用FLG（0：销售概况页面；1：销售数据页面）
	    $scope.prePageFlg = $stateParams.prePageFlg;
	    // 取得日常销售报表明细画面的初始数据
        comApi.get("saleData/initMobileDailyReportList", function(data) {
            $scope.todayDate = data.todayDate;
            $scope.weekStartDate = data.weekStartDate;
            $scope.weekEndDate = data.weekEndDate;
            $scope.monthStartDate = data.monthStartDate;
            $scope.monthEndDate = data.monthEndDate;
            $scope.initValue = {
                today : $filter("date")($scope.todayDate, "yyyyMMdd") + $filter("date")($scope.todayDate, "yyyyMMdd"),
                week : $filter("date")($scope.weekStartDate, "yyyyMMdd") + $filter("date")($scope.weekEndDate, "yyyyMMdd"),
                month : $filter("date")($scope.monthStartDate, "yyyyMMdd") + $filter("date")($scope.monthEndDate, "yyyyMMdd"),
                selectedDate : $filter("date")($scope.cond.saleStartDate, 'yyyyMMdd') + $filter("date")($scope.cond.saleEndDate, 'yyyyMMdd'),
                selectedStfNum : "0000"
            }
        });
	}
	
	// 调用页面初始化
	$scope.init();
	
    // 点击【筛选】里的人员姓名
    $scope.staffClick = function(stfNum) {
          $scope.cond.condStfNum = stfNum;
          $scope.initValue.selectedStfNum = stfNum;
          $scope.cond.condStfNm = "";
          $scope.toggleStatus.staffChecked = false;
          if ($scope.initValue.selectedDate != "BTN") {
              $scope.toggleStatus.dateChecked = false;
              $scope.inputStartDate = "";
              $scope.inputEndDate = "";
          }
          $scope.pageNum = 0;
          $scope.moredata = true;
          $scope.dailyReportList = [];
          // 设定【人员销售业绩汇总】画面显示
          $scope.pageShow = {
              list : true,
              filter : false,
              date : false,
              staff : false
          }
          // 回到顶部
          $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
    };
    
    // 点击人员的【确定】按钮
    $scope.btnStaffClick = function(stfNm) {
        // 指定人员姓名为空的时候，提示错误销售
        if (stfNm == undefined || stfNm == null || stfNm == "") {
            // 弹出提示消息
            comApi.showMessage(["error", "指定人员姓名"], "msg.common.10002", 3000);
            return;
        }
        $scope.cond.condStfNum = "";
        $scope.initValue.selectedStfNum = "BTN";
        if ($scope.initValue.selectedDate != "BTN") {
            $scope.toggleStatus.dateChecked = false;
            $scope.inputStartDate = "";
            $scope.inputEndDate = "";
        }
        $scope.cond.condStfNm = stfNm;
        $scope.pageNum = 0;
        $scope.moredata = true;
        $scope.dailyReportList = [];
        // 设定【人员销售业绩汇总】画面显示
        $scope.pageShow = {
            list : true,
            filter : false,
            date : false,
            staff : false
        }
        // 回到顶部
        $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
    };
    
    // 点击【筛选】里的日期
    $scope.dateClick = function(start, end, isToday) {
          $scope.isToday = isToday;
          $scope.cond.saleStartDate = $filter("date")(start, 'yyyy-MM-dd');
          $scope.cond.saleEndDate = $filter("date")(end, 'yyyy-MM-dd');
          $scope.toggleStatus.dateChecked = false;
          $scope.inputStartDate = "";
          $scope.inputEndDate = "";
          $scope.initValue.selectedDate = $filter("date")(start, 'yyyyMMdd') + $filter("date")(end, 'yyyyMMdd');
          if ($scope.initValue.selectedStfNum != "BTN") {
              $scope.toggleStatus.staffChecked = false;
          }
          $scope.pageNum = 0;
          $scope.moredata = true;
          $scope.dailyReportList = [];
          // 设定【人员销售业绩汇总】画面显示
          $scope.pageShow = {
              list : true,
              filter : false,
              date : false,
              staff : false
          }
          // 回到顶部
          $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
    };
    
    // 点击【确定】按钮的处理
    $scope.btnDateClick = function(start, end, isToday) {
        // 销售开始日期为空的时候，提示错误销售
        if (start == undefined || start == null || start == "") {
            // 弹出提示消息
            comApi.showMessage(["error", "销售开始日期"], "msg.common.10002", 3000);
            return;
        }
        // 销售结束日期为空的时候，提示错误销售
        if (end == undefined || end == null || end == "") {
            // 弹出提示消息
            comApi.showMessage(["error", "销售结束日期"], "msg.common.10002", 3000);
            return;
        }
        $scope.isToday = isToday;
        $scope.cond.saleStartDate = $filter("date")(start, 'yyyy-MM-dd');
        $scope.cond.saleEndDate = $filter("date")(end, 'yyyy-MM-dd');
        $scope.initValue.selectedDate = "BTN";
        if ($scope.initValue.selectedStfNum != "BTN") {
            $scope.toggleStatus.staffChecked = false;
        }
        $scope.pageNum = 0;
        $scope.moredata = true;
        $scope.dailyReportList = [];
        // 设定【人员销售业绩汇总】画面显示
        $scope.pageShow = {
            list : true,
            filter : false,
            date : false,
            staff : false
        }
        // 回到顶部
        $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
    };
    
    // 显示【筛选】画面
    $scope.showFilter = function(isDateShow) {
        $scope.pageShow = {
            list : false,
            filter : true,
            date : isDateShow,
            staff : !isDateShow
        }
        // 设定【筛选】的高度
        var height = document.body.clientHeight - 48;
        $scope.shaixuanBoxHeight = height + "px";
    };
    
    // 取消【筛选】
    $scope.cancelFilter = function() {
        $scope.pageShow = {
            list : true,
            filter : false,
            date : false,
            staff : false
        }
    };
    
    // 检索用户提交的报表数据
    function selectMobileDailyReportList(cond, isFirstFlg) {
        // 取得用户提交的报表数据
        comApi.post('saleData/selectMobileDailyReportList', {
            pageSize : $scope.pageSize,
            pageNum : $scope.pageNum + 1,
            params : cond
        }, function(data) {
            $scope.moredata = data.hasNextPage;
            $scope.pageNum = data.pageNum;
            if (isFirstFlg) {
                $scope.dailyReportList = data.list;
                $scope.$broadcast("scroll.refreshComplete");
            } else {
                Array.prototype.push.apply($scope.dailyReportList, data.list);
                $scope.$broadcast("scroll.infiniteScrollComplete");
            }
        });
    }
    
    // 下拉刷新
    $scope.doRefresh = function() {
        $scope.pageNum = 0;
        $scope.moredata = true;
        selectMobileDailyReportList($scope.cond, true);
    }
    
    // 上拉加载
    $scope.loadMore = function() {
        selectMobileDailyReportList($scope.cond, false);
    };
    
    // 返回方法
    $scope.back = function(){
        if ($scope.prePageFlg == "0") {
            // 返回【销售概况】画面
            $state.go("saleSummary");
        } else {
            // 返回【销售数据】画面
            $state.go("saleData");
        }
    }
    // 选择开始日期
    var startFunc = {
        callback : function(val) {
            var date = $filter("date")(val, 'yyyy-MM-dd');
            $scope.inputStartDate = date;
        }
    };
    // 选择结束日期
    var endFunc = {
        callback : function(val) {
            var date = $filter("date")(val, 'yyyy-MM-dd');
            $scope.inputEndDate = date;
        }
    };
    // 选择日期
    $scope.openDatePicker = function(isStart) {
        if (isStart) {
            ionicDatePicker.openDatePicker(startFunc);
        } else {
            ionicDatePicker.openDatePicker(endFunc);
        }
    };
    // 改变开关的状态
    $scope.toggleChanged = function() {
      if (!$scope.toggleStatus.dateChecked) {
    	  $scope.initValue.selectedDate = selectedDate;
          $scope.inputStartDate = "";
          $scope.inputEndDate = "";
      }else{
    	  selectedDate = $scope.initValue.selectedDate;
    	  $scope.initValue.selectedDate = "1";
      }
    };
    //指定人员开关状态改变时触发
    $scope.zhidingrenyuan = function(){
    	if($scope.toggleStatus.staffChecked){
    		selectedStfNum = $scope.initValue.selectedStfNum;
    		$scope.initValue.selectedStfNum = "1";
    	}else{
    		$scope.initValue.selectedStfNum = selectedStfNum;
    	}
    }
});