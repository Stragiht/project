
app.controller('saleDataCtrl', function($scope, $http, $location,comApi) {
	var navMenu = comApi.showFooterMenu("reportShow","2");
	$scope.$emit('navMenu.type', navMenu); 
});