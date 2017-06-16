/**
 * 分配督导销售业绩頁面的Controller 
 * helt 2016-5-9 
 * 引入的  $scope NgTableParams comApi toaster $timeout $filter
 */

app.controller("disSupSalePerfSelect", function ($scope, $http, NgTableParams, $location, comApi, $stateParams, $localStorage, $filter) {

	// 用于显示查询数据失败
	$scope.msgShowInfo = true;
	// 初始化tabke数据 
	$scope.dataTempSize = 0;
	
	// 查询 手风琴 默认打开
	$scope.status = { open : true };
	$scope.updateData = [];
	$scope.updateDataInfo = {};

	
	var self = this;
	self.checkboxes = {
		checked : false,
		items : {}
	};
	
	init()
	
	// 设置了一个用于存放个人创建变量用的对象
	$scope.myPara = {
			select:{
				// 起始时间
				phaStartTm1:null,
				// 结束时间
				phaEndTm1:null
			}
	};
	
	// 点击查询
	$scope.selectBaSaleReportDtl = function(){
		// 初始化格式化起始时间
		$scope.pointFormatPhaStartTm1 = "";
		// 初始化格式化终止时间
		$scope.pointFormatPhaEndTm11 = "";
		// 格式化时间 -- 起始
		$scope.pointFormatPhaStartTm1 = $filter('date')($scope.myPara.select.phaStartTm1,'MM-dd');
		// 格式化时间 -- 终止
		$scope.pointFormatPhaEndTm11 = $filter('date')($scope.myPara.select.phaEndTm1,'MM-dd');
		
		// 格式化时间 -- 起始 -- YYYY-MM-DD
		$scope.pointFormatPhaStartRealTm1 = $filter('date')($scope.myPara.select.phaStartTm1,'yyyy-MM-dd');
		// 格式化时间 -- 终止 -- YYYY-MM-DD
		$scope.pointFormatPhaEndRealTm11 = $filter('date')($scope.myPara.select.phaEndTm1,'yyyy-MM-dd');

		// 用于存放向后台传递数据的对象
		$scope.tempDate = {};
		// 起始时间
		$scope.tempDate.fromTime = $scope.myPara.select.phaStartTm1.getTime();
		// 终止时间
		$scope.tempDate.toTime = $scope.myPara.select.phaEndTm1.getTime();
		
		// 这个带.的时间放在url上估计需要转译。
    	
        comApi.post("report/disSupSalePerf/disSupSalePerfSelect" , $scope.tempDate ,function(data){
        	// 向date中加入一列 pageSelectTime 用于存放page上选择的 pageSelectDate
        	// 获取 date 长度
        	$scope.dataTempSize = data.length;
        	if($scope.dataTempSize == 0 || $scope.dataTempSize == "" || $scope.dataTempSize == undefined){
        		$scope.msgShowInfo = true;
        	}else{
        		$scope.msgShowInfo = false;
        	}
        	
        	for(var i = 0; i < $scope.dataTempSize; i++){
        		data[i].pageSelectTime = $scope.pointFormatPhaStartTm1 + " ~ " + $scope.pointFormatPhaEndTm11; 
        	}
        	
        	
			angular.element(".select-all").prop("indeterminate",false);
			angular.forEach($scope.list,
				function(item) {
					// $scope.list的一个key值注意這個value值是唯一的
					self.checkboxes.items[item.stfNum] = false;
				});
			
		    // 綁定一個數據集方便下面全選的 調用
		    $scope.list = data;
			
			self.tableParams = new NgTableParams(
                    {
						// 显示第几页
                        page: 1,
						// 每页显示条数
                        count: 15
                    },
                    {
                        dataset:data,
						// 可选的每页显示条数
                        counts: [15, 50, 100, 200]
                    })
        })
	}
	
	
    // 生成ng-table
    $scope.tableParamsGet = function () {
    	
    	
        comApi.post("report/disSupSalePerf/disSupSalePerfSelect" , $scope.myPara.select ,function(data){
			angular.element(".select-all").prop("indeterminate",false);
			angular.forEach($scope.list,
				function(item) {
					// $scope.list的一个key值注意這個value值是唯一的
					self.checkboxes.items[item.stfNum] = false;
				});
			
		    // 綁定一個數據集方便下面全選的 調用
		    $scope.list = data;
		    
//        	if(data.length == 0 || data.length == "" || data.length == undefined){
//        		$scope.msgShowInfo == true;
//        	}else{
//        		$scope.msgShowInfo == false;
//        	}
        	
			self.tableParams = new NgTableParams(
                    {
						// 显示第几页
                        page: 1,
						// 每页显示条数
                        count: 15
                    },
                    {
                        dataset:data,
						// 可选的每页显示条数
                        counts: [15, 50, 100, 200]
                    })
        })
    };
	
    // 查看最后一次生成结果
    $scope.tableParamsGetLast = function () {
        comApi.post("staff/prmnDemnMng/prmnDemnMngLastSelect" , '' ,function(data){
        	// 获取 date 长度
        	$scope.dataTempSize = data.length;
        	if($scope.dataTempSize == 0 || $scope.dataTempSize == "" || $scope.dataTempSize == undefined){
        		$scope.msgShowInfo = true;
        	}else{
        		$scope.msgShowInfo = false;
        	}
        	
        	self.tableParams = new NgTableParams(
                    {
						// 显示第几页
                        page: 1,
						// 每页显示条数
                        count: 15
                    },
                    {
                        dataset:data,
						// 可选的每页显示条数
                        counts: [15, 50, 100, 200]
                    })
        })
    };
    
    
    // 点击全选 的事件
    $scope.checkAll = function() {
      // angular 循环的方法
      angular.forEach($scope.list, function(item) {
        // stfNum是
        // $scope.list的一个key值注意這個value值是唯一的
        self.checkboxes.items[item.stfNum] = self.checkboxes.checked;
      });
    };
    // 设定checkbox的选中状态
    function checkItem() {
      var checked = 0, unchecked = 0, total = $scope.gydst;
      angular.forEach($scope.list, function(item) {
        checked += (self.checkboxes.items[item.stfNum]) || 0;
        unchecked += (!self.checkboxes.items[item.stfNum]) || 0;
      });
      if ((unchecked == 0) || (checked == 0)) {
        self.checkboxes.checked = (checked == total);
      }
      angular.element(".select-all").prop("indeterminate",
          (checked != 0 && unchecked != 0));
    };
    // 單選 的事件
    $scope.checkItem = function() {
      checkItem();
    }

    // 画面初期状态
    function init() {
      // 初始化选中OID列表
      $scope.stfNums = [];
      // 初始化ng-table的checkboxes
      self.checkboxes = {
        checked : false,
        items : {}
      };
      // 初始化全选checkBox的样式
      angular.element(".select-all").prop("indeterminate", false);
    }

    
	  // 更新人员信息
	  $scope.updateStfInfo = function() {
		  $scope.updateData = [];
		  
		    // angular 循环的方法
		    angular.forEach($scope.list, function(item) {
		      // 如果数据是选中状态的时候
		      if (self.checkboxes.items[item.stfNum]) {
		        $scope.updateData.push(item.stfNum);
		      }
		    });
		    // 如果没有选择要导出的数据，提示错误信息，返回。
		    if ($scope.updateData.length == 0) {
		    	//alert("没有选中信息");
				comApi.errorMessage("msg.report.10001");
//		      comApi.HintMessage("error", "错误", "msg.common.10002", 0, function() {
//		      });
				return false;
		    }
			// 要更新的数据
	        comApi.post("staff/prmnDemnMng/prmnDemnMngUpdateStf" , $scope.updateData ,function(){
	        	
	        })
	  };

});