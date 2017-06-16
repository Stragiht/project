/**
 * 请假管理详情
 */
app.controller('appAttendReportInfoController', function ($scope, $timeout,$sessionStorage, $ionicPopup, $state, comApi, $stateParams) {
    $scope.flag = $stateParams.flag;
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	//初始化
    function init() {
        //列表数据
        comApi.get("GenAttendReport/selectStfAttendDtlbyStfNumMobile/" + $stateParams.oid, function (data) {
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
        $scope.apprShowNo = true;
        $scope.apprCommonts = "";
    }

    init();
    //切换列表页面
    $scope.goToPage = function(){
        $scope.apprShowNo = !$scope.apprShowNo;
    };
    //提交申请
    $scope.subSub = function () {
        comApi.post("GenAttendReport/updateAppAttendReport", {oid:$stateParams.oid,updtTm:$stateParams.updtTm}, function (data) {
          comApi.showMessage("success", "msg.common.10001", 3000);  
          
          $timeout(function () {
            $state.go("appAttendReport");
          }, 3000);
        },true);
    };
    //审批
    $scope.apprAppl = function(v){
        comApi.post("GenAttendReport/updateApprAttendReportOne",{oid:$stateParams.oid,updtTm:$stateParams.updtTm,apprRst:v,apprCommonts:$scope.apprCommonts},function(data){
          comApi.showMessage("success", "msg.common.10001", 3000);    
          $timeout(function () {
            $state.go("appAttendReport");
          }, 3000);
        },true);
    };
    //跳转到编辑页面
    $scope.goEdit = function(){
        $state.go("appAttendReportInfoUpdate",{oid:$stateParams.oid,updtTm:$stateParams.updtTm})
    }
    // 调用打电话
    $scope.callPhone = function() {
      var data = '{"phone" : ' + $scope.AttendDatas.phone + '}';
      var resultJson = JSON.parse(window.bdk.callNumber(data));
    }
});