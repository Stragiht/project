/**
 * 
 * 分配业绩
 * Created by helt on 2016-5-11.
 */

app.controller("disSupShareSalePerf", function ($scope, $http, NgTableParams, $location, comApi, $stateParams, $localStorage, $filter,$state) {
	
	// 存放url上数据的对象
	$scope.FromTimeToTimeAndStfNumVo = {};
	// url上人员编号获取
	$scope.FromTimeToTimeAndStfNumVo.stfNum = $stateParams.strNum;
	// url上起始时间获取
	$scope.FromTimeToTimeAndStfNumVo.fromTime = $stateParams.startTime;
	// url上终止时间获取
	$scope.FromTimeToTimeAndStfNumVo.toTime = $stateParams.endTime;
	// 用于存放date的对象
	$scope.mydate = {};
	
	
	// 用于显示在页面上  销售日期  的date startTime
	$scope.sellDateShowStartTime = $filter('date')($scope.FromTimeToTimeAndStfNumVo.fromTime,'MM-dd');
	
	// 用于显示在页面上  销售日期  的date endTime
	$scope.sellDateShowEndTime = $filter('date')($scope.FromTimeToTimeAndStfNumVo.toTime,'MM-dd');
	
	
	// 基本信息
	$scope.baseInfo = [];
	// 其下人员销售业绩
	$scope.baInfo = [];
	// 分配督导销售业绩
	$scope.supSalePerfInfo = [];
	
	// 存放每天的销售业绩的Map
	$scope.dateSellObj = {
			date:"",
			sell:"",
			share:""
	};
	// 存放每天的销售业绩的Map 的 List
	$scope.dateSellObjList = [];
	
	// 需要Post的Map
	$scope.dateSellPostObj = {
			date:"",
			sell:"",
			share:""
	};
	// 存放需要Post的Map的数组
	$scope.dateSellPostObjList = [];
	
	// 基本信息 手风琴 默认打开
	$scope.status1 = { open : true };
	// 其下人员销售业绩 手风琴 默认打开
	$scope.status2 = { open : true };
	// 分配督导销售业绩 手风琴 默认打开
	$scope.status3 = { open : true };
	
	// 临时数组
	$scope.arrayTemp = [];
	
	
	
	
	// 初始化  
	init();
	
	function init(){
		// 人员基本信息 获取
		comApi.post("report/disSupShareSalePerf/baseInfo" , $scope.FromTimeToTimeAndStfNumVo ,function(data){
			$scope.baseInfo = data;
			
		});
		// 其下人员销售业绩
		comApi.post("report/disSupShareSalePerf/baInfo" , $scope.FromTimeToTimeAndStfNumVo ,function(data){
			$scope.baInfo = data;
			
		});
		// TODO 需要修改传入的BEAN
		// 获取督导所属BA列表
		comApi.post("report/disSupShareSalePerf/supOwnBASelect" , $scope.FromTimeToTimeAndStfNumVo ,function(data){
			$scope.supOwnBASelect = data;
		});
		
		// 分配督导销售业绩
		comApi.post("report/disSupShareSalePerf/supSalePerfInfo" , $scope.FromTimeToTimeAndStfNumVo ,function(data){
			$scope.mydate.dataTempSize = data.length;
			$scope.mydate.dataTemp = data;
//			for(var i = 0; i < $scope.mydate.dataTempSize; i++){
//				// 保存真实日期
//				$scope.mydate.dataTemp[i].realTime = $scope.mydate.dataTemp[i].rptTm;
//				// 格式化销售日期
//				$scope.mydate.dataTemp[i].rptTm = $filter('date')($scope.mydate.dataTemp[i].rptTm,'MM-dd');
//				// 分配销售业绩 设置为 null
//				$scope.mydate.dataTemp[i].assnAmt = $scope.mydate.dataTemp[i].assnAmt;
//				// 其下人员编号设置为null
//				$scope.mydate.dataTemp[i].assnStfNum = $scope.FromTimeToTimeAndStfNumVo.SupShareNm;
//				// 上级编号
//				$scope.mydate.dataTemp[i].supvrNum = $scope.FromTimeToTimeAndStfNumVo.stfNum;
//				// table编号
//				$scope.mydate.dataTemp[i].rowNum = i;
//				
//				// Init 每天的销售业绩的 Map
//				$scope.dateSellObj = {
//						date:$scope.mydate.dataTemp[i].rptTm, // 销售人员上报信息创建时间
//						sell:$scope.mydate.dataTemp[i].saleAmt, // 督导销售业绩
//						share:$scope.mydate.dataTemp[i].shareAmt // 分配了的钱数，此处先不用
//				};
//
//			}
			// 将直接赋值改为循环插入 $scope.supSalePerfInfo
			for(var i = 0; i < $scope.mydate.dataTempSize; i++){
				$scope.myobj = {};
				$scope.myobj.rowNum = i;
				// 完整时间
				$scope.myobj.rptTm = $scope.mydate.dataTemp[i].rptTm;
				$scope.myobj.saleAmt = $scope.mydate.dataTemp[i].saleAmt;
				$scope.myobj.assnStfNum = $scope.mydate.dataTemp[i].assnStfNum;
				$scope.myobj.assnAmt = $scope.mydate.dataTemp[i].assnAmt;
				$scope.myobj.supvrNum = $scope.mydate.dataTemp[i].stfNum;
				$scope.supSalePerfInfo.splice(i ,0, $scope.myobj);
			}
			
		});
		
	}
	
	// 添加
	$scope.addSupSalePerfInfo = function(index){
		
		var j = 0;
		for(var i = 0; i < $scope.supSalePerfInfo.length; i++){
			if(i == parseInt(index)){
				$scope.myobj = {};
				$scope.myobj.rowNum = j;
				// 完整时间
				$scope.myobj.rptTm = $scope.supSalePerfInfo[i].rptTm;
				$scope.myobj.saleAmt = $scope.supSalePerfInfo[i].saleAmt;
				$scope.myobj.assnStfNum = $scope.supSalePerfInfo[i].assnStfNum;
				$scope.myobj.assnAmt = $scope.supSalePerfInfo[i].assnAmt;
				$scope.myobj.supvrNum = $scope.supSalePerfInfo[i].supvrNum;
				$scope.arrayTemp.splice(j ,0, $scope.myobj);
				j++
				
				$scope.myobj = {};
				$scope.myobj.rowNum = j;
				// 完整时间
				$scope.myobj.rptTm = $scope.supSalePerfInfo[parseInt(index)].rptTm;
				$scope.myobj.saleAmt = $scope.supSalePerfInfo[parseInt(index)].saleAmt;
				$scope.myobj.assnStfNum = "";
				$scope.myobj.assnAmt = "";
                $scope.myobj.supvrNum = $scope.supSalePerfInfo[parseInt(index)].supvrNum;
				$scope.arrayTemp.splice(j ,0, $scope.myobj);
				j++;
			}else{
				$scope.myobj = {};
				$scope.myobj.rowNum = j;
				// 完整时间
				$scope.myobj.rptTm = $scope.supSalePerfInfo[i].rptTm;
				$scope.myobj.saleAmt = $scope.supSalePerfInfo[i].saleAmt;
				$scope.myobj.assnStfNum = $scope.supSalePerfInfo[i].assnStfNum;
				$scope.myobj.assnAmt = $scope.supSalePerfInfo[i].assnAmt;
				$scope.myobj.supvrNum = $scope.supSalePerfInfo[i].supvrNum;
				$scope.arrayTemp.splice(j ,0, $scope.myobj);
				j++
			}
		}
		
		$scope.supSalePerfInfo = $scope.arrayTemp;
		// 清空临时数组
		$scope.arrayTemp = [];
	}
	
	// 删除
	$scope.delSupSalePerfInfo = function(index, saleDt){
		var j = 0;
		var dateCount = 0;
		// 判断删除行的销售日期是否是唯一
		for(var i = 0; i < $scope.supSalePerfInfo.length; i++){
		    if (saleDt == $scope.supSalePerfInfo[i].rptTm) {
		      dateCount = dateCount + 1;
		    }
		}
		// 如果删除行是该日期的最后一行，则只删除分配给其下成员和分配销售业绩
		if (dateCount == 1) {
		    $scope.supSalePerfInfo[index].assnStfNum = "";
		    $scope.supSalePerfInfo[index].assnAmt = "";
	        return;
		}
		for(var i = 0; i < $scope.supSalePerfInfo.length; i++){
			if(i == parseInt(index)){

			}else{
				$scope.myobj = {};
				$scope.myobj.rowNum = j;
				// 完整时间
				$scope.myobj.rptTm = $scope.supSalePerfInfo[i].rptTm;
				$scope.myobj.saleAmt = $scope.supSalePerfInfo[i].saleAmt;
				$scope.myobj.assnStfNum = $scope.supSalePerfInfo[i].assnStfNum;
				$scope.myobj.assnAmt = $scope.supSalePerfInfo[i].assnAmt;
				$scope.myobj.supvrNum = $scope.supSalePerfInfo[i].supvrNum;
				$scope.arrayTemp.splice(j ,0, $scope.myobj);
				j++
			}
		}
		
		$scope.supSalePerfInfo = $scope.arrayTemp;
		// 清空临时数组
		$scope.arrayTemp = [];
	}
	
	// 提交 分配督导销售业绩
	$scope.postSupSalePerfInfo = function(){
		var j = 0;
		var saleDt = "";
		var assnAmt = 0;
		var sumAssnAmt = 0;
		if ($scope.supSalePerfInfo.length == 0) {
		    comApi.HintMessage( "error", "错误", "msg.common.00044", 0, function() {});
            return;
		}
        var reg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
        var supSalePerfInfoList = [];
		for(var i = 0; i < $scope.supSalePerfInfo.length; i++){
		    if (!($scope.supSalePerfInfo[i].assnStfNum == undefined || $scope.supSalePerfInfo[i].assnStfNum == null
		        || $scope.supSalePerfInfo[i].assnStfNum == "") && ($scope.supSalePerfInfo[i].assnAmt == undefined 
                   || $scope.supSalePerfInfo[i].assnAmt == null || $scope.supSalePerfInfo[i].assnAmt == "")){
                comApi.HintMessage( "error", "错误", "msg.common.00041", 0, function() {});
                return;
		    }
			if($scope.supSalePerfInfo[i].assnAmt != undefined 
				&& $scope.supSalePerfInfo[i].assnAmt != null && $scope.supSalePerfInfo[i].assnAmt != "" && $scope.supSalePerfInfo[i].assnAmt != "0"){
	            if (!reg.exec($scope.supSalePerfInfo[i].assnAmt)) {
	                comApi.HintMessage( ["error", "分配销售业绩"], "错误", "msg.common.00013", 0, function() {});
	                return;
	            }
			    assnAmt = $scope.supSalePerfInfo[i].assnAmt;
			} else {
                assnAmt = 0;
            }
            if (i == 0) {
                sumAssnAmt = assnAmt;
                saleDt = $scope.supSalePerfInfo[i].rptTm;
            } else {
                if (saleDt == $scope.supSalePerfInfo[i].rptTm) {
                    sumAssnAmt = Number(sumAssnAmt) + Number(assnAmt);
                } else {
                    // 判断【同一天分配的销售业绩】不能超过【当天可分配的督导销售业绩】
                    if (Number(sumAssnAmt) > Number($scope.supSalePerfInfo[i - 1].saleAmt)) {
                        comApi.HintMessage( ["error", saleDt], "错误", "msg.common.00036", 0, function() {});
                        return;
                    }
                    sumAssnAmt = assnAmt;
                    saleDt = $scope.supSalePerfInfo[i].rptTm;
                }
            }
            if (i == $scope.supSalePerfInfo.length - 1) {
                // 判断【同一天分配的销售业绩】不能超过【当天可分配的督导销售业绩】
                if (Number(sumAssnAmt) > Number($scope.supSalePerfInfo[i].saleAmt)) {
                    comApi.HintMessage( ["error", $filter('date')(saleDt, 'MM-dd')], "错误", "msg.common.00036", 0, function() {});
                    return;
                }
            }
            
            supSalePerfInfoList.push({
            	"supvrNum":$scope.supSalePerfInfo[i].supvrNum,
            	"saleDt":$scope.supSalePerfInfo[i].rptTm,
            	"assnStfNum":$scope.supSalePerfInfo[i].assnStfNum,
            	"assnAmt":$scope.supSalePerfInfo[i].assnAmt
            });
            
		}
		
		
		var data = {
		    supvrNum : $scope.FromTimeToTimeAndStfNumVo.stfNum,
		    fromTime : comApi.timeToTimestamp($scope.FromTimeToTimeAndStfNumVo.fromTime),
		    toTime : comApi.timeToTimestamp($scope.FromTimeToTimeAndStfNumVo.toTime),
		    supSalePerfInfo : supSalePerfInfoList
		};
		
		comApi.post("report/disSupShareSalePerf/disSupSalePerfInsert", data, function(data){
		  comApi.HintMessage( ["success","分配督导销售业绩"], "提示", "msg.common.00023",3000, "");  
          $state.go("app.report.disSupSalePerfSelect");
		});
		
	}

	
	
});

