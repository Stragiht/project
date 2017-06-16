app.controller('stfRptSaleInfoSelectController', ['$scope','NgTableParams','$state','comApi','$filter',function($scope,NgTableParams,$state,comApi,$filter){
	    //初始化数组
	    $scope.comparison={};
	    //比对结果(all.全部，1.正确，2.有错)
	    var compRslt;
	    if(compRslt==null||compRslt==""||compRslt==undefined){
	    	compRslt = 'all';
	    }
	    //比对结果按钮状态(初始为全部)all.全部，trueResult.正确，errorResult.有错
	    var radioModel = 'all';
	    if(compRslt == 'all'){
	        radioModel = 'all';
	    }else if(compRslt == '1'){
	        radioModel = 'trueResult';
	    }else if(compRslt == '2'){
	        radioModel = 'errorResult';
	    }
	   $scope.radioModel = radioModel;
	   //初始化面板展开
	   $scope.oneAtATime = true;
	   $scope.status = {
			   open : true
	   };        
	   //初始化ng-table的checkboxes
	   $scope.checkboxes = {
			checked : false,
			items : {}
	   };
	   //初始化记录条数
	   $scope.listcount=0;
	   // 取得销售报表开启审核流程的状态
	   comApi.get("StfRptSaleInfoReport/selectSaleReportStatus", function(data) {
	       if (data == "0") {
	           // 未开启的时候，设定【开启审核流程】按钮可用
	           $scope.saleReportStatus = false;
	       } else {
               // 否则，设定【开启审核流程】按钮不可用
               $scope.saleReportStatus = true;
	       }
	   });
	   //比对查看
	   $scope.comparisonLook=function(compRslt){ 
	   if($filter("date")($scope.comparison.comparisonstart,'yyyy-MM-dd')>$filter("date")($scope.comparison.comparisonend,'yyyy-MM-dd')){
		   comApi.HintMessage(["error","比对"],"错误","msg.common.00012",0,function () {});	
           return;
       }
	   if($scope.comparison.comparisonstart==''||$scope.comparison.comparisonstart==null||$scope.comparison.comparisonstart==undefined){
		   comApi.HintMessage(["error","比对开始时间"],"错误","msg.common.00014",0,function () {});	
           return;
       }
	   if($scope.comparison.comparisonend==''||$scope.comparison.comparisonend==null||$scope.comparison.comparisonend==undefined){
		   comApi.HintMessage(["error","比对结束时间"],"错误","msg.common.00014",0,function () {});	
		   return;
	   }
	   var comp;
	   if(compRslt=='1000'){
		   comp=$scope.radioModel;
		   if(comp=='all'){
		      comp='all';
		   }else if(comp=='trueResult'){
		      comp='1';
		   }else if(comp=='errorResult')
		      comp='2';
	   }else{
		   comp=compRslt;
	   } 
	   //组装数据
	   var json={
			   compRslt:comp,
			   billOfLandTmStrat:$scope.comparison.comparisonstart,
			   billOfLandTmEnd:$scope.comparison.comparisonend,
			   gdsSalTmStart:$scope.comparison.comparisonstart,
			   gdsSalTmEnd:$scope.comparison.comparisonend,
			   repApprStartDt:$scope.comparison.comparisonstart,
			   repApprEndDt:$scope.comparison.comparisonend
			   }
	   comApi.post('StfRptSaleInfoReport/selectStfRptSaleInfo',json,function(data) {
		   if(data.hasOwnProperty("maxCount")){
	         if (data.length == data[0].maxCount) {
		         comApi.HintMessage( ["success",data[0].maxCount], "提示", "msg.common.00021",3000, "");	
	         }
		   }
	   if(data.length==0){
		       //comApi.HintMessage("error","错误","NoDatas",0,function () {});	
			   $scope.listcount=0;
			   $scope.tableParams = new NgTableParams({
					page: 1, // show first page
					count: 20 // count per page
				}, {
					dataset: data,
					counts: [20, 50, 100, 200]
				});
				//初始化ng-table的checkboxes
				$scope.checkboxes = {
						checked : false,
						items : {}
				};
				angular.element(".select-all").prop("indeterminate",false);
			    return;
	   }
	   $scope.tableParams = new NgTableParams({
					page: 1, // show first page
					count: 20 // count per page
				}, {
					dataset: data,
					counts: [20, 50, 100, 200]
				});
				//统计记录条数
				$scope.listcount=data.length;
				//绑定个数据集供复选框全选用
				$scope.list=data;
				//初始化ng-table的checkboxes
				$scope.checkboxes = {
						checked : false,
						items : {}
				};
				angular.element(".select-all").prop("indeterminate",false);
				//初始化全选checkbox
				//$scope.checkboxes.checked=false;
			    // 取得销售报表开启审核流程的状态
			    comApi.get("StfRptSaleInfoReport/selectSaleReportStatus", function(data) {
			        if (data == "0") {
			            // 未开启的时候，设定【开启审核流程】按钮可用
			            $scope.saleReportStatus = false;
			        } else {
			            // 否则，设定【开启审核流程】按钮不可用
			            $scope.saleReportStatus = true;
			        }
			    });
			})
	   }
	    //根据比对结果查询一览
	    $scope.comparisonResult = function (compRslt) {
	        //比对结果(all.全部，1.正确，2.有错)
	    	compRslt = compRslt;
	    	$scope.comparisonLook(compRslt);
	    }
	    
	    //开启BPM审核流程
	    $scope.openAudit=function(){
	    	   //获取当前页面比对结果
	    	   var comp=$scope.radioModel;
			   if(comp=='all'){
			      comp='all';
			   }else if(comp=='trueResult'){
			      comp='1';
			   }else if(comp=='errorResult'){
			      comp='2';
			   }
	          var obj=$scope.checkboxes.items;
	          //把选中的门店放进数组里
	          var arr = new Array();  
	          //取出所有的key,也就是门店编号
	          var flag=false;
	          for(var prop in obj){
	        	if (obj.hasOwnProperty(prop)){
	        	//alert("prop: " + prop + " value: " + obj[prop]);   
	        	if(obj[prop]==true){
	    	         flag=true;
	    	         arr.push(prop);
	        	}
	        	}
	          }
	          if(flag==false){
	        	  comApi.HintMessage(["error","开启销售报表审批流程"],"错误","msg.common.00020",0,function () {});	
	        	  return;
	          }else{ 
	              // 设定【开启审核流程】按钮不可用
	              $scope.saleReportStatus = true;
	       	   //组装数据
	       	   var json={
		       			   compRslt:comp,
		       			   billOfLandTmStrat:$scope.comparison.comparisonstart,
		       			   billOfLandTmEnd:$scope.comparison.comparisonend,
		       			   gdsSalTmStart:$scope.comparison.comparisonstart,
		       			   gdsSalTmEnd:$scope.comparison.comparisonend,
		       			   repApprStartDt:$scope.comparison.comparisonstart,
		       			   repApprEndDt:$scope.comparison.comparisonend,
		       			   strNumArray:arr
	       			   }
	        	  //如果有选中的门店数据就执行开启审核流程,至于能否开启成功,后台有业务判断
	        	  comApi.post('StfRptSaleInfoReport/openAudit',json,function(data){
                      if (data == 0) {
                          // 未开启的时候，设定【开启审核流程】按钮可用
                          $scope.saleReportStatus = false;   
                          comApi.HintMessage( ["success","销售报表审批流程"], "提示", "msg.common.00025",3000, ""); 
                          //重新加载数据
                          $scope.comparisonLook('1000');
                      } else if(data == 1){	
                          // 未开启的时候，设定【开启审核流程】按钮可用
                          $scope.saleReportStatus = false;   
	        			  comApi.HintMessage("error","错误","msg.common.00027",0,function () {});	
		        		  return;
	        		  }else if (data == 2){
	                      // 未开启的时候，设定【开启审核流程】按钮可用
	                      $scope.saleReportStatus = false;   
	        		      comApi.HintMessage([ "error", "开启审核流程" ], "错误", "msg.common.00039", 0, "");
	                      return;
	        		  } else if (data == 3) {
                          comApi.HintMessage([ "error", "已经有人开启审核流程" ], "错误", "msg.common.00038", 0, "");
                          return;
	        		  }
	        	  });
	          }
	    }
	    
	    //点击全选 的事件
	    $scope.checkAll = function() {
	          // angular 循环的方法
	          angular.forEach($scope.list,function(item) {
	            $scope.checkboxes.items[item.strNum] = $scope.checkboxes.checked;
	          });
	   }; 
	   //单选的事件
	   $scope.checkItem = function() {
	          var checked = 0, unchecked = 0, total = $scope.listcount;
	          angular.forEach($scope.list,function(item) {
	            checked += ($scope.checkboxes.items[item.strNum]) || 0;
	            unchecked += (!$scope.checkboxes.items[item.strNum]) || 0;
	          });
	          if ((unchecked == 0) || (checked == 0)) {
	            $scope.checkboxes.checked = (checked == total);
	          }
	          angular.element(".select-all").prop("indeterminate",(checked != 0 && unchecked != 0));
	      };
}]);