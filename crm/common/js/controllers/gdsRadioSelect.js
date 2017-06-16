app.controller("gdsRadioSelectController",['$scope', '$modal', 'NgTableParams',
	'$location', '$stateParams', '$state', '$log', 'comApi', '$modalInstance', '$filter',
	'flag',function($scope, $modal, NgTableParams,
					$location, $stateParams, $state, $log, comApi, $modalInstance,$filter,
					flag){
	$scope.oneAtATime = true;
	$scope.status = {
		open: true
	};

	//分页数据
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


	//公共变量
	//查询对象
	$scope.gdsSearchFilter = {
		//"ftyGdsNum":"",		//工厂商品编号
		//"gdsNm":"",			//商品名称
		"gdsSpecDtlNum":"",	//商品规格详细编号
		"gdsSpecDtlNm":"",	//商品规格详细名称
		//"brdId":"",			//商品品牌ID
		"gdsClsId":"",		//商品分类ID
		//"sellFlg":"",			//是否上架
		"chnlNum":"",			//渠道编号
		//"ifGdsThum":"0"		//是否有商品缩略图
	};

	//全局中间变量-选中的商品规格详细
	var selGdsSpecDtlNum = "";
	//单选框初始值
	$scope.selectedRD = "2";

	//初始化数据
	initData();

	// 查询方法
	$scope.searchMultiGds = function(){
		pageIndex = 1;
		selectList(pageIndex, pageCount);
	}

	//确定按钮
	$scope.ok = function() {

		var datas = [];

		if(typeof($scope.tableParams) != "undefined"){
			//中间变量
			var gdsData = $scope.tableParams.data;

			//验证单选框是否选中
			for(var i =0; i<gdsData.length;i++) {
				if (gdsData[i].gdsSpecDtlNum == selGdsSpecDtlNum) {
					datas.push(gdsData[i]);
					break;
				}
			}
		}

		//向父页面传递参数
		$modalInstance.close(datas);
	};

	//关闭当前子画面
	$scope.cancel = function() {
		$modalInstance.dismiss();
	};

	//单选框单击事件
	$scope.selectClick = function(value){
		selGdsSpecDtlNum = value;
	}

		//初始化数据
	function initData() {

		$scope.gdsCount = 0;

		$scope.gdsGetData = function() {
			selectList(pageIndex, pageCount);
		}

		$scope.chnlList = comApi.getChnlList('PGCOMW0910001', 2);
		$scope.gdsSearchFilter.chnlNum = $scope.chnlList[0].key;
		//当前选中的商品分类级数
		$scope.selectedGdsClsLevel = 1;
		//当前选中的商品分类
		$scope.selectedGdsCls = [];
		$scope.gdsClsList = [];

		comApi.selectAllGdsCls();

		$scope.getGdsClsText = function(cateLevel){

			var input=cateLevel;
			if(input==1)
				return "设为一级分类";
			else if(input==2)
				return "设为二级分类";
			else if(input==3)
				return "设为三级分类";
			else if(input==4)
				return "设为四级分类";
			else if(input==5)
				return "设为五级分类";
			else if(input==6)
				return "设为六级分类";
			else if(input==7)
				return "设为七级分类";
			else if(input==8)
				return "设为八级分类";
			else if(input==9)
				return "设为九级分类";
		}

		//$scope.gdsClsList[0].push(comApi.GetGdsClsList("", "设为一级分类", "3"));  //key text
		$scope.gdsClsList[0] = comApi.GetGdsClsList("", $scope.getGdsClsText(1), "2");
		$scope.selectedGdsCls[0] = $scope.gdsClsList[0][0].key;

		$scope.changeSuperGdsCls = function(index){
			if($scope.selectedGdsCls[index] == "0000"){//全部
				$scope.selectedGdsClsLevel = index+1;
				//$scope.gdsClsInsert.cateLevel = $scope.selectedGdsClsLevel;
				if(index == 0) {//一级分类为全部，则商品分类ID为空
					$scope.gdsSearchFilter.gdsClsId = "";
				}else{//其它级别，获取上级商品分类ID
					$scope.gdsSearchFilter.gdsClsId = $scope.selectedGdsCls[index-1];
				}
			}else{//选中其它选项
				$scope.gdsSearchFilter.gdsClsId =  $scope.selectedGdsCls[index];
				//加载下级分类
				if(index < 9) {
					$scope.gdsClsList[index + 1] = comApi.GetGdsClsList($scope.gdsSearchFilter.gdsClsId, $scope.getGdsClsText(index+2), "2");
					$scope.selectedGdsCls[index + 1] = $scope.gdsClsList[index][0].key;
					$scope.selectedGdsClsLevel = index + 2;
					//$scope.gdsClsInsert.cateLevel = $scope.selectedGdsClsLevel;
				}
			}


		}

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

	//查询方法
	function selectList(page, counts) {
		//定义查询商品列表传递的参数
		var selectGdsList = {
			"pageNum":1,
			"pageSize":"",
			"params":{
				//"ftyGdsNum":"",		//工厂商品编号
				//"gdsNm":"",			//商品名称
				"gdsSpecDtlNum":"",	//商品规格详细编号
				"gdsSpecDtlNm":"",	//商品规格详细名称
				//"brdId":"",			//商品品牌ID
				"gdsClsId":"",		//商品分类ID
				//"sellFlg":"",			//是否上架
				"chnlNum":"",			//渠道编号
				//"ifGdsThum":"0"		//是否有商品缩略图
			}
		}

		selectGdsList.params = $scope.gdsSearchFilter;
		selectGdsList.params.startTime = timeToTimestamp(angularDateFor(selectGdsList.params.startTime));
		selectGdsList.params.endTime = timeToTimestamp(angularDateFor(selectGdsList.params.endTime));

		comApi.post("gdsInfo/selectGdsInfo",selectGdsList,function(data) {
			selGdsSpecDtlNum = "";//重新查询后应将当前选中的商品置空
			data = data.data;
			// 綁定變量返回的 map數據的長度
			$scope.gdsCount = data.length;
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
