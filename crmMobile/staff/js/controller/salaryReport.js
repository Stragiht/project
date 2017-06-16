
app.controller('salaryReportCtrl', function($scope, $http, $location,comApi) {
	var navMenu = comApi.showFooterMenu("stfShow","4");
	$scope.$emit('navMenu.type', navMenu); 
});