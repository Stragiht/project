app.controller("radioStaffController", function($scope, $modal, NgTableParams,
		$location, $stateParams, $state, $log, comApi, toaster, $modalInstance,flag) {
  //TODO 中科软修复BUG后删除
//  flag = 1;
  
  $scope.flag=flag;
	/**
	 * 
	 * 分页数据
	 * 
	 * 
	 */
	// 当前页数(初始为第一页)
	var pageIndex = $stateParams.pageIndex;
	if (pageIndex == null || pageIndex == "" || pageIndex == undefined) {
		pageIndex = 1;
	}

	// 当前页数据条数（当当前页数据条数为1时，做删除操作后更新数据前pageIndex需减1）
	var count = $stateParams.count;

	// 当城市分区信息在最后一页并且该页数据条数为1时，pageIndex需减1
	if (count == 1) {
		pageIndex = pageIndex - 1;
	}
	// 每页显示数据条数
	var pageCount = $stateParams.pageCount;
	if (pageCount == null || pageCount == "" || pageCount == undefined) {
		pageCount = 20;// 每页显示数据条数，可修改
	}

	/**
	 * 
	 * 公共变量
	 * 
	 */
	//查询对象
	$scope.stfbas = {
		hasDirSupFlg : true
	};
	
	//全局中间变量-人员
    var stfNum = "";
	
	//单选框初始值
    $scope.selectedRD = "2";
	
	//初始化数据
    $scope.recordCount = "0";
	initData();
	

	
	/**
	 * 
	 * 查询方法
	 * 
	 * 
	 */
	$scope.searchMultistore = function(){
		selectList(pageIndex, pageCount);
		
	}
	
    /**
     * 
     * 单选框单击事件
     * 
     * 
     */
    $scope.selectClick = function(value){
      
      stfNum = value;
      
    }   

	/**
	 * 
	 * 
	 * 确定按钮
	 * 
	 * 
	 */
	$scope.ok = function() {
		
		var datas = [];
		
		if(typeof($scope.tableParams) != "undefined"){
			
			/**
			 * 
			 * 中间变量
			 * 
			 */
			var staffData = $scope.tableParams.data;
			
			
            /**
             * 
             * 验证单选框是否选中
             * 
             */
            for(var i =0; i<staffData.length;i++){
              if(staffData[i].stfNum == stfNum){
                  datas.push(staffData[i]);
                  break;
              }
              
              
            }
			
		}
		
		/**
		 * 
		 * 向父页面传递参数
		 * 
		 */
		$modalInstance.close(datas);
	};
	
	
	/**
	 * 
	 * 关闭当前子画面
	 * 
	 * 
	 */
	$scope.cancel = function() {
		$modalInstance.dismiss();
	};

	
	
	/**
	 * 
	 * 
	 * 初始化数据
	 * 
	 * 
	 */
	function initData() {
	  
	  $scope.staffGetData = function() {

        stfNum = "";
	    selectList(pageIndex, pageCount);
	    
	  }
	      


	  //设定部门默认值
	  $scope.department = comApi.getSelectBoxDepartment(2);
	  $scope.stfbas.subDep = $scope.department[0].key;


	  //加载职位信息
	  comApi.get("commonDataController/selectJobPosALL",function(data) {
	    
	    //初始值
	    var obj = {
	        posNum : "0000",
	        posNm : "全部"
	    };
	    
	    //数组指定位置插入元素
	    data.splice(0, 0, obj); 
	    
	    //赋值循环变量
	    $scope.jobPosData = data;
	    
	    //model赋值找到默认全部
	    $scope.stfbas.jobPos = "0000";
	    
	    //初始值
	    obj = {
	        posGrdNum : "0000",
	        posGrdNm : "全部"
	    };
	    
	    //初始化变量
	    data = [];
	    data.push(obj);
	    
	    //第一次
	    $scope.posLvlData = data;
	    
	    //赋值等级信息
	    $scope.stfbas.posLvl = "0000";
	    
	  });

	  $scope.changeJobPos = function(posNum){
	    
	    comApi.get("commonDataController/posLvlSelect?posNum=" + posNum,function(data) { 
	      
	      //初始值
	      var obj = {
	          posGrdNum : "0000",
	          posGrdNm : "全部"
	      };
	      
	      //数组指定位置插入元素
	      data.splice(0, 0, obj); 
	      
	      //赋值循环变量
	      $scope.posLvlData = data;
	      
	      //model赋值找到默认全部
	      $scope.stfbas.posLvl = "0000";
	      
	    });
	  }
	  
	  
	};
	

	/**
	 * 
	 * 
	 * 查询方法
	 * 
	 * 
	 */
	function selectList(page, counts) {
		
		
		comApi.post("commonDataController/staffSelectAll",$scope.stfbas,function(data) {
			// 綁定變量返回的 map數據的長度
			$scope.recordCount = data.length;
			// 綁定一個數據集方便下面全選的 調用
			$scope.list = data;
			$scope.tableParams = new NgTableParams({

				page : page,
				count : counts

			}, {
				dataset : data,
				counts : [ 20, 50, 100, 200 ]
			});
		});

	}

});
