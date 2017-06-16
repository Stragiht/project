/*
 *這是 人員基本信息批量修改统一编辑的方法 
 *--江風成  2016-3-25 
 *引入的  $scope  $http  NgTableParams  $element
 */
app.controller('stfBasAllEditUpdate',['$scope','$http','NgTableParams','$element','comApi','$filter','toaster','$timeout','$state',
	'$modal', '$stateParams','toaster',function($scope, $http, NgTableParams, $element,comApi, $filter,toaster, $timeout, $state, $modal,$stateParams) {
	// 定义变量
	$scope.stfbas = {};
	$scope.stfbastable={};
	$scope.insert={};
	// 定义变量
	$scope.date = {};
	// 初始化ng-table的checkboxes
	$scope.oneAtATime = true;
	var self = this;
	self.checkboxes = {
		checked : false,
		items : {}
	};
	$scope.status = {
		open : true
	};
	var stnum = "";
	var stnumtwo = "";
	var result=$stateParams.stfNum.split(",");
	for(var i=0;i<result.length;i++){
	  stnum += '"'+ result[i]+ '"' + ",";
	  stnumtwo += result[i]+",";
	}
	
	$scope.stfbas.stfBasNumber=stnum.substring(0,stnum.length - 1);
	$scope.stfbas.stfBasNumbertwo=stnumtwo.substring(0,stnumtwo.length - 1);
	$scope.zhuangtai = comApi.getSelectBoxDic("C001", 0);
	$scope.jobs = comApi.getSelectBoxJob(0);
					
	//直属主管弹窗
	$scope.openStaff = function(size) {
		var modalInstance = $modal.open({
			templateUrl : 'radiostaff.html',
			controller : 'radioStaffController',
			size : size,
			resolve : {
				//传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
				flag : function() {
				return 1;
				},
				//配置需要注入JS
				deps: ['$ocLazyLoad', function ($ocLazyLoad) { return $ocLazyLoad.load(['common/js/controllers/radiostaff.js']);}]
			}
		});
			//父子传递参数
		modalInstance.result.then(function(selectedItem) {
		//给text窗口赋显示格式的值
		  if(selectedItem.length > 0){
		    $scope.stfbas.supvrStfNums=selectedItem[0].stfNum+"."+selectedItem[0].stfNm;
		    $scope.stfbastable.supvrStfNum=selectedItem[0].stfNum;
		  }else{
		    $scope.stfbas.supvrStfNums="";
		    $scope.stfbastable.supvrStfNum="";
		  }
		});
	};
	if($stateParams.type){
	  var tempStr=$stateParams.type.split(",");
	    for(var i=0;i<tempStr.length;i++){
	      //职位
	      if (tempStr[i]=="1") {
	        $scope.posNumsss=true;
	      }
	      //直属主管
	      if (tempStr[i]=="3") {
	        $scope.supvrStfNumsss=true;
	      }
	      //在岗状态
	      if (tempStr[i]=="4") {
	        $scope.workStatsss=true;
	      }
	    }
	}
	//职位改变状态
	$scope.selectc = function() {
		$scope.posgrdnum = comApi.getSelectBoxPosLvl($scope.stfbastable.posNum, "0");
		if($scope.posgrdnum.length=="0"){
		  $scope.stfbastable.posGrdNum="0000";
        } else {
			//初始化默认值为第一个
			$scope.stfbastable.posGrdNum = $scope.posgrdnum[0].key;
		}

	};
	
	comApi.post("/staff/selectEdit",$scope.stfbas,function(data) {
		// 綁定變量返回的 map數據的長度
		var content="";
		$scope.repeatlist=data;
		for(var i =0;i<data.length;i++){
			content+= data[i].stfNum+"."+data[i].stfNm+",";
			}
			$scope.contents= content.substring(0,content.length-1);
			});
	
	/*
	 * 插入人员信息
	 */
	$scope.inserter = function() {
	    if(!$stateParams.type){
	      return;
	    }
			if($scope.stfbas.supvrStfNums==null){
			  $scope.insert.supvrStfNum = "";
	        }else{
	          var str=$scope.stfbas.supvrStfNums;
	            var stfNum=str.substr(0, str.indexOf('.'));
	            for(var i=0;i<$stateParams.stfNum.split(",").length;i++){
	              if($stateParams.stfNum.split(",")[i]==stfNum){
	                comApi.HintMessage("error", "", "msg.common.00046",0, "");
	                return;
	              }
	            }
	            $scope.insert.supvrStfNum = $scope.stfbastable.supvrStfNum;
	        }
			$scope.insert.stfBasNumber=$scope.stfbas.stfBasNumbertwo;
			$scope.insert.posNum=$scope.stfbastable.posNum;
			$scope.insert.posGrdNum = $scope.stfbastable.posGrdNum;
			$scope.insert.workStat = $scope.stfbastable.workStat;
			$scope.insert.contents = $scope.contents;
			
			$scope.insert.modifyPosNum = $scope.posNumsss == true;
			$scope.insert.modifySupvrStfNum = $scope.supvrStfNumsss == true;
			$scope.insert.modifyWorkStat = $scope.workStatsss == true;
			
			comApi.post("/staff/stfbasAllUpdate",$scope.insert, function(data) {

				comApi.searchUnReadMessage($scope);

				comApi.HintMessage( ["success","统一编辑"], "", "msg.common.00023",3000, "");
						setTimeout(function() {
							$state.go("app.staff.stfBasAllUpdate");}, "1000");
									});
									}

						 
						} ]);
