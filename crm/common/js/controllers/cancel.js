app.controller("cancelController", function($scope, $modal, comApi,$modalInstance) {
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


});
