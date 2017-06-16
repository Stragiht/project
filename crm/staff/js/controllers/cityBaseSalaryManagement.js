app.controller('CsdxjsglCtrl', ['toaster','$stateParams','$scope','NgTableParams','comApi','$state', function(toaster,$stateParams,$scope,NgTableParams,comApi,$state) {
  $scope.countfalg = 0;  
  //当前页数(初始为第一页)
    var pageIndex = $stateParams.pageIndex;
    if(pageIndex==null||pageIndex==""||pageIndex==undefined){
        pageIndex = 1;
    }
    //当前页数据条数（当当前页数据条数为1时，做删除操作后更新数据前pageIndex需减1）
    var count = $stateParams.count;
    //当城市分区信息在最后一页并且该页数据条数为1时，pageIndex需减1
    if(count==1){
        pageIndex = pageIndex - 1;
    }
    //每页显示数据条数
    var pageCount = $stateParams.pageCount;
    if(pageCount==null||pageCount==""||pageCount==undefined){
        pageCount = 20;//每页显示数据条数，可修改
    }
    //加载列表信息
    selectList(pageIndex,pageCount);
    //一览查询
    function selectList(page,counts){
        comApi.get("cbsbm/cbsbmSelect",function(data){
            $scope.tableParams = new NgTableParams({
                page: page, // show first page
                count: counts // count per page
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
            if(data.length == 0){
                $scope.countfalg=0;
            }else{
                $scope.countfalg=data.length;
            }
        });
    }
    $scope.cancel = cancel;
    $scope.del = del;
    $scope.save = save;

    function cancel(row, rowForm) {
      var originalRow = resetRow(row, rowForm);
      angular.extend(row, originalRow);
    }
    //删除开始-------------------------------------------
    
    function del(oid,index) {
      comApi.openDelWindow(function(){
        comApi.post("cbsbm/deleteCbsbm",{oId:oid},function(data){
            if(data==1){
                //删除前最后一页数据为1条时，删除后跳到前一页
                if(count == 1){
                    pageIndex = pageIndex - 1;
                }
                selectList(pageIndex,pageCount);
            }
        });
      })
    }
    //删除结束-----------------------------------------------
    function resetRow(row, rowForm){
      row.isEditing = false;
      rowForm.$setPristine();
    }
    //修改
    function save(row,rowForm) {
        comApi.post("cbsbm/updateCbsbm",row,function (data){
            cancel(row, rowForm);
        });
    }
}]);
