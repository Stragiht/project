app.controller('XzjsgzCtrl', ['$scope','$http','$location','NgTableParams','comApi','toaster','$state', function($scope,$http,$location,NgTableParams,comApi,toaster,$state) {
    //
    $scope.gzlylbdata=[{gzlylb:"",ycy:""}];
    //添加工资来源类别
    $scope.tjgzlylb = function(){
        $scope.gzlylbdata.push({gzlylb:"",ycy:""});
    };
    $scope.scgzlylb = function(flag){
        if($scope.gzlylbdata.length == 1){
          comApi.HintMessage("error","错误","msg.common.00048",0,"");
          return;
        }
        $scope.gzlylbdata.splice(flag,1);
    }
    $scope.zt = "D001";
    //选择工资来源类别的时候触发
    $scope.xzgzlylb = function(lb){
        for(var i=0; i<$scope.gzlylbdata.length-1;i++){
          for(var j=i+1; j<$scope.gzlylbdata.length;j++){
            if($scope.gzlylbdata[j].gzlylb != undefined){
              if($scope.gzlylbdata[j].gzlylb.trim() != ""){
                if($scope.gzlylbdata[i].gzlylb.trim() == $scope.gzlylbdata[j].gzlylb.trim()){
                    comApi.HintMessage( "error", "错误", "msg.common.00049",0, "");
                    setTimeout(function(){},"1000");
                    lb.userinfo.ycy ="";
                    lb.userinfo.gzlylb = "";
                    return;
                }else{
                  if($scope.gzlylbdata[i].gzlylb.trim() == "D001"){
                    if($scope.gzlylbdata[j].gzlylb.trim() == "D002"){
                      comApi.HintMessage( "error", "错误", "msg.common.00053",0, "");
                      return;
                    }
                  }else if($scope.gzlylbdata[i].gzlylb.trim() == "D002"){
                    if($scope.gzlylbdata[j].gzlylb.trim() == "D001"){
                      comApi.HintMessage( "error", "错误", "msg.common.00053",0, "");
                      return;
                    }
                  }
                }
              }
            }
          }
        }
        if(lb.userinfo.gzlylb == "D001"){
            lb.userinfo.ycy = "staff/tpl/wagecalculationrules/fixedSalary.html";
        }else if(lb.userinfo.gzlylb == "D002"){
            lb.userinfo.ycy = "staff/tpl/wagecalculationrules/basicSalary.html";
        }else if(lb.userinfo.gzlylb == "D003"){
            lb.userinfo.ycy = "staff/tpl/wagecalculationrules/wsprip.html";
        }else if(lb.userinfo.gzlylb == "D004"){
            lb.userinfo.ycy = "staff/tpl/wagecalculationrules/wsprtmspr.html";
        }else if(lb.userinfo.gzlylb == "D005"){
            lb.userinfo.ycy = "staff/tpl/wagecalculationrules/memberCommission.html";
        }else if(lb.userinfo.gzlylb == "D006"){
            lb.userinfo.ycy = "staff/tpl/wagecalculationrules/mmbcc.html";
        }else if(lb.userinfo.gzlylb == "D007"){
            lb.userinfo.ycy = "staff/tpl/wagecalculationrules/postSubsidy.html";
        }else if(lb.userinfo.gzlylb == "D008"){
            lb.userinfo.ycy = "staff/tpl/wagecalculationrules/statutoryHolidayAllowance.html";
        }
    };
    //底薪方案选择子方案
    $scope.basicSalary=function(subProgram){
        if(subProgram.xzzfa == "D001"){
            $scope.basicSalaryHidden = "staff/tpl/wagecalculationrules/basicSalarySubProgram01.html";
        }else if(subProgram.xzzfa == "D002"){
            $scope.basicSalaryHidden = "staff/tpl/wagecalculationrules/basicSalarySubProgram02.html";
        }
    }
    //提交按钮
    $scope.tjbc = function(e){
        
        //规则名称
        var gzname = $scope.gzname;
        //职位
        var position = $scope.position;
        //等级
        var grade = $scope.grade;
        //状态
        var zhuangtai = $scope.zt;
        if(gzname == undefined){
            return;
        }
        //工资来源类别
        var gzlylb = $scope.gzlylbdata[0].gzlylb;
        var flag = 0;
        for(var i = 0; i < $scope.gzlylbdata.length; i++){
            if(i > 0){
                //判断是否有来源类别没有选择
                gzlylb = gzlylb +","+ $scope.gzlylbdata[i].gzlylb;
            }
            if($scope.gzlylbdata[i].gzlylb == "D001"){
                flag = 1;
                var gdgzlylb = $scope.gzlylbdata[i].gzlylb;
                var jsgz = e.form.jsgz.$modelValue;
                if($scope.stringLength(jsgz,10)){
                  comApi.HintMessage([ "error", "计算规则","10" ], "", "msg.common.00051", 0, "");
                  return;
                }
            }
            if($scope.gzlylbdata[i].gzlylb == "D002"){
                flag = 1;
                var xjbzsyq="";
                var xjbzzzh="";
                var syqxjbz="";
                var zzhxjbz="";
                var xzzfa = e.form.xzzfa.$modelValue;
                var dxfalylb = $scope.gzlylbdata[i].gzlylb;
                if(e.form.xzzfa.$modelValue == "D001"){
                    xjbzsyq = e.form.xjbzsyq.$modelValue; 
                    xjbzzzh = e.form.xjbzzzh.$modelValue;
                    if($scope.stringLength(xjbzsyq,10)){
                      comApi.HintMessage([ "error", "试用期星级标准","10" ], "", "msg.common.00051", 0, "");
                      return;
                    }
                    if($scope.stringLength(xjbzzzh,10)){
                      comApi.HintMessage([ "error", "转正后星级标准","10" ], "", "msg.common.00051", 0, "");
                      return;
                    }
                    if(parseFloat(xjbzsyq) > parseFloat(xjbzzzh)){
                      comApi.HintMessage([ "error", "试用期星级标准","转正后星级标准" ], "", "msg.common.00052", 0, "");
                      return;
                    }
                }else if(xzzfa == "D002"){
                    syqxjbz = e.form.syqxjbz.$modelValue;
                    zzhxjbz = e.form.zzhxjbz.$modelValue;
                    if($scope.stringLength(syqxjbz,10)){
                      comApi.HintMessage([ "error", "试用期星级标准","10" ], "", "msg.common.00051", 0, "");
                      return;
                    }
                    if($scope.stringLength(zzhxjbz,10)){
                      comApi.HintMessage([ "error", "转正后星级标准","10" ], "", "msg.common.00051", 0, "");
                      return;
                    }
                    if(parseFloat(syqxjbz) > parseFloat(zzhxjbz)){
                      comApi.HintMessage([ "error", "试用期星级标准","转正后星级标准" ], "", "msg.common.00052", 0, "");
                      return;
                    }
                }   
            }
            if($scope.gzlylbdata[i].gzlylb == "D003"){
                var gryjlylb = $scope.gzlylbdata[i].gzlylb;
                var grxx = e.form.grjbmin.$modelValue;
                var grsx = e.form.grjbmax.$modelValue;
                var grjbtc = e.form.grjbtcbfb.$modelValue;
                var grcetc = e.form.grcetcbfb.$modelValue;
                if($scope.stringLength(grxx,10)){
                  comApi.HintMessage([ "error", "基本提成下限","10" ], "", "msg.common.00051", 0, "");
                  return;
                }
                if($scope.stringLength(grsx,10)){
                  comApi.HintMessage([ "error", "基本提成上限","10" ], "", "msg.common.00051", 0, "");
                  return;
                }
                if($scope.stringLength(grjbtc,3)){
                  comApi.HintMessage([ "error", "基本提成百分比","3" ], "", "msg.common.00051", 0, "");
                  return;
                }
                if($scope.stringLength(grcetc,3)){
                  comApi.HintMessage([ "error", "超额提成","3" ], "", "msg.common.00051", 0, "");
                  return;
                }
                if(parseFloat(grxx ) > parseFloat(grsx)){
                  comApi.HintMessage([ "error", "基本提成工资下限","上限" ], "", "msg.common.00052", 0, "");
                  return;
                }
            }
            if($scope.gzlylbdata[i].gzlylb == "D004"){
                var tdcylylb = $scope.gzlylbdata[i].gzlylb;
                var tdxzzfa = e.form.tdxzzfa.$modelValue;
                var tdyjtcbfb = e.form.tdyjtcbfb.$modelValue;
                if($scope.stringLength(tdyjtcbfb,3)){
                  comApi.HintMessage([ "error", "业绩提成","3" ], "", "msg.common.00051", 0, "");
                  return;
                }
            }
            if($scope.gzlylbdata[i].gzlylb == "D005"){
                var hyltcdata = $scope.hyltcdata;
                for(var j=0;j<hyltcdata.length;j++){
                  if($scope.stringLength(hyltcdata[j].xiaxian,10)){
                    comApi.HintMessage([ "error", "提取范围下限","10" ], "", "msg.common.00051", 0, "");
                    return;
                  }
                  if($scope.stringLength(hyltcdata[j].shangxian,10)){
                    comApi.HintMessage([ "error", "提取范围上限","10" ], "", "msg.common.00051", 0, "");
                    return;
                  }
                  if($scope.stringLength(hyltcdata[j].baifenbi,3)){
                    comApi.HintMessage([ "error", "提成百分比","3" ], "", "msg.common.00051", 0, "");
                    return;
                  }
                  if(parseFloat(hyltcdata[j].xiaxian)>parseFloat(hyltcdata[j].shangxian)){
                    comApi.HintMessage([ "error", "下限","上限" ], "", "msg.common.00052", 0, "");
                    return;
                  }
                }
                var hyllylb = $scope.gzlylbdata[i].gzlylb;
            }
            if($scope.gzlylbdata[i].gzlylb == "D006"){
                var hywsltcdata = $scope.hywsltcdata;
                for(var j=0;j<hywsltcdata.length;j++){
                  if($scope.stringLength(hywsltcdata[j].xiaxian,10)){
                    comApi.HintMessage([ "error", "提取范围","10" ], "", "msg.common.00051", 0, "");
                    return;
                  }
                  if($scope.stringLength(hywsltcdata[j].shangxian,10)){
                    comApi.HintMessage([ "error", "提取范围下限","10" ], "", "msg.common.00051", 0, "");
                    return;
                  }
                  if($scope.stringLength(hywsltcdata[j].baifenbi,3)){
                    comApi.HintMessage([ "error", "提成百分比","3" ], "", "msg.common.00051", 0, "");
                    return;
                  }
                  if(parseFloat(hywsltcdata[j].xiaxian)>parseFloat(hywsltcdata[j].shangxian)){
                    comApi.HintMessage([ "error", "下限","上限" ], "", "msg.common.00052", 0, "");
                    return;
                  }
                }
                var wsllylb = $scope.gzlylbdata[i].gzlylb;
            }
            if($scope.gzlylbdata[i].gzlylb == "D007"){
                var zwbzlylb = $scope.gzlylbdata[i].gzlylb;
                var sf = e.form.sf.$modelValue;
                if(sf == "0"){
                    var yuan = e.form.yuan.$modelValue;
                    if($scope.stringLength(yuan,10)){
                      comApi.HintMessage([ "error", "职位补助标准","10" ], "", "msg.common.00051", 0, "");
                      return;
                    }
                }
            }
            if($scope.gzlylbdata[i].gzlylb == "D008"){
                var fdjrlylb = $scope.gzlylbdata[i].gzlylb;
                var fdjrgzbz = e.form.fdjrgzbzbs.$modelValue;
                if($scope.stringLength(fdjrgzbz,2)){
                  comApi.HintMessage([ "error", "法定假日工资补助","2" ], "", "msg.common.00051", 0, "");
                  return;
                }
            }
        }
        if(flag == 0){
          comApi.HintMessage("error", "错误", "msg.common.00054", 0, "");
          return;
        }
        dataall = {wslhylist:hywsltcdata,wsllylb:wsllylb,hyllylb:hyllylb,hylhylist:hyltcdata,gdgzlylb:gdgzlylb,dxfalylb:dxfalylb,jsgz:jsgz,xzzfa:xzzfa,xjbzsyq:xjbzsyq,xjbzzzh:xjbzzzh,syqxjbz:syqxjbz,zzhxjbz:zzhxjbz,gryjlylb:gryjlylb,grxx:grxx,grsx:grsx,grjbtc:grjbtc,grcetc:grcetc,tdcylylb:tdcylylb,tdxzzfa:tdxzzfa,tdyjtcbfb:tdyjtcbfb,zwbzlylb:zwbzlylb,sf:sf,yuan:yuan,fdjrlylb:fdjrlylb,fdjrgzbz:fdjrgzbz,gzlylb:gzlylb,gzname:gzname,position:position,grade:grade,zhuangtai:zhuangtai};

        comApi.post("tsalrule/insterTsalrule",dataall,function (data){
          comApi.HintMessage(["success", "工资计算规则"],"", "msg.common.00023", 3000, "");
          setTimeout(function(){
              $state.go("app.staff.wageCalculationRules");
          },"1000");
        });
    };
    //会员类
    $scope.hyltcdata=[{shangxian:"",xiaxian:"",baifenbi:""}];
    //--新增
    $scope.xzhyltcxfqd = function(){
        $scope.hyltcdata.push({shangxian:"",xiaxian:"",baifenbi:""});
    };
    //--删除
    $scope.schyltcxfqd = function(index){
        $scope.hyltcdata.splice(index,1);
    };
    //会员微商类
    $scope.hywsltcdata=[{shangxian:"",xiaxian:"",baifenbi:""}];
    //--新增
    $scope.xzhywsltcxfqd = function(){
        $scope.hywsltcdata.push({shangxian:"",xiaxian:"",baifenbi:""});
    };
    //--删除
    $scope.schywsltcxfqd = function(index){
        $scope.hywsltcdata.splice(index,1);
    };
    //工资类别下拉框
    $scope.gongzilaiyuan = comApi.getSelectBoxDic("C007","0");
    //职位下拉框
    $scope.positions = comApi.getSelectBoxJob("0");
    $scope.position = $scope.positions[0].key;
    //职位等级
    $scope.positiongrade = function(){
      $scope.Grade = comApi.getSelectBoxPosLvl($scope.position,"0");
      if($scope.Grade.length>0){
        $scope.grade = $scope.Grade[0].key;
      }else{
        $scope.grade = "";
      }
    }
    $scope.positiongrade();
    
    //判断数值的长度chick
    $scope.stringLength = function(str,length){
      var n = str.indexOf(".");
      if(n>length || (n==-1 && str.length>length)){
        return true;
      }else{
        return false;
      }
    }
}]);
//底薪方案选择子方案下拉框
app.controller('subProgramCtrl', ['comApi','$scope', function(comApi,$scope) {
    $scope.subProgram = comApi.getSelectBoxDic("C035","0");
}]);
//屈臣氏销售业绩提成选择子方案下拉框
app.controller('qcsyjtcflCtrl', ['comApi','$scope', function(comApi,$scope) {
    $scope.qcsyjtcfls = comApi.getSelectBoxDic("C037","0").splice(1,2);
}]);