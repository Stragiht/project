app.controller("memRadioSelectController", ['$scope', '$modal', 'NgTableParams',
	'$location', '$stateParams', '$state', '$log', 'comApi', '$modalInstance', '$filter',
	'flag',function($scope, $modal, NgTableParams,
		$location, $stateParams, $state, $log, comApi, $modalInstance,$filter,
		flag) {
	$scope.oneAtATime = true;
	$scope.status = {
		memopen: true
	};
	
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
	$scope.membas = {};
	
	//全局中间变量-会员
    var memNum = "";
	
	//单选框初始值
    $scope.selectedRD = "2";
	
	//初始化数据
	initData();

	/**
	 * 
	 * 查询方法
	 * 
	 * 
	 */
	$scope.searchMemList = function(){
		pageIndex = 1;
		selectList(pageIndex, pageCount);
	}
	
    /**
     * 
     * 单选框单击事件
     * 
     * 
     */
    $scope.selectClick = function(value){
      
      memNum = value;
      
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
			var memData = $scope.tableParams.data;
			
			
            /**
             * 
             * 验证单选框是否选中
             * 
             */
            for(var i =0; i<memData.length;i++){
              
              
              if(memData[i].membNum == memNum){
                  datas.push(memData[i]);
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
	  $scope.membCount = 0;

	  $scope.memGetData = function() {
	    selectList(pageIndex, pageCount);
	  };
	};

	//时间格式化
	function timeFormat(time) {
		var newTime = time.split(' ');
		return newTime[0]+' '+newTime[1].split('.')[0];
	}

	//日期转换成时间戳
	function timeToTimestamp(dateStr) {
		if (dateStr == null || dateStr == '' || dateStr == undefined) {
			return '';
		} else {
			//只能识别xxxx/02/01这种形式
			var date = dateStr.replace(/-/g,'/');
			return new Date(date).getTime();
		}
	}

	//angular中日期格式化
	function angularDateFor(date){
		return $filter('date')(date,'yyyy-MM-dd');
	}

	/**
	 * 
	 * 
	 * 查询方法
	 * 
	 * 
	 */
	function selectList(page, counts) {

		//定义查询会员列表传递的参数
		var selectMembList = {
			"pageNum": '1',
			"pageSize": '',
			"params": {
				"C025": "",
				"C026": "",
				"C027": "",
				"C028": "",
				"crtdStfNm": "",
				"endTime": '',  //"endTime": '2016-01-01',
				"grpId": "",    //组别id
				"membNm": "",
				"membNum": "",
				"phone": "",
				"provChnl": "",  //渠道
				"startTime": ''  // "startTime": '2016-01-01'
			}
		}

		selectMembList.params = $scope.membas;
		selectMembList.params.startTime = timeToTimestamp(angularDateFor(selectMembList.params.startTime));
		selectMembList.params.endTime = timeToTimestamp(angularDateFor(selectMembList.params.endTime));


		comApi.post("/membBas/selectMembBas",selectMembList,function(data) {
			memNum = "";//重新查询后应将选中的会员置空
			// 綁定變量返回的 map數據的長度
			data = data.data;
//			for (var i=0; i<data.length; i++) {
//				data[i].registTm = timeFormat(data[i].registTm);
//			}
			$scope.membCount = data.length;
			// 綁定一個數據集方便下面全選的 調用
			$scope.list = data;
			$scope.tableParams = new NgTableParams({

				page : page,
				count : counts

			}, {
				dataset : data,
				counts : [ 20, 50, 100, 200 ],
				getData : function($defer, params) {
					$defer.resolve(data.slice((params.page() - 1)
							* params.count(), params.page() * params.count()));
					// 当前所在页
					pageIndex = params.page();
					// 每页显示条数
					pageCount = params.count();
					// 当前页数据条数
					count = data.slice((params.page() - 1) * params.count(),
							params.page() * params.count()).length;
				}
			});
		});

	}

}]);
