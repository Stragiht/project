app.controller("multiSelectStaffController", function($scope, $modal, NgTableParams,
		$location, $stateParams, $state, $log, comApi, toaster, $modalInstance) {

	
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
	
	//初始化数据
	$scope.recordCount = "0";
	initData();
	initCheckBox();
	

	
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
			var storeData = $scope.tableParams.data;
			
			
			/**
			 * 
			 * 验证单选框是否选中
			 * 
			 */
			for(var i =0; i<$scope.recordCount;i++){
				
				if(typeof($scope.checkboxes.items[$scope.list[i].stfNum]) != "undefined"){
					if($scope.checkboxes.items[$scope.list[i].stfNum]){
						datas.push($scope.list[i]);
					}
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
	 * 多选单选方法
	 * 
	 * 
	 */
	function initCheckBox() {
	  
	    // 初始化ng-table的checkboxes
	    $scope.checkboxes = {
	        checked : false,
	        items : {}
	    };
	    // 点击全选 的事件
	    $scope.checkAll = function() {
	        // angular 循环的方法
	        angular
	                .forEach(
	                        $scope.list,
	                        function(item) {
	                            // stfNum是
	                            // $scope.list的一个key值注意這個value值是唯一的
	                            $scope.checkboxes.items[item.stfNum] = $scope.checkboxes.checked;
	                        });
	    };
	    // 單選 的事件
	    $scope.checkItem = function() {
	        var checked = 0, unchecked = 0, total = $scope.gydst;
	        angular
	                .forEach(
	                        $scope.list,
	                        function(item) {
	                            checked += ($scope.checkboxes.items[item.stfNum]) || 0;
	                            unchecked += (!$scope.checkboxes.items[item.stfNum]) || 0;
	                        });
	        if ((unchecked == 0) || (checked == 0)) {
	            $scope.checkboxes.checked = (checked == total);
	        }
	        angular.element(".select-all").prop(
	                "indeterminate",
	                (checked != 0 && unchecked != 0));
	    };
	  
	  
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
			$scope.checkboxes = {
			        checked : false,
			        items : {}
			    };
			// 綁定變量返回的 map數據的長度
			$scope.recordCount = data.length;
			// 綁定一個數據集方便下面全選的 調用
			$scope.list = data;
			$scope.tableParams = new NgTableParams({page : page,count : counts

				
				

			}, {
				dataset : data,
				counts : [ 20, 50, 100, 200 ]
				/*getData : function($defer, params) {
					$defer.resolve(data.slice((params.page() - 1)
							* params.count(), params.page() * params.count()));
					// 当前所在页
					pageIndex = params.page();
					// 每页显示条数
					pageCount = params.count();
					// 当前页数据条数
					count = data.slice((params.page() - 1) * params.count(),
							params.page() * params.count()).length;
				}*/
			});
		});

	}

});
