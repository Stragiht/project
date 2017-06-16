app.controller("radioStoreController", function($scope, $modal, NgTableParams,
		$location, $stateParams, $state, $log, comApi, toaster, $modalInstance,
		flag) {

	
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
	var self = this;
	var all = {
		key : "",
		text : "全部"
	};
	$scope.cond = {};
	
	//单选框初始值
	$scope.selectedRD = "2";
	
	//全局中间变量-门店编号
	var strNum = "";

	/**
	 * 
	 * 初始化数据
	 * 
	 */
	$scope.recordCount = "0";
	initCommon();
	
	
	
	/**
	 * 
	 * 单选框单击事件
	 * 
	 * 
	 */
	$scope.selectClick = function(value){
	  
	  strNum = value;
	  
	}	
	
	/**
	 * 
	 * 绑定查询方法
	 * 
	 * 
	 */
	$scope.searchMultistore = function(){
		
		selectList(pageIndex, pageCount);
		
	}
	

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
			for(var i =0; i<storeData.length;i++){
			  
			  
			  if(storeData[i].strNum == strNum){
			      datas.push(storeData[i]);
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

	$scope.cancel = function() {
		$modalInstance.dismiss();
	};

	function initCommon() {
		// 设定销售渠道的下拉框
		$scope.chnlList = comApi.getChnlList("PGREPW0130001", 2);
		// 设定销售渠道的默认值
		$scope.cond.chnlNum = $scope.chnlList[0].key;
		// 设定销售大区的下拉框
		$scope.majRgnList = [all];
		// 设定销售大区的默认值
		$scope.cond.majRgnNum = "";
		// 设定省份的下拉框
		$scope.proList = [all];
		// 设定省份的默认值
		$scope.cond.proNum = "";
		// 设定城市的下拉框
		$scope.cityList = [all];
		// 设定城市的默认值
		$scope.cond.cityNum = "";
		// 设定城市分区的下拉框
		$scope.partiList = [all];
		// 设定城市分区的默认值
		$scope.cond.partiNum = "";
		
		// 改变销售渠道选中值的方法
		$scope.changeChnl = function(chnlNum) {
			// 销售渠道选择【全部】的时候，清空销售大区的下拉框
			if (chnlNum == undefined || chnlNum == null || chnlNum == "") {
				// 设定销售大区的下拉框
				$scope.majRgnList = [all];
				// 设定销售大区的默认值
				$scope.cond.majRgnNum = "";
			} else {
		        // 检索选中销售渠道下的销售大区
				$scope.majRgnList = comApi.getMajRgnList(chnlNum, 2);
				// 设定销售大区的默认值
				$scope.cond.majRgnNum = $scope.majRgnList[0].key;
			}
			// 设定省份的下拉框
			$scope.proList = [all];
			// 设定省份的默认值
			$scope.cond.proNum = "";
			// 设定城市的下拉框
			$scope.cityList = [all];
			// 设定城市的默认值
			$scope.cond.cityNum = "";
			// 设定城市分区的下拉框
			$scope.partiList = [all];
			// 设定城市分区的默认值
			$scope.cond.partiNum = "";
			// 设定门店的下拉框
			$scope.strList = [all];
			// 设定门店的默认值
//			$scope.cond.strNum = "";
		}
		
		// 改变销售大区选中值的方法
		$scope.changeMajRgn = function(chnlNum, majRgnNum) {
			// 销售大区选择【全部】的时候，清空省份的下拉框
			if (majRgnNum == undefined || majRgnNum == null || majRgnNum == "") {
				// 设定省份的下拉框
				$scope.proList = [all];
				// 设定省份的默认值
				$scope.cond.proNum = "";
			} else {
				// 设定省份的下拉框
				$scope.proList = comApi.getProList(chnlNum, majRgnNum, 2);
				// 设定省份的默认值
				$scope.cond.proNum = $scope.proList[0].key;
			}
			// 设定城市的下拉框
			$scope.cityList = [all];
			// 设定城市的默认值
			$scope.cond.cityNum = "";
			// 设定城市分区的下拉框
			$scope.partiList = [all];
			// 设定城市分区的默认值
			$scope.cond.partiNum = "";
			// 设定门店的下拉框
			$scope.strList = [all];
			// 设定门店的默认值
//			$scope.cond.strNum = "";
		}
		
		// 改变省份选中值的方法
		$scope.changePro = function(chnlNum, majRgnNum, proNum) {
			// 省份选择【全部】的时候，清空城市的下拉框
			if (proNum == undefined || proNum == null || proNum == "") {
				// 设定城市的下拉框
				$scope.cityList = [all];
				// 设定城市的默认值
				$scope.cond.cityNum = "";
			} else {
				// 设定城市的下拉框
				$scope.cityList = comApi.getCityList(chnlNum, majRgnNum, proNum, 2);
				// 设定城市的默认值
				$scope.cond.cityNum = $scope.cityList[0].key;
			}
			// 设定城市分区的下拉框
			$scope.partiList = [all];
			// 设定城市分区的默认值
			$scope.cond.partiNum = "";
			// 设定门店的下拉框
			$scope.strList = [all];
			// 设定门店的默认值
//			$scope.cond.strNum = "";
		}
		
		// 改变城市选中值的方法
		$scope.changeCity = function(chnlNum, cityNum) {
			// 城市选择【全部】的时候，清空城市分区的下拉框
			if (cityNum == undefined || cityNum == null || cityNum == "") {
				// 设定城市分区的下拉框
				$scope.partiList = [all];
				// 设定城市分区的默认值
				$scope.cond.partiNum = "";
			} else {
				// 设定城市分区的下拉框
				$scope.partiList = comApi.getPartiList(chnlNum, cityNum, 2);
				// 设定城市分区的默认值
				$scope.cond.partiNum = $scope.partiList[0].key;
			}
			// 设定门店的下拉框
			$scope.strList = [all];
			// 设定门店的默认值
//			$scope.cond.strNum = "";
		}
	}

	/**
	 * 
	 * 
	 * 查询方法
	 * 
	 * 
	 */
	function selectList(page, counts) {
		
		//权限区分赋值
		$scope.cond.flag = flag;
		
		comApi.post("commonDataController/multiSelectStoreSelect",$scope.cond,function(data) {
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
