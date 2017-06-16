app.controller("deleteController", ['$scope','$modal','comApi','$modalInstance','flag',function($scope, $modal, comApi,$modalInstance,flag) {
    /**
     * 确定按钮
     */
    $scope.ok = function() {
        $modalInstance.close();
    };

    /**
     *
     * 关闭当前子画面
     *
     *
     */
    $scope.cancel = function() {
        $modalInstance.dismiss();
    };

    $scope.flag = flag;
}]);
