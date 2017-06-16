/**
 * 
 * 销售大区信息主页
 * 
 */
app.controller("majRegController", function($scope, NgTableParams,
		$location, $stateParams, $state, comApi, toaster) {

	// 调用页面初始化
	loadMajRgn();

	// 删除销售大区
	$scope.majRgnDelete = function(majrgnnum,subchnl) {
    	$scope.rccFlag = 1; //放入回收站标识
	    comApi.openDelWindow(function(){
        comApi.post("majReg/majRegDelete", {
          majrgnnum : majrgnnum,
          subchnl:subchnl
      }, function(data) {
          if (data != 0) {
              comApi.HintMessage(["success","销售大区信息"],"","msg.common.00031",3000,"");
              //重新加载session 
              //1.销售大区信息
              comApi.selectMajRegALL();
              //2.大区城市关联关系
              comApi.selectMajRegCityReALL();
              loadMajRgn();
          }
      });
      },$scope.rccFlag)

	}

	// 跳转编辑画面
	$scope.goUpdate = function(subchnl, majrgnnum) {

		$state.go("app.staff.majRgnUpdate", {
			subchnl : subchnl,
			majrgnnum : majrgnnum
		});

	}

	// 画面初始化方法
	function loadMajRgn() {
		
		comApi.get("majReg/majRegAllSelect",function(data){
		    //查询结果条数xsdqInfo
			$scope.xsdqInfo = data;
			 if(data==null){
				   $scope.recordCount=0;  
			   }else{
				   $scope.recordCount=data.length;		
			   }
		});
		
	}

});
