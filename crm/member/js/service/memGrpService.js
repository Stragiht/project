/**
 * Created by lenovo on 2016/4/18.
 */
app.service("memGrpDateSer", function($filter){
    return {
        //日期转换成时间戳
        timeToTimestamp: function(dateStr) {
            if (dateStr == null || dateStr == '' || dateStr == undefined) {
                return '';
            } else {
                //只能识别xxxx/02/01这种形式
                var date = dateStr.replace(/-/g,'/');
                return new Date(date).getTime();
            }
        },

        //angular中日期格式化
        angularDateFor: function(date){
            return $filter('date')(date,'yyyy-MM-dd');
         }
    }
})