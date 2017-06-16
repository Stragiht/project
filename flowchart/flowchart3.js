/// <reference path="SinotaiyoBPM.js" />
/// <reference path="external/jquery/jquery.js" />

///代码暂时位置等待整理
//输入输出模板
var InDataTemplate;
//路由的模板
var RouteTemplate;

//数据输入输出模板
var IntOurData_tabTemplate;

$(document).ready(function () {
    InDataTemplate = $(".F_nodeInDataContent").find(".ListContent").html();
    $(".F_nodeInDataContent").find(".ListContent").html('');
    RouteTemplate = $(".NodesContent").html();
    $(".NodesContent").html('');
    IntOurData_tabTemplate = $("#IntOurData_list").html();
    $("#IntOurData_list").html('');
    //重写节点编号
    _InitialIndex = function (content) {
        var list = content.find(".ListContent").find('fieldset');
        for (var i = 0; i < list.length; i++) {
            var node = $(list[i]);
            node.find('.Depth').html(i + 1);
        }
    }

    //添加输入输出数据
    $(".AddInData").bind("click", function () {
        //获取以后list的数量
        var contentObj = $(this).parent().parent();
        var Depth = contentObj.find(".ListContent").find('fieldset').length;
        var parentClass = contentObj.attr('class');
        var NewNode = $(InDataTemplate);
        NewNode.find('.Depth').html(Depth - 0 + 1);
        NewNode.find('.DeleteNodes').data('ListContent', NewNode);
        NewNode.find('.F_nodeCanBeNull').attr('name', parentClass + 'F_nodeCanBeNull' + (Depth - 0 + 1));
        NewNode.find('.DeleteNodes').bind('click', function () {
            NewNode.remove();
            _InitialIndex(contentObj);
        })
        contentObj.find(".ListContent").append(NewNode);
    });
    //添加路由的指向
    $("#RouteSelectionAddButton").bind("click", function () {
        var data = bpmProperties.RouteSelection;
        var Node = $(RouteTemplate);
        Node.find('#DeleteNode').bind('click', function () {
            Node.remove();
        })
        if($(data).length>0){
            $.each(data, function (index, dom) {
                var ck = $('<span style="margin:5px 10px;"><input type="checkbox" value="" /><label class="name"></label></span>');
                ck.find('.name').html(dom.node.name);
                ck.find('input[type="checkbox"]').attr('value', dom.link.oid);
                Node.find('.CheckboxContent').append(ck);
            });
            $(".RouteSelection").find('.NodesContent').append(Node);
        }else{
            alert('没有设置任何下一个节点！');
        }
    });
})


function init() {
    var $goJS = go.GraphObject.make;  // for conciseness in defining templates

    myDiagram =
        $goJS(go.Diagram, "myDiagram",  // must name or refer to the DIV HTML element
            {
                initialContentAlignment: go.Spot.Center,
                allowDrop: true,  // must be true to accept drops from the Palette
                "LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
                "LinkRelinked": showLinkLabel,
                "animationManager.duration": 800, // slightly longer than default (600ms) animation
                "undoManager.isEnabled": true  // enable undo & redo
            });


    //Menu Start
    // This is a dummy context menu for the whole Diagram:
    myDiagram.contextMenu = $goJS(go.Adornment);

    // This is the actual HTML context menu:
    var cxElement = document.getElementById("contextMenu");

    // We don't want the div acting as a context menu to have a (browser) context menu!
    cxElement.addEventListener("contextmenu", function (e) { e.preventDefault(); return false; }, false);
    cxElement.addEventListener("blur", function (e) { cxMenu.stopTool(); }, false);

    // Override the ContextMenuTool.showContextMenu and hideContextMenu methods
    // in order to modify the HTML appropriately.
    var cxTool = myDiagram.toolManager.contextMenuTool;

    // This is the override of ContextMenuTool.showContextMenu:
    // This does not not need to call the base method.
    cxTool.showContextMenu = function (contextmenu, obj) {

        var diagram = this.diagram;
        if (diagram == null) return;

        if (obj) {
            //判断是否为连线
            selectLink = (obj.Lh == "T" || obj.Lh == "R" | obj.Lh == "B" || obj.Lh == "L") ? obj : null;
        }

        // Hide any other existing context menu
        if (contextmenu !== this.currentContextMenu) {
            this.hideContextMenu();
        }

        // Show only the relevant buttons given the current state.
        var cmd = diagram.commandHandler;
        document.getElementById("cut").style.display = cmd.canCutSelection() ? "block" : "none";
        document.getElementById("copy").style.display = cmd.canCopySelection() ? "block" : "none";
        document.getElementById("paste").style.display = cmd.canPasteSelection() ? "block" : "none";
        document.getElementById("delete").style.display = cmd.canDeleteSelection() ? "block" : "none";
        //document.getElementById("property").style.display = obj !== null ? "block" : "none";

        //连接线上的右键菜单屏蔽部分选项
        if (selectLink != null) {
            document.getElementById("cut").style.display = "none";
            document.getElementById("copy").style.display = "none";
            document.getElementById("paste").style.display = "none";
        }

        // Now show the whole context menu element
        cxElement.style.display = "block";
        // we don't bother overriding positionContextMenu, we just do it here:
        var mousePt = diagram.lastInput.viewPoint;
        cxElement.style.left = (mousePt.x + 80) + "px"; //偏移80，调整菜单出现位置
        cxElement.style.top = mousePt.y + "px";

        // Remember that there is now a context menu showing
        this.currentContextMenu = contextmenu;
    }

    // This is the corresponding override of ContextMenuTool.hideContextMenu:
    // This does not not need to call the base method.
    cxTool.hideContextMenu = function () {
        if (this.currentContextMenu == null) return;
        cxElement.style.display = "none";
        this.currentContextMenu = null;
    }
    //Menu End


    // helper definitions for node templates
    function nodeStyle() {
        return [
            // The Node.location comes from the "loc" property of the node data,
            // converted by the Point.parse static method.
            // If the Node.location is changed, it updates the "loc" property of the node data,
            // converting back using the Point.stringify static method.
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            {
                // the Node.location is at the center of each node
                locationSpot: go.Spot.Center,
                contextMenu: $goJS(go.Adornment),
                //isShadowed: true,
                //shadowColor: "#888",
                // handle mouse enter/leave events to show/hide the ports
                mouseEnter: function (e, obj) { showPorts(obj.part, true); },
                mouseLeave: function (e, obj) { showPorts(obj.part, false); }
            }
        ];
    }
    function linkStyle() {
        return [
            {
                contextMenu: $goJS(go.Adornment),
                mouseEnter: function (e, obj) { showPorts(obj.part, true); },
                mouseLeave: function (e, obj) { showPorts(obj.part, false); }
            }
        ];
    }
    // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
    // and where the port is positioned on the node, and the boolean "output" and "input" arguments
    // control whether the user can draw links from or to the port.
    function makePort(name, spot, output, input) {
        // the port is basically just a small circle that has a white stroke when it is made visible
        return $goJS(go.Shape, "Circle",
            {
                fill: "transparent",
                stroke: null,  // this is changed to "white" in the showPorts function
                desiredSize: new go.Size(8, 8),
                alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
                portId: name,  // declare this object to be a "port"
                fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                cursor: "pointer"  // show a different cursor to indicate potential link point
            });
    }

    // define the Node templates for regular nodes

    var lightText = 'whitesmoke';
    var graygrad = $goJS(go.Brush, "Linear", { 0: "#F5F5F5", 1: "#F1F1F1" });
    var bluegrad = $goJS(go.Brush, "Linear", { 0: "#CDDAF0", 1: "#91ADDD" });
    var yellowgrad = $goJS(go.Brush, "Linear", { 0: "#FEC901", 1: "#FEA200" });
    var lavgrad = $goJS(go.Brush, "Linear", { 0: "#EF9EFA", 1: "#A570AD" });


    myDiagram.nodeTemplateMap.add("Start",
        $goJS(go.Node, "Spot", nodeStyle(),
            $goJS(go.Panel, "Auto",
                $goJS(go.Shape, "Circle",
                    { minSize: new go.Size(40, 40), fill: "#79C900", stroke: null },new go.Binding("fill").makeTwoWay()),
                $goJS(go.TextBlock, "Start",
                    { stroke: lightText },
                    new go.Binding("text"))
            ),
            // three named ports, one on each side except the top, all output only:
            makePort("L", go.Spot.Left, true, false),
            makePort("R", go.Spot.Right, true, false),
            makePort("B", go.Spot.Bottom, true, false)
        ));
    myDiagram.nodeTemplateMap.add("",  // the default category
        $goJS(go.Node, "Spot", nodeStyle(),
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            $goJS(go.Panel, "Auto",
                $goJS(go.Shape, "RoundedRectangle",
                    { fill: "#00A9C9", stroke: null },
                    new go.Binding("figure", "figure"),new go.Binding("fill").makeTwoWay()),
                $goJS(go.TextBlock,
                    {
                        stroke: lightText,
                        margin: 5,
                        maxSize: new go.Size(160, NaN),
                        wrap: go.TextBlock.WrapFit,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay())
            ),
            // four named ports, one on each side:
            makePort("T", go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, true, false)
        ));

    myDiagram.nodeTemplateMap.add("Diamond",
        $goJS(go.Node, "Spot", nodeStyle(),
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            $goJS(go.Panel, "Auto",
                $goJS(go.Shape, "Diamond",
                    { minSize: new go.Size(40, 40), fill: "#553C99", stroke: null },new go.Binding("fill").makeTwoWay()),
                $goJS(go.TextBlock,
                    {
                        stroke: lightText,
                        margin: 2,
                        maxSize: new go.Size(160, NaN),
                        wrap: go.TextBlock.WrapFit,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay())
            ),
            // four named ports, one on each side:
            makePort("T", go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, true, false)
        ));


    myDiagram.nodeTemplateMap.add("End",
        $goJS(go.Node, "Spot", nodeStyle(),
            $goJS(go.Panel, "Auto",
                $goJS(go.Shape, "Circle",
                    { minSize: new go.Size(40, 40), fill: "#883C00", stroke: null },new go.Binding("fill").makeTwoWay()),
                $goJS(go.TextBlock, "End",
                    { stroke: lightText },
                    new go.Binding("text"))
            ),
            // three named ports, one on each side except the bottom, all input only:
            makePort("T", go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, false, true),
            makePort("R", go.Spot.Right, false, true)
        ));

    myDiagram.nodeTemplateMap.add("Comment",
        $goJS(go.Node, "Auto", nodeStyle(),
            $goJS(go.Shape, "File",
                { fill: "#EFFAB4", stroke: null }),
            $goJS(go.TextBlock,
                {
                    margin: 5,
                    maxSize: new go.Size(200, NaN),
                    textAlign: "center",
                    editable: true,
                    stroke: '#454545'
                },
                new go.Binding("text").makeTwoWay())
            // no ports, because no links are allowed to connect with a comment
        ));

    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate =
        $goJS(go.Link, linkStyle(),// the whole link panel
            {
                routing: go.Link.AvoidsNodes,
                curve: go.Link.JumpOver,
                corner: 5, toShortLength: 4,
                relinkableFrom: true,
                relinkableTo: true,
                reshapable: true,
                resegmentable: true,
                // mouse-overs subtly highlight links:
                mouseEnter: function (e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
                mouseLeave: function (e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
            },
            new go.Binding("points").makeTwoWay(),
            $goJS(go.Shape,  // the highlight shape, normally transparent
                { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
            $goJS(go.Shape,  // the link path shape
                { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
                new go.Binding("stroke").makeTwoWay()
            ),
            $goJS(go.Shape,  // the arrowhead
                { toArrow: "standard", stroke: null, fill: "gray" },
                new go.Binding("fill").makeTwoWay()
            )
        );

    // Make link labels visible if coming out of a "conditional" node.
    // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
    function showLinkLabel(e) {
        var label = e.subject.findObject("LABEL");
        if (label !== null) label.visible = (e.subject.fromNode.data.figure == "Diamond");
    }

    // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
    myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
    myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

    load();  // load an initial diagram from some JSON text

    // initialize the Palette that is on the left side of the page
    myPalette =
        $goJS(go.Palette, "myPalette",  // must name or refer to the DIV HTML element
            {
                "animationManager.duration": 800, // slightly longer than default (600ms) animation
                nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
                model: new go.GraphLinksModel([  // specify the contents of the Palette
                    { category: "Start", text: "开始" },
                    { text: "步骤" },
                    { category: "Diamond", text: "条件" },
                    { category: "End", text: "结束" },
                    { category: "Comment", text: "说明" }
                ])
            });


    $("#NodeType").accordion();
    $("#pWindows").dialog({
        autoOpen: false,
        width: 700,
        buttons: [
            {
                text: "Ok",
                click: function () {
                    saveProperty();
                    $(this).dialog("close");
                }
            },
            {
                text: "Cancel",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    });
}


// This is the general menu command handler, parameterized by the name of the command.
function cxcommand(val) {
    var diagram = myDiagram;
    if (!(diagram.currentTool instanceof go.ContextMenuTool)) return;
    switch (val) {
        case "Cut": diagram.commandHandler.cutSelection(); break;
        case "Copy": diagram.commandHandler.copySelection(); break;
        case "Paste": diagram.commandHandler.pasteSelection(diagram.lastInput.documentPoint); break;
        case "Delete": diagram.commandHandler.deleteSelection(); break;
        case "property": setProperty(diagram); break;
    }
    diagram.currentTool.stopTool();
}

var selectLink = null;
// A custom command, for changing the color of the selected node(s).

//回填页面填充输入输出数据
function InitialDataList(data, content) {
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            var node = data[i];
            var nodeObj = $(InDataTemplate);
            nodeObj.find('.DeleteNodes').data('ListContent', node);
            var parentClass = content.attr('class');
            nodeObj.find('.F_nodeCanBeNull').attr('name', parentClass + 'F_nodeCanBeNull' + (i - 0 + 1));
            nodeObj.find('.DeleteNodes').bind('click', function () {
                nodeObj.remove();
                _InitialIndex(contentObj);
            })
            //开始回填数据
            nodeObj.find(".InputData_name").val(node.name);
            nodeObj.find(".InputData_code").val(node.code);
            nodeObj.find(".InputData_comment").val(node.comment);
            nodeObj.find(".InputData_key").val(node.key);
            nodeObj.find(".defaultValue").val(node.defaultValue);
            nodeObj.find(".InputData_canBeNull").val(node.validateRegExpr);
            switch (node.canBeNull) {
                case BPMEnumValue.BpmDefData.CAN_BE_NULL_YES:
                    nodeObj.find('input[value="CAN_BE_NULL_YES"]')[0].checked = true;
                    break;
                case BPMEnumValue.BpmDefData.CAN_BE_NULL_NO:
                    nodeObj.find('input[value="CAN_BE_NULL_NO"]')[0].checked = true;
                    break;
            }
            content.find(".ListContent").append(nodeObj);
        }
    } else {
        content.find(".ListContent").html("");
    }
}

//回填路由判断条件
function InitialDecisionResultList(decisionResultList) {
    try {
        var LinkNodesData = bpmProperties.RouteSelection;
        for (var i = 0; i < decisionResultList.length; i++) {
            var DecisionNode = decisionResultList[i];
            var Node = $(RouteTemplate);
            Node.find('#DeleteNode').bind('click', function () {
                Node.remove();
            })
            Node.find('#decisionResult').val(DecisionNode.decisionResult);
            $.each(LinkNodesData, function (index, dom) {
                var ck = $('<span style="margin:5px 10px;"><input type="checkbox" value="" /><label class="name"></label></span>');
                ck.find('.name').html(dom.node.name);
                ck.find('input[type="checkbox"]').attr('value', dom.link.oid);
                //判断是否是选中状态。
                var isChecked = false;
                if (DecisionNode.resultFlowOidList.length > 0) {
                    $.each(DecisionNode.resultFlowOidList, function (i, d) {
                        if (d == dom.link.oid) {
                            isChecked = true;
                        }
                    });
                }
                ck.find('input[type="checkbox"]')[0].checked = isChecked;
                Node.find('.CheckboxContent').append(ck);
            });
            $(".RouteSelection").find('.NodesContent').append(Node);
        }     
    } catch (e) {
        return [];
    }

}

//右键属性响应的方法
function setProperty(diagram) {

    var cxElement = document.getElementById("contextMenu");
    cxElement.style.display = "none";

    $("#pWindows").dialog("open");

    var F_linkBase = document.getElementById("F_linkBase");
    var F_nodeBase = document.getElementById("F_nodeBase");
    var F_nodeInData = document.getElementById("F_nodeInData");
    var F_nodeOutData = document.getElementById("F_nodeOutData");
    var F_nodeIf = document.getElementById("F_nodeIf");
    F_linkBase.style.display = "none";
    F_nodeBase.style.display = "none";
    F_nodeInData.style.display = "none";
    F_nodeOutData.style.display = "none";
    F_nodeIf.style.display = "none";


    ClearState();

    //流程信息
    document.getElementById("F_nodeBPMname").value = BpmDefinationManagerVo.name;
    document.getElementById("F_nodeBPMcode").value = BpmDefinationManagerVo.code;
    document.getElementById("F_nodeBPMcomment").value = BpmDefinationManagerVo.comment;




    //连线信息
    if (selectLink != null) {
        F_linkBase.style.display = "block";

        var BpmdefFlow = findBpmdefFlow(selectLink.data.from,selectLink.data.to,selectLink.data.fromPort,selectLink.data.toPort);

        var p = findBpmDefProcess(selectLink.data.from);
        var c = findBpmDefProcess(selectLink.data.to);
        $('#F_linkFrom').text(p.name);
        $('#F_linkTo').text(c.name);

        $('#F_linkName').val(BpmdefFlow.name);
        $('#F_linkCode').val(BpmdefFlow.code );
        $('#F_linkComment').val((BpmdefFlow.comment==null||BpmdefFlow.comment==undefined||BpmdefFlow.comment=='')?p.name+"->"+c.name:BpmdefFlow.comment);


        //获取连线的颜色
        var F_linkDirections = document.getElementsByName("F_linkDirection");
        if (selectLink.data.fill) {
            for (var i = 0; i < F_linkDirections.length; i++) {
                if (F_linkDirections[i].value == selectLink.data.fill) {
                    F_linkDirections[i].checked = true;
                }
                else {
                    F_linkDirections[i].checked = false;
                }
            }
        }
        else {
            F_linkDirections[0].checked = true;
        }
        return;
    }

    //节点信息
    diagram.selection.each(function (node) {
        $("#F_nodeBPMname").val(BpmDefinationManagerVo.name);
        $("#F_nodeBPMcode").val(BpmDefinationManagerVo.code);
        $("#F_nodeBPMcomment").val(BpmDefinationManagerVo.comment);

        if (node instanceof go.Node) {  // ignore any selected Links and simple Parts
            var F_nodeType = document.getElementById("F_nodeProcessNodeType");
            var F_nodeProperty = document.getElementById("F_nodeProperty");
            if (node.ci == "Start") {
                F_nodeType.innerText = "开始节点";
                F_nodeBase.style.display = "block";
                F_nodeInData.style.display = "block";
                F_nodeOutData.style.display = "block";
                F_nodeIf.style.display = "none";
            }
            if (node.ci == "") {
                F_nodeType.innerText = "步骤节点";
                F_nodeBase.style.display = "block";
                F_nodeInData.style.display = "block";
                F_nodeOutData.style.display = "block";
                F_nodeIf.style.display = "none";
            }
            if (node.ci == "Diamond") {
                F_nodeType.innerText = "条件节点";
                F_nodeBase.style.display = "block";
                F_nodeInData.style.display = "block";
                F_nodeOutData.style.display = "block";
                F_nodeIf.style.display = "block";
            }
            if (node.ci == "End") {
                F_nodeType.innerText = "结束节点";
                F_nodeBase.style.display = "block";
                F_nodeInData.style.display = "block";
                F_nodeOutData.style.display = "block";
                F_nodeIf.style.display = "none";
            }
            if (node.ci == "Comment") {
                F_nodeType.innerText = "说明节点";
                F_nodeBase.style.display = "block";
                F_nodeInData.style.display = "none";
                F_nodeOutData.style.display = "none";
                F_nodeIf.style.display = "none";
            }


            //拿附加属性 

            var NodesData = findBpmDefProcess(node.data.key);
            if (node.ci == "Diamond") {
                var links = [];
                for (var i = 0; i < myDiagram.model.linkDataArray.length; i++) {
                    var Linknode = myDiagram.model.linkDataArray[i];
                    if (Linknode.from == node.data.key) {
                        var data = findBpmDefProcess(Linknode.to);
                        if (data) {
                            var BpmdefFlow = findBpmdefFlow(Linknode.from,Linknode.to,Linknode.fromPort,Linknode.toPort);
                            links.push({link:BpmdefFlow,node:data});
                        }
                    }
                }

                bpmProperties.RouteSelection = links;
            }


            $("#F_nodeName").val(NodesData.name);
            $("#F_nodeCode").val(NodesData.code);
            $("#F_nodeComment").val(NodesData.comment);

            //回填节点处理类型
            switch (NodesData.processType) {
                case BPMEnumValue.BpmDefProcess.PROCESS_TYPE.AUTO:
                    $('input[name=F_nodeProcessType][value="AUTO"]')[0].checked = true;
                    break;
                case BPMEnumValue.BpmDefProcess.PROCESS_TYPE.PEOPLE:
                    $('input[name=F_nodeProcessType][value="PEOPLE"]')[0].checked = true;
                    break;
                case BPMEnumValue.BpmDefProcess.PROCESS_TYPE.SYSTEM:
                    $('input[name=F_nodeProcessType][value="SYSTEM"]')[0].checked = true;
                    break;
                case BPMEnumValue.BpmDefProcess.PROCESS_TYPE.CHILD_BP:
                    $('input[name=F_nodeProcessType][value="CHILD_BP"]')[0].checked = true;
                    break;
            }
            //回填实例类型
            switch (NodesData.instanceType) {
                case BPMEnumValue.BpmDefProcess.INSTANCE_TYPE.SINGLE_IN_RUN:
                    $('input[name=F_nodeInstanceType][value="SINGLE_IN_RUN"]')[0].checked = true;
                    break;
                case BPMEnumValue.BpmDefProcess.INSTANCE_TYPE.MULTIPLE:
                    $('input[name=F_nodeInstanceType][value="MULTIPLE"]')[0].checked = true;
                    break;
                case BPMEnumValue.BpmDefProcess.INSTANCE_TYPE.SINGLE_IN_BP:
                    $('input[name=F_nodeInstanceType][value="SINGLE_IN_BP"]')[0].checked = true;
                    break;
            }

            //输入数据 inputDataList
            InitialDataList(NodesData.inputDataList, $(".F_nodeInDataContent"));

            //输出数据 outputDataList
            InitialDataList(NodesData.outputDataList, $(".F_nodeOutDataContent"));

            $("#F_nodeDecisionCondition").val(NodesData.decisionCondition);

            //回填是否启动判断
            switch (NodesData.startDecision) {
                case BPMEnumValue.BpmDefProcess.START_DECISIION.YES:
                    $('input[name=F_nodeStartDecision][value="YES"]')[0].checked = true;
                    break;
                case BPMEnumValue.BpmDefProcess.START_DECISIION.NO:
                    $('input[name=F_nodeStartDecision][value="NO"]')[0].checked = true;
                    break;
            }
            $("#F_nodeStartDecisionCondition").val(NodesData.startDecisionCondition);
            $("#F_nodeChildBusinessProcessCode").val(NodesData.childBusinessProcessCode);
            //等待前节点
            switch (NodesData.waitForFrom) {
                case BPMEnumValue.BpmDefProcess.WAIT_FOR_FROM.ALL:
                    $('input[name=F_nodeWaitForFrom][value="ALL"]')[0].checked = true;
                    break;
                case BPMEnumValue.BpmDefProcess.WAIT_FOR_FROM.NO:
                    $('input[name=F_nodeWaitForFrom][value="NO"]')[0].checked = true;
                    break;
            }
            //等待流程
            switch (NodesData.waitForChildBp) {
                case BPMEnumValue.BpmDefProcess.WAIT_FOR_CHILD_BP.YES:
                    $('input[name=F_nodeWaitForChildBp][value="YES"]')[0].checked = true;
                    break;
                case BPMEnumValue.BpmDefProcess.WAIT_FOR_CHILD_BP.NO:
                    $('input[name=F_nodeWaitForChildBp][value="NO"]')[0].checked = true;
                    break;
            }

            $("#F_nodeWaitForChildProcessNodeCode").val(NodesData.waitForChildProcessNodeCode);

            //回填路由条件
            InitialDecisionResultList(NodesData.decisionResultList);

        }
    });



}

// the object with the context menu, in this case a Node, is accessible as:
//var cmObj = diagram.toolManager.contextMenuTool.currentObject;
// but this function operates on all selected Nodes, not just the one at the mouse pointer.

// Always make changes in a transaction, except when initializing the diagram.
//diagram.startTransaction("change color");
//diagram.selection.each(function(node) {
//    if (node instanceof go.Node) {  // ignore any selected Links and simple Parts
//        // Examine and modify the data, not the Node directly.
//       var data = node.data;
//       if (data.color === "red") {
// Call setDataProperty to support undo/redo as well as
// automatically evaluating any relevant bindings.
//           diagram.model.setDataProperty(data, "color", go.Brush.randomColor());
//      } else {
//           diagram.model.setDataProperty(data, "color", "red");
//      }
//   }
//});
//diagram.commitTransaction("change color");



function closeWindows() {
    var pWindows = document.getElementById("pWindows");
    pWindows.style.display = "none";
}

// Make all ports on a node visible when the mouse is over the node
function showPorts(node, show) {
    var diagram = node.diagram;
    if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
    node.ports.each(function (port) {
        port.stroke = (show ? "white" : null);
    });
}

// Show the diagram's model in JSON format that the user may edit
function save() {
    document.getElementById("mySavedModel").value = myDiagram.model.toJson();
    myDiagram.isModified = false;
}
function load() {
    myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
}

// add an SVG rendering of the diagram at the end of this page
function makeSVG() {
    var svg = myDiagram.makeSvg({
        scale: 0.5
    });
    svg.style.border = "1px solid black";
    obj = document.getElementById("SVGArea");
    obj.appendChild(svg);
    if (obj.children.length > 0) {
        obj.replaceChild(svg, obj.children[0]);
    }
}

//节点对应的扩展属性集合:连线属性集合，路由选择集合，节点属性集合
var bpmProperties = {bpmdefFlows:[],RouteSelection:[],KeyNode:[]};

//查询节点路由信息，没有返回null
var findRouteSelection = function (key) {
    for (findBpmDefProcess_i = 0; findBpmDefProcess_i < bpmProperties.KeyNode.length; findBpmDefProcess_i++) {
        var node = bpmProperties.KeyNode[findBpmDefProcess_i];
        if (node.key == key) return node.RouteSelection;
    }
    return null;
}

//使用属性oid查询节点绑定信息
var findNodeData = function (oid) {
    for (findBpmDefProcess_i = 0; findBpmDefProcess_i < bpmProperties.KeyNode.length; findBpmDefProcess_i++) {
        var node = bpmProperties.KeyNode[findBpmDefProcess_i];
        if (node.BpmDefProcess.oid == oid) {
            return findNode(node.key);
        }
    }

    return null;
}

//查询节点设置信息,没有则新建
var findBpmDefProcess = function (key) {
    for (findBpmDefProcess_i = 0; findBpmDefProcess_i < bpmProperties.KeyNode.length; findBpmDefProcess_i++) {
        var node = bpmProperties.KeyNode[findBpmDefProcess_i];
        if (node.key == key) return node.BpmDefProcess ? node.BpmDefProcess : NewBpmDefProcess();
    }
    var BpmDefProcess = NewBpmDefProcess();
    bpmProperties.KeyNode.push({ key: key, BpmDefProcess: BpmDefProcess });
    return BpmDefProcess;
}

//查询连线设置信息，没有则新建
var findBpmdefFlow = function (from,to,fromPort,toPort) {
    if(bpmProperties.bpmdefFlows==undefined){bpmProperties.bpmdefFlows=[]}
    for (findBpmdefFlow_i = 0; findBpmdefFlow_i < bpmProperties.bpmdefFlows.length; findBpmdefFlow_i++) {
        var link = bpmProperties.bpmdefFlows[findBpmdefFlow_i];
        if (link.from == from && link.to==to && link.fromPort==fromPort && link.toPort==toPort) {
            link.BpmdefFlow.parentNodeId = findBpmDefProcess(from).oid;
            link.BpmdefFlow.childNodeId = findBpmDefProcess(to).oid;
            var _link = findLink(from,to,fromPort,toPort);
            if(_link.fill == undefined || _link.fill == "gray"){
                link.BpmdefFlow.type = BPMEnumValue.BpmDefFlow.FLOW_TYPE_FORWARD;
            }else{
                link.BpmdefFlow.type = BPMEnumValue.BpmDefFlow.FLOW_TYPE_BACK
            }
            return link.BpmdefFlow;
        }
    }
    var BpmdefFlow = NewBpmDefFlow();
    bpmProperties.bpmdefFlows.push({from:from,to:to,fromPort:fromPort,toPort:toPort,BpmdefFlow: BpmdefFlow})
    BpmdefFlow.parentNodeId = findBpmDefProcess(from).oid;
    BpmdefFlow.childNodeId = findBpmDefProcess(to).oid;
    var _link = findLink(from,to,fromPort,toPort);
    if(_link.fill == undefined || _link.fill == "gray"){
        BpmdefFlow.type = BPMEnumValue.BpmDefFlow.FLOW_TYPE_FORWARD;
    }else{
        BpmdefFlow.type = BPMEnumValue.BpmDefFlow.FLOW_TYPE_BACK
    }
    return BpmdefFlow;
}


//查询节点绑定信息
var findNode = function (key) {
    for (findNode_i = 0; findNode_i < myDiagram.model.nodeDataArray.length; findNode_i++) {
        var _node = myDiagram.model.nodeDataArray[findNode_i];
        if (_node.key == key) return _node
    }
    return null;
}

//查询连线绑定信息
var findLink = function (from,to,fromPort,toPort) {
    for (findLink_i = 0; findLink_i < myDiagram.model.linkDataArray.length; findLink_i++) {
        var _link = myDiagram.model.linkDataArray[findLink_i];
        if (_link.from == from&&_link.to == to&&_link.fromPort == fromPort&&_link.toPort == toPort) return _link
    }
    return null;
}

//------无用，清理无用的key
var clearKey = function () {
    var isFindNULL = [];
    for (i = 0; i < bpmProperties.KeyNode.length; i++) {
        var nodebpmProperties = bpmProperties.KeyNode[i];
        for (i = 0; i < myDiagram.model.nodeDataArray.length; i++) {
            var nodemyDiagram = myDiagram.model.nodeDataArray[i];
            if (nodebpmProperties.key == nodemyDiagram.key) {
                isFind = true;
            }
        }
        if (isFind == false) {
            isFindNULL.push(nodebpmProperties);
        }
    }

    for (i = 0; i < isFindNULL.length; i++) {
        bpmProperties.KeyNode.remove(isFindNULL[i]);
    }
}

//获取数据
function GetDataInfo(con) {
    try {
        var list = [];
        for (var i = 0; i < con.length; i++) {
            var node = NewBpmDefData();
            var dom = con[i];
            node.name = $(dom).find('.InputData_name').val();
            node.code = $(dom).find('.InputData_code').val();
            node.comment = $(dom).find('.InputData_comment').val();
            node.key = $(dom).find('.InputData_key').val();
            node.validateRegExpr = $(dom).find('.InputData_canBeNull').val();
            node.canBeNull = BPMEnumValue.BpmDefData[$(dom).find(".F_nodeCanBeNull:checked").attr('value')];
            node.defaultValue = $(dom).find('.defaultValue').val();
            list.push(node);
        }
        return list;
    } catch (e) {
        return [];
    }

}

function ClearState() {
    $("#F_nodeBPMname").val("");
    $("#F_nodeBPMcode").val("");
    $("#F_nodeBPMcomment").val("");
    $("#F_linkName").val("");
    $("#F_linkCode").val("");
    $("#F_linkComment").val("");
    $("#F_linkFrom").html("");
    $("#F_linkTo").html("");
    $("input[name='F_linkDirection']")[0].checked = true;
    $("#F_nodeProcessNodeType").val("");
    $("#F_nodeName").val("");
    $("#F_nodeCode").val("");
    $("#F_nodeComment").val("");
    $("input[name='F_nodeProcessType']")[0].checked = true;
    $("#F_nodeChildBusinessProcessCode").val("");
    $("#F_nodeWaitForChildProcessNodeCode").val("");
    $("input[name='F_nodeWaitForChildBp']")[0].checked = true;
    $("input[name='F_nodeInstanceType']")[0].checked = true;
    $("input[name='F_nodeWaitForFrom']")[0].checked = true;
    $("input[name='F_nodeStartDecision']")[0].checked = true;
    $("#F_nodeStartDecisionCondition").val("");
    $("#F_nodeDecisionCondition").val("");
    $(".F_nodeInDataContent").find('.ListContent').html('');
    $(".F_nodeOutDataContent").find('.ListContent').html('');
    $(".NodesContent").html('');
    $("#F_nodeBPM").click();
}

function decisionResultList() {
    var reLsit = [];
    var NodesList = $(".NodesContent").find('fieldset');
    if (NodesList.length > 0) {
        for (var i = 0; i < NodesList.length; i++) {
            var reData = NewBpmDefDecisionResult();
            var node = NodesList[i];
            reData.decisionResult = $(node).find('#decisionResult').val();
            var chickboxList = $(node).find('input[type=checkbox]:checked');
            if (chickboxList.length > 0) {
                $.each(chickboxList, function (index, dom) {
                    reData.resultFlowOidList.push($(dom).attr('value'));
                })
            }
            reLsit.push(reData);
        }
    }
    return reLsit;
}


//保存属性
function saveProperty() {
    var diagram = myDiagram;
    //流程信息
    BpmDefinationManagerVo.name = $("#F_nodeBPMname").val()
    BpmDefinationManagerVo.code = $("#F_nodeBPMcode").val()
    BpmDefinationManagerVo.comment =$("#F_nodeBPMcomment").val()

    //连线信息
    if (selectLink != null) {
        var F_linkDirections = document.getElementsByName("F_linkDirection");
        for (var i = 0; i < F_linkDirections.length; i++) {
            if (F_linkDirections[i].checked) {
                var linkcolor = F_linkDirections[i].value
                diagram.model.setDataProperty(selectLink.data, "stroke", linkcolor);
                diagram.model.setDataProperty(selectLink.data, "fill", linkcolor);

                var BpmdefFlow = findBpmdefFlow(selectLink.data.from,selectLink.data.to,selectLink.data.fromPort,selectLink.data.toPort);
                BpmdefFlow.name = $('#F_linkName').val();
                BpmdefFlow.code = $('#F_linkCode').val();
                BpmdefFlow.comment = $('#F_linkComment').val();

                var p = findBpmDefProcess(selectLink.data.from);
                var c = findBpmDefProcess(selectLink.data.to)
                BpmdefFlow.parentNodeId = p.oid;
                BpmdefFlow.childNodeId = c.oid;



                if(linkcolor=="gray"){
                    BpmdefFlow.type = BPMEnumValue.BpmDefFlow.FLOW_TYPE_FORWARD;
                }
                else{
                    BpmdefFlow.type = BPMEnumValue.BpmDefFlow.FLOW_TYPE_BACK;
                }
            }
        }
    }
        //节点信息
    else {
        diagram.selection.each(function (node) {
            if (node instanceof go.Node) {  // ignore any selected Links and simple Parts
                //var F_nodeText = document.getElementById("F_nodeText");
                //diagram.model.setDataProperty(node.data, "text", F_nodeText.value);
                var BpmDefProcess = findBpmDefProcess(node.data.key);
                //追加附加属性          
                BpmDefProcess.name = $("#F_nodeName").val();
                BpmDefProcess.code = $("#F_nodeCode").val();
                BpmDefProcess.comment = $("#F_nodeComment").val();

                if(node.data.category=="Start"){
                    BpmDefProcess.processNodeType = BPMEnumValue.BpmDefProcess.PROCESS_NODE_TYPE.START
                }
                if(node.data.category==undefined || node.data.category==""){
                    BpmDefProcess.processNodeType = BPMEnumValue.BpmDefProcess.PROCESS_NODE_TYPE.PROCESS
                }
                if(node.data.category=="Diamond"){
                    BpmDefProcess.processNodeType =BPMEnumValue.BpmDefProcess.PROCESS_NODE_TYPE.DECISION
                }
                if(node.data.category=="End"){
                    BpmDefProcess.processNodeType = BPMEnumValue.BpmDefProcess.PROCESS_NODE_TYPE.END
                }
                if(node.data.category=="Comment"){
                    BpmDefProcess.processNodeType = -9999;
                }
                _processType = $("input[name='F_nodeProcessType']:checked").attr('value');
                BpmDefProcess.processType = BPMEnumValue.BpmDefProcess.PROCESS_TYPE[_processType];

                _instanceType = $("input[name='F_nodeInstanceType']:checked").attr('value');
                BpmDefProcess.instanceType = BPMEnumValue.BpmDefProcess.INSTANCE_TYPE[_instanceType];

                //输入数据 inputDataList
                var _inputDataListDom = $('.F_nodeInDataContent').find('fieldset');
                var _inputDataList = GetDataInfo(_inputDataListDom);
                BpmDefProcess.inputDataList = _inputDataList;

                //输出数据 outputDataList
                var _outputDataListDom = $('.F_nodeOutDataContent').find('fieldset');
                var _outputDataList = GetDataInfo(_outputDataListDom);
                BpmDefProcess.outputDataList = _outputDataList;

                //等待子流程
                _waitForChildBp = $("input[name='F_nodeWaitForChildBp']:checked").attr('value');
                BpmDefProcess.waitForChildBp = BPMEnumValue.BpmDefProcess.WAIT_FOR_CHILD_BP[_waitForChildBp];

                //节点判断条件
                BpmDefProcess.decisionCondition = $("#F_nodeDecisionCondition").val();

                //节点判断条件                
                BpmDefProcess.decisionResultList = decisionResultList();

                _startDecision = $("input[name='F_nodeStartDecision']:checked").attr('value');
                BpmDefProcess.startDecision = BPMEnumValue.BpmDefProcess.START_DECISIION[_startDecision];

                BpmDefProcess.startDecisionCondition = $("#F_nodeStartDecisionCondition").val();

                BpmDefProcess.childBusinessProcessCode = $("#F_nodeChildBusinessProcessCode").val();

                _waitForFrom = $("input[name='F_nodeWaitForFrom']:checked").attr('value');
                BpmDefProcess.waitForFrom = BPMEnumValue.BpmDefProcess.WAIT_FOR_FROM[_waitForFrom];

                BpmDefProcess.waitForChildProcessNodeCode = $("#F_nodeWaitForChildProcessNodeCode").val();
                //回填数据页面
                diagram.model.setDataProperty(node.data, "text", BpmDefProcess.name);
            }
        });
    }
    $('#Q_nodeBPMcode').val(BpmDefinationManagerVo.code);
    alert("保存成功！")
}


// Converts canvas to an image
function GetBPMJson() {

    var ErrorMess = "";
    BpmDefinationManagerVo.bpmFlowchartJson = myDiagram.model.toJson();
    BpmDefinationManagerVo.bpmPropertiesJson = JSON.stringify(bpmProperties);

    //流程基础信息
    var BpmDefination = NewBpmDefination();
    BpmDefination.name = BpmDefinationManagerVo.name
    BpmDefination.code = BpmDefinationManagerVo.code
    BpmDefination.comment = BpmDefinationManagerVo.comment

    //节点定义信息
    for (Node_i = 0; Node_i < myDiagram.model.nodeDataArray.length; Node_i++) {
        var node = myDiagram.model.nodeDataArray[Node_i];
        var BpmDefProcess = findBpmDefProcess(node.key)


        //排除说明节点
        if(BpmDefProcess.processNodeType == -9999){

        }else{
            BpmDefination.processList.push(BpmDefProcess);
        }
    }

    //检查连接点规则【两个节点的不能有两个及以上的同方向连接线】
    for (x = 0; x < myDiagram.model.linkDataArray.length; x++) {
        var linkmyDiagram1 = myDiagram.model.linkDataArray[x];
        for (n = 0; n < myDiagram.model.linkDataArray.length; n++) {
            var linkmyDiagram2 = myDiagram.model.linkDataArray[n];
            if (linkmyDiagram1.from == linkmyDiagram2.from && linkmyDiagram1.to == linkmyDiagram2.to &&
                linkmyDiagram1.fromPort == linkmyDiagram2.fromPort && linkmyDiagram1.toPort == linkmyDiagram2.toPort) {

            } else {
                if (linkmyDiagram1.from == linkmyDiagram2.from && linkmyDiagram1.to == linkmyDiagram2.to &&
                    (linkmyDiagram1.fromPort != linkmyDiagram2.fromPort && linkmyDiagram1.toPort != linkmyDiagram2.toPort)) {

                    var BpmDefProcessFrom = findBpmDefProcess(linkmyDiagram1.from);
                    var BpmDefProcessTo = findBpmDefProcess(linkmyDiagram1.to);
                    var fromNode = findNode(linkmyDiagram1.from);
                    var toNode = findNode(linkmyDiagram1.to);
                    //ErrorMess = ErrorMess + "发现重复的连接线【开始节点：" + BpmDefProcessFrom.name +"结束节点：" + BpmDefProcessTo.name + "】" + "\n\r";
                    ErrorMess = ErrorMess + "发现重复的连接线【" +
                        "开始节点：" + (BpmDefProcessFrom.name == "" ? fromNode.text : BpmDefProcessFrom.name) + "(" + linkmyDiagram1.fromPort + ") " +
                        "结束节点：" + (BpmDefProcessTo.name == "" ? toNode.text : BpmDefProcessTo.name) + "(" + linkmyDiagram1.toPort + ") 】" + "\n";
                }
            }
        }
    }

    //连线定义信息
    for (Link_i = 0; Link_i < myDiagram.model.linkDataArray.length; Link_i++) {
        var link = myDiagram.model.linkDataArray[Link_i];
        var BpmDefFlow = findBpmdefFlow(link.from,link.to,link.fromPort,link.toPort)
        BpmDefination.flowList.push(BpmDefFlow);
    }


    BpmDefinationManagerVo.bpmDefinationJson = JSON.stringify(BpmDefination);


    if (ErrorMess == "") {

        return {meta:true,message:"",data:JSON.stringify(BpmDefinationManagerVo)}
        //

        //BpmRestController.bpm.addBpmDefinationManager(BpmDefinationManagerVo,function(data){

        //})

    } else {
        return {meta:false,message:ErrorMess,data:""}
    }
}


function ReadBPM(){
    var valueJSON = $('#BPMJSON').val();
    if(valueJSON&&valueJSON!="")
    {
        BpmDefinationManagerVo =JSON.parse(valueJSON);
        myDiagram.model = go.Model.fromJson(BpmDefinationManagerVo.bpmFlowchartJson);
        bpmProperties =  JSON.parse( BpmDefinationManagerVo.bpmPropertiesJson);
        $('#Q_nodeBPMcode').val(BpmDefinationManagerVo.code);
        alert("读取完成")
    }
    else
    {
        alert("请输入定义JSON")
    }
}

function GetBPM(){
    var _JSONvalue =  GetBPMJson();
    if(_JSONvalue.meta){
        $('#BPMJSON').val(_JSONvalue.data);
    }else
    {
        alert(_JSONvalue.message)
    }
}


function PostBPM(){
    var _JSONvalue =  GetBPMJson();
    if(_JSONvalue.meta){
        $('#BPMJSON').val(_JSONvalue.data);
        BpmRestController.bpm.addBpmDefinationManager(_JSONvalue.data,function(data ){
            alert("提交流程成功！")
        })
    }else
    {
        alert(_JSONvalue.message)
    }
}

function GetBPMInfo() {
    BpmRestController.bpm.getBpmDefinationManagerByCode($('#Q_nodeBPMcode').val(), function (data) {
        if(data)
        {
            $('#BPMJSON').val(JSON.stringify(data));
            BpmDefinationManagerVo = data;
            myDiagram.model = go.Model.fromJson(BpmDefinationManagerVo.bpmFlowchartJson);
            bpmProperties =  JSON.parse( BpmDefinationManagerVo.bpmPropertiesJson);
        }else{
            alert("没有该流程")
        }
    },
    function(){
        alert("没有该流程")
    })
}

function NewBPM(){
    NewBpmDefinationManagerVo();
    myDiagram.model = go.Model.fromJson(BpmDefinationManagerVo.bpmFlowchartJson);
    bpmProperties = {RouteSelection:[],KeyNode:[]};
    $('#Q_nodeBPMcode').val(BpmDefinationManagerVo.code);
}

function SaveBPM(){

    //删除不合格数据（以前的bug造成的错误数据）
    var rem = [];
    $.each(bpmProperties.bpmdefFlows,function(index2,dom2){
        if(dom2.from==true||dom2.from==false){
        }else{
            rem.push(dom2);
        }
    })
    bpmProperties.bpmdefFlows = rem;


    BpmRestController.bpm.getBpmDefinationManagerByCode(BpmDefinationManagerVo.code, function (data) {
            if(data){
                //编辑
                var _JSONvalue =  GetBPMJson();
                if(_JSONvalue.meta){
                    BpmRestController.bpm.updateBpmDefinationManagerById(_JSONvalue.data,function(data ){
                        alert("提交流程成功！")
                    })
                }else
                {
                    alert(_JSONvalue.message)
                }
            }else{
                //新增
                var _JSONvalue =  GetBPMJson();
                if(_JSONvalue.meta){
                    BpmRestController.bpm.addBpmDefinationManager(_JSONvalue.data,function(data ){
                        alert("提交流程成功！")
                    })
                }else
                {
                    alert(_JSONvalue.message)
                }
            }
        },
        function(){
            alert("没有该流程")
        })
}
//启动模拟
function RunBPM(){
    BpmRestController.bpm.startBusinessProcessSimulate(BpmDefinationManagerVo.code,function(data ){
        $('#run_businessProcessOid').val(data);
        alert("模拟开始")
    })
}
//开始交互
function EventRunBPM(){
    BpmRestController.bpm.getBpmSimulateMonitorVo($('#run_businessProcessOid').val(),function(data ){
        if(data){
            $('#IntOurData_list').html('');
            $.each(data.bpmSimulateMonitorEventVoMap,function(index,event){

                var _itemdata = findNodeData(event.bpmDefProcess.oid);
                if(_itemdata){
                    myDiagram.model.setDataProperty(_itemdata, "fill", " #DC3C00");
                }

                /**
                 * 开始前事件
                 * 启动判断执行前被执行
                 * 提示用户提供输入数据
                 */
                if(event.eventType=="ProcessNodeBeforeStartEvent"){
                    var newNode = $(IntOurData_tabTemplate);
                    var nodeitem = newNode.find(".IntOurData_NoedDataitem").html();
                    newNode.find(".IntOurData_NoedDataitem").html('');

                    $(newNode).find('.IntOurData_tabTitle').html('节点：' + event.bpmDefProcess.name + '，操作：<button class="nextStep">提交处理</button>')
                    $(newNode).find('.IntOurData_DataType').html("输入数据")

                    $.each(event.bpmDefProcess.inputDataList,function(intIndex,intData){
                        var Newnodeitem = $(nodeitem);
                        Newnodeitem.find('.datakey').val(intData.key)
                        Newnodeitem.find('.datavname').html(intData.name)
                        BpmRestController.bpm.findProcessData(event.businessProcessOid,intData.key,function(_datavalue){
                            Newnodeitem.find('.datavalue').val(_datavalue)
                        })
                        newNode.find('.IntOurData_NoedDataitem').append(Newnodeitem);
                    })
                    //增加新数据
                    newNode.find('.IntOurData_newItem').data('dom',newNode);
                    newNode.find('.IntOurData_newItem').bind('click',function(){
                        var Newnodeitem = $(nodeitem);
                        $(this).data('dom').find('.IntOurData_NoedDataitem').append(Newnodeitem);
                    })
                    //提交处理
                    $(newNode).find('.nextStep').data('event',event)
                    $(newNode).find('.nextStep').data('newNode',newNode)
                    $(newNode).find('.nextStep').data('_itemdata',_itemdata)
                    $(newNode).find('.nextStep').bind('click',function(){

                        myDiagram.model.setDataProperty($(this).data('_itemdata'), "fill", "#EE9999");

                        var _newNode = $(this).data('newNode');
                        var _event = $(this).data('event');
                        var datalist = $(newNode).find('.datakey');
                        var postValue = [];
                        $.each(datalist,function(datalstindex,datalistitem){
                            var _key = $(datalistitem).val();
                            var _value = $(datalistitem).parent().find('.datavalue').val();
                            var vauleNew;
                            eval("vauleNew = {"+_key+":'"+_value+"'}");
                            postValue.push(vauleNew);
                        })

                        if(postValue.length!=0){
                            BpmRestController.bpm.putProcessDataMap(_event.businessProcessOid,postValue,function(){
                                BpmRestController.bpm.continuteBpmSimulateMonitorEvent(_event.businessProcessOid,_event.monitorEventOid,function(_data){
                                    $(_newNode).remove();
                                })
                            })
                        }else{
                            BpmRestController.bpm.continuteBpmSimulateMonitorEvent(_event.businessProcessOid,_event.monitorEventOid,function(_data){
                                $(_newNode).remove();
                            })
                        }
                    })
                    $('#IntOurData_list').append(newNode);
                }
                /**
                 * 执行通过事件
                 * 执行通过时被执行
                 * 提示用户提供输出数据
                 */
                if(event.eventType=="ProcessNodeExecuteEvent"){
                    var newNode = $(IntOurData_tabTemplate);
                    var nodeitem = newNode.find(".IntOurData_NoedDataitem").html();
                    newNode.find(".IntOurData_NoedDataitem").html('');

                    $(newNode).find('.IntOurData_tabTitle').html('节点：' + event.bpmDefProcess.name + '，操作：<button class="nextStep">提交处理</button>')
                    $(newNode).find('.IntOurData_DataType').html("输出数据")

                    $.each(event.bpmDefProcess.outputDataList,function(intIndex,intData){
                        var Newnodeitem = $(nodeitem);
                        Newnodeitem.find('.datakey').val(intData.key)
                        Newnodeitem.find('.datavname').html(intData.name)
                        BpmRestController.bpm.findProcessData(event.businessProcessOid,intData.key,function(_datavalue){
                            Newnodeitem.find('.datavalue').val(_datavalue)
                        })
                        newNode.find('.IntOurData_NoedDataitem').append(Newnodeitem);
                    })
                    //增加新数据
                    newNode.find('.IntOurData_newItem').data('dom',newNode);
                    newNode.find('.IntOurData_newItem').bind('click',function(){
                        var Newnodeitem = $(nodeitem);
                        $(this).data('dom').find('.IntOurData_NoedDataitem').append(Newnodeitem);
                    })
                    //提交处理
                    $(newNode).find('.nextStep').data('event',event)
                    $(newNode).find('.nextStep').data('newNode',newNode)
                    $(newNode).find('.nextStep').data('_itemdata',_itemdata)
                    $(newNode).find('.nextStep').bind('click',function(){
                        myDiagram.model.setDataProperty($(this).data('_itemdata'), "fill", "#EE9999");
                        var _newNode = $(this).data('newNode');
                        var _event = $(this).data('event');
                        var datalist = $(newNode).find('.datakey');
                        var postValue = [];
                        $.each(datalist,function(datalstindex,datalistitem){
                            var _key = $(datalistitem).val();
                            var _value = $(datalistitem).parent().find('.datavalue').val();
                            var vauleNew;
                            eval("vauleNew = {"+_key+":'"+_value+"'}");
                            postValue.push(vauleNew);
                        })

                        if(postValue.length!=0){
                            BpmRestController.bpm.putProcessDataMap(_event.businessProcessOid,postValue,function(){
                                BpmRestController.bpm.continuteBpmSimulateMonitorEvent(_event.businessProcessOid,_event.monitorEventOid,function(_data){
                                    $(_newNode).remove();
                                })
                            })
                        }else{
                            BpmRestController.bpm.continuteBpmSimulateMonitorEvent(_event.businessProcessOid,_event.monitorEventOid,function(_data){
                                $(_newNode).remove();
                            })
                        }
                    })
                    $('#IntOurData_list').append(newNode);
                }

                //其它事件
                if(event.eventType=="ProcessNodeStartEvent"||event.eventType=="ProcessNodeEndEvent"||event.eventType=="ProcessNodeWaitTriggerEvent"){
                    var newNode = $(IntOurData_tabTemplate);
                    var nodeitem = newNode.find(".IntOurData_NoedDataitem").html();
                    newNode.find(".IntOurData_NoedDataitem").html('');

                    $(newNode).find('.IntOurData_tabTitle').html('节点：' + event.bpmDefProcess.name + '，操作：<button class="nextStep">提交处理</button>')
                    $(newNode).find('.IntOurData_DataType').html("节点状态");
                    newNode.find('.IntOurData_NoedDataitem').append($('<h4>'+event.eventType+'</h4>'));
                    //提交处理
                    $(newNode).find('.nextStep').data('event',event)
                    $(newNode).find('.nextStep').data('newNode',newNode)
                    $(newNode).find('.nextStep').data('_itemdata',_itemdata)
                    $(newNode).find('.nextStep').bind('click',function(){
                        myDiagram.model.setDataProperty($(this).data('_itemdata'), "fill", "#EE9999");
                        if(event.eventType=="ProcessNodeEndEvent"){
                            myDiagram.model.setDataProperty($(this).data('_itemdata'), "fill", "#C0C0C0");
                        }
                        var _event = $(this).data('event');
                        var _newNode = $(this).data('newNode');
                        BpmRestController.bpm.continuteBpmSimulateMonitorEvent(_event.businessProcessOid,_event.monitorEventOid,function(_data){

                            if(event.eventType=="ProcessNodeWaitTriggerEvent"&&event.bpmDefProcess.processType==BPMEnumValue.BpmDefProcess.PROCESS_TYPE.PEOPLE){
                                BpmRestController.bpm.triggerProcessNode(_event.businessProcessOid,_event.processNodeoid,function(_data){

                                })
                            }
                            $(_newNode).remove();
                        })
                    });
                    $('#IntOurData_list').append(newNode);
                }
            })
            //$("#IntOurData_list").accordion();
            $("#IntOurData").dialog({
                autoOpen: true,
                width: 500,
                heigt:600,
                buttons: [
                    {
                        text: "Ok",
                        click: function () {
                            //saveProperty();
                            $(this).dialog("close");
                        }
                    },
                    {
                        text: "Cancel",
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ]
            });
        }
    })
}
//获取当前流程状态，每一个实例节点
function GetRunBPMInfo(){


    BpmRestController.bpm.getBusinessProcessStatusInfo($('#run_businessProcessOid').val(),function(data ){
        if(data){
            $('#Q_nodeBPMcode').val(data.bpmDefination.code);
            //查看所有节点实例
            $.each(data.bpmProcessNodeList,function(index,node){
                var nodedata = findNodeData(node.bpmDefProcess.oid);
                //alert("[key:"+nodedata.key+",STATUS:"+node.status+"]"+node.bpmDefProcess.name)

                //异常
                if(node.status == BPMEnumValue.PROCESS_NODE.STATUS.EXCEPTION){
                    //myDiagram.model.setDataProperty(nodedata, "fill", " #DC3C00");
                }
            })


        }
    })
}
