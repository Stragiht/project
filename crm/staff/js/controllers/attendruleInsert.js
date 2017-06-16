app.controller('kqgzjsglInsertCtrl', [
    '$state',
    '$scope',
    'comApi',
    '$modal',
    function($state, $scope, comApi, $modal) {

      // 档期初始化数据
      $scope.attendRuleData = {};
      
      //C042
      $scope.kqfss = comApi.getSelectBoxDic("C042","0");
      var AttDays;// 档期间隔天数(档期结束日期-档期开始日期+1)
      var holiday = 0;// 不需要出勤天数,在设定【不需出勤具体日期】时赋值
      // 获取档期组
      $scope.phaGrpOidList = comApi.getSelectBoxPhaGrp("0");
      $scope.phaGrpOid = $scope.phaGrpOidList[0].key;
      // 获取档期
      $scope.phaIdList = comApi.getSelectBoxPhase($scope.phaGrpOid, "0");
      $scope.phaId = $scope.phaIdList[0].key;
      $scope.phaStartTm = $scope.phaIdList[0].phaStartTm;
      $scope.phaEndTm = $scope.phaIdList[0].phaEndTm;

      init($scope.phaId);
      // 档期组变更重新取得档期列表
      $scope.changePhaGrpOid = function(phaGrpOid) {
        $scope.phaIdList = comApi.getSelectBoxPhase($scope.phaGrpOid, "0");
        $scope.phaId = $scope.phaIdList[0].key;
        $scope.phaStartTm = $scope.phaIdList[0].phaStartTm;
        $scope.phaEndTm = $scope.phaIdList[0].phaEndTm;
        
        // 查询该档期开始日期和结束日期
        var json = {
          applyPhaNum : $scope.phaId
        };
        comApi.post("AttendRule/getAttendDays", json, function(data) {
          AttDays = data;
          for ( var i in $scope.kqgzjsdata) {
            if ($scope.kqgzjsdata[i].attMode == "0") {
              $scope.kqgzjsdata[i].attDays = AttDays;
              $scope.kqgzjsdata[i].exactDate = "";
            }
            $scope.kqgzjsdata[i].weekend = "";
          }
        });
      };

      // 职位等级初始化数据
      $scope.jobList = comApi.getSelectBoxJob("0");
      $scope.attendRuleData.position = $scope.jobList[0].key;

      // 档期选择重新取得档期列表
      $scope.changePhaId = function() {
        for (var i = 0; i < $scope.phaIdList.length; i++) {
          if ($scope.phaId == $scope.phaIdList[i].key) {
            $scope.phaStartTm = $scope.phaIdList[i].phaStartTm;
            $scope.phaEndTm = $scope.phaIdList[i].phaEndTm;
          }
        }

        // 查询该档期开始日期和结束日期
        var json = {
          applyPhaNum : $scope.phaId
        };
        comApi.post("AttendRule/getAttendDays", json, function(data) {
          AttDays = data;
          for ( var i in $scope.kqgzjsdata) {
            if ($scope.kqgzjsdata[i].attMode == "0") {
              $scope.kqgzjsdata[i].attDays = AttDays;
              $scope.kqgzjsdata[i].exactDate = "";
            }
            $scope.kqgzjsdata[i].weekend = "";
          }
        });
      };

      // 变更考勤方式，需出勤天数变更
      $scope.changeAttMode = function(attendRuleData) {
        if (attendRuleData.attMode == "1") {
          attendRuleData.attDays = "提交销售报表为准";
          attendRuleData.exactDate = "提交销售报表为准";
          attendRuleData.weekend = 0;
        } else if (attendRuleData.attMode == "0") {
          attendRuleData.attDays = AttDays - attendRuleData.weekend;
          attendRuleData.exactDate = "";
        }
      };

      // 删除
      $scope.del = function(index) {
        $scope.kqgzjsdata.splice(index, 1);
      }

      // 新增
      $scope.insertKqgzjs = function(valid) {
        // 提交时进行信息验证
        $scope.isSubmitted = true;
        // check验证选择职位信息时,至少保留一行table数据
        if ($scope.kqgzjsdata.length == 0) {
          comApi.HintMessage("error", "", "msg.common.00030", 0, "");
          return;
        }
        // check不需出勤的具体日期不能为空
        // var exactday=isEmpty($scope.kqgzjsdata);
        // if(exactday==0){
        // comApi.HintMessage(["error","不需出勤具体日期"],"","msg.common.00014",0,"");
        // return;
        // }
        // 判断是否存在相同的职位
        var flag = isRepeat($scope.kqgzjsdata);
        if (flag) {
          comApi
              .HintMessage([ "error", "职位名称" ], "", "msg.common.00017", 0, "");
          return;
        } else {
        }

        if (valid) {
          // 整理json数据
          var json = {
            attRuleGridObject : $scope.kqgzjsdata,
            applyPhaNum : $scope.phaId,
            ruleNm : $scope.ruleNm
          };
          comApi.post("AttendRule/attendRuleInsert", json, function(data) {
            if (data == 1) {
              comApi.HintMessage([ "error", "档期" ], "", "msg.common.00017", 0,
                  "");
              return;
            } else {
              $scope.kqgzjsdata = [ {} ];
              comApi.HintMessage([ "success", "考勤规则" ], "", "msg.common.00023",
                  3000, function() {
                  });
              $state.go("app.staff.attendRule");
            }
          });
        }
      }

      // table
      $scope.kqgzjsdata = [];
      $scope.add = function() {
        $scope.jobList = comApi.getSelectBoxJob("0");
        var position = $scope.jobList[0].key;
        $scope.kqgzjsdata.push({
          position : position,
          attMode : "0",
          attDays : AttDays,
          exactDate : "",
          weekend : 0
        });
      }

      // 获取档期间隔时间
      function init(phaId) {
        var json = {
          applyPhaNum : phaId
        };
        comApi.post("AttendRule/getAttendDays", json, function(data) {
          AttDays = data;
        })
      }

      // 选择不出勤日期
      $scope.open5 = function(attendRuleData) {
        var modalInstance = $modal.open({
          templateUrl : 'common/tpl/selectHoliday.html',
          controller : 'selectHolidayController',
          resolve : {
            fromDate : function() {
              return angular.copy($scope.phaStartTm);
            },
            toDate : function() {
              return angular.copy($scope.phaEndTm);
            },
            // 配置需要注入JS
            deps : [
                '$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad
                      .load([ 'common/js/controllers/selectHoliday.js' ]);
                } ]
          }
        });

        // 父子传递参数
        modalInstance.result.then(function(selectedItem) {
          // 不需要出席天数
          attendRuleData.weekend = selectedItem.length;
          // 需要出勤的天数
          attendRuleData.attDays = AttDays - attendRuleData.weekend;
          if (selectedItem.length == 0) {
            attendRuleData.exactDate = "";
          } else {
            var day = concat(selectedItem);
            attendRuleData.exactDate = day;
          }
        });

      };
    } ]);

// 验证数组内元素重不重复,true重复,false不重复
function isRepeat(arr) {
  var hash = {};
  for ( var i in arr) {
    if (hash[arr[i].position]) {
      return true;
    }
    hash[arr[i].position] = true;
  }
  return false;
}

// 验证数组内元素不能为空,true不为空,false为空
function isEmpty(arr) {
  for ( var i in arr) {
    if (arr[i].exactDate == "" || arr[i].exactDate == null) {
      return false;
    }
  }
  return true;
}

// 不需出勤具体日期按照业务方式显示。
/*function concat2(arr) {
  var con = new Array();
  var map = new Map();
  for (var i = 0; i < arr.length; i++) {
    con.push(arr[i].date.split('-'));
  }

  for (var i = 0; i < con.length; i++) {
    var dat = con[i];

    if (map.contains(dat[0])) {
      var temp = map.get(dat[0]);
      if (temp.contains(dat[1])) {
        temp.put(dat[1], temp.get(dat[1]) + '|' + dat[2]);
      } else {
        temp.put(dat[1], dat[2]);
      }
    } else {
      var temp = new Map();
      temp.put(dat[1], dat[2]);
      map.put(dat[0], temp);
    }
  }

  return map.toString();

  function Map() {
    this.keys = new Array();
    this.data = new Object();

    this.put = function(key, value) {
      if (this.data[key] == null) {
        this.keys.push(key);
      }
      this.data[key] = value;
    };

    this.get = function(key) {
      return this.data[key];
    };

    this.contains = function(key) {
      var len = this.keys.length;
      for (var i = 0; i < len; i++) {
        if (key == this.keys[i])
          return true;
      }
      return false;
    }

    this.toString = function() {
      var s = "";
      this.keys.sort();
      for (var i = 0; i < this.keys.length; i++) {
        var k = this.keys[i];
        s += k + "-" + this.data[k];
        ',' != s.charAt(s.length - 1) ? s += ',' : s = s;
      }

      s = s.substring(0, s.lastIndexOf(','));

      return s;
    };
  }
 
}*/

//不需出勤具体日期按照业务方式显示。
function concat(arr) {
  var date = arr[0].date;
  for (var i = 1; i < arr.length; i++) {
    date = date + ","+arr[i].date;
  }
  return date;
}