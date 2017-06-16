/**
 * Created by Benson on 15/11/20.
 */

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/** BPM枚举选择值 */
var BPMEnumValue = {
    /** 业务节点数据定义 */
    BpmDefData: {
        /** 是否可为空 ：是 */
        CAN_BE_NULL_YES: 1,
        /** 是否可为空 ：否 */
        CAN_BE_NULL_NO: 2
    },
    /** 业务流程连接线 */
    BpmDefFlow: {
        /** 流向类型:前进 */
        FLOW_TYPE_FORWARD: 0,
        /** 流向类型:回退 */
        FLOW_TYPE_BACK: 1
    },
    /** 业务流程节点 */
    BpmDefProcess: {
        //处理节点类型定义
        PROCESS_NODE_TYPE: {
            //开始节点
            START: 0,
            //结束节点
            END: 99,
            //处理节点
            PROCESS: 1,
            //判断节点
            DECISION: 2
        },
        //处理类型定义
        PROCESS_TYPE: {
            //自动节点
            AUTO: 1,
            //人机交互节点
            PEOPLE: 2,
            //系统交互节点
            SYSTEM: 3,
            //子流程启动节点
            CHILD_BP: 4
        },
        //实例类型
        INSTANCE_TYPE: {
            //运行时单例
            SINGLE_IN_RUN: 1,
            //多例
            MULTIPLE: 2,
            //流程单例:
            SINGLE_IN_BP: 3
        },
        //等待前节点
        WAIT_FOR_FROM: {
            //等待所有
            ALL: 1,
            //不等待
            NO: 2
        },
        //是否进行启动判断
        START_DECISIION: {
            //否
            NO: 0,
            //yes
            YES: 1
        },
        //是否等待子流程
        WAIT_FOR_CHILD_BP: {
            //否
            NO: 0,
            //yes
            YES: 1
        },
        /** 添加操作者配置 吕晓亮 2016-02-19*/
        /** 操作者从属关系 */
        OPERATOR_BELONG_RELATION: {
        	/** 操作者从属关系 ：无 */
        	NO: 0,
        	/** 操作者从属关系 ：向上从属关系 */
        	UP: 1,
        	/** 操作者从属关系 ：向下从属关系 */
        	DOWN: 2,
        	/** 操作者从属关系 ：同一操作者 */
        	SAME: 3
        },
        /** 组织从属关系 */
        ORGANIZATION_BELONG_RELATION: {
        	/** 组织从属关系 ：无 */
        	NO: 0,
        	/** 组织从属关系 ：向上组织关系 */
        	UP: 1,
        	/** 组织从属关系 ：向下组织关系 */
        	DOWN: 2
        },
        /** 是否允许无操作者 */
        ALLOW_OPERATOR_NONE: {
        	/** 是否允许无操作者 ：是 */
        	YES: 0,
        	/** 是否允许无操作者 ：否 */
        	NO: 1
        }
        
    },
    PROCESS_NODE:{
        STATUS:{
            /** 处理节点状态定义 ：未启动 */
            NOTSTART :0,
            /** 处理节点状态定义 ：不能启动 */
            CANNOTSTART:1,
            /** 处理节点状态定义 ：预启动 */
            RESTART :10,
            /** 处理节点状态定义 ：输入数据 校验 */
            INPUT_VALIDATE :20,
            /** 处理节点状态定义 ：输入数据 校验出错 */
            INPUT_ERROR :30,
            /** 处理节点状态定义 ：执行通过*/
            EXECUTE :40,
            /** 处理节点状态定义 ：等待触发 */
            WAITING_FOR_TRIGGER : 50,
            /** 处理节点状态定义 ：输出数据 校验 */
            OUTPUT_VALIDATE : 60,
            /** 处理节点状态定义 ：输出数据 校验出错 */
            OUTPUT_ERROR :70,
            /** 处理节点状态定义 ：异常 */
            EXCEPTION :80,
            /** 处理节点状态定义 ：强制结束 */
            FORCED_END : 90,
            /** 处理节点状态定义 ：结束 */
            END : 100
        }
    }
}
/** 业务节点数据定义 */
var NewBpmDefData = function () {
    return {
        /** 数据OID */
        oid: guid(),
        /** 数据名称 */
        name: "",
        /** 数据编号 */
        code: "",
        /** 数据注释 */
        comment: "",
        /** 数据KEY */
        key: "",
        /** 数据校验用正则表达式 */
        validateRegExpr: "",
        /** 是否可为空 */
        canBeNull: BPMEnumValue.BpmDefData.CAN_BE_NULL_YES,
        /** 为空时默认值 */
        defaultValue: ""
    }
}
/** 运算结果流向定义 */
var NewBpmDefDecisionResult = function () {
    return {
        /** 判断结果 */
        decisionResult: "",
        /** 判断结果对应流向List[BpmDefFlow.oid] */
        resultFlowOidList: []
    }
}
/** 业务流程定义 */
var NewBpmDefination = function () {
    return {
        /** 业务Oid */
        oid: guid(),
        /** 业务名 */
        name: "",
        /** 业务编号 */
        code: "",
        /** 业务注释 */
        comment: "",
        /** 处理节点List[BpmDefProcess]*/
        processList: [],
        /** 处理流向List[BpmDefFlow]*/
        flowList: []
    }
}
/** 业务流程连接线 */
var NewBpmDefFlow = function () {
    return {
        /** 流向OID */
        oid: guid(),
        /** 流向名称 */
        name: "",
        /** 流向编号 */
        code: "",
        /** 流向注释 */
        comment: "",
        /** 父节点OID */
        parentNodeId: "",
        /** 子节点OID */
        childNodeId: "",
        /** 流向类型 */
        type: BPMEnumValue.BpmDefFlow.FLOW_TYPE_FORWARD
    }
}
/** 业务流程节点 */
var NewBpmDefProcess = function () {
    return {
        /** 处理节点OID */
        oid: guid(),
        /** 处理节点名 */
        name: "",
        /** 处理节点编号 */
        code: "",
        /** 处理节点注释 */
        comment: "",
        /** 处理节点类型 */
        processNodeType: BPMEnumValue.BpmDefProcess.PROCESS_NODE_TYPE.PROCESS,
        /** 处理类型 */
        processType: BPMEnumValue.BpmDefProcess.PROCESS_TYPE.AUTO,
        /** 实例类型 */
        instanceType: BPMEnumValue.BpmDefProcess.INSTANCE_TYPE.SINGLE_IN_RUN,
        /** 等待前节点 */
        waitForFrom: BPMEnumValue.BpmDefProcess.WAIT_FOR_FROM.ALL,
        /** 输入数据 List[BpmDefData]*/
        inputDataList: [],
        /** 输出数据 List[BpmDefData]*/
        outputDataList: [],
        /** 判断节点条件 */
        decisionCondition: "",
        /** 判断节点结果List[BpmDefDecisionResult]*/
        decisionResultList: [],
        /** 是否进行启动判断 */
        startDecision: BPMEnumValue.BpmDefProcess.START_DECISIION.NO,
        /** 启动判断条件 */
        startDecisionCondition: "",
        /** 子业务流程编号 */
        childBusinessProcessCode: "",
        /** 是否等待子流程 */
        waitForChildBp: BPMEnumValue.BpmDefProcess.WAIT_FOR_CHILD_BP.NO,
        /** 等待子流程处理节点编号*/
        waitForChildProcessNodeCode: "",
        /**添加操作者相关配置，吕晓亮 2016-02-19*/
        /** 选择角色 */
    	selectedRoles: "",
    	/** 操作者从属关系 */
    	operatorBelongRelation: BPMEnumValue.BpmDefProcess.OPERATOR_BELONG_RELATION.NO,
    	/** 组织从属关系 */
    	organizationBelongRelation: BPMEnumValue.BpmDefProcess.ORGANIZATION_BELONG_RELATION.NO,
    	/** 从属关系源节点编号 */
    	relationSrcPnCode: "",
    	/** 是否允许无操作者 */
    	allowOperatorNone: BPMEnumValue.BpmDefProcess.ALLOW_OPERATOR_NONE.YES
    }
}

/**提交业务流程定义*/
var BpmDefinationManagerVo = {
    /** 流程索引*/
    oid: guid(),
    /** 流程名称*/
    name: "",
    /** 流程编号*/
    code: "",
    /** 流程说明*/
    comment: "",
    /** 流程图形定义*/
    bpmFlowchartJson: JSON.stringify({ "class": "go.GraphLinksModel",
        "linkFromPortIdProperty": "fromPort",
        "linkToPortIdProperty": "toPort",
        "nodeDataArray": [
            {"category":"Comment", "loc":"360 -10", "text":"新建流程", "key":1}

        ],
        "linkDataArray": []}),
    /** 流程图形定义的对应数据定义*/
    bpmPropertiesJson: "",
    /** 流程数据定义的JSON*/
    bpmDefinationJson: "",
    /** 流程数据定义的XML，（由后台产生，前台不用初始化该数据）*/
    bpmDefinationXml: "",
    /** 流程图形定义的图片（Base64）*/
    bpmPicture: ""

}
var NewBpmDefinationManagerVo = function(){

    BpmDefinationManagerVo.oid = guid();
    BpmDefinationManagerVo.name = "新建流程";
    BpmDefinationManagerVo.code = BpmDefinationManagerVo.oid;
    BpmDefinationManagerVo.comment = "新建流程";

    BpmDefinationManagerVo.bpmFlowchartJson = JSON.stringify({ "class": "go.GraphLinksModel",
        "linkFromPortIdProperty": "fromPort",
        "linkToPortIdProperty": "toPort",
        "nodeDataArray": [
            {"category":"Comment", "loc":"360 -10", "text":"新建流程", "key":1}

        ],
        "linkDataArray": []});
    BpmDefinationManagerVo.bpmPropertiesJson="";
    BpmDefinationManagerVo.bpmDefinationJson="";
    BpmDefinationManagerVo.bpmDefinationXml="";
    BpmDefinationManagerVo.bpmPicture="";
}

/**BPM核心API*/
var bpmurl = "/CrmWeb/api/bpm/";
var bpmSimulateurl = "/CrmWeb/api/bpmSimulate/";
var bpmAjax = function(url,type,data,success_func,error_func){
    $.ajax({
        url: url,    //请求的url地址
        dataType: "json",   //返回格式为json
        data: data,    //参数值
        type: type,   //请求方式
        contentType: "application/json",
        beforeSend: function() {
            //请求前的处理
        },
        success: function(reg){
        	//输出测试信息
        	if($("#debugFlag").is(':checked')){
        		$("#jsonTest").val(JSON.stringify(reg));
        	}
        	
            if(reg.meta.success){
                if($.isFunction(success_func)){
                    success_func(reg.data==""?reg.meta.success:reg.data);
                }
            }
            else{
                alert(reg.meta.message);
            }
        },
        complete: function() {
            //请求完成的处理
        },
        error: function() {
            if($.isFunction(error_func)) {
                success_func();
            }
            else{
                alert("请求异常!")
            }

        }
    });
}
var BpmRestController = {
    /** API */
    bpm :{
        /**
         * 根据业务流程定义编号取得业务流程定义
         * @param businessCode 业务流程定义编号
         * @return 业务流程定义
         */
        getBpmDefinationManagerByCode:function(businessCode,success_func,error_func){
            bpmAjax(bpmurl + "getBpmDefinationManagerByCode/"+businessCode,"GET","",success_func,error_func);
        },
        /**
         * 追加BPM业务流程定义
         * @param bpmDefinationManagerVoWithBLOBs 业务流程定义
         * @return 是否成功
         */
        addBpmDefinationManager:function(bpmDefinationManagerVoWithBLOBs,success_func,error_func){
            bpmAjax(bpmurl + "addBpmDefinationManager","POST",bpmDefinationManagerVoWithBLOBs,success_func,error_func);
        },
        /**
         * 根据业务流程定义Oid更新业务流程定义
         * @param bpmDefinationManagerVoWithBLOBs 业务流程定义
         * @return 是否成功
         */
        updateBpmDefinationManagerById:function(bpmDefinationManagerVoWithBLOBs,success_func,error_func){
            bpmAjax(bpmurl + "updateBpmDefinationManagerById","POST",bpmDefinationManagerVoWithBLOBs,success_func,error_func);
        },
        /**
         * 取得所有业务流程定义列表
         * @return 所有业务流程定义列表
         */
        getAllBpmDefinationManagerList:function(success_func,error_func){
            bpmAjax(bpmurl + "getAllBpmDefinationManagerList","GET","",success_func,error_func);
        },
        /**
         * 开始业务流程模拟
         * @param businessCode 业务流程编号
         * @return String 业务流程Oid
         */
        startBusinessProcessSimulate:function(businessCode,success_func,error_func){
            bpmAjax(bpmurl + "startBusinessProcessSimulate/"+businessCode,"GET","",success_func,error_func);
        },
        /**
         * 获取业务流程实例及处理节点的状态信息
         * @param businessProcessOid 业务流程Oid
         * @return 业务流程实例及处理节点的状态信息
         */
        getBusinessProcessStatusInfo:function(businessProcessOid,success_func,error_func){
            bpmAjax(bpmurl + "getBusinessProcessStatusInfo/"+businessProcessOid,"GET","",success_func,error_func);
        },
        /**
         * 取得BPM模拟 监视对象
         * @param businessProcessOid 业务流程Oid
         * @return BPM模拟 监视对象
         */
        getBpmSimulateMonitorVo:function(businessProcessOid,success_func,error_func){
            bpmAjax(bpmSimulateurl + "getBpmSimulateMonitorVo/"+businessProcessOid,"GET","",success_func,error_func);
        },
        /**
         * 获取业务流程数据
         * @param businessProcessOid 业务流程Oid
         * @param dataKey 数据Key
         * @return 取得结果
         */
        findProcessData:function(businessProcessOid,dataKey,success_func,error_func){
            bpmAjax(bpmurl + "findProcessData/"+businessProcessOid+"/"+dataKey,"GET","",success_func,error_func);
        },
        /**
         * 追加业务流程数据
         * @param businessProcessOid 业务流程Oid
         * @param dataKey 数据Key
         * @param dataValue 数据值
         * @return 处理结果 true:成功  false:失败
         */
        putProcessData:function(businessProcessOid,dataKey,dataValue,success_func,error_func){
            bpmAjax(bpmurl + "putProcessData/"+businessProcessOid+"/"+dataKey+"/"+dataValue,"GET","",success_func,error_func);
        },
        /**
         * 监视处理结束 继续执行事件
         * @param businessProcessOid 业务流程Oid
         * @param monitorEventOid 监视用事件OID
         * @return 是否成功
         */
        continuteBpmSimulateMonitorEvent:function(businessProcessOid,monitorEventOid,success_func,error_func){
            bpmAjax(bpmSimulateurl + "continuteBpmSimulateMonitorEvent/"+businessProcessOid+"/"+monitorEventOid,"GET","",success_func,error_func);
        },
        /**
         * 触发业务流程节点
         * @param businessProcessOid 业务流程Oid
         * @param processNodeOid 处理节点Oid
         * @return 处理结果 true:成功  false:失败
         */
        triggerProcessNode:function(businessProcessOid,processNodeOid,success_func,error_func){
            bpmAjax(bpmurl + "triggerProcessNode/"+businessProcessOid+"/"+processNodeOid,"GET","",success_func,error_func);
        },
        /**
         * 追加业务流程数据Map
         * @param businessProcessOid 业务流程Oid
         * @param dataMap 业务流程数据Map
         * @return 处理结果 true:成功  false:失败
         */
        putProcessDataMap:function(businessProcessOid,dataMap,success_func,error_func){
            bpmAjax(bpmurl + "putProcessDataMap/"+businessProcessOid,"POST",dataMap,success_func,error_func);
        },
        /**
    	 * 获取所有角色List
    	 * @return 处理结果 true:成功  false:失败
    	 */
        getAllBpmRole:function(success_func,error_func){
        	bpmAjax(bpmurl + "getAllBpmRole","GET","",success_func,error_func);
        }
    }
}

