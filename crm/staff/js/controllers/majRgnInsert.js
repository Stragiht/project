/**
 * 
 * 新增销售大区信息
 * 
 */
app.controller("majRegInsertController", function($scope, $location, comApi,
		toaster,$modal) {

	// 初始化省份信息
	loadMajRegProvince();

	// 初始化销售渠道信息
	loadMajRegChnlInfo();

	// 单选框隶属人员、其他NG-Show属性
	$scope.visible1 = true;
	$scope.visible2 = false;

	// 区分大区总监
	$scope.dqzjFlag = "0";

	// 省数据
	$scope.CityObj = [];
	
	//省数据
	$scope.shengObjs = [];

	// 下拉框NG-Show属性
	$scope.provinceVisible = false;
	$scope.cityVisible = false;
    $scope.openStaff = function(size) {
    	var modalInstance = $modal.open({
    	      templateUrl : 'radiostaff.html',
    	      controller : 'radioStaffController',
    	      size : size,
    	      resolve : {
    	        // 传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
    	        flag : function() {
    	          return 1;
    	        },
    	        // 配置需要注入JS
    	        deps : [ '$ocLazyLoad', function($ocLazyLoad) {
    	          return $ocLazyLoad.load([ 'common/js/controllers/radiostaff.js' ]);
    	        } ]
    	      }
    	});
    //父子传递参数
    modalInstance.result.then(function(selectedItem) {
        $scope.majrgnmgrnm1 = selectedItem.length != 0 ?selectedItem[0].stfNum+"."+selectedItem[0].stfNm:"";
    });

    };
    
	// 单选框单击事件
	$scope.shows = function(typeCode) {

		if (typeCode == 2) {
			$scope.visible1 = false;
			$scope.visible2 = true;
		} else {
			$scope.visible1 = true;
			$scope.visible2 = false;
		}

	}

	// 添加城市按钮单击事件
	$scope.showCitys = function() {
		$scope.CityObj.push({
			shi : []
		});
        $scope.provinceVisible = true;
	}

	// 全选反选
	$scope.all = function(checkFlag, cityArr) {

		for (var i = 0; i < cityArr.length; i++) {
			cityArr[i].checked = checkFlag ? "1" : "0";
		}

	};

	// 地级市全部选择时，全选勾选
    $scope.chk = function(cityArr,flag) {
        var allCheck = true;
        if(flag==1){
            for (var i = 0; i < cityArr.length; i++) {
                allCheck = cityArr[i].checked == "1" ? true&&allCheck : false&&allCheck;
            }
            $scope.masterShiArr= allCheck;
        }else if(flag==2){
            for (var i = 0; i < cityArr.shi.length; i++) {
                allCheck = cityArr.shi[i].checked == "1" ? true&&allCheck : false&&allCheck;
            }
            cityArr.master = allCheck;
        }
    }
	// 新增销售大区信息
	$scope.saveMajRgn = function(valid) {

        $scope.isSubmitted=true;
		// 大区总监区分
		var dqzj = $scope.dqzjFlag;
		var majrgnmgr = "";
		var majrgnmgrnm = "";
		if(dqzj == "0"){
		  if($scope.majrgnmgrnm1 != null && $scope.majrgnmgrnm1 != ""){
	        majrgnmgr = $scope.majrgnmgrnm1.split(".")[0];
	        majrgnmgrnm = $scope.majrgnmgrnm1.split(".")[1];
		  }
		}else{
		  majrgnmgrnm = $scope.majrgnmgrnm2;
		}
		
		
		// 第一个 省市
		if (typeof ($scope.city) != "undefined") {

			var shiArrays = [];

			// 取出第一个相应的市区
			for (var i = 0; i < $scope.shiArr.length; i++) {

				if ($scope.shiArr[i].checked == "1") {

					shiArrays.push($scope.shiArr[i].rgnNum);

				}

			}

			// 取出动态生成相应的市区
			for (var i = 0; i < $scope.CityObj.length; i++) {

				for (var z = 0; z < $scope.CityObj[i].shi.length; z++) {
					if ($scope.CityObj[i].shi[z].checked == "1") {
						shiArrays.push($scope.CityObj[i].shi[z].rgnNum);
					}
				}

			}
            if(shiArrays.length == 0){
              comApi.HintMessage(["error","区域包含城市"],"","msg.common.00014",0,"");
              return;
            }
            if(valid){
    			// 执行入例操作
    			comApi.post("majReg/majRegInsert", {
    				majrgnnm : $scope.majRegName,
    				subchnl : $scope.chnlInfos,
    				cityarr : shiArrays,
    				majrgnmgr:majrgnmgr,
    				majrgnmgrnm:majrgnmgrnm
    			}, function(data) {
    				
    				if (data > 0) {
                        comApi.HintMessage(["success","销售大区信息"],"","msg.common.00023",3000,"");
                        //重新加载session
                        //1.销售大区信息
                        comApi.selectMajRegALL();
                        //2.大区城市关联关系
                        comApi.selectMajRegCityReALL();
    					$location.path("/app/staff/majRgn");
    
    				}
    				
    			});
            }
		}else{
		  comApi.HintMessage(["error","区域包含城市"],"","msg.common.00014",0,"");
        }

	}

	// 省值改变事件
	$scope.shengChange = function(z) {
		
		comApi.get("majReg/majRegCitySelect?superRgnNum=" + z, function(data) {
            $scope.shiArr = data;
            });
		$scope.masterShiArr= false;
	}

	// 省下拉框出发事件
	$scope.cityChange = function(superRgnNum, shuzu) {

		comApi.get("majReg/majRegCitySelect?superRgnNum="
				+ superRgnNum, function(data) {
			$scope.CityObj[shuzu].shi = data;
		});
        $scope.CityObj[shuzu].master = false;
	}

	// 初始化画面省份下拉框
	function loadMajRegProvince() {
		
		comApi.get("majReg/majRegProvinceSelect", function(data) {
			$scope.provinceData = data;
			$scope.city =$scope.provinceData[0].rgnNum;
			comApi.get("majReg/majRegCitySelect?superRgnNum=" + $scope.city,
            function(data) {
                $scope.shiArr = data;
            });
		});
		
	}

	function loadMajRegChnlInfo() {
		
		comApi.get("majReg/chnlInfoSelect", function(data) {
			$scope.chnlInfo = data;
		    $scope.chnlInfos =$scope.chnlInfo[0].chnlNum;
		});
	}

});
