/**
 * Created by 朱艳春 on 2016-4-19.
 */


 app.controller("prmnDemnRuleManage", function ($scope, $http,$state,$stateParams,NgTableParams,$location,comApi,toaster) {
	 //加载一览数据
	 comApi.get('PrmnDemnRuleManage/prmnDemnRuleManageSelect',function(data){
		 $scope.rules = data;
		 if(data==null){
			   $scope.countNumber=0;  
			   }else{
				   $scope.countNumber=data.length;		
			   }
	 });	
	//点击删除的删除方法
	 $scope.ruleDelete = function (oId) {
  	   comApi.openDelWindow(function(){
    	   comApi.post('PrmnDemnRuleManage/updatePrmnDemnRuleFlag',{oid:oId},
             function(data){
             toaster.pop('success', '',
                        '删除成功', 3000,
                        'trustedHtml',
                        function() {
                        });
             comApi.get('PrmnDemnRuleManage/prmnDemnRuleManageSelect',function(data){
                 $scope.rules = data;
                 if(data==null){
                       $scope.countNumber=0;  
                       }else{
                           $scope.countNumber=data.length;      
                       }
             });
    	   });
          })
    }
	 //点击编辑跳转页面
    $scope.ruleUpdate = function(oid){
    	$location.path("/app/staff/prmnDemnRuleUpdate/"+oid);
    }
    
 })
