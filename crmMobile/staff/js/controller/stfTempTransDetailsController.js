/**
 * Created by 朱艳春 on 2016-4-22.
 * BA借调一览
 */
app.controller('stfTempTransDetailsController', ['$scope','$ionicPopup','$stateParams','comApi','$filter',function ($scope, $ionicPopup,$stateParams,comApi,$filter) {
	
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu);

	/*var dataStr = '2016-08-09 17:54:20';
	var time = $filter("dateFormat")(dataStr);
	alert(time);
	alert(new Date(dataStr).getTime());
	alert(dataStr.replace(/-/g, ''));
	alert((dataStr.replace(/-/g, '')).split('.')[0]);*/

    //初始化方法
	$scope.init = function(){
		$scope.stfInfo={};
		$scope.superItems=[];
		comApi.post( 'StfTempTrans/stfTempTransDetailsMobileSelect',{applNum:$stateParams.applNum},function(data){
			if(data.length>0){
				$scope.stfInfo = data[0];
			}
			var stfNmJDs = data[0].stfNmJD.split(",");
			if(stfNmJDs.length > 0){
                for(var i = 0 ; i<stfNmJDs.length;i++ ){
                    $scope.superItems.push({stfNmJD:stfNmJDs[i]});
                }
            }
			$scope.stfInfo.applNum = data[0].applNum;
		});
		
	};
	//调用页面初始化
	$scope.init();
	
	// 调用打电话
	  $scope.callPhone = function() {
	    var data = '{"phone" : ' + $scope.stfInfo.phone + '}';
	    var resultJson = JSON.parse(window.bdk.callNumber(data));
	  }
}]);