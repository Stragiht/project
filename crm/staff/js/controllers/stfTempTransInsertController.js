/**
 * Created by 朱艳春 on 2016-3-10.
 */

 app.controller("stfTempTransInsert", function ($scope, $http,$state,$stateParams,NgTableParams,$location,$modal,comApi,toaster,$filter,$log,toaster) {
	 //初始数据
	 $scope.sec = {};
	 $scope.stf = {};
	 $scope.reasons= comApi.getSelectBoxDic("C015",0);
	 //默认第一项被选中
	 $scope.stf.dicNm=$scope.reasons[0].key;
	// 人员多选 
		    $scope.openStf = function(size) {
		        
		        var modalInstance = $modal.open({
		            templateUrl : 'multiselectstaff.html',
		            controller : 'multiSelectStaffController',
		            size : size,
		            resolve : {
		              //配置需要注入JS
		              deps: ['$ocLazyLoad', function ($ocLazyLoad) { return $ocLazyLoad.load(['common/js/controllers/multiselectstaff.js']);}]
		            }
		        
		        });
		        //父子传递参数
		        modalInstance.result.then(function(selectedItem) {
		        	if(typeof($scope.datas) != "undefined"){
		        		$scope.datas=$scope.unique($scope.datas.concat(selectedItem));
		        	}else{
		        		$scope.datas=$scope.unique(selectedItem);
		        	}
		        });
		    };
		    $scope.unique = function(data){
                var a = data;
                var b =data;
	           for (var i=0; i<a.length; i++) {  
	               var num =0;
	               for(var j=0; j<b.length; j++)
	               if(a[i].stfNum==b[j].stfNum){
	                   num++;
	                   if(num==2){
	                      data.splice(j,1);
	                   }
	               }
	              }  
                     return data;  
              }
		        $scope.openStr = function(size) {
		            
		            var modalInstance = $modal.open({
		                templateUrl : 'radiostore.html',
		                controller : 'radioStoreController',
		                size : size,
		                resolve : {
		                  //传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
		                  flag : function() {
		                      return 2;
		                  },
		                  //配置需要注入JS
		                  deps: ['$ocLazyLoad', function ($ocLazyLoad) { return $ocLazyLoad.load(['common/js/controllers/radiostore.js']);}]
		                }
		            
		            });
		            
		            //父子传递参数
		            modalInstance.result.then(function(selectedItem) {
		            	if (selectedItem.length > 0) {
		                    var strNum = selectedItem[0].strNum;
		                    var strNm = selectedItem[0].strNm;
		                    $scope.supvrStfNumDisplay = strNum+"."+strNm;
		                  }else{
		                	$scope.supvrStfNumDisplay ="";
		                  }
		            });

		        };

	 
	 //点击保存的方法
	 $scope.saveStfTempTrans = function(){
		 for(var i=0;i<$scope.datas.length;i++){
			 if($filter("date")($scope.sec.secStartTm,'yyyy-MM-dd')<$filter("date")($scope.datas[i].stfEntDt,'yyyy-MM-dd')){
	           comApi.HintMessage(["error","借调开始时间","借调人员入职时间"], "错误", "msg.common.00052",0, "");
	           return;
	         }
		 }
		 //取借调事由key用来插入借调信息表的reason
		 for(var i=0;i<$scope.reasons.length;i++){
			 var dtlNum = $scope.reasons[i].key;
		 }
		 if($scope.datas==null || $scope.datas==undefined || $scope.datas==''){
		   comApi.HintMessage( ["error","借调人员"], "错误", "msg.common.00014",0, "");
           return;
		 }
		 if($scope.supvrStfNumDisplay==null || $scope.supvrStfNumDisplay==undefined || $scope.supvrStfNumDisplay==''){
		   comApi.HintMessage( ["error","门店"], "错误", "msg.common.00014",0, "");
           return;
		 }
		 if($scope.stf.dicNm==null || $scope.stf.dicNm==undefined || $scope.stf.dicNm==''){
		   comApi.HintMessage( ["error","事由"], "错误", "msg.common.00014",0, "");
           return;
		 }
		 //当前系统时间
		 if($filter("date")($scope.sec.secStartTm,'yyyy-MM-dd')==null || $filter("date")($scope.sec.secStartTm,'yyyy-MM-dd')==undefined || $filter("date")($scope.sec.secStartTm,'yyyy-MM-dd')==''){
           comApi.HintMessage( ["error","借调开始时间"], "错误", "msg.common.00014",0, "");
           return;
         }
		 if($filter("date")($scope.sec.secEndTm,'yyyy-MM-dd')==null || $filter("date")($scope.sec.secEndTm,'yyyy-MM-dd')==undefined || $filter("date")($scope.sec.secEndTm,'yyyy-MM-dd')==''){
           comApi.HintMessage( ["error","借调结束时间"], "错误", "msg.common.00014",0, "");
           return;
         }else if($filter("date")($scope.sec.secStartTm,'yyyy-MM-dd') > $filter("date")($scope.sec.secEndTm,'yyyy-MM-dd')){
           comApi.HintMessage( ["error","借调"], "错误", "msg.common.00012",0, "");
           return;
         }
		 
		 var a = $scope.supvrStfNumDisplay
		 var num = a.substr(0, a.indexOf('.'));
		 //保存方法
		 comApi.post('StfTempTrans/insertStfTempTrans', {
			 applNum:$stateParams.applNum,secStartTm:$scope.sec.secStartTm,secEndTm:$scope.sec.secEndTm,dtlNum:dtlNum,object: $scope.datas,secStrNum:num},
			 function(data) {
			   comApi.HintMessage( ["success","人员借调"], "提示", "msg.common.00023",3000, "");  
               $state.go("app.staff.stfTempTransSelect");
			});
		 
	 }
 })
