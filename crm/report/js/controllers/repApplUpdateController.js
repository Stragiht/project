app.controller('repApplUpdateController', ['$scope','$state','comApi','NgTableParams','$stateParams',function($scope,$state,comApi,NgTableParams,$stateParams){
    var reg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
	//初始化面板展开
	$scope.oneAtATime = true;
	$scope.status = {
	   repAppInfoBaseInfoOpen:true,
	   repAppInfoStoreInfoOpen:true,
	   repAppInfoSaleInfoOpen:true,
	   repAppInfoSaleUpdateOpen:true,
	   repAppInfoStoreSaleInfoOpen:true
	};
	$scope.datas=[];
	var ApplNum=$stateParams.ApplNum;
	$scope.BaseInfo=function(){
		//基本信息
		comApi.get("RepApplReport/selectBaseInfoByrepApplNum/" + ApplNum, function(data) {
			$scope.repApplNum=data.repApplNum;
			$scope.commitStfNm=data.commitStfNm;
			$scope.apprStat=data.apprStat;
			$scope.sbmtTm=data.sbmtTm;
			$scope.updtTm=data.updtTm;
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
			//调用共通赋值初始化调整金额
			$scope.adjustTypeInfoList=comApi.getSelectBoxDic("C029", "0");
			//选择人员
			comApi.get("RepApplReport/selectChooseInfoByrepApplNum/" + ApplNum, function(data) {
				$scope.apprStfNumInfoList=data;
			});
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
			$scope.changeDanXiang();
		});
	}
	//点击门店人员销售业绩人员tab页
	$scope.baTabClick=function(stfNum){
	    var repApprStartDt = $scope.repApprStartDt;
	    var repApprEndDt = $scope.repApprEndDt;
	    var strNum = $scope.strNum;
		var json={stfNum:stfNum,strNum:strNum,repApprStartDt:repApprStartDt,repApprEndDt:repApprEndDt};
		comApi.post("RepApplReport/selectStroeInPersonByrepApplNum1",json, function(data) {
			//初始化清空table
			$scope.stroeInPersonOneList=[];
			$scope.stroeInPersonOneList=data;
		});
	}
	
	$scope.BaseInfo();
	
	//单项改变调整金额
	$scope.changeDanXiang=function(){
		//先刷新清空相关人员销售业绩列表的变动累加金额和申请总变化调整金额
		for(var k=0;k<$scope.PersonInfo.length;k++){
			   $scope.PersonInfo[k].countUpdateStfRepSaleAmt=0;
		}
	    $scope.ApplStroeDataOne.countUpdateRepAppSaleAmt=0;
		//实时变化相关人员修改后金额
		for(var i=0;i<$scope.datas.length;i++){
		    for(var h=0;h<$scope.PersonInfo.length;h++){
    		    if($scope.datas[i].apprStfNum == $scope.PersonInfo[h].apprStfNum){
                    var adjustAmtConToNumber = 0;
                    if (reg.exec($scope.datas[i].adjustAmt)) {
                        adjustAmtConToNumber = new Number(new Number($scope.datas[i].adjustAmt).toFixed(2));
                    }
    				if($scope.datas[i].adjustType=='1'){
    					$scope.PersonInfo[h].countUpdateStfRepSaleAmt += adjustAmtConToNumber;
    				}else if($scope.datas[i].adjustType=='2'){
    					$scope.PersonInfo[h].countUpdateStfRepSaleAmt += -adjustAmtConToNumber;
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
//	//初始化加载选择人员
//	$scope.apprStfNumInfoList=[{key:"0001",text:"张三"}];
//	//初始化选择金额
//	$scope.adjustTypeInfoList=[{key:"0001",text:"+"},{key:"0002",text:"-"}]
//	//这里写对应页面要用的JS
//	var datas = [{apprStfNum:"0001",adjustType:"0001",adjustAmt:"0.01",adjustDate:"2015-01-22"}];
//	$scope.datas = datas;
	//添加新增变更
	$scope.addUpdateChange=function(){
		 $scope.datas.push({apprStfNum:$scope.apprStfNumInfoList[0].stfNum,adjustType:"1",adjustAmt:"0",adjustDate:"",flag:"2"});
	}
    //点击删除按钮更新flag
    $scope.del = function(delId){
    	if($scope.datas[delId].oId){
    		$scope.datas[delId].flag = "0";
    	}else{
    		$scope.datas.splice(delId,"1");
    	}

		//先刷新清空相关人员销售业绩列表的变动累加金额和申请总变化调整金额
		for(var k=0;k<$scope.PersonInfo.length;k++){
			   $scope.PersonInfo[k].countUpdateStfRepSaleAmt=0;
		}
	    $scope.ApplStroeDataOne.countUpdateRepAppSaleAmt=0;
		//实时变化相关人员修改后金额
		for(var i=0;i<$scope.datas.length;i++){
		   for(var h=0;h<$scope.PersonInfo.length;h++){
		   if($scope.datas[i].apprStfNum
				   ==$scope.PersonInfo[h].apprStfNum){
				if($scope.datas[i].adjustType=='1'){
					if($scope.datas[i].flag=="0"){
						continue;
					}else{
						var adjustAmtConToNumber 
						= new Number(new Number($scope.datas[i].adjustAmt).toFixed(2));
						$scope.PersonInfo[h].countUpdateStfRepSaleAmt
						+=adjustAmtConToNumber;
					}
				}else if($scope.datas[i].adjustType=='2'){
					if($scope.datas[i].flag=="0"){
						continue;
					}else{
						var adjustAmtConToNumber 
						= new Number(new Number($scope.datas[i].adjustAmt).toFixed(2));
						$scope.PersonInfo[h].countUpdateStfRepSaleAmt
						+=-adjustAmtConToNumber;						
					}
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
    //保存销售报表审批数据
    $scope.saveInfo=function(opreationFlag){
	for(var i = 0;i<$scope.datas.length;i++){
        if($scope.datas[i].adjustAmt==null || $scope.datas[i].adjustAmt==undefined || $scope.datas[i].adjustAmt==''){
      	    comApi.HintMessage(["error","调整金额"],"错误","msg.common.00014",0,function () {});	
        	return;
    	}else{
      	    if (!reg.exec($scope.datas[i].adjustAmt)) {
                comApi.HintMessage( ["error", "调整金额"], "错误", "msg.common.00013", 0, function() {});
                return;
            }
//          if(!isNaN($scope.datas[i].adjustAmt)){
//        	var num=$scope.datas[i].adjustAmt;
//        	if(num<=0){
//            	comApi.HintMessage(["error","调整金额(不能小于等于0)"],"错误","msg.common.00013",0,function () {});	
//                return;
//        	}
//            }else{
//            	comApi.HintMessage(["error","调整金额(格式不合法)"],"错误","msg.common.00013",0,function () {});
//                return;
//            }
//    		if($scope.datas[i].adjustAmt.length>12){
//    			comApi.HintMessage(["error","调整金额(包含小数点在内,最大长度不可超过12位)"],"错误","msg.common.00013",0,function () {});
//        		return;
//    		}
    	}
        if($scope.datas[i].adjustDate==null || $scope.datas[i].adjustDate==undefined || $scope.datas[i].adjustDate==''){
            comApi.HintMessage(["error","调整日期"],"错误","msg.common.00014",0,function () {});	
        	return;
    	}
    }
	//如果是提交的时候，校验比对结果是否正确
    if (opreationFlag == 'commit') {
      //修改后的人员提交总销售数据大于财务导入销售数据的时候，提示错误消息
      if ($scope.ApplStroeDataOne.stfRepSaleAmtSum + $scope.ApplStroeDataOne.countUpdateRepAppSaleAmt > $scope.ApplStroeDataOne.fcImpSaleAmt) {
        comApi.HintMessage( "error", "错误", "msg.common.00056", 0, function() {});
        return;
      }
    }
    //整理json数据
	var json= {adjustObjectList:$scope.datas,repApplId:$stateParams.ApplNum,opreationFlag:opreationFlag,updtTm:$scope.updtTm};
//	if(valid){
	//向后台保存数据
	comApi.post("RepApplReport/applyReportManagement",json,function(data) {
		if(data==0){
    	    comApi.HintMessage(["error","销售报表申请修改明细"],"错误","msg.common.00019",0,function () {});	
			return;
		}else if(data==1){
		    comApi.HintMessage(["success","销售报表数据"], "提示", "msg.common.00023",3000, "");	
			$state.go("app.report.repApplSelect");
		}else if(data==2){
		    comApi.HintMessage(["success","销售报表数据"], "提示", "msg.common.00024",3000, "");	
			$state.go("app.report.repApplSelect");
		}
	}); 	
//	}
    }
}]);