
app.controller('attendanceAdminCtrl', function($scope, $http, $location,comApi) {
	var navMenu = comApi.showFooterMenu("stfShow","3");
	$scope.$emit('navMenu.type', navMenu); 
});