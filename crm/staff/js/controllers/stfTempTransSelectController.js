/**
 * Created by 朱艳春 on 2016-3-10.
 */


 app.controller("stfTempTransSelect", function ($scope, $http,$state,$stateParams,NgTableParams,$location,comApi) {
	 //加载一览数据
	 comApi.get('StfTempTrans/stfTempTransSelect',function(data){
		 var pageIndex=$stateParams.pageIndex;
		 if(pageIndex==null||pageIndex==""||pageIndex==undefined){
				pageIndex=1;
			}
		 	if(data==null){
			   $scope.countNumber=0;  
			   }else{
				   $scope.countNumber=data.length;		
			   }
			$scope.tableParams = new NgTableParams({
		        page: pageIndex, 
		        count: 20 
		    }, {
		        dataset: data,
		        counts: [20,50,100,200]
		        
		    });	
	 });	
	 //点击编辑跳转页面
	 $scope.stfUpdate = function(applNum){
	    	$location.path("/app/staff/stfTempTransUpdate/"+applNum);
	    }
 })
