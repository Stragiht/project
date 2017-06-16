app.controller("legalLolidaysController",['$scope','NgTableParams','$http','comApi',  function ($scope,NgTableParams,$http,comApi) {

  var list = [];
  var year = "";
  var april = ""
  var count = 0;
  //一览查询
  comApi.get("staff/legalLolidaysSelect",function(data){
    if(data.length > 0){
      $scope.countfalg=data.length;
      year = data[0].dateVal.substring(0,4)
      april = data[0].dateVal.substring(5);
      if(data.length > 1){
        for(var i=1;i<data.length;i++){
          if(year != data[i].dateVal.substring(0,4)){
            count += 1;
            list[list.length] = {year:year,april:april}
            year = data[i].dateVal.substring(0,4);
            april = data[i].dateVal.substring(5);
          }else{
            april += "," + data[i].dateVal.substring(5);
          }
        }
        list[list.length] = {year:year,april:april}
      }else{
        list[0] = {year:year,april:april}
      }
    }else{
      $scope.countfalg=0;
    }
    $scope.legalLolidaysList = list;
  });
  //删除
  $scope.del = function(year,index){
    comApi.openDelWindow(function(){
      comApi.post("staff/legalLolidaysDelete",{dateVal : year},function(data){
        $scope.legalLolidaysList.splice(index,1);
        $scope.countfalg=$scope.legalLolidaysList.length;
      });
    })
  }
}]);
//限定字段超出规定字符数省略号显示
app.filter('cut', function () {
    return function (value, wordwise, max, tail) {
      if (!value) return '';

      max = parseInt(max, 10);
      if (!max) return value;
      if (value.length <= max) return value;

      value = value.substr(0, max);
      if (wordwise) {
        var lastspace = value.lastIndexOf(' ');
        if (lastspace != -1) {
          value = value.substr(0, lastspace);
        }
      }

      return value + (tail || ' …');
    };
  });