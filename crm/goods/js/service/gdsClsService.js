/**
 * Created by lenovo on 2016/4/14.
 */
app.service('gdsClsService', ['comApi',function(comApi){

    this.searchAllGod = function() {
        comApi.get(servUrl + "/gdsCls/selectAllGdsCls", function (data) {
            console.log(JSON.stringify(data)+"=====gdsClsSer")
           return data;
        })

}}])
