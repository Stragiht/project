/**
 * Created by lenovo on 2016/5/24.
 */
//来源渠道
app.filter("chnlInfoFilter", function($sessionStorage) {  // $sessionStorage.selectChnlInfoALL
    return function(input){
        // 取得分类编号对应的所有明细
        for (var i = 0; i < $sessionStorage.selectChnlInfoALL.length; i++) {
            if ($sessionStorage.selectChnlInfoALL[i].chnlNum == input) {
                return $sessionStorage.selectChnlInfoALL[i].chnlNm;
            }
        }
    }
});

/**
 * 共通用filter
 */
app.filter("dicNameFilter", function($sessionStorage) {
    return function(input, cateNum){
        var name = "";
        var dic = [];
        // 取得分类编号对应的所有明细
        for (var i = 0; i < $sessionStorage.dic.length; i++) {
            if ($sessionStorage.dic[i].key == cateNum) {
                dic = $sessionStorage.dic[i].value
                break;
            }
        }
        // 取得明细编号对应的名称
        for (var i = 0 ; i < dic.length; i++) {
            if (dic[i].key == input) {
                name = dic[i].text;
            }
        }
        return name;
    }
});

/*
 * 根据出生日期计算年龄
 * */

app.filter('CalculatingAge', function(){
    return function(birthDate){
        if (birthDate != undefined && birthDate != null && birthDate != '') {
            var curYear = new Date().getFullYear();
            var yourYear = new Date(birthDate).getFullYear();
           // return parseInt(curYear)-parseInt(yourYear)+1;
            return parseInt(curYear)-parseInt(yourYear);
        } else {
            return '';
        }
    }
});

/*
 * 省-市-县  $sessionStorage.selectAddressALL
 * */
app.filter('addressFilter', function($sessionStorage){
    return function(input){
        // 取得分类编号对应的所有明细
        for (var i = 0; i < $sessionStorage.selectAddressALL.length; i++) {
            if ($sessionStorage.selectAddressALL[i].rgnNum == input) {
                return $sessionStorage.selectAddressALL[i].rgnNm;
            }
        }
    }
});


//照片路径
app.filter('imgpath', function(comApi) {
    return function(input) {
        //return "/uploadFiles/"+input;
      if (input !== null && input !== undefined && input !== '') {
        return comApi.getFileServerPath() + input;
      } else {
        return "";
      }
    };
});

//字符串切割
app.filter('pathStrSplit', function(comApi) {
    return function(input) {
        return input.split(',');
        //alert(input);
        //return "/uploadFiles/"+input;
        /* if (input != undefined && input != null && input!= '') {
         return input.split(',');
         } else {
         return null;
         }*/
    };
});

//缩略显示
app.filter("textAbbr", function() {
    return function(input, maxLen){
        var text = "";
        if(input && input != null && input.length > maxLen){
            text = input.substr(0, maxLen);
            text += "...";
        }else{
            text = input;
        }
        return text;
    }
});

//日期显示
app.filter('dateFormat', function(comApi){
    return function(input) {
        if ((input+"").indexOf('.') != -1 || (input+"").indexOf('-') != -1) {
            //20160711 17:54:28.374  2016-10-19 14:56这种格式的时间转成时间戳
            input = comApi.timeToTimestamp(input);
        }
        var showDate = null;
        //当前日期
        var dd = new Date();
        //当前年份
        var curYear = dd.getFullYear();

        var thisDate = new Date(input);
        //输入的年份
        var thisYear = thisDate.getFullYear();

        if (curYear === thisYear) {
            if (comApi.getDay(dd,0) == comApi.getDay(thisDate,0)){
                showDate = "今天";
            } else if (comApi.getDay(dd,1) == comApi.getDay(thisDate,0)){
                showDate = "明天";
            } else if(comApi.getDay(dd,-1) == comApi.getDay(thisDate,0)) {
                showDate = "昨天";
            } else {
                showDate = comApi.doHandleMonth(thisDate.getMonth()+1)+"-"+comApi.doHandleMonth(thisDate.getDate());
            }
        } else {
            showDate = comApi.doHandleMonth(thisYear+"-"+thisDate.getMonth()+1)+"-"+comApi.doHandleMonth(thisDate.getDate());
        }

        return showDate;
    }
});

//截取时间
app.filter('cutTimeFilter', function(){
    return function(input) {
        //这种格式xxxxxxxx 15:32:20
        if((input+'').indexOf(' ') != -1) {
            input = input.split(' ')[1];
            if (input != '00:00' && input != '00:00:00') {
                return input;
            }
        }
        return '';
    }
});


//去掉 '省'、'市'
app.filter('provCityFormat', function(){
    return function(input) {
        if (input.indexOf("省") || input.indexOf("市")) {
            return input.substring(0,input.length-1);
        } else {
            return input;
        }

    }

});

//是否含有市
app.filter('cityJudge', function(){
    return function(input) {
        if (input.indexOf("市")) {
            return true;
        } else {
            return false;
        }

    }

});

//\n换成<br/>换行
app.filter('brWrap', function(){
    return function(input) {
        return  input.replace(/\n+/g,'<br\/>' );
    }
});


