app.controller('CsdxjsglInsertCtrl', ['$state','toaster','$scope','NgTableParams','comApi','$state', function($state,toaster,$scope,NgTableParams,comApi,$state) {
    //删除
    $scope.del=function(index){
        $scope.csdxjsdata.splice(index,1);
    }
    //保存
    $scope.insertCsdxjs=function(){
        xzdata = $scope.csdxjsdata;
        for(var i = 0;i < xzdata.length;i++){
            //省
            if(xzdata[i].province.key == undefined){
                toaster.pop('error','提示',"省不能为空!", 0, 'trustedHtml', function () {});   
                return;
            }
            //市
            if(xzdata[i].city.key == undefined){
                toaster.pop('error','提示',"市不能为空!", 0, 'trustedHtml', function () {});   
                return;
            }
            if(xzdata[i].basSalBase == undefined || xzdata[i].basSalBase == ""){
                toaster.pop('error','提示',"底薪基数不能为空!", 0, 'trustedHtml', function () {});   
                return;
            }
        }
        comApi.post("cbsbm/insertCbsbm",xzdata,function(data){
            if(data=="1"){
                toaster.pop('success','提示',"保存成功!", 2000, 'trustedHtml', function () {});
                $state.go("app.staff.cityBaseSalaryManagement");
            }else if(data == "0"){
                toaster.pop('error','提示',"保存失败!", 0, 'trustedHtml', function () {});
            }else{
                toaster.pop('error','提示',data+"已经存在!", 0, 'trustedHtml', function () {});
            }
        });
    }
    $scope.csdxjsdata = [];
    $scope.csdxjsdata=[{basSalBase:"",remark:""}];
    //获取省
    $scope.provinces = comApi.getSelectBoxPCV("1", "0");
    $scope.csdxjsdata[0].province = $scope.provinces[0];
    //省市联动
    $scope.shengshi = function(sheng,index){
      if(sheng == "" || sheng == undefined || sheng == null){
        var sheng = this.userinfo.province.key;
      }
      //获取市
      $scope.csdxjsdata[index].citys = comApi.getSelectBoxPCV(sheng, "0");
      if($scope.csdxjsdata[index].citys.length>0){
        $scope.csdxjsdata[index].city = $scope.csdxjsdata[index].citys[0];
      }
    }
    $scope.shengshi($scope.provinces[0].key,"0");
    
    
    $scope.add=function(){
      $scope.csdxjsdata.push({province:$scope.provinces[0],basSalBase:"",remark:""});
      $scope.shengshi($scope.provinces[0].key,$scope.csdxjsdata.length-1);
    }
    
}]);
