app.controller('repApplSelectController', ['$scope','$state','comApi','NgTableParams','$modal',function($scope,$state,comApi,NgTableParams,$modal){
//初始化面板展开
$scope.oneAtATime = true;
$scope.status = {
	open : true
};
$scope.selectedApprStat = "0000";
//初始化ng-table的checkboxes
$scope.checkboxes = {
		checked : false,
		items : {}
};
$scope.deit = {};
//初始化赋值总件数
$scope.recordCount=0;
//动态加载审批状态选项
$scope.apprStatList = comApi.getSelectBoxDic("C018", "2");
// 查询处理
$scope.selectRepApplInfolList = function(apprStat) {
	selectRepApplInfo(apprStat);
};
//初始化加载查询
selectRepApplInfo('0000');
function selectRepApplInfo(apprStat) {
  $scope.selectedApprStat = apprStat;
comApi.get("RepApplReport/selectRepApplInfo/" + apprStat, function(data) {
 if(data.hasOwnProperty("maxCount")){
 if (data.length == data[0].maxCount) {
     comApi.HintMessage( ["success",data[0].maxCount], "提示", "msg.common.00021",3000, "");	
     }
   }
if(data.length==0){
  //comApi.HintMessage("error","错误","NoDatas",0,function () {});	
  $scope.recordCount=0;
  $scope.tableParams = new NgTableParams({
	  // 显示的第几页
	  page : 1,
	  // 一页显示多少条
	  count : 20
  }, {
	  // 把data数据集绑定前台
	  dataset : data,
	  // 可以点击的显示自己想要一页显示多少条
	  counts : [ 20, 50, 100, 200 ]
  });
  //初始化ng-table的checkboxes
  $scope.checkboxes = {
			checked : false,
			items : {}
  };
  angular.element(".select-all").prop("indeterminate",false);
  return;
}

$scope.list=data;
//总件数
$scope.recordCount = data.length;
//ng-table的实现绑定
$scope.tableParams = new NgTableParams({
  // 显示的第几页
  page : 1,
  // 一页显示多少条
  count : 20
}, {
  // 把data数据集绑定前台
  dataset : data,
  // 可以点击的显示自己想要一页显示多少条
  counts : [ 20, 50, 100, 200 ]
});
});
//初始化复选框
$scope.checkboxes = {
		checked : false,
		items : {}
};
angular.element(".select-all").prop("indeterminate",false);
}

//调用共通画面
$scope.openAppl = function(size) {
	var obj=$scope.checkboxes.items;
	//把选中的记录放进数组里
	var dataList=[];
	//取出所有的key,也就是申请编号
	var flag=false;
	for(var prop in obj){
		if (obj.hasOwnProperty(prop)){
		//alert("prop: " + prop + " value: " + obj[prop]);   
		if(obj[prop]==true){
	       flag=true;
           var map = new Map();
           for(var i=0;i<$scope.list.length;i++){
        	   if(prop==$scope.list[i].repApplNum){
                   if ($scope.list[i].apprStat != "30") {
                       comApi.HintMessage("error", "错误", "msg.common.00047", 0, function () {});    
                       return;
                   }
                   map.put("updtTm",$scope.list[i].updtTm);
                   map.put("repApplNum",$scope.list[i].repApplNum);
                   dataList.push(map.entrySet);
        	   }
           }
		}
		}
	}
	if(flag==false){
		  comApi.HintMessage(["error","批量审批"],"错误","msg.common.00020",0,function () {});	
		  return;
    }
	var modalInstance = $modal.open({
		templateUrl : 'batchapproval.html',
		controller : 'batchapprovalController',
		size : size,
		resolve : {
			//配置需要注入JS
			deps: ['$ocLazyLoad', function ($ocLazyLoad) { return $ocLazyLoad.load(['common/js/controllers/batchapprova.js']);}]
		}
	
	});
	
	//父子传递参数
	modalInstance.result.then(function(selectedItem) {
		//组装json数数据
		var json = {dataList:dataList,apprRst:selectedItem};
        comApi.post("RepApplReport/apprReportBatchManagement",json,function(data){
          comApi.HintMessage(["success","销售报表审批流程"], "提示","msg.common.00022",3000,function () {});	
          //审批成功后重新检索
          selectRepApplInfo($scope.selectedApprStat);
        });
	}); 

};

//查看销售报表
$scope.infoEntryAppl=function(repApplNum){
	$state.go("app.report.repApplInfoSelect",{ApplNum:repApplNum});
}
//编辑销售报表
$scope.updateEntryAppl=function(repApplNum){
	$state.go("app.report.repApplUpdate",{ApplNum:repApplNum});
}
//审批销售报表
$scope.apprEntryAppl=function(repApplNum){
	$state.go("app.report.repApplAppr",{ApplNum:repApplNum});
}

//点击全选 的事件
$scope.checkAll = function() {
      // angular 循环的方法
      angular.forEach($scope.list,function(item) {
        $scope.checkboxes.items[item.repApplNum] = $scope.checkboxes.checked;
      });
}; 
//单选的事件
$scope.checkItem = function() {
      var checked = 0, unchecked = 0, total = $scope.recordCount;
      angular.forEach($scope.list,function(item) {
        checked += ($scope.checkboxes.items[item.repApplNum]) || 0;
        unchecked += (!$scope.checkboxes.items[item.repApplNum]) || 0;
      });
      if ((unchecked == 0) || (checked == 0)) {
        $scope.checkboxes.checked = (checked == total);
      }
      angular.element(".select-all").prop("indeterminate",(checked != 0 && unchecked != 0));
  };
}]);