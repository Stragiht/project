/**
 * Created by lenovo on 2016/9/26.
 */
app.controller('setVerMgmtController',function($scope,comApi,$modal,$state) {
	
	$scope.logDescEditor = null;
	
	$scope.verMgmtData = {"logDesc":"","updtTm":""};
	
    $scope.initVerLogInfo = function() {
    	
    	$scope.logDescEditor = MyEditor.createEditor("logDesc", {"height":"390px"});
    	
        comApi.get("systemSetting/getVerLogInfo", function(data) {
        	var logDesc = "";
        	if(data != null){
        		$scope.verMgmtData = data;
        		logDesc = data.logDesc;
        	}
        	MyEditor.setData($scope.logDescEditor, logDesc);
        })
    };


    $scope.saveVerMgmt = function() {
    	$scope.verMgmtData.logDesc = MyEditor.getHtmlVal($scope.logDescEditor);
        comApi.post("systemSetting/saveVerLog", $scope.verMgmtData, function(data) {
        	$scope.verMgmtData = data;
            comApi.successMessage("msg.common.20010");
        })
    };
    
    $scope.initVerLogInfo();
    
});