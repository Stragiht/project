/**
 * 
 * 销售门店信息
 * Created by helt on 2016-3-11.
 */

app.controller("storesSelect", function ($scope, $http, NgTableParams, $location, comApi, toaster, $stateParams, $localStorage, $sessionStorage) {

	// 查询 手风琴 默认打开
	$scope.status = { open : true };
	// 创建查询结果对象
	$scope.xsmdxx = new Array();
	// 初始化下拉选择默认为全选值为 0000
	$scope.xsmdxx.ssxsqd = '0000';
	// 初始化 所属销售渠道 下拉选择框
	// PGSTFW0250003
	//$scope.chnlList = comApi.getChnlList("PGREPW0130001",2);
	// 用于显示查询数据失败
	$scope.msgShowInfo = true;

	/*lg*/
	var counts = comApi.getPageCounts();
	var pageNum = 1;
	var pageSize = counts[0];
	var isBack = $stateParams.isBack && ($stateParams.isBack == "true" || $stateParams.isBack == true);
	$scope.gydst = 0;

	//定义销售门店搜索的参数
	$scope.salesOutlets = {
		"pageNum": 1,
		"pageSize": "",
		"params": {
			"strNum": "",
			"strNm": "",
			"subChnl": "",
			"majRgnNum": "",
			"province": "",
			"city": "",
			"partiNum": ""
		}
	};

	// 设置了一个用于存放个人创建变量用的对象
	$scope.myPara = {
		// 存放page相关参数
		page: {
			// 存放url上参数信息
			url: {
				// 所属销售渠道
				strType: $stateParams.strType,
				// 页码数
				pageNum: $stateParams.pageNum,
				// 每页最大行数
				pageSize: $stateParams.pageSize,
				// 主键
				strNum: $stateParams.strNum
			}
		},
		// 存放table相关参数
		table: {
			// 所属销售渠道
			strType: "",
			// 初始化页码数
			strInitPageNum: 1,
			// 初始化每页最大显示条数
			pageSizeInit: 20,
			// 页码数
			pageNum: "",
			// 每页最大行数
			pageSize: "0",
			// 总页数
			pageCount: "",
			// 总行数
			dataCount: "",
			// 获取当前页数
			pageNow: "",
			dataSize: "0"
		}
	};

	/*lg*/
	$scope.ChnlInfoList = comApi.getChnlList("PGREPW0130001", 2);
	$scope.salesOutlets.params.subChnl = $scope.ChnlInfoList[0].key;

	$scope.MajRegInfoList = comApi.getMajRgnList($scope.salesOutlets.params.subChnl, 2);
	$scope.salesOutlets.params.majRgnNum = $scope.MajRegInfoList[0].key;

	$scope.proVinceInfoList = comApi.getProList($scope.salesOutlets.params.subChnl, $scope.salesOutlets.params.majRgnNum, 2);
	$scope.salesOutlets.params.province = $scope.proVinceInfoList[0].key;

	$scope.cityInfoList = comApi.getCityList($scope.salesOutlets.params.subChnl, $scope.salesOutlets.params.majRgnNum, $scope.salesOutlets.params.province, 2);
	$scope.salesOutlets.params.city = $scope.cityInfoList[0].key;

	$scope.partiInfoList = comApi.getPartiList($scope.salesOutlets.params.subChnl, $scope.salesOutlets.params.city, 2);
	$scope.salesOutlets.params.partiNum = $scope.partiInfoList[0].key;


	// 联动大区/*lg*/
	$scope.changeMajRegInfo = function (subChnl) {

		// 加载大区信息
		$scope.MajRegInfoList = comApi.getMajRgnList(subChnl, 2);
		//默认选中全部
		$scope.salesOutlets.params.majRgnNum = $scope.MajRegInfoList[0].key;

		$scope.changeproVinceInfo(subChnl, $scope.salesOutlets.params.majRgnNum);
	};

	// 联动省份
	$scope.changeproVinceInfo = function (subChnl, majRgnNum) {
		$scope.proVinceInfoList = comApi.getProList(subChnl, majRgnNum, 2);
		$scope.salesOutlets.params.province = $scope.proVinceInfoList[0].key;
		$scope.changecityInfo(subChnl, majRgnNum, $scope.salesOutlets.params.province);

	};

	// 联动城市
	$scope.changecityInfo = function (subChnl, majRgnNum, proRgnNum) {

		// 给城市下拉框赋值
		$scope.cityInfoList = comApi.getCityList(subChnl, majRgnNum, proRgnNum, 2);
		$scope.salesOutlets.params.city = $scope.cityInfoList[0].key;
		$scope.changepartiInfo(subChnl, $scope.salesOutlets.params.city);
	};

	// 城市分区
	$scope.changepartiInfo = function (subChnl, cityNum) {

		// 给城市下拉框赋值
		$scope.partiInfoList = comApi.getPartiList(subChnl, cityNum, 2);
		$scope.salesOutlets.params.partiNum = $scope.partiInfoList[0].key;
	};

	//搜索销售门店/*lg*/
	$scope.searchStoresSelect  = function() {
		/*comApi.post("staff/stores/search", $scope.salesOutlets, function(data) {

			console.log(angular.toJson(data));

			$scope.gydst = data.data.length;
			$scope.tableParams = getTableParams(pageNum, pageSize, data.data, counts);

		});*/

		pageSize = $sessionStorage.storesSelectPageSizeCopy > 0 ? angular.copy($sessionStorage.storesSelectPageSizeCopy) : pageSize;
		if(isBack == true){
			$scope.storesSelectList= angular.copy($sessionStorage.storesSelect);
			$scope.gydst = angular.copy($sessionStorage.storesSelectDataLengthCopy);

			if (comApi.isNotEmptyObject($sessionStorage.storesSelect)) {
				$scope.salesOutlets = angular.copy($sessionStorage.salesOutletsDataCopy);
				$scope.MajRegInfoList = comApi.getMajRgnList($scope.salesOutlets.params.subChnl, 2);
				$scope.proVinceInfoList = comApi.getProList($scope.salesOutlets.params.subChnl, $scope.salesOutlets.params.majRgnNum, 2);
				$scope.cityInfoList = comApi.getCityList($scope.salesOutlets.params.subChnl, $scope.salesOutlets.params.majRgnNum, $scope.salesOutlets.params.province, 2);
				$scope.partiInfoList = comApi.getPartiList($scope.salesOutlets.params.subChnl, $scope.salesOutlets.params.city, 2);
			}

			pageNum = $sessionStorage.storesSelectPageNumCopy > 0 ? angular.copy($sessionStorage.storesSelectPageNumCopy) : pageNum;
			$scope.tableParams = getTableParams(pageNum, pageSize, $scope.storesSelectList, counts);
			isBack = false;
		}else {
			pageNum = 1;
			comApi.post('staff/stores/search', $scope.salesOutlets, function (data) {

				$scope.storesSelectList = data.data;
				$scope.gydst = data.data.length;
				$scope.tableParams = getTableParams(pageNum, pageSize, data.data, counts);
				$sessionStorage.storesSelectDataLengthCopy = angular.copy($scope.gydst);
				$sessionStorage.storesSelect = angular.copy($scope.storesSelectList);
				$sessionStorage.salesOutletsDataCopy = angular.copy($scope.salesOutlets);
			});
		}
	};

	function getTableParams(pageNum, pageSize, data, counts){
		var arr = comApi.buildTableParams(pageNum, pageSize, data, counts, function(pageIndex, pageCount){
			pageNum = pageIndex;
			pageSize = pageCount;
			$sessionStorage.storesSelectPageNumCopy = angular.copy(pageIndex);
			$sessionStorage.storesSelectPageSizeCopy = angular.copy(pageCount);
		});
		var tableParams = new NgTableParams(arr[0], arr[1]);
		return tableParams;
	}

	if(isBack == true){
		var url = window.location.href;
		url = url.indexOf("?") == -1 ? url : url.substring(0, url.indexOf('?'));
		window.history.pushState({}, "", url);
		$scope.searchStoresSelect();
	}
	
    // 生成ng-table
    $scope.tableParamsGet = function (strType, pageNow, pageSize) {

        comApi.get("staff/stores/storesSelect/" + strType ,function(data){
        	// table的总数据数
        	$scope.myPara.table.dataSize = data.length;
        	
        	// 如果查询出的数据为0，那么返回错误信息
        	if($scope.myPara.table.dataSize == 0 || $scope.myPara.table.dataSize == null || $scope.myPara.table.dataSize == undefined){
        		$scope.msgShowInfo = true;
        	}else{
        		$scope.msgShowInfo = false;
        	}
        	
        	// 计算出总页数
        	$scope.myPara.table.pageCount = Math.ceil($scope.myPara.table.dataSize / $scope.myPara.table.pageSize);
        	// 如果当前页超过了最大页，那么当前页为最大页， 用于，如果返回时页面数发生变化的情况
        	if(pageNow > $scope.myPara.table.pageCount){
				pageNow = $scope.myPara.table.pageCount;
        	}
        	// 捕获传入的strType(所属销售渠道)
//			$scope.myPara.table.strType = strType;

            $scope.tableParams = new NgTableParams(
                    {
						// 显示第几页
                        page: pageNow,
						// 每页显示条数
                        count: pageSize
                    },
                    {
                        dataset:data,
						// 可选的每页显示条数
                        counts: [20, 50, 100, 200],
						// 显示ng-table数据，捕获所属销售渠道值，更新每页最大数据数，更新当前所属页数
                        getData: function($defer, params) {
							// 有这句话ng-table才会显示数据
                            $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            // TODO:测试一下此处是否可以获取strType,如果可以的话，在此处获取
							$scope.myPara.table.strType = strType;
                            // 获取单页行数
                            $scope.myPara.table.pageSize = params.count();
							// 获取当前页码数
                            $scope.myPara.table.pageNow = params.page();
                            
                            
                            // 更改url保存值  用于新增部分
                            // 更新销售渠道
							$scope.myPara.page.url.strType = $scope.myPara.table.strType;
                            // 更新单页行数
							$scope.myPara.page.url.pageSize = $scope.myPara.table.pageSize;
							// 更新当前页码数
							$scope.myPara.page.url.pageNum = $scope.myPara.table.pageNow;
                        }
                    })
            
            if($scope.myPara.table.dataSize == 0 || $scope.myPara.table.dataSize == null || $scope.myPara.table.dataSize == "" || $scope.myPara.table.dataSize == undefined){
            	// 没查询到数据时提示
            }
        })
    };
	
	// 如果页码数是数字且大于0，那么调用还原页数和类型的方法
	if ($stateParams.pageNum > 0){
//		// 初始化 所属销售渠道
//		$scope.myPara.page.url.strType = $stateParams.strType;
//		// 初始化 页码数
//		$scope.myPara.page.url.pageNum = $stateParams.pageNum;
//		// 初始化 每页最大显示行数
//		$scope.myPara.page.url.pageSize = $stateParams.pageSize;
		// 还原 所属销售渠道 下拉列表
		$scope.xsmdxx.ssxsqd = $scope.myPara.page.url.strType;
		// 查询
		$scope.tableParamsGet($scope.myPara.page.url.strType, $scope.myPara.page.url.pageNum, $scope.myPara.page.url.pageSize);
	}



	// NOTE:url设定，暂时定为。类型，每页行数，页数，主键  ,初次进入类型和页码都设定为0，然后通过判断设定的页码数>0为查询条件
	// strType:获取所属销售渠道
	// 获取所属销售渠道，如果为空则说明是第一次进入该页面
//	if($stateParams.strType!=null&&$stateParams.strType!=undefined&&$stateParams.strType!=""){
//		$scope.strType = $stateParams.strType;
//		// 如果不是第一次进入，应该将 所属销售渠道 下拉还原
//		$scope.xsmdxx.ssxsqd = $scope.strType;
//	}


	
	// TODO:在第几页进行了删除，那么这条数据将消失，然后重新查询，还原页码
	


		


	// 创建了一个查询用的初始化方法
	$scope.tableSelectInit = function(strType){
		// 像生成ng-table的方法传入 所属销售渠道， 初始化页码数， 初始化页面最大条数
		$scope.tableParamsGet(strType, $scope.myPara.table.strInitPageNum, $scope.myPara.table.pageSizeInit);
	};

    
//    // 编辑
//	$scope.$storage = $localStorage;
//	$scope.editStores = function(strNum){
//		$localStorage.storeSelect = {
//			// 此处只储存查询条件，关于ng-table的相关信息，由url传递
//			strType:"test"
//		};
//
//		$location.path("/app/staff/storesInsert/0/0/0");
//	};

	/*function URLencode(sStr)
	{
		return escape(sStr).replace(/\+/g, '%2B').replace(/\"/g,'%22').replace(/\'/g, '%27').replace(/\//g,'%2F');
	}

*/

	// 删除
    $scope.deleteStores = function (strNum){

		strNum = comApi.myEncodeURIComponent(strNum);
       	$scope.rccFlag = 1; //放入回收站标识
        comApi.openDelWindow(function(){
            comApi.get("staff/stores/storesDelete/" + strNum ,function(data){
                //toaster.pop('success','提示',"数据删除成功!", 3000, 'trustedHtml', function () {});   
            	// 删除后重新加载查询结果并还原现场
    			//$scope.tableParamsGet($scope.myPara.table.strType, $scope.myPara.table.pageNow, $scope.myPara.table.pageSize);

				$scope.searchStoresSelect();
            })
        }, $scope.rccFlag)
    };
});


