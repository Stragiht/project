/**
 * 新增排班
 */
app
    .controller(
        'updateSchedule',
        function($scope, $sessionStorage, $ionicPopup, $ionicScrollDelegate,
            $timeout, $state, $filter, comApi, ionicDatePicker, $stateParams) {
          $scope.flag = false;
        	var navMenu = comApi.showFooterMenu("");
        	$scope.$emit('navMenu.type', navMenu); 
        	
        	$scope.calendar = {};
          $scope.selectedDate = {};
          var persons = [];
          var eventss = [];
          $scope.sched = {};
          $scope.sched.daytimes = "0000";
          $scope.dimiInfo = {};
          // 初始化
          $scope.init = function() {
            $scope.sched.daytime="无";
            $scope.scheds = true;
            $scope.subSchedShow = false;
            $scope.subSchedTimeShow = false;
            $scope.subTimeShow = false;
        
       
            
            // 取得排班情况列表
            comApi.getSelectBoxDic("C041", 3).then(function(data) {
              $scope.dicList = data;
            });

            // 到结束时间实行
            comApi.getSelectBoxDic("C048", 3).then(function(data) {
              $scope.dicListTime = data;
            });
    comApi.get( 'staff/mobileStfInfo/'+$sessionStorage.userId,function(data){
              
              $scope.bltime =data[0].stfEntDt; 
                     
            // 初始化档期
            comApi.get("staff/selectSchedule", function(data) {
              list = data;
              comApi.post('staff/getShiftMngInfo', {
                schNum : $stateParams.schNum
              }, function(data) {
            	  for(var k=0;k<list.length;k++){
            		  if(data.phaNum == list[k].oId){
            			  $scope.schedtime = list[k].phaStartTm + "~" + list[k].phaEndTm;
                          // 定义一个变量值
                          // 档期开始时间
                          $scope.phastar = list[k].phaStartTm;
                          // 档期结束时间
                          $scope.phaend = list[k].phaEndTm;
            		  }
            	  }
                  $scope.sbmtTm = data.sbmtTm;
                  $scope.updtTm = data.updtTm;
                  var adphanum = data.phaNum;
                comApi.get("staff/selectSchedule", function(data) {
                  data.splice(1, 1);
                  for (var i = 0; i < data.length; i++) {
                    if (data[i].oId == adphanum) {
                      $scope.phaNum = adphanum;
                      $scope.schedtime = data[i].phaStartTm + "~"
                          + data[i].phaEndTm;
                      // 档期开始时间
                      $scope.phastar = data[i].phaStartTm;
                      var datas =$filter("date")(Date.parse($scope.phastar), 'yyyy-MM-dd');
                      var daysss = new Date(datas);
                      $scope.calendar.currentDate = new Date(daysss);
                      // 档期结束时间
                      $scope.phaend = data[i].phaEndTm;
                      break;
                    }
                  }
                  $scope.flag = true;
                });
               
                
              });
              
            });
            // 初始化门店
            comApi.get('staff/selectSubStoreListBykey/', function(data) {
              var a="";
              for(var i=0;i<data.length;i++){
                a+=data[i].strNm;
              }
              document.getElementById('kd').style.width = a.length*19 + 'px';
                persons = createJson(data);
              $scope.schedstore = data;
              $scope.selectEntryAppl(data[0].subStrNum);

            
            comApi.post('staff/getSelectShiftMngDaysList', {
              schNum : $stateParams.schNum
            }, function(data) {
              if(data.length>0){
              var datas = "[";
              for (var i = 0; i < data.length; i++) {
                datas += data[i].date
              }
              datas += datas.substring(0, datas.length - 1) + "]]";
              var abc = eval('(' + datas + ')');
              abc.pop();
              var abcd= eval('(' + persons + ')');
              for(var i=0;i<abcd.length;i++){
                for(var j=0;j<abc.length;j++){
              if(abcd[i].subStrNum==abc[j].subStrNum){
                abcd[i].data=abc[j].data;
              }
                }
              }
              persons = JSON.stringify(abcd);
              eventss = [];
              eventss = getData($scope.apprStatCnd);
              $scope.loadEvents();
              $scope.calendar.currentDate = new Date();
              }

            });
            });

    });
          }

          // 执行初始化方法
          $scope.init();
          $scope.selectedDate.events = true;
          $scope.changeMode = function(mode) {
            $scope.calendar.mode = mode;
          };

          $scope.loadEvents = function() {
            $scope.calendar.eventSource = eventss;
            $scope.$broadcast('eventSourceChanged',eventss);
          };

          $scope.selectEntryAppl = function(value) {
            updateData($scope.apprStatCnd, eventss);
            eventss = [];
            eventss = getData(value);
            $scope.loadEvents();
            $scope.apprStatCnd = value;
            $scope.calendar.currentDate = new Date($scope.calendar.currentDate);
          }

          $scope.onViewTitleChanged = function(title) {
            var m = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
                "Aug", "Sep", "Oct", "Nov", "Dec");
            var n = new Array("01", "02", "03", "04", "05", "06", "07", "08",
                "09", "10", "11", "12");
            var newtitle = title.substring(0, 3);
            for (var i = 0; i < m.length; i++) {
              if (newtitle == m[i]) {
                var a = title.substring(title.length - 4, title.length);
                // 构造一个日期对象：
                var day = new Date(a, n[i], 0);
                $scope.times = day;
                title = a + "年" + n[i] + "月";
                break;
              }

            }
            $scope.viewTitle = title;
          };
          // 今天
          $scope.today = function() {
            $scope.calendar.currentDate = new Date();
          };

          // 下个月
          $scope.monday = function() {
        	var curDate = $scope.calendar.currentDate;
        	var viewMon = curDate.getMonth() + 1;
            var daysss = new Date(curDate.getFullYear(), viewMon, 1);
            $scope.calendar.currentDate = new Date(daysss);
          }
          // 上个月
          $scope.yestmonday = function() {
        	var curDate = $scope.calendar.currentDate;
        	var viewMon = curDate.getMonth() - 1;
            var daysss = new Date(curDate.getFullYear(), viewMon, 1);
            $scope.calendar.currentDate = new Date(daysss);
          }
          $scope.isToday = function() {
            var today = new Date(), currentCalendarDate = new Date(
                $scope.calendar.currentDate);

            today.setHours(0, 0, 0, 0);
            currentCalendarDate.setHours(0, 0, 0, 0);
            return today.getTime() === currentCalendarDate.getTime();
          };
          // 显示排班情况
          $scope.subSched = function() {
            $scope.scheds = false;
            $scope.subSchedShow = true;
          }
          // 显示排班时间
          $scope.subSchedtime = function(daytime) {
            $scope.scheds = false;
            $scope.subSchedTimeShow = true;
            $scope.sched.status = daytime;
          }

          $scope.subTimeShows = function() {
            $scope.scheds = false;
            $scope.subTimeShow = true;
          }


          //计算天数差的函数，通用  
            function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2006-12-18格式  
                var  aDate,  oDate1,  oDate2,  iDays;  
                aDate  =  sDate1.split("-");  
                oDate1  =  new  Date();    //转换为12-18-2006格式  
                oDate1.setFullYear(aDate[0],aDate[1],aDate[2]);
                aDate  =  sDate2.split("-");  
                oDate2  =  new  Date();  
                oDate2.setFullYear(aDate[0],aDate[1],aDate[2]);
                iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24);    //把相差的毫秒数转换为天数  
                return  iDays;  
            } 
          // 点击 到结束时间
            $scope.clickDayTime = function(dic) {

              if(dic.key == "0000"){
                $scope.sched.daytime = dic.text;
                $scope.sched.daytimes = dic.key;
                $scope.goBack();
                return;
              }
              if ($scope.newtime == undefined) {
                comApi.showMessage(["error","开始排班日期"], "msg.common.10011", 3000);
                return;
              }
              if ($scope.sched.day == "0000") {
                comApi.showMessage(["error","早班、晚班、直落、休息"], "msg.common.10011", 3000);
                return;
              }
              var list = [];
              var first = new Date($scope.newtime);
              for(var j = 0;j<eventss.length;j++){
                if($filter("date")(Date.parse(eventss[j].startTime), 'yyyy-MM-dd') < $filter("date")(first, 'yyyy-MM-dd')){
                  list[list.length] = eventss[j];
                }
              }
              eventss = list;
              if (dic.key == 0) {
            
                var datalength =  DateDiff($filter("date")($scope.phastar, 'yyyy-MM-dd'),$filter("date")($scope.phaend, 'yyyy-MM-dd'));
                
                var data =new Date($filter("date")($scope.phastar, 'yyyy-MM-dd'));
                var a = $scope.sched.day;
                for (var i = first.getDate() - 1; i < datalength+1; i++) {
                  var daysss = new Date(data.getFullYear(), data.getMonth(),
                      i + 1,12);
                  $scope.createRandomEvents(daysss, a);
                  $scope.loadEvents();
                  if (a == "3") {
                    a = $scope.sched.day;
                  } else {
                    a = "3";
                  }
                }
              } else if (dic.key == 1) {
                var datalength =  DateDiff($filter("date")($scope.phastar, 'yyyy-MM-dd'),$filter("date")($scope.phaend, 'yyyy-MM-dd'));
                var data =new Date($filter("date")($scope.phastar, 'yyyy-MM-dd'));
                var a = $scope.sched.day;
                var d = 1;

                for (var i = first.getDate() - 1; i < datalength+1; i++) {
                  var daysss = new Date(data.getFullYear(), data.getMonth(),i + 1,12);
                  $scope.createRandomEvents(daysss, a);
                  $scope.loadEvents();
                  if (a == "3") {
                    if (d < 6) {
                      a = $scope.sched.day;
                      d = 0
                    } else if (d == 6) {
                      a = "3";
                    }
                    d++;
                  } else {
                    if (d == 6) {
                      a = "3";
                      d = 0
                    } else {
                      a = $scope.sched.day;
                    }
                    d++;
                  }
                }
              }
              
              $scope.calendar.currentDate = new Date($scope.newtime);
              $scope.sched.daytime = dic.text;
              $scope.sched.daytimes = dic.key;
              $scope.goBack();
            };
          // 选择排班时间情况
          $scope.clickDays = function(dic) {

            if (dic.oId != $scope.phaNum) {
              var confirmPopup = $ionicPopup.confirm({
                title : '提示',
                template : '确定要放弃保存当前数据？',
                okText : '确定',
                cancelText : '取消'
              });
              confirmPopup.then(function(res) {
                if (res) {
                 return;
                }
              });
              $scope.phaNum = dic.oId;
              $scope.schedtime = dic.phaStartTm + "~" + dic.phaEndTm;
              // 档期开始时间
              $scope.phastar = dic.phaStartTm;
              var datas =$filter("date")(Date.parse($scope.phastar), 'yyyy-MM-dd');
              var daysss = new Date(datas);
              $scope.calendar.currentDate = new Date(daysss);
              // 档期结束时间
              $scope.phaend = dic.phaEndTm;
           
              // 初始化门店
              comApi.get('staff/selectSubStoreListBykey/', function(data) {
                $scope.schedstore = data;
                persons = createJson(data);
                $scope.apprStatCnd = data[0].subStrNum;
                eventss = [];
              });

            }

            $scope.goBack();
          };
          // 选择排班情况
          $scope.clickDay = function(dic) {
              $scope.subScheds = dic.key;
              $scope.sched.day = dic.key;
              $scope.sched.text = dic.text;
              $scope.goBack();
          };

          // 返回
          $scope.goBack = function() {
            $scope.scheds = true;
            $scope.subSchedShow = false;
            $scope.subSchedTimeShow = false;
            $scope.subTimeShow = false;
          }
          // 选择日期事件
          $scope.onTimeSelected = function(selectedTime) {

            if ($scope.sched.day == undefined) {
              comApi.showMessage(["error","排班情况"], "msg.common.10011", 3000);
              $scope.calendar.currentDate = new Date(selectedTime);
              return;
            }

            if ($filter("date")(selectedTime, 'yyyy-MM-dd') < $filter("date")(
                $scope.phastar, 'yyyy-MM-dd')
                || $filter("date")(selectedTime, 'yyyy-MM-dd') > $filter("date")
                    ($scope.phaend, 'yyyy-MM-dd')) {
              comApi.showMessage("error", "msg.common.10012", 3000);
              $scope.calendar.currentDate = new Date(selectedTime);
 
              return;
            }
            if ($filter("date")(selectedTime, 'yyyy-MM-dd') < $filter("date")(
            		$scope.bltime, 'yyyy-MM-dd')) {
              comApi.showMessage("error", "msg.common.10044", 3000);
              $scope.calendar.currentDate = new Date(selectedTime);
              return;
            }
            var a = new Date(selectedTime);
            for (var i = 0; i < eventss.length; i++) {
              var b = new Date(eventss[i].startTime);
              if (a.getFullYear() == b.getFullYear()
                  && a.getMonth() == b.getMonth() && a.getDate() == b.getDate()) {
                eventss.splice(i, 1);
              }

            }
            $scope.createRandomEvents(selectedTime, $scope.sched.day);
            $scope.newtime = selectedTime;

            $scope.loadEvents();
            $scope.calendar.currentDate = new Date(selectedTime);
          };
          // 提交保存
          $scope.saveSchendule = function() {
            updateData($scope.apprStatCnd, eventss);
            $scope.dimiInfo.schNum = $stateParams.schNum;
            $scope.dimiInfo.strNum = $scope.apprStatCnd;
            $scope.dimiInfo.daysData = eval('(' + persons + ')');
            $scope.dimiInfo.phaNum = $scope.phaNum;
            $scope.dimiInfo.updtTm = $scope.updtTm;
            if ($scope.dimiInfo.strNum == undefined) {
              comApi.showMessage(["error","排班的门店"], "msg.common.10011", 3000);
              return;
            }
            comApi
                .post(
                    "staff/updateSched",
                    $scope.dimiInfo,
                    function(data) {
                      comApi.showMessage("success", "msg.common.10001", 3000);
                      setTimeout(function(){
                          $state.go("baShiftMngApplInfo", {
                            applNum:$stateParams.schNum
                          });
                      },"1000");
                    },true);
          };
          // 提交保存操作
          $scope.saveSubmitSchendule = function() {
            updateData($scope.apprStatCnd, eventss);
            $scope.dimiInfo.schNum = $stateParams.schNum;
            $scope.dimiInfo.strNum = $scope.apprStatCnd;
            $scope.dimiInfo.daysData = eval('(' + persons + ')');
            $scope.dimiInfo.type = "submit";
            $scope.dimiInfo.phaNum = $scope.phaNum;
            $scope.dimiInfo.sbmtTm=$scope.sbmtTm;
            $scope.dimiInfo.updtTm = $scope.updtTm;
            if ($scope.dimiInfo.strNum == undefined) {
              comApi.showMessage(["error","排班的门店"], "msg.common.10011", 3000);
              return;
            }
            comApi
                .post(
                    "staff/updateSched",
                    $scope.dimiInfo,
                    function(data) {
                      comApi.showMessage("success", "msg.common.10001", 3000);
                      setTimeout(function(){
                          $state.go("baShiftMngApplInfo", {
                            applNum:$stateParams.schNum
                          });
                      },"1000");
                    },true);
          };
          // 返回前页面
          $scope.goFrontPage = function() {
            var confirmPopup = $ionicPopup.confirm({
              title : '提示',
              template : '确定要放弃此次编辑？',
              okText : '确定',
              cancelText : '取消'
            });
            confirmPopup.then(function(res) {
              if (res) {
                $state.go("baShiftMngApplInfo",{applNum:$stateParams.schNum});
              }
            });
          };
          $scope.createRandomEvents = function(selectedTime, type) {
            var startTime;
            var endTime;
            startTime = new Date(selectedTime);
            endTime = new Date(selectedTime);
            if (type != "0000") {
                eventss.push({
                    title : type,
                    startTime : startTime,
                    endTime : endTime,
                    allDay : true
                  });
            }
          }
          /** ***************json工具类************************ */
          function createJson(data) {
            var string = "[";
            for (var i = 0; i < data.length; i++) {
              string += '{"subStrNum' + '":"' + data[i].subStrNum + '",'
                  + '"data":' + "[]},";
            }
            string = string.substring(0, string.length - 1);
            string += "]";
            return string;

          }
          function updateData(subStrNum, data) {
            var json = eval('(' + persons + ')');
            for (var i = 0; i < json.length; i++) {

              if (json[i].subStrNum == subStrNum) {
                json[i].data = data;
              }
            }
            persons = JSON.stringify(json);
            return json;
          }
          function getData(subStrNum) {
            var json = eval('(' + persons + ')');
            for (var i = 0; i < json.length; i++) {

              if (json[i].subStrNum == subStrNum) {
                return json[i].data;
              }
            }

          }
        });