app.controller('repApplApprController', ['$scope','$state','comApi','NgTableParams','$stateParams',function($scope,$state,comApi,NgTableParams,$stateParams){
    $scope.deit = {};
	//初始化面板展开
	$scope.oneAtATime = true;
	$scope.status = {
	   repAppInfoBaseInfoOpen:true,
	   repAppInfoStoreInfoOpen:true,
	   repAppInfoSaleInfoOpen:true,
	   repAppInfoStoreSaleInfoOpen:true,
	   repAppOperationOpen:true
	};
	$scope.datas=[];
	//基本信息
	var ApplNum=$stateParams.ApplNum;
    // 取得是否通过选项列表
    var apprRstDataList = comApi.getSelectBoxDic("C002", "0");
    $scope.apprRstList = apprRstDataList;
    $scope.deit.apprRst = apprRstDataList[0].key;
	$scope.BaseInfo=function(){
		//基本信息
		comApi.get("RepApplReport/selectBaseInfoByrepApplNum/" + ApplNum, function(data) {
			$scope.repApplNum=data.repApplNum;
			$scope.commitStfNm=data.commitStfNm;
			$scope.apprStat=data.apprStat;
			$scope.sbmtTm=data.sbmtTm;
			//做排他处理
		    $scope.deit.updtTm = data.updtTm;
		    $scope.deit.repApplNum = data.repApplNum;
			$scope.StroeInfo();
		});
	}
	$scope.StroeInfo=function(){
		//门店信息
		comApi.get("RepApplReport/selectStroeInfoByrepApplNum/" + ApplNum, function(data) {
			$scope.strNum=data.strNum;
			$scope.strNm=data.strNm;
			$scope.ApplStroeData();
		});
	}
	$scope.ApplStroeData=function(){
		//销售业绩比对之申请数据 
		comApi.get("RepApplReport/selectApplStroeDataByrepApplNum/" + ApplNum, function(data) {
			$scope.repApprStartDt=data.repApprStartDt;
			$scope.repApprEndDt=data.repApprEndDt;
			$scope.ApplStroeDataOne=[];
			$scope.ApplStroeDataOne.stfRepSaleAmtSum=data.stfRepSaleAmtSum;
			$scope.ApplStroeDataOne.stfRepSaleAmtSum=data.stfRepSaleAmtSum;
			$scope.ApplStroeDataOne.fcImpSaleAmt=data.fcImpSaleAmt;
			$scope.ApplStroeDataOne.compRslt=data.compRslt;
			$scope.ApplStroeDataOne.countUpdateRepAppSaleAmt=data.countUpdateRepAppSaleAmt;
			$scope.PersonInfoFunction();
		});
	}
	$scope.PersonInfoFunction=function(){
		//销售业绩比对之相关人员销售数据
		comApi.get("RepApplReport/selectPersonInfoByrepApplNum/" + ApplNum, function(data) {
			$scope.PersonInfo=data;
			$scope.ModInfo();
		});
	}
    $scope.ModInfo=function(){
        //修改人员销售业绩
        comApi.get("RepApplReport/selectModInfoByrepApplNum/" + ApplNum, function(data) {
            //给人员销售业绩赋值
            for(var i=0;i<data.length;i++){
                var obj = {};
                obj.oId= data[i].oId;
                obj.updtTm=data[i].updtTm;
                obj.apprStfNum=data[i].apprStfNum;
                obj.adjustType=data[i].adjustType;
                obj.adjustAmt= data[i].adjustAmt;
                obj.adjustDate= data[i].adjustDate;
                obj.flag = "1";
                $scope.datas.push(obj); 
            }
            $scope.StroeInPerson();
        });
    }
	$scope.StroeInPerson=function(){	
        var repApprStartDt = $scope.repApprStartDt;
        var repApprEndDt = $scope.repApprEndDt;
		//门店人员销售业绩
		comApi.get("RepApplReport/selectStroeInPersonByrepApplNum/" + ApplNum +"/" + repApprStartDt +"/" + repApprEndDt, function(data) {
			$scope.stroeInPersonList=data;
			$scope.baTabClick(data[0].stfNum);
			$scope.changeAmt();
		});
	}
	//点击门店人员销售业绩人员tab页
	$scope.baTabClick=function(stfNum){
        var repApprStartDt = $scope.repApprStartDt;
        var repApprEndDt = $scope.repApprEndDt;
        var json={stfNum:stfNum,strNum:$scope.strNum,repApprStartDt:repApprStartDt,repApprEndDt:repApprEndDt};
		comApi.post("RepApplReport/selectStroeInPersonByrepApplNum1",json, function(data) {
			//初始化清空table
			$scope.stroeInPersonOneList=[];
			$scope.stroeInPersonOneList=data;
		});
	}
    //初始化改变调整金额
	$scope.changeAmt=function(){
		//实时变化相关人员修改后金额
		for(var i=0;i<$scope.datas.length;i++){
		   for(var h=0;h<$scope.PersonInfo.length;h++){
		       if($scope.datas[i].apprStfNum
		    		   ==$scope.PersonInfo[h].apprStfNum){
				if($scope.datas[i].adjustType=='1'){
					$scope.PersonInfo[h].countUpdateStfRepSaleAmt
					+=$scope.datas[i].adjustAmt;
				}else if($scope.datas[i].adjustType=='2'){
					$scope.PersonInfo[h].countUpdateStfRepSaleAmt
					+=-($scope.datas[i].adjustAmt);
				}
			   }
			 }
		}
		//实时变化申请数据修改后金额
		for(var k=0;k<$scope.PersonInfo.length;k++){
		    $scope.ApplStroeDataOne.countUpdateRepAppSaleAmt
		    +=$scope.PersonInfo[k].countUpdateStfRepSaleAmt;
		}
	}	
	$scope.BaseInfo();
	//切换申请信息tab页
	$scope.selecttabs1=function(){
		 $scope.datas=[];
	     $scope.BaseInfo();
	}
	//切换审批历史tab页
	$scope.selecttabs2=function(){
		//审批历史
		comApi.get("RepApplReport/selectHistoryByrepApplNum/" + ApplNum, function(data) {
			$scope.History=data;
		});
	}
	
	//审批提交保存
	$scope.apprManagement=function(){
        comApi.post("RepApplReport/apprReportManagement",$scope.deit,function(data){
                comApi.HintMessage(["success","销售报表审批流程"], "提示","msg.common.00022",3000,function () {});	
        		$state.go("app.report.repApplSelect");
        });
	}
}]);