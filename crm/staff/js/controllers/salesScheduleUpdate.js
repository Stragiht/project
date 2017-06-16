/**
 * Created by 朱艳春 on 2016-3-11.
 */
//这里写对应页面要用的js
app.controller('salesScheduleUpdateCol', ['$scope','$http','$stateParams','$state','$filter','comApi','toaster',function($scope,$http,$stateParams,$state,$filter,comApi,toaster) {
	$scope.datas = [];
	//1-1档期组查询
	comApi.post('SalesScheduleManage/selectGrpInfo', {
		oid:$stateParams.oid
		},function(data) {
			for(var i=0;i<data.length;i++){
				$scope.phagrpNm = data[i].phaGrpNm;
				$scope.remark=data[i].remark;
				$scope.updtTm=data[i].updtTm;
			}
	});
    //1-1档期查询
	comApi.post('SalesScheduleManage/selectPhaseMngInfo', {
		oid:$stateParams.oid
		},function(data) {
			for(var i=0;i<data.length;i++){
				var obj = {};
				obj.oId = data[i].oId;
				obj.name= data[i].phaNm;
				obj.start= data[i].phaStartTm;
				obj.end= data[i].phaEndTm;
				obj.flag = "1"
				$scope.datas.push(obj);
			}
	});
    //点击删除按钮更新flag
    $scope.del = function(delId){
    	if($scope.datas[delId].oId){
    		$scope.datas[delId].flag = "0";
    	}else{
    		$scope.datas.splice(delId,"1");
    	}
    }
    $scope.addSchedule = function(){
		$scope.datas.push({name:"",start:"",end:"",flag:"3"});
	}
    //    2-1档期组修改
    var count=0;
    $scope.saveSchedule = function(valid){
      //提交时进行信息验证
      $scope.isSubmitted=true;
    	var phagrpNm = $scope.phagrpNm;
    	//提交时进行信息验证
        $scope.isSubmitted=true;
    	//加入各种验证
    	if(phagrpNm==null || phagrpNm==undefined || phagrpNm==''){
    	  comApi.HintMessage( ["error","档期组名称"], "错误", "msg.common.00014",0, "");
    	  return;
    	}
    	for(var i = 0;i<$scope.datas.length;i++){
    	  if($scope.datas[i].flag=="0"){
            count = count+1;
          }
    	}
    	if($scope.datas.length!=count){
    	  for(var i = 0;i<$scope.datas.length;i++){
            if($scope.datas[i].name==null || $scope.datas[i].name==undefined || $scope.datas[i].name==''){
                comApi.HintMessage( ["error","档期名称"], "错误", "msg.common.00014",0, "");
                return;
            }
            if($scope.datas[i].start==null || $scope.datas[i].start==undefined || $scope.datas[i].start==''){
                comApi.HintMessage( ["error","档期开始时间"], "错误", "msg.common.00014",0, "");
                return;
            }
            if($scope.datas[i].end==null || $scope.datas[i].end==undefined || $scope.datas[i].end==''){
                comApi.HintMessage( ["error","档期结束时间"], "错误", "msg.common.00014",0, "");
                return;
            }
            if($filter("date")($scope.datas[i].start,'yyyy-MM-dd')> $filter("date")($scope.datas[i].end,'yyyy-MM-dd')){
              comApi.HintMessage( ["error","档期"], "错误", "msg.common.00012",0, "");
              return;
            }
            if($scope.datas.length>1){
                for(var a in $scope.datas){
                    if(a != i && $scope.datas[a].flag != "0" && $scope.datas[i].flag != "0"){
                        if($filter("date")($scope.datas[a].start,'yyyy-MM-dd') <= $filter("date")($scope.datas[i].start,'yyyy-MM-dd') && $filter("date")($scope.datas[i].start,'yyyy-MM-dd') <= $filter("date")($scope.datas[a].end,'yyyy-MM-dd')){
                          comApi.HintMessage( ["error","多个档期"], "错误", "msg.common.00033",0, "");
                          return;
                        }else if($filter("date")($scope.datas[a].start,'yyyy-MM-dd') <= $filter("date")($scope.datas[i].end,'yyyy-MM-dd') && $filter("date")($scope.datas[i].end,'yyyy-MM-dd')<= $filter("date")($scope.datas[a].end,'yyyy-MM-dd')){
                          comApi.HintMessage( ["error","多个档期"], "错误", "msg.common.00033",0, "");
                          return;
                        }
                    }
                }
                
                
            }
    	  }
    	}else{
    	  comApi.HintMessage( ["error","档期信息"], "错误", "msg.common.00014",0, "");
    	  return;
    	}
    	
    	//针对控件选定时间传入后台VO里面是选择日期的前一天问题
    	for(var i=0;i<$scope.datas.length;i++){
          var startTime = $filter("date")($scope.datas[i].start,'yyyy-MM-dd');
          var endTime = $filter("date")($scope.datas[i].end,'yyyy-MM-dd');
          $scope.datas[i].start= startTime;
          $scope.datas[i].end=endTime;
        }
    	//编辑保存方法
    	comApi.post('SalesScheduleManage/updateGrp', {
    		oid:$stateParams.oid,phagrpNm:$scope.phagrpNm,remark:$scope.remark,updtTm:$scope.updtTm,scheduleObject: $scope.datas
    		},function(data) {
    		  comApi.HintMessage( ["success","档期"], "提示", "msg.common.00023",3000, "");  
    		  //重新加载session
              comApi.selectphaALL();
              $state.go("app.staff.salesScheduleManage");
    	});
    }
}]);
