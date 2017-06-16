// 清楚缓存时候可用
var cleanCache = false;

// 获取缓存大小完成
function getCacheSizeComplete(data) {
  var dataJson = JSON.parse(data);
  if (dataJson.success) {
    document.getElementById("cacheSize").innerHTML = dataJson.cachesize;
    cleanCache = true;
  }
}

/**
 * Created by dxm 设置页面 Controller 2016/05/10
 */
app.controller('setupCtrl', function($scope, $state,comApi) {

	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
  $scope.hasNew = false; // 是否有新版本
  $scope.currentVersion = ""; // 版本号

  // 获取缓存大小
  window.bdk.getCacheSize();

  // 获取版本信息
  var dataJson = JSON.parse(window.bdk.isNewVersion());
  if (dataJson.success) {
    if (dataJson.result.isNewVersion == "1") {
     $scope.hasNew = true;
    }
    $scope.currentVersion = dataJson.result.currentVersion;
  }

  // 清楚缓存
  $scope.cleanCaches = function() {
    if (cleanCache) {
      var resultJson = JSON.parse(window.bdk.cleanApplicationData());
      if (resultJson.success) {
        // window.bdk.getCacheSize();
        document.getElementById("cacheSize").innerHTML = "0.0K";
        cleanCache = false;
        comApi.showMessage([ "clear" ], "msg.common.10056", 3000);
      }
    }
  }

  // 版本更新
  $scope.updateVersion = function() {
  	var url = "/commonDataController/getVersionControlInfo/{terminal}";
  	
  	if(comApi.isIOS || comApi.isIPad) {
  		url = url.replace("{terminal}", "IOS");
  	} else {
  		url = url.replace("{terminal}", "ANDROID");
  	}

  	comApi.get(url, function(data) {
  		var dataVersion = data.verNo;
  		var version = $scope.currentVersion;

  		if(comApi.versionCompare(dataVersion, version) == 1) {
  			//dataVersion > version时，表明有新版本
  		    $scope.hasNew = true;
  		    window.bdk.checkUpdate('{"forceCheck":"1"}');
  		} else {
  			var content = {template: '已是最新版本'};
  			comApi.appFaultNotice(content);
  		}
  	});
    /*if ($scope.hasNew) {
      window.bdk.checkUpdate('{"forceCheck":"1"}');
    }*/
  }
});