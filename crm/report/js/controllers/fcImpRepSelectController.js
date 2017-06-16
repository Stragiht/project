app.controller('fcImpRepSelectController', ['toaster','$scope','$http','$state','comApi','NgTableParams',function(toaster,$scope,$http,$state,comApi,NgTableParams){
comApi.get('fcImpRepImport/selectAll',function(data) {
    	 $scope.countNumber=data.length;		
		 $scope.tableParams = new NgTableParams({
	    		 page: 1, // show first page
	    		 count: 20 // count per page
	    	 }, {
	    		 dataset: data,
	    		 counts: [20, 50, 100, 200],
	    		 getData: function($defer, params) {  
	                 $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));  
	                 //当前所在页
	                 pageIndex = params.page();
	                 //每页显示条数
	                 pageCount = params.count();
	                 //当前页数据条数
	                 count = data.slice((params.page() - 1) * params.count(), params.page() * params.count()).length;
	             }
	    	 });
    });		  
}]);