/**
 * Created by 朱艳春 on 2016-3-11.
 */

//这里写对应页面要用的js
var datas = [
    {name:"",start:"",end:""}
];
app.controller('salesScheduleInsertCol', function($scope,$http,$state,$filter,comApi,toaster) {
	//初始加载表格
	$scope.datas = datas;
    $scope.addSchedule = function(){
        $scope.datas.push({name:"",start:"",end:""});
    }
    $scope.datas=[{}];
    //点击保存提交
    $scope.saveSchedule = function(valid){
      //提交时进行信息验证
      $scope.isSubmitted=true;
    	var phagrpNm = $scope.phagrpNm;
    	//加入前台的各种验证
    	if($scope.datas.length>0){
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
                      if(a != i){
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
    	//保存档期
    	comApi.post("SalesScheduleManage/salesScheduleInsert", {
			scheduleObject: $scope.datas,phagrpNm:$scope.phagrpNm,remark:$scope.remark
			},function(data) {
				$scope.datas=[{}];
				comApi.HintMessage( ["success","档期"], "提示", "msg.common.00023",3000, "");  
				//重新加载session
				comApi.selectphaALL();
				$state.go("app.staff.salesScheduleManage");
    	});
		
		
    }
    
});