app.controller('ModalssmdCtrl', ['$scope', '$modalInstance', 'NgTableParams', function($scope, $modalInstance, NgTableParams) {
	  
	var datas = [{rybh:"0001",xm:"罗荣龙",zw:"区域经理",dj:"A级",ssqy:"广东东区"},
				{rybh:"0002",xm:"小明",zw:"区域经理",dj:"B级",ssqy:"广东西区"}];

	  $scope.tableParams = new NgTableParams({
				page: 1, // show first page
				count: 3 // count per page
			}, {
				dataset: datas,
	  		counts: [3, 5, 10, 25]
			}); 
			
    /*$scope.items = items;
    $scope.selected = {
      item: $scope.items[0]
    };*/

   /* $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };*/

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);   