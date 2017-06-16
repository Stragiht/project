/**
 * 人员变动首页
 */
app.controller('stfChangeIndexCtrl', function($scope, $http, $location,comApi) {
	var navMenu = comApi.showFooterMenu("stfShow","2");
	$scope.$emit('navMenu.type', navMenu); 
});