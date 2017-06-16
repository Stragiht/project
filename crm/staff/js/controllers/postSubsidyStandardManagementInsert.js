app.controller('XzZwbzbzglCtrl', ['toaster','$scope','NgTableParams','comApi','$state', function(toaster,$scope,NgTableParams,comApi,$state) {
  $scope.xzgzbzbz=[{trafficExpense:"flase",mobilePhoneCharges:"flase"}];
  $scope.positions = comApi.getSelectBoxJob("0");
  $scope.xzgzbzbz[0].position = $scope.positions[0];
    
    $scope.grade=function(position,index){
      
      if(position == "" || position == undefined || position == null){
        var position = this.userinfo.position.key;
      }
      $scope.xzgzbzbz[index].grades=comApi.getSelectBoxPosLvl(position, "0");
      
      if($scope.xzgzbzbz[index].grades.length>0){
        $scope.xzgzbzbz[index].grade = $scope.xzgzbzbz[index].grades[0];
      }
    }
    $scope.grade($scope.positions[0].key,"0");
    
    $scope.add=function(){
        $scope.xzgzbzbz.push({position:$scope.positions[0],trafficExpense:"flase",mobilePhoneCharges:"flase"});
        $scope.grade($scope.positions[0].key,$scope.xzgzbzbz.length-1);
    }
    $scope.del=function(flag){
      if($scope.xzgzbzbz.length>1){
        $scope.xzgzbzbz.splice(flag,1);
      }else{
        comApi.HintMessage("error","错误","msg.common.00055",0,"");
        return;
      }
    }
    $scope.insertZwbzbzgl=function(){
        for(var i = 0;i<$scope.xzgzbzbz.length-1;i++){
          for(var j = i+1;j<$scope.xzgzbzbz.length;j++){
              if($scope.xzgzbzbz[i].grade != "" && $scope.xzgzbzbz[j].grade != "" && $scope.xzgzbzbz[i].grade != undefined && $scope.xzgzbzbz[j].grade != undefined){
                if($scope.xzgzbzbz[i].grade.key == $scope.xzgzbzbz[j].grade.key){
                  toaster.pop('error','错误',$scope.xzgzbzbz[j].position.text+ $scope.xzgzbzbz[j].grade.text+ "存在相同的数据!", 0, 'trustedHtml', function () {});
                  return;
                }
              }else{
                if(($scope.xzgzbzbz[i].grade == "" && $scope.xzgzbzbz[j].grade == "") 
                  || ($scope.xzgzbzbz[i].grade == "" && $scope.xzgzbzbz[j].grade == undefined)
                  || ($scope.xzgzbzbz[i].grade == undefined && $scope.xzgzbzbz[j].grade == undefined)
                  || ($scope.xzgzbzbz[i].grade == undefined && $scope.xzgzbzbz[j].grade == "")){
                  toaster.pop('error','错误',$scope.xzgzbzbz[i].position.text+"职位不能重复!", 0, 'trustedHtml', function () {});
                  return;
                }
              }
          }
        }
        var i = 0;
        var name = $scope.gzname;
        var listdata = $scope.xzgzbzbz;
        var xzzwbzbzgl = {ruleNm:name,lists:listdata};
        comApi.post("pssm/insertPssm",xzzwbzbzgl,function(data){
            if(data == 0){
                toaster.pop('error','错误',"此规则名称已存在！", 0, 'trustedHtml', function () {});
            }else if(data == 1){
                toaster.pop('success','提示',"保存成功!", "3000", 'trustedHtml', function () {});
                $state.go("app.staff.postSubsidyStandardManagement");
            }
        });
    }
}]);
