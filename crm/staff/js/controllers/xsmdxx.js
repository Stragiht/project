/**
 * Created by helt on 2016/3/12.
 */
app.controller('XsmdxxCtrl', ['$scope','NgTableParams', function($scope,NgTableParams) {

    var data = [{a:"707",b:"GZ天河好又多店",c:"屈臣氏",d:"华南区 > 广东省 > 广州市 > 广州一区",e:"Star",f:"岑智铿",g:"85541983/85541991"},
        {a:"704",b:"GZ天河娱乐店",c:"C/S",d:"华南区 > 广东省 > 广州市 > 广州一区",e:"Super Star",f:"蒋云华",g:"85516602/87583894"}];

    $scope.gydst=data.length;

    $scope.tableParams = new NgTableParams({
        page: 1, // show first page
        count: 15 // count per page
    }, {
        dataset: data,
        counts: [15, 30, 60, 120]
    });
    // 查询
    $scope.pop = (function(){

    });
    // 删除
    $scope.delete = (function(value){
        if (confirm("删除的内容将不可恢复，\n您是否仍要继续删除该区域数据？")) {
            // 确认删除
            alert("您已成功删除了该区域数据");
        }
    });
}]);