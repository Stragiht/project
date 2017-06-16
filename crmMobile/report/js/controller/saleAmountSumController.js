/**
 * Created by 王健 on 2016-5-3.
 * 人员销售业绩汇总画面
 */
app.controller('saleAmountSumController', function ($scope, comApi, $sessionStorage, $state, $filter, $ionicScrollDelegate, ionicDatePicker) {
    
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	var selectedStfNum = "";
	var dateChecked = "";
	// 初始化方法
	$scope.init = function(){
        // 设定【人员销售业绩汇总】画面显示
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
        $scope.entryStfNum = $sessionStorage.userId;
        // 取得人员销售业绩汇总画面的初始化数据
        comApi.get("saleData/initMobileSaleAmountSum", function(data) {
            $scope.todayDate = data.todayDate;
            $scope.weekStartDate = data.weekStartDate;
            $scope.weekEndDate = data.weekEndDate;
            $scope.monthStartDate = data.monthStartDate;
            $scope.monthEndDate = data.monthEndDate;
            $scope.posList = data.posList;
            // 设定默认的检索条件
            $scope.cond = {
                stfNum : "0000",
                condStfNm : "",
                posNum : data.posList[0].posNum,
                saleStartDate : $filter("date")(data.todayDate, 'yyyy-MM-dd'),
                saleEndDate : $filter("date")(data.todayDate, 'yyyy-MM-dd')
            }
            $scope.initValue = {
                today : $filter("date")($scope.todayDate, "yyyyMMdd") + $filter("date")($scope.todayDate, "yyyyMMdd"),
                week : $filter("date")($scope.weekStartDate, "yyyyMMdd") + $filter("date")($scope.weekEndDate, "yyyyMMdd"),
                month : $filter("date")($scope.monthStartDate, "yyyyMMdd") + $filter("date")($scope.monthEndDate, "yyyyMMdd"),
                selectedDate : $filter("date")($scope.todayDate, 'yyyyMMdd') + $filter("date")($scope.todayDate, 'yyyyMMdd'),
                selectedStfNum : "0000"
            }
            $scope.posWidth = (87.5 - 3 * Number($scope.posList.length)) / Number($scope.posList.length) + "%";
            // 当前页数
            $scope.pageNum = 0;
            // 每页显示的数据件数
            $scope.pageSize = 15;
            // 上拉加载是否可用
            $scope.moredata = true;
            // 结果集
            $scope.saleAmountSumList = [];
        });
	}
	
	// 调用页面初始化
	$scope.init();
	
    // 检索人员销售业绩汇总画面的数据
	$scope.selectMobileSaleAmountSum = function(cond, isFirstFlg) {
        // 检索人员销售业绩汇总画面的数据
        comApi.post('saleData/selectMobileSaleAmountSum', {
            pageSize : $scope.pageSize,
            pageNum : $scope.pageNum + 1,
            params : cond
        }, function(data) {
            $scope.moredata = data.hasNextPage;
            $scope.pageNum = data.pageNum;
            if (isFirstFlg) {
                $scope.saleAmountSumList = data.list;
                $scope.$broadcast("scroll.refreshComplete");
            } else {
                Array.prototype.push.apply($scope.saleAmountSumList, data.list);
                $scope.$broadcast("scroll.infiniteScrollComplete");
            }
        });
    };
    
    // 点击职位Tab
    $scope.tabClick = function(posNum) {
        $scope.cond.posNum = posNum;
        $scope.pageNum = 0;
        $scope.moredata = true;
        $scope.saleAmountSumList = [];
        // 回到顶部
        $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
    };
    
    // 点击【筛选】里的人员姓名
    $scope.staffClick = function(stfNum) {
        $scope.cond.stfNum = stfNum;
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
        $scope.saleAmountSumList = [];
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
      $scope.cond.stfNum = "";
      $scope.initValue.selectedStfNum = "BTN";
      if ($scope.initValue.selectedDate != "BTN") {
          $scope.toggleStatus.dateChecked = false;
          $scope.inputStartDate = "";
          $scope.inputEndDate = "";
      }
      $scope.cond.condStfNm = stfNm;
      $scope.pageNum = 0;
      $scope.moredata = true;
      $scope.saleAmountSumList = [];
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
        $scope.saleAmountSumList = [];
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
        $scope.saleAmountSumList = [];
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
    
    // 下拉刷新
    $scope.doRefresh = function() {
        $scope.pageNum = 0;
        $scope.moredata = true;
        // 检索人员销售业绩汇总画面的数据
        $scope.selectMobileSaleAmountSum($scope.cond, true);
    }
    
    // 上拉加载
    $scope.loadMore = function() {
        $scope.selectMobileSaleAmountSum($scope.cond, false);
    };
    
    // 显示销售业绩明细
    $scope.showDetail = function(saleAmountSumInfo) {
        // 设定参数
        $sessionStorage.PGREPM0220002 = {
            isToday : $scope.isToday,
            saleStartDate : $scope.cond.saleStartDate,
            saleEndDate : $scope.cond.saleEndDate,
            saleAmountSumInfo : saleAmountSumInfo
        }
        $state.go("saleAmountSumDetail");
    };
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
        	$scope.initValue.selectedDate  = dateChecked;
        	$scope.inputStartDate = "";
            $scope.inputEndDate = "";
        }else{
        	dateChecked = $scope.initValue.selectedDate;
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