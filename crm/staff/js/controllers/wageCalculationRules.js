app.controller('GzjsgzCtrl', ['$scope','$state','$http','NgTableParams','comApi', function($scope,$state,$http,NgTableParams,comApi) {
    //一览查询
    comApi.get("tsalrule/tsalruleSelect",function(data){
        $scope.gzjsgzyl = data
    });
    //删除
    $scope.tsalruleDelete = function (oid,index) {
      comApi.openDelWindow(function(){
          comApi.post("tsalrule/tsalruleDelete",{salcalrulenum:oid},function(data){
            $scope.gzjsgzyl.splice(index,1);
          });
      })
    };
}]);
//职位过滤
app.filter('stfbas_posNum', function(comApi) {
    return function(input ) {
        var positionGrade = "";
        for(var i=0;i< comApi.getSelectBoxJob().length;i++){
            if(comApi.getSelectBoxJob()[i].key==input.posNum){
                positionGrade = comApi.getSelectBoxJob()[i].text;
            }
        }
        for(var i=0;i< comApi.getSelectBoxPosLvl(input.posNum,"0").length;i++){
            if(comApi.getSelectBoxPosLvl(input.posNum,"0")[i].key==input.applyPosNum){
                positionGrade =positionGrade + ">" + comApi.getSelectBoxPosLvl(input.posNum,"0")[i].text;
            }
        }
        return positionGrade;
    };
});
//工资来源过滤
app.filter('stfbas_salSrc', function(comApi) {
    return function(input) {
        var strArr = input.salSrc.split(",");
        var strDx=input.subScheme;
        var strTd=input.commCalcRule;
        for(var j=0; j<strArr.length;j++){
            if(j==0){ 
                for(var i=0;i< comApi.getSelectBoxDic("C007","0").length;i++){
                    if(comApi.getSelectBoxDic("C007","0")[i].key==strArr[j]){
                        str = comApi.getSelectBoxDic("C007","0")[i].text;
                    }
                }
                if(strArr[j] == "D002"){
                    for(var i=0;i< comApi.getSelectBoxDic("C035","0").length;i++){
                        if(comApi.getSelectBoxDic("C035","0")[i].key==strDx){
                            str = str + ">" + comApi.getSelectBoxDic("C035","0")[i].text;
                        }
                    }
                }else if(strArr[j] == "D004"){
                    for(var i=0;i< comApi.getSelectBoxDic("C037","0").length;i++){
                        if(comApi.getSelectBoxDic("C037","0")[i].key==strTd){
                            str = str + ">" + comApi.getSelectBoxDic("C037","0")[i].text;
                        }
                    }
                }
            }else if(j>0){
                for(var i=0;i< comApi.getSelectBoxDic("C007","0").length;i++){
                    if(comApi.getSelectBoxDic("C007","0")[i].key==strArr[j]){
                        str = str + "," + comApi.getSelectBoxDic("C007","0")[i].text;
                    }
                }
                if(strArr[j] == "D002"){
                    for(var i=0;i< comApi.getSelectBoxDic("C035","0").length;i++){
                        if(comApi.getSelectBoxDic("C035","0")[i].key==strDx){
                            str = str + ">" + comApi.getSelectBoxDic("C035","0")[i].text;
                        }
                    }
                }else if(strArr[j] == "D004"){
                    for(var i=0;i< comApi.getSelectBoxDic("C037","0").length;i++){
                        if(comApi.getSelectBoxDic("C037","0")[i].key==strTd){
                            str = str + ">" + comApi.getSelectBoxDic("C037","0")[i].text;
                        }
                    }
                }
            }
        }
        return str;
    };
});