/**
 * Created by 朱艳春 on 2016-3-10.
 */

 app.controller("stfTempTransUpate", function ($scope, $http,$state,$stateParams,NgTableParams,$location,comApi,toaster,$filter,$modal) {
	 $scope.datas = [];
	 $scope.sec = {};
	 $scope.stf=[];
	 //加载借调事由列表
	 $scope.reasons= comApi.getSelectBoxDic("C015",0);
	 //加载人员信息
	 comApi.post('StfTempTrans/stfSelect', {
		 applNum:$stateParams.applNum
			},function(data) {
				for(var i=0;i<data.length;i++){
					var obj = {};
					obj.stfNum = data[i].stfNum;
					obj.stfNm= data[i].stfNm;
					obj.posNm= data[i].posNm;
					obj.posGrdNm= data[i].posGrdNm;
					obj.rgnNm = data[i].rgnNm;
					obj.stfEntDt = data[i].stfEntDt;
					$scope.datas.push(obj);
				}
		});
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
	        	}});
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
	                      return 1;
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
	 //加载借调信息
	 comApi.post('StfTempTrans/stfInfoSelect', {
		 applNum:$stateParams.applNum
			},function(data) {
				for(var i=0;i<data.length;i++){
					$scope.supvrStfNumDisplay = data[i].strNm;
					$scope.sec.secStartTm=data[i].secStartTm;
					$scope.sec.secEndTm=data[i].secEndTm;
					$scope.stf.dicNm=data[i].reason;
					$scope.reason=data[i].reason;
					$scope.updtTm=data[i].updtTm;
				}
		});
	 //点击提交保存
	 $scope.saveStfTempTrans = function(){
  	     //当前系统时间
         if($filter("date")($scope.sec.secStartTm,'yyyy-MM-dd') > $filter("date")($scope.sec.secEndTm,'yyyy-MM-dd')){
           comApi.HintMessage( ["error","借调"], "错误", "msg.common.00012",0, "");
           return;
         }
		 if($scope.datas.length<=0){
		   comApi.HintMessage( ["error","借调人员"], "错误", "msg.common.00014",0, "");
	       return;
	     }
	     if($scope.stf.dicNm==null || $scope.stf.dicNm==undefined || $scope.stf.dicNm==''){
	       comApi.HintMessage( ["error","事由"], "错误", "msg.common.00014",0, "");
	       return;
	     }
		 var a = $scope.supvrStfNumDisplay
		 var num = a.substr(0, a.indexOf('.'));
		 comApi.post('StfTempTrans/updateStfTempTrans', {
			 applNum:$stateParams.applNum,secStartTm:$scope.sec.secStartTm,secEndTm:$scope.sec.secEndTm,reason:$scope.reason,updtTm1:$scope.updtTm,object: $scope.datas,secStrNum:num},
			 function(data) {
			   comApi.HintMessage( ["success","人员借调"], "提示", "msg.common.00023",3000, "");  
               $state.go("app.staff.stfTempTransSelect");
			});
		 
	 }
 })
