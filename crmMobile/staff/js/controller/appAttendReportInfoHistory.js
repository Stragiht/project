/**
 * 请假管理详情
 */
app.controller('appAttendReportInfoHistoryController', function ($scope, $sessionStorage, $ionicPopup, $state, comApi, $stateParams) {
    
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	//初始化
    function init() {
        //初始化查询列表数据
        comApi.get("GenAttendReport/selectStfAttendDtlbyStfNum/" + $stateParams.oid, function (data) {
            $scope.AttendDatas = data;
            $scope.kqmxDatas = JSON.parse(data.kqmx);
            //流程数据
            comApi.post('LeaveManagementController/approvalListSelect', {
                leaveNm : data.applNum
            }, function(data) {
                if (data.length > 0) {
                    $scope.apprHisDisplay = true;
                }
                $scope.approvalList = data;

            });
        });
        $scope.apprShow = false;
        $scope.apprShowNo = true;
        $scope.apprCommonts = "";
    }

    init();
 // 调用打电话
    $scope.callPhone = function() {
      var data = '{"phone" : ' + $scope.AttendDatas.phone + '}';
      var resultJson = JSON.parse(window.bdk.callNumber(data));
    }
});