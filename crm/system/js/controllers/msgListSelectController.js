app.controller('msgListSelectController', function($scope,NgTableParams,$http,$stateParams,$state,comApi,$sessionStorage) {

    //查询消息列表请求参数
    $scope.msgListData = {
        "pageNum": 1,
        "pageSize": 0,
        "params":{
            "status": "0000"
        }
    };

    var counts = comApi.getPageCounts();
    var pageNum = 1;
    var pageSize = counts[0];
    var status = $stateParams.status;
    var radioModel = 'All';
    if(!comApi.isNotNullAndUndefined(status)){
        status = '0000';
    }

    if(status == '0000'){
        radioModel = 'All';
    }else if(status == 3){
        radioModel = 'read';
    }else if(status == 1){
        radioModel = 'unRead';
    }
    $scope.radioModel = radioModel;

    $scope.searchMsgListInfo = function(status) {

        $scope.msgListData.params.status = status;
        pageNum = 1;
        comApi.post('msgList/msgListSelect', $scope.msgListData, function(data){
            if (status == "0000") {
                var num = 0;
                angular.forEach(data.data, function(data){
                    if (data.status == "1") {
                        num++;
                    }
                });
                $scope.$emit('unReadMsgNum', num);
            } else if (status == "1"){
                $scope.$emit('unReadMsgNum', data.currentSize);
            }
            data = data.data;
            $scope.gydst=data.length;
            $scope.list=data;
            $scope.tableParams = getTableParams(pageNum, pageSize, data, counts);
        });

    };

    $scope.searchMsgListInfo(status);

    function getTableParams(pageNum, pageSize, data, counts){
        var arr = comApi.buildTableParams(pageNum, pageSize, data, counts, function(pageIndex, pageCount){
            pageNum = pageIndex;
            pageSize = pageCount;
        });
        var tableParams = new NgTableParams(arr[0], arr[1]);
        return tableParams;
    }

    //根据消息状态查询一览
    $scope.msgListSelectByStatus = function (msgStatus) {
        //消息状态(all.全部，1.未读，3.已读)
        status = msgStatus;
        $scope.searchMsgListInfo(status);
    };
  
    //删除消息
    $scope.msgListDelete = function (id) {
        comApi.openDelWindow(function(){
        	comApi.get('msgList/msgListDelete/' + id,function(data){
                $scope.searchMsgListInfo(status);
            });
        })
    };

    //查看消息
    $scope.view = function(id, curStatus){
        $state.go("app.system.msgListInfo", {id:id, msgCount:33, status:status, curStatus:curStatus});
    }

});

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