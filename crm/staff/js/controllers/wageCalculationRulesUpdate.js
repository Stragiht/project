app.controller('bjjsgzCtrl',['$scope','$http','$stateParams','$location','NgTableParams','comApi','toaster','$state',function($scope,$http,$stateParams,$location,NgTableParams,comApi,toaster,$state){
    $scope.gzlylbdata = [];
    $scope.zwdj = {};
    var lydata = [];
    $scope.gradeflag = "";
    $scope.positionflag = "";
    //添加工资来源类别
    $scope.tjgzlylb = function(){
        $scope.gzlylbdata.push({delflg:"2",gzlylb:"",ycy:""});
    };
    $scope.scgzlylb = function(flag){
        var k = 0;
        for(var i = 0;i<$scope.gzlylbdata.length;i++){
          if($scope.gzlylbdata[flag].delflg == "0" || $scope.gzlylbdata[flag].delflg == "2"){
            k = k+1;
          }
        }
        if(k == 1){
          comApi.HintMessage("error","错误","msg.common.00048",0,"");
          return;
        }
        if($scope.gzlylbdata[flag].delflg == "2"){
          $scope.gzlylbdata.splice(flag,1);
        }else{
          $scope.gzlylbdata[flag].delflg = "1";
        }
    }
    //选择工资来源类别的时候触发
    $scope.xzgzlylb = function(lb,index){
        for(var i=0; i<$scope.gzlylbdata.length-1;i++){
            for(var j=i+1; j<$scope.gzlylbdata.length;j++){
                if($scope.gzlylbdata[j].gzlylb.trim() != ""){
                  if($scope.gzlylbdata[j].delflg != "1" && $scope.gzlylbdata[i].delflg != "1"){
                    if($scope.gzlylbdata[i].gzlylb.trim() == $scope.gzlylbdata[j].gzlylb.trim()){
                        comApi.HintMessage( "error", "错误", "msg.common.00049",0, "");
                        setTimeout(function(){
                        },"1000");
                        lb.userinfo.ycy ="";
                        lb.userinfo.gzlylb = "";
                        return;
                    }
                  }
                }
            }
        }
        if($scope.gzlylbdata[index].delflg == "0"){
          $scope.gzlylbdata[index].delflg = "1";
          var ycy = "";
          if(lb.userinfo.gzlylb == "D001"){
              ycy = "staff/tpl/wagecalculationrules/fixedSalary.html";
          }else if(lb.userinfo.gzlylb.trim() == "D002"){
              ycy = "staff/tpl/wagecalculationrules/basicSalary.html";
          }else if(lb.userinfo.gzlylb.trim() == "D003"){
              ycy = "staff/tpl/wagecalculationrules/wsprip.html";
          }else if(lb.userinfo.gzlylb.trim() == "D004"){
              ycy = "staff/tpl/wagecalculationrules/wsprtmspr.html";
          }else if(lb.userinfo.gzlylb.trim() == "D005"){
              if($scope.hyltcdata.length == 0){
                $scope.hyltcdata.push({shangxian:"",xiaxian:"",baifenbi:""});
              }
              ycy = "staff/tpl/wagecalculationrules/memberCommission.html";
          }else if(lb.userinfo.gzlylb.trim() == "D006"){
              if($scope.hywsltcdata.length == 0){
                $scope.hywsltcdata.push({shangxian:"",xiaxian:"",baifenbi:""});
              }
              ycy = "staff/tpl/wagecalculationrules/mmbcc.html";
          }else if(lb.userinfo.gzlylb.trim() == "D007"){
              ycy = "staff/tpl/wagecalculationrules/postSubsidy.html";
          }else if(lb.userinfo.gzlylb.trim() == "D008"){
              ycy = "staff/tpl/wagecalculationrules/statutoryHolidayAllowance.html";
          }
          var data = {delflg:"2",gzlylb:lb.userinfo.gzlylb.trim(),ycy:ycy};
          
          $scope.gzlylbdata.splice(index,0,data);
          $scope.gzlylbdata[index+1].gzlylb = lydata[index].gzlylb;
        }else{
          if(lb.userinfo.gzlylb == "D001"){
            lb.userinfo.ycy = "staff/tpl/wagecalculationrules/fixedSalary.html";
          }else if(lb.userinfo.gzlylb.trim() == "D002"){
            lb.userinfo.ycy = "staff/tpl/wagecalculationrules/basicSalary.html";
          }else if(lb.userinfo.gzlylb.trim() == "D003"){
            lb.userinfo.ycy = "staff/tpl/wagecalculationrules/wsprip.html";
          }else if(lb.userinfo.gzlylb.trim() == "D004"){
            lb.userinfo.ycy = "staff/tpl/wagecalculationrules/wsprtmspr.html";
          }else if(lb.userinfo.gzlylb.trim() == "D005"){
            if($scope.hyltcdata.length == 0){
              $scope.hyltcdata.push({shangxian:"",xiaxian:"",baifenbi:""});
            }
            lb.userinfo.ycy = "staff/tpl/wagecalculationrules/memberCommission.html";
          }else if(lb.userinfo.gzlylb.trim() == "D006"){
            if($scope.hywsltcdata.length == 0){
              $scope.hywsltcdata.push({shangxian:"",xiaxian:"",baifenbi:""});
            }
            lb.userinfo.ycy = "staff/tpl/wagecalculationrules/mmbcc.html";
          }else if(lb.userinfo.gzlylb.trim() == "D007"){
            lb.userinfo.ycy = "staff/tpl/wagecalculationrules/postSubsidy.html";
          }else if(lb.userinfo.gzlylb.trim() == "D008"){
            lb.userinfo.ycy = "staff/tpl/wagecalculationrules/statutoryHolidayAllowance.html";
          }
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
        var flag = 0;
        //规则名称
        var gzname = $scope.gzname;
        //职位
        var position = $scope.zwdj.position;
        //等级
        var grade = $scope.zwdj.grade;
        //状态
        var zhuangtai = $scope.zt;
        if(gzname == undefined){
            return;
        }
        //工资来源类别
        var gzlylb = $scope.gzlylbdata[0].gzlylb;
        if(zhuangtai == undefined){
          comApi.HintMessage( "error", "错误", "msg.common.00050",0, "");
          return;
        }
        for(var i = 0; i < $scope.gzlylbdata.length; i++){
            if(i > 0){
                if($scope.gzlylbdata[i].delflg != "1"){
                  gzlylb = gzlylb +","+ $scope.gzlylbdata[i].gzlylb;
                }
            }
            if($scope.gzlylbdata[i].gzlylb == "D001"){
                var gdgzlylbdelflg = $scope.gzlylbdata[i].delflg;
                var gdgzlylb = $scope.gzlylbdata[i].gzlylb;
                if(gdgzlylbdelflg != "1"){
                  flag = 1;
                  var jsgz = e.form.jsgz.$modelValue;
                  if($scope.stringLength(jsgz,10)){
                    comApi.HintMessage([ "error", "计算规则","10" ], "", "msg.common.00051", 0, "");
                    return;
                  }
                }
            }
            if($scope.gzlylbdata[i].gzlylb == "D002"){
                var dxfalylbdelflg = $scope.gzlylbdata[i].delflg;
                var dxfalylb = $scope.gzlylbdata[i].gzlylb;
                if(dxfalylbdelflg != "1"){
                  flag = 1;
                  var xzzfa = e.form.xzzfa.$modelValue;
                  if(e.form.xzzfa.$modelValue == "D001"){
                      var xjbzsyq = e.form.xjbzsyq.$modelValue; 
                      var xjbzzzh = e.form.xjbzzzh.$modelValue;
                      var syqxjbz = "";
                      var zzhxjbz = "";
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
                      var syqxjbz = e.form.syqxjbz.$modelValue;
                      var zzhxjbz = e.form.zzhxjbz.$modelValue;
                      var xjbzsyq = ""; 
                      var xjbzzzh = "";
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
            }
            if($scope.gzlylbdata[i].gzlylb == "D003"){
                var gryjlylbdelflg = $scope.gzlylbdata[i].delflg;
                var gryjlylb = $scope.gzlylbdata[i].gzlylb;
                if(gryjlylbdelflg != "1"){
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
                  if(parseFloat(grxx) > parseFloat(grsx)){
                    comApi.HintMessage([ "error", "基本提成工资下限","上限" ], "", "msg.common.00052", 0, "");
                    return;
                  }
                }
            }
            if($scope.gzlylbdata[i].gzlylb == "D004"){
                var tdcylylbdelflg = $scope.gzlylbdata[i].delflg;
                var tdcylylb = $scope.gzlylbdata[i].gzlylb;
                if(tdcylylbdelflg != "1"){
                  var tdxzzfa = e.form.tdxzzfa.$modelValue;
                  var tdyjtcbfb = e.form.tdyjtcbfb.$modelValue;
                  if($scope.stringLength(tdyjtcbfb,3)){
                    comApi.HintMessage([ "error", "业绩提成","3" ], "", "msg.common.00051", 0, "");
                    return;
                  }
                }
            }
            if($scope.gzlylbdata[i].gzlylb == "D005"){
                var hyllylbdelflg = $scope.gzlylbdata[i].delflg;
                var hyllylb = $scope.gzlylbdata[i].gzlylb;
                if(hyllylbdelflg != "1"){
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
                }
            }
            if($scope.gzlylbdata[i].gzlylb == "D006"){
                var wsllylbdelflg = $scope.gzlylbdata[i].delflg;
                var wsllylb = $scope.gzlylbdata[i].gzlylb;
                if(wsllylbdelflg != "1"){
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
                }
            }
            if($scope.gzlylbdata[i].gzlylb == "D007"){
                var zwbzlylbdelflg = $scope.gzlylbdata[i].delflg;
                var zwbzlylb = $scope.gzlylbdata[i].gzlylb;
                if(zwbzlylbdelflg != "1"){
                  var sf = e.form.sf.$modelValue;
                  if(sf == "0"){
                      var yuan = e.form.yuan.$modelValue;
                      if($scope.stringLength(yuan,10)){
                        comApi.HintMessage([ "error", "职位补助标准","10" ], "", "msg.common.00051", 0, "");
                        return;
                      }
                  }
                }
            }
            if($scope.gzlylbdata[i].gzlylb == "D008"){
                var fdjrlylbdelflg = $scope.gzlylbdata[i].delflg;
                var fdjrlylb = $scope.gzlylbdata[i].gzlylb;
                if(fdjrlylbdelflg != "1"){
                  var fdjrgzbz = e.form.fdjrgzbzbs.$modelValue;
                  if($scope.stringLength(fdjrgzbz,2)){
                    comApi.HintMessage([ "error", "法定假日工资补助","2" ], "", "msg.common.00051", 0, "");
                    return;
                  }
                }
            }
        }
        var positionlevel = 0;
        if($scope.gradeflag != ""){
          if($scope.gradeflag != grade){
            positionlevel = 1;
          }
        }else{
          if($scope.positionflag != position){
            positionlevel = 1;
          }
        }
        if(flag == 0){
          comApi.HintMessage("error", "错误", "msg.common.00054", 0, "");
          return;
        }
        dataall = {
            positionlevel:positionlevel,
            oId:$stateParams.oid,
            wslhylist:hywsltcdata,
            wsllylbdelflg:wsllylbdelflg,
            wsllylb:wsllylb,
            hyllylbdelflg:hyllylbdelflg,
            hyllylb:hyllylb,
            hylhylist:hyltcdata,
            gdgzlylbdelflg:gdgzlylbdelflg,
            gdgzlylb:gdgzlylb,
            dxfalylbdelflg:dxfalylbdelflg,
            dxfalylb:dxfalylb,
            jsgz:jsgz,
            xzzfa:xzzfa,
            xjbzsyq:xjbzsyq,
            xjbzzzh:xjbzzzh,
            syqxjbz:syqxjbz,
            zzhxjbz:zzhxjbz,
            gryjlylbdelflg:gryjlylbdelflg,
            gryjlylb:gryjlylb,
            grxx:grxx,
            grsx:grsx,
            grjbtc:grjbtc,
            grcetc:grcetc,
            tdcylylbdelflg:tdcylylbdelflg,
            tdcylylb:tdcylylb,
            tdxzzfa:tdxzzfa,
            tdyjtcbfb:tdyjtcbfb,
            zwbzlylbdelflg:zwbzlylbdelflg,
            zwbzlylb:zwbzlylb,
            sf:sf,yuan:yuan,
            fdjrlylbdelflg:fdjrlylbdelflg,
            fdjrlylb:fdjrlylb,
            fdjrgzbz:fdjrgzbz,
            gzlylb:gzlylb,
            gzname:gzname,
            position:position,
            grade:grade,
            zhuangtai:zhuangtai
        };

        comApi.post("tsalrule/updateWageCalculationRules",dataall,function (data){
          comApi.HintMessage(["success", "工资计算规则"],"", "msg.common.00023", 3000, "");
          setTimeout(function(){
              $state.go("app.staff.wageCalculationRules");
          },"1000");
        });
    };
    
    //会员类
    $scope.hyltcdata=[{shangxian:"",xiaxian:"",baifenbi:"",delflg:"2"}];
    //--新增
    $scope.xzhyltcxfqd = function(){
        $scope.hyltcdata.push({shangxian:"",xiaxian:"",baifenbi:"",delflg:"2"});
    };
    //--删除
    $scope.schyltcxfqd = function(index){
        if($scope.hyltcdata[index].salcalrulenum){
            $scope.hyltcdata[index].delflg = "1";
        }else{
            $scope.hyltcdata.splice(index,1);
        }
    };
    //会员微商类
    $scope.hywsltcdata=[{shangxian:"",xiaxian:"",baifenbi:"",delflg:"2"}];
    //--新增
    $scope.xzhywsltcxfqd = function(){
        $scope.hywsltcdata.push({shangxian:"",xiaxian:"",baifenbi:"",delflg:"2"});
    };
    //--删除
    $scope.schywsltcxfqd = function(index){
        if($scope.hywsltcdata[index].salcalrulenum){
            $scope.hywsltcdata[index].delflg = "1";
        }else{
            $scope.hywsltcdata.splice(index,1);
        }
    };
    //工资类别下拉框
    $scope.gongzilaiyuan = comApi.getSelectBoxDic("C007","0");
    //职位下拉框
    $scope.position = comApi.getSelectBoxJob("0");
    //职位等级
    $scope.positiongrade = function(){
        $scope.Grade = comApi.getSelectBoxPosLvl($scope.zwdj.position,"0");
        if($scope.Grade.length>0){
          $scope.zwdj.grade = $scope.Grade[0].key;
        }else{
          $scope.zwdj.grade = "";
        }
    }
    comApi.get("tsalrule/tsalruleUpdateSelect/" + $stateParams.oid,function(data){
        $scope.oid = data.oid;
        $scope.gzname = data.gzname;
        $scope.zwdj.position = data.position;
        $scope.Grade = comApi.getSelectBoxPosLvl(data.position,"0");
        $scope.zwdj.grade = data.grade;
        $scope.positionflag = data.position;
        $scope.gradeflag = data.grade;
        $scope.zt = data.zhuangtai;
        if(data.gdgzlylb == "D001"){
            $scope.gzlylbdata.push({delflg:"0",gzlylb:data.gdgzlylb,ycy:"staff/tpl/wagecalculationrules/fixedSalary.html"});
            lydata.push({gzlylb:data.gdgzlylb});
            $scope.jsgz = data.jsgz;
        };
        if(data.dxfalylb == "D002"){
            $scope.gzlylbdata.push({delflg:"0",gzlylb:data.dxfalylb,ycy:"staff/tpl/wagecalculationrules/basicSalary.html"});
            lydata.push({gzlylb:data.dxfalylb});
            $scope.xzzfa = data.xzzfa;
            if(data.xzzfa == "D001"){
                $scope.basicSalaryHidden = "staff/tpl/wagecalculationrules/basicSalarySubProgram01.html";
                $scope.xjbzsyq = data.xjbzsyq;
                $scope.xjbzzzh = data.xjbzzzh;
            }else if(data.xzzfa == "D002"){
                $scope.basicSalaryHidden = "staff/tpl/wagecalculationrules/basicSalarySubProgram02.html";
                $scope.syqxjbz = data.syqxjbz;
                $scope.zzhxjbz = data.zzhxjbz;
            }
        };
        if(data.gryjlylb == "D003"){
            $scope.gzlylbdata.push({delflg:"0",gzlylb:data.gryjlylb,ycy:"staff/tpl/wagecalculationrules/wsprip.html"});
            lydata.push({gzlylb:data.gryjlylb});
            $scope.grjbmin = data.grxx;
            $scope.grjbmax = data.grsx;
            $scope.grjbtcbfb = data.grjbtc;
            $scope.grcetcbfb = data.grcetc;
        };
        if(data.tdcylylb == "D004"){
            $scope.gzlylbdata.push({delflg:"0",gzlylb:data.tdcylylb,ycy:"staff/tpl/wagecalculationrules/wsprtmspr.html"});
            lydata.push({gzlylb:data.tdcylylb});
            $scope.tdxzzfa = data.tdxzzfa;
            $scope.tdyjtcbfb = data.tdyjtcbfb;
        };
        if(data.hyllylb == "D005"){
            $scope.gzlylbdata.push({delflg:"0",gzlylb:data.hyllylb,ycy:"staff/tpl/wagecalculationrules/memberCommission.html"});
            lydata.push({gzlylb:data.hyllylb});
            $scope.hyltcdata = [];
            for(var i = 0;i<data.hyllist.length;i++){
                $scope.hyltcdata.push({
                    salcalrulenum : data.hyllist[i].oId,
                    xiaxian : data.hyllist[i].consuMinAmt,
                    shangxian : data.hyllist[i].consuMaxAmt,
                    baifenbi : data.hyllist[i].commPct,
                    delflg : "0"
                });
            }
        };
        if(data.wsllylb == "D006"){
            $scope.gzlylbdata.push({delflg:"0",gzlylb:data.wsllylb,ycy:"staff/tpl/wagecalculationrules/mmbcc.html"});
            lydata.push({gzlylb:data.wsllylb});
            $scope.hywsltcdata = [];
            for(var i = 0;i<data.wsllist.length;i++){
                $scope.hywsltcdata.push({
                    salcalrulenum : data.wsllist[i].oId,
                    xiaxian : data.wsllist[i].consuMinAmt,
                    shangxian : data.wsllist[i].consuMaxAmt,
                    baifenbi : data.wsllist[i].commPct,
                    delflg : "0"
                });
            }
        };
        if(data.zwbzlylb == "D007"){
            $scope.gzlylbdata.push({delflg:"0",gzlylb:data.zwbzlylb,ycy:"staff/tpl/wagecalculationrules/postSubsidy.html"});
            lydata.push({gzlylb:data.zwbzlylb});
            $scope.sfyyzwbzbz = data.sf;
            $scope.yuan = data.yuan;
        };
        if(data.fdjrlylb == "D008"){
            $scope.gzlylbdata.push({delflg:"0",gzlylb:data.fdjrlylb,ycy:"staff/tpl/wagecalculationrules/statutoryHolidayAllowance.html"});
            lydata.push({gzlylb:data.fdjrlylb});
            $scope.fdjrgzbzbs = data.fdjrgzbz;
        }
    });
    //判断数值的长度chick
    $scope.stringLength = function(str,length){
      str = str+"";
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