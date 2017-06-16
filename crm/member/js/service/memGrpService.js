/**
 * Created by lenovo on 2016/4/18.
 */
app.service("memGrpDateSer", function($filter){
    return {
        //����ת����ʱ���
        timeToTimestamp: function(dateStr) {
            if (dateStr == null || dateStr == '' || dateStr == undefined) {
                return '';
            } else {
                //ֻ��ʶ��xxxx/02/01������ʽ
                var date = dateStr.replace(/-/g,'/');
                return new Date(date).getTime();
            }
        },

        //angular�����ڸ�ʽ��
        angularDateFor: function(date){
            return $filter('date')(date,'yyyy-MM-dd');
         }
    }
})