app.controller('memRtnRuleUpdateCtrl', ['$scope', 'comApi', '$stateParams','$state',function($scope,comApi,$stateParams,$state) {

    //职位名称
    $scope.list=[{a:'',b:''}];
   /* $scope.add1=function(){
        var obj={a:'',b:''};
        $scope.list.push(obj);
    }*/

    $scope.add1=function(){
        var obj = {a:'0000'};
        $scope.posNumListCopy.push(obj);
    };

  /*  $scope.del1=function(idx){
        $scope.list.splice(idx,1);
    }*/

    $scope.del1=function(idx){
       // $scope.membRtnRuleUpd.posNumList.splice(idx,1);
        $scope.posNumListCopy.splice(idx,1);
    };

    var oId = $stateParams.oId;
    //查看详情
    comApi.get('membRtnRule/selectMembRtnRuleByOId/'+oId, function(data){
        $scope.membRtnRuleUpd = data;
        $scope.posNumListCP = angular.copy($scope.membRtnRuleUpd.posNumList);
        var obj = {a:''};
        $scope.posNumListCopy = [];
        for (var i = 0; i<$scope.posNumListCP.length; i++) {
            $scope.posNumListCopy.push({a:$scope.posNumListCP[i]});
        }
    });

    //获取所有的职位信息
    $scope.jobPosAll = comApi.getSelectBoxJob(0);

    //获取所有回访事项
    $scope.allMembRtnRuleRtn  = comApi.getAllMembRtnRuleRtn(0);
    $scope.allMembRtnRuleRtnCopy = angular.copy($scope.allMembRtnRuleRtn);

    //大盒子
    /*$scope.goodslist=[{a:'',b:'',c:'',rowlist:[{a:'',b:''}],infor:[{a:'',b:''}]}]
     $scope.add=function(){
     var obj={a:'',b:'',c:'',rowlist:[{a:'',b:''}],infor:[{a:'',b:''}]};
     $scope.goodslist.push(obj);
     }
     */
   /* $scope.del=function(idx){
        $scope.goodslist.splice(idx,1);
    }*/

    $scope.add=function(){
        var obj = {
            "gdsSpecList": [
                /*{
                    "chnlNumList": [
                        ""
                    ],
                    "gdsSpecDtlNm": "",
                    "gdsSpecDtlNum": ""
                }*/
            ],
            "rtnTskTmList": [
                {
                    "fbkTimes": '',
                    "rtnInterval": '',
                    "rtnItem": $scope.allMembRtnRuleRtn[0].text
                }
            ]
        };
        $scope.membRtnRuleUpd.gdsAndTskTmList.push(obj);
    };

    $scope.del=function(idx){
        $scope.membRtnRuleUpd.gdsAndTskTmList.splice(idx,1);
    };

    //相关商品
    $scope.add2=function(rowlist){
        //var obj={a:'',b:''};
        var obj = {
            "chnlNumList": [
                ""
            ],
            "gdsSpecDtlNm": "",
            "gdsSpecDtlNum": ""
            };
        rowlist.push(obj);
    };

    $scope.dell2=function(rowlist, idx){
        rowlist.splice(idx,1);
    };

    //回访详情
    $scope.add3=function(infor){
        var obj={
            "fbkTimes": '',
            "rtnInterval": '',
            "rtnItem": comApi.isNotEmptyObject($scope.allMembRtnRuleRtn) ? $scope.allMembRtnRuleRtn[0].text : ''
        };
        infor.push(obj);
    };

    $scope.testTxt = '是否使用咨询';

    $scope.dell=function(infor, idx){
        infor.splice(idx,1);
    };

    $scope.memRtnRuleSub = function() {
        //职位数据拼接
        var obj = [];
        for (var j=0;j<$scope.posNumListCopy.length; j++) {
            obj[j] = $scope.posNumListCopy[j].a;
        }
        //备份提交的数据
        $scope.membRtnRuleUpdCopy = angular.copy($scope.membRtnRuleUpd);

        $scope.membRtnRuleUpdCopy.posNumList = obj;

        comApi.post('membRtnRule/updateMembRtnRule', $scope.membRtnRuleUpdCopy, function (data) {
        	comApi.successMessage('msg.member.10015');
            setTimeout(function() {
                $state.go('app.member.memRtnRule');
            },1000);
        })
    };

    $scope.add2=function(rowlist){
        var obj = {
            "chnlNumList": [
                ""
            ],
            "gdsSpecDtlNm": "",
            "gdsSpecDtlNum": ""
        };
        rowlist.push(obj);
    };
    //选择商品模态窗口(经讨论，销售渠道部显示)
    $scope.openGdsMultiSelec= function(size, gdsSpecLs){
        comApi.openGdsMultiSelect(size, 1, function(selectedItem) {
            //获取选择的商品
            if(selectedItem && selectedItem.length > 0) {
                for(var i = 0; i < selectedItem.length; i++){
                    //定义添加的对象  //gdsSpecDtlChnlVoList
                    var obj = {
                        "chnlNumList": [
                            ''
                        ],
                        "gdsSpecDtlNm": selectedItem[i].gdsSpecDtlNm,
                        "gdsSpecDtlNum": selectedItem[i].gdsSpecDtlNum
                    };


                    gdsSpecLs.push(obj);
                }

            }
        });
    }



}]);