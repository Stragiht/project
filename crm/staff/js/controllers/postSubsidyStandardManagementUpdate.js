app.controller('BjZwbzbzglCtrl', ['$stateParams','toaster','$scope','NgTableParams','comApi','$state', function($stateParams,toaster,$scope,NgTableParams,comApi,$state) {
    $scope.bjgzbzbz = [];  
    $scope.positions = comApi.getSelectBoxJob("0");
    //职位等级联动
    $scope.grade=function(position,index){
      
      if(position == "" || position == undefined || position == null){
        var position = this.userinfo.position.key;
      }
      $scope.bjgzbzbz[index].grades=comApi.getSelectBoxPosLvl(position, "0");
      
      if($scope.bjgzbzbz[index].grades.length>0){
        $scope.bjgzbzbz[index].grade = $scope.bjgzbzbz[index].grades[0];
      }else{
        $scope.bjgzbzbz[index].grade = "";
      }
    }
    $scope.add=function(){
      $scope.bjgzbzbz.push({position:$scope.positions[0],trafficExpense:"flase",mobilePhoneCharges:"flase",delflg:"2"});
      $scope.grade($scope.positions[0].key,$scope.bjgzbzbz.length-1);
    }
    $scope.del=function(flag){
      var contdelflg = 0;
      for(var i=0;i<$scope.bjgzbzbz.length;i++){
        if($scope.bjgzbzbz[i].delflg != "1"){
          contdelflg += 1;
        }
      }
      if(contdelflg>1){
        if($scope.bjgzbzbz[flag].oid){
          $scope.bjgzbzbz[flag].delflg = "1"; 
        }else{
          $scope.bjgzbzbz.splice(flag,1);
        }
      }else{
        comApi.HintMessage("error","错误","msg.common.00055",0,"");
        return;
      }
    }
    $scope.insertZwbzbzgl=function(){
      var listdata = $scope.bjgzbzbz;
      for(var i = 0;i<$scope.bjgzbzbz.length-1;i++){
        for(var j = i+1;j<$scope.bjgzbzbz.length;j++){
            if($scope.bjgzbzbz[i].grade != "" && $scope.bjgzbzbz[j].grade != "" && $scope.bjgzbzbz[i].grade != undefined && $scope.bjgzbzbz[j].grade != undefined){
              if($scope.bjgzbzbz[i].grade.key == $scope.bjgzbzbz[j].grade.key){
                toaster.pop('error','错误',$scope.bjgzbzbz[j].position.text+ $scope.bjgzbzbz[j].grade.text+ "存在相同的数据!", 0, 'trustedHtml', function () {});
                return;
              }
            }else{
              if(($scope.bjgzbzbz[i].grade == "" && $scope.bjgzbzbz[j].grade == "") 
                || ($scope.bjgzbzbz[i].grade == "" && $scope.bjgzbzbz[j].grade == undefined)
                || ($scope.bjgzbzbz[i].grade == undefined && $scope.bjgzbzbz[j].grade == undefined)
                || ($scope.bjgzbzbz[i].grade == undefined && $scope.bjgzbzbz[j].grade == "")){
                toaster.pop('error','错误',$scope.bjgzbzbz[i].position.text+"职位不能重复!", 0, 'trustedHtml', function () {});
                return;
              }
            }
        }
      }
        var name = $scope.gzname;
        var listdata = $scope.bjgzbzbz;
        var bjgzbzbz = {ruleNm:name,lists:listdata};
        comApi.post("pssm/updatePssm",bjgzbzbz,function(data){
            if(data == 1){
                toaster.pop('success','错误',"修改成功!", 3000, 'trustedHtml', function () {});
                $state.go("app.staff.postSubsidyStandardManagement");
            }
        });
    }
    
    comApi.get("pssm/pssmUpdateSelect/" + $stateParams.ruleNm,function(data){
      var bjgzbzbz = [];
        $scope.gzname = $stateParams.ruleNm;
        for(var i=0;i<data.length;i++){
            var subs = data[i].subsCate.split(",");
            var trafficExpense = false;
            var mobilePhoneCharges = false;
            if(subs.length > 1){
                trafficExpense = true;
                mobilePhoneCharges = true;
            }else if(subs.length == 1){
                if(subs[0] == "trafficExpense"){
                    mobilePhoneCharges = true;
                }
                if(subs[0] == "mobilePhoneCharges"){
                    mobilePhoneCharges = true;
                }
            }
            
            var dj = comApi.getSelectBoxPosLvl(data[i].subsPos, "0");
            var position = "";
            var grade = "";
            for(var j=0;j<$scope.positions.length;j++){
              if(data[i].subsPos == $scope.positions[j].key){
                position = $scope.positions[j];
              }
            }
            for(var k=0;k<dj.length;k++){
              if(data[i].subsPosGrd == dj[k].key){
                grade = dj[k];
              }
            }
            bjgzbzbz.push({
              grades : dj,
              oid : data[i].oId,
              beizhu : data[i].remark,
              grant : data[i].subsAmt,
              position : position,
              grade : grade,
              position1 : position,
              grade1 : grade,
              trafficExpense : trafficExpense,
              mobilePhoneCharges : mobilePhoneCharges,
              delflg : "0"
          });
            
        }
        $scope.bjgzbzbz = bjgzbzbz;
    })
}]);
