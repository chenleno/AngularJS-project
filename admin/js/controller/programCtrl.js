/**
 * Created by chenqi1 on 2017/6/30.
 */
//节目列表

app.controller('programListCtrl', ['$scope', '$rootScope', '$http', '$resource', '$state', '$timeout', 'selectService', 'commonService', 'programService','checkBtnService',

    function ($scope, $rootScope, $http, $resource, $state, $timeout, selectService, commonService, programService,checkBtnService) {

        var programSelectedArr = []
        $scope.programSelectedArr = programSelectedArr

        $scope.query = function (name, pageNo, pageSize) {

            var $com = $resource($scope.app.host +
                "/api/mps-materialList/materialList?name=:name&pageNo=:pageNo&pageSize=:pageSize", {
                    name: '@name',
                    pageNo: '@pageNo',
                    pageSize: '@pageSize'
                });

            $com.get({ name: name, pageNo: pageNo, pageSize: pageSize },
                function (data) {
                    $scope.datas = data.results
                    $scope.programList = data.results
                })
        }

        $scope.query()

        //监听按键
        $scope.search = function (name, e, pageNo, pageSize) {
            if (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    $scope.query(name, pageNo, pageSize)
                }
            }
        }

        //点击新建按钮触发弹框
        $scope.addProgram = function () {
            checkBtnService.check("/api/mps-materialList/materialList",'POST').then(function(){
                commonService.addPro()
            })

        }

        //删除操作
        $scope.delete = function (data) {
            //检查删除权限
            checkBtnService.check("/api/mps-materialList/materialList",'put').then(function(){
                //获取删除项对象集合
                var sendObj = programService.getSelectedProgram(data, $scope.datas)

                if (sendObj.ids.length == 0) {
                    commonService.ctrlError('操作', '请先选择节目')
                } else {
                    commonService.ctrlModal("deleteProgramType").result.then(function () {

                        var promise = $http({
                            method: 'put',
                            url: $scope.app.host + '/api/mps-materialList/materialList',
                            data: sendObj
                        })

                        promise.then(function (res) {
                            res.data.success ?
                                commonService.ctrlSuccess('删除') :
                                commonService.ctrlError('删除', res.msg)
                            $scope.query()
                        })
                    })
                }

            })


        }

        //select相关操作的方法绑定
        $scope.updateSelection = selectService.updateSelection
        $scope.selectAll = selectService.selectAll
        $scope.isSelected = selectService.isSelected
        $scope.isSelectedAll = selectService.isSelectedAll

    }])

//新建节目模态框
app.controller('addProCtrl', ['$scope', '$modalInstance', '$resource', '$state', 'commonService', 'staticData', 'programService',
    function ($scope, $modalInstance, $resource, $state, commonService, staticData, programService) {

        var host = staticData.hostUrl
        var id = ""
        $scope.addProModel = true

        $scope.submit = function () {

            var $com = $resource(host + "/api/mps-materialList/materialList")
            $com.save({}, $scope.data, function (res) {
                res.success ?
                    commonService.ctrlSuccess('新建节目') :
                    commonService.ctrlError('新建节目', res.message)

                id = res.message
                if(res.success == true){
                    $state.go('app.program.addProgram',{id:id,name:$scope.data.name,bool:false})
                }

            })

            $modalInstance.close();
            $scope.addProModel = false


        }

        $scope.doSubmit = function (e) {
            //验证输入项是否符合要求
            var bool = programService.limitNameLength($scope.data.name)
            $scope.bool = bool
            //验证按键事件
            if (e) {
                var keycode = window.event ? e.keyCode : e.which;

                switch (keycode) {
                    case 13:
                        if (bool) {
                            $scope.submit()
                            break
                        }
                }
            } else {
                if (bool) {
                    $scope.submit()
                }
            }
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
            $scope.addProModel = false
        };

    }])

//添加修改素材列表

app.controller('addProgramCtrl', ['$scope', '$rootScope', '$http', '$resource', '$state', '$timeout', 'selectService', 'commonService', 'programService','$stateParams',
    function ($scope, $rootScope, $http, $resource, $state, $timeout, selectService, commonService, programService,$stateParams) {
        var programSelectedArr = []
        $scope.programSelectedArr = programSelectedArr
        var name = $stateParams.name
        var edit = !!$stateParams.bool;
        $scope.programName = name //获取的名字
        $scope.editProName = false;
        $scope.materialListId = $stateParams.id; //获取的id
        $scope.datas = []
        //查询列表
        $scope.query = function (materialListId, pageNo, pageSize) {

            var $com = $resource($scope.app.host +
                "/api/mps-materialList/materialList/:materialListId/material?pageNo=:pageNo&pageSize=:pageSize", {
                    materialListId: '@materialListId',
                    pageNo: '@pageNo',
                    pageSize: '@pageSize'
                });

            $com.get({ materialListId: materialListId, pageNo: pageNo, pageSize: pageSize },
                function (data) {
                    $scope.datas = data.results
                })
        }
        //
        if(edit){
            $scope.query($scope.materialListId,1,10000)
        }
        //
        //改名字
        $scope.changeName = function (name, materialListId) {
            if (name == '') {
                commonService.ctrlError('操作', '请输入名字')
            } else {
                var sendObj = { 'name': name }
                var promise = $http({ method: 'put', url: $scope.app.host + '/api/mps-materialList/materialList/' + materialListId + '/name', data: sendObj })
                promise.then(function (res) {
                    res.data.success ?
                        commonService.ctrlSuccess('保存') :
                        commonService.ctrlError('保存', res.data.message)
                    if(res.data.success){
                        $scope.editProName = !$scope.editProName;
                    }

                })
            }
        }


        $scope.submit = function (id, arr) {
            if (arr == '') {
                commonService.ctrlError('操作', '请先选择素材')
            } else if(edit) {
                //for(var i = 0; i < arr.length; i++){
                //    if(arr[i].orderNumber == ""){
                //        arr[i].orderNumber = 0
                //    }
                //}
                var sendObj = { 'fileList': arr }
                var promise = $http({ method: 'put', url: $scope.app.host + '/api/mps-materialList/materialList/' + id +'/file', data: sendObj })

                promise.then(function (res) {
                    res.data.success ?
                        commonService.ctrlSuccess('保存') :
                        commonService.ctrlError('保存', res.data.message)
                    if (res.data.success) {
                        $scope.query(id, 1, 1000)
                    }
                })
            }else if(!edit){
                //for(var i = 0; i < arr.length; i++){
                //    if(arr[i].orderNumber == ""){
                //        arr[i].orderNumber = 0
                //    }
                //}
                var sendObj = { 'fileList': arr }
                var promise = $http({ method: 'post', url: $scope.app.host + '/api/mps-materialList/materialList/' + id +'/file', data: sendObj })

                promise.then(function (res) {
                    res.data.success ?
                        commonService.ctrlSuccess('保存') :
                        commonService.ctrlError('保存', res.data.message)
                    if (res.data.success) {
                        $scope.query(id, 1, 1000)
                    }
                })
            }

        }

        //删除操作
        $scope.delete = function (index, bool) {
            if (bool) {
                commonService.ctrlModal("delRole").result.then(function () {
                    $scope.datas.splice(index, 1);
                })
            } else {
                if (index == '') {
                    commonService.ctrlError('操作', '请先选择素材')
                } else {
                    commonService.ctrlModal("delRole").result.then(function () {
                        for (var i = 0; i < index.length; i++) {
                            for (var k = 0; k < $scope.datas.length; k++) {
                                if ($scope.datas[k].uid == index[i]) {
                                    $scope.datas.splice(k, 1);
                                    break;
                                }
                            }
                        }
                        $scope.programSelectedArr = []
                    })

                }
            }
        }
        //取消改名字操作
        $scope.clearName = function(){
            $scope.programName = name;
            $scope.editProName = !$scope.editProName;
        }
        $scope.editName = function(){
            //$scope.programName = name2;
            $scope.editProName = !$scope.editProName;
            //angular.element('.proName').focus().select()
            var focusEle = angular.element('.proName')
            $timeout(function () {
                focusEle.focus().select()
            })
        }
        $scope.addProName = function(name,materialListId){
            $scope.changeName(name,materialListId)
            //console.log(materialListId)
        }


        //select相关操作的方法绑定
        $scope.updateSelection = selectService.updateSelection
        $scope.selectAll = selectService.selectAll
        $scope.isSelected = selectService.isSelected
        $scope.isSelectedAll = selectService.isSelectedAll

        //监听导入的素材列表
        $scope.$on('newSelectList', function (event, args) {

            //$scope.datas = args.newSelectList;
            var itemBool = false;
            for( var i = 0 ; i < args.newSelectList.length ; i++){
                for(var k = 0; k < $scope.datas.length; k++){
                    if(args.newSelectList[i].uid == $scope.datas[k].uid){
                        itemBool = true;
                        break;
                    }
                }
                if(itemBool == false){
                    args.newSelectList[i]["orderNumber"] = ''
                    $scope.datas.push(args.newSelectList[i]);
                }
                itemBool = false
            }
            //console.log(args.newSelectList);
            //console.log($scope.datas);
        });

    }])

//文件操作模态框
app.controller('treeNodeCtrl', ['$scope', '$rootScope', '$resource', '$state', 'commonService', '$q', 'addDiyDom'
    , function ($scope, $rootScope, $resource, $state, commonService, $q, addDiyDom) {

        var zTreeObj;//初始化树形结构对象

        var setting = {
            view: {
                showLine: false,
                showIcon: false,
                selectedMulti: false,
                dblClickExpand: true,
                addDiyDom: addDiyDoms
            },
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            data: {
                key: {
                    name: "name",
                    title: "name"
                }
            },
            callback: {
                onCheck: zTreeOnCheck
            }
        };

        //自定义Dom样式
        function addDiyDoms(treeId, treeNode) {
            addDiyDom.diyDom(treeId, treeNode, 'check');
        }

        //是否选中状态的DOM操作
        function zTreeOnCheck(event, treeId, treeNode) {
            //console.log(treeId);

            var zTree = $.fn.zTree.getZTreeObj("treeNodes");
            var nodes = zTree.getCheckedNodes(true);

            for (var i = 0; i <= nodes.length - 1;i++) {
                $("#" + nodes[i].tId).css("background-color", "#fff3e4");
            }

            var noChecked = zTree.getCheckedNodes(false);
            
            for (var j = 0; j <= noChecked.length - 1;j++) {
                $("#" + noChecked[j].tId).css("background-color", "#fff");
            }    

            // if (!treeNode.checked) {
            //     $("#" + treeNode.tId).css("background-color", "#fff");
            //     console.log("未勾选" + treeNode.name);
            // } else {
            //     $("#" + treeNode.tId).css("background-color", "#fff3e4");
            //     console.log("勾选" + treeNode.name);
            // }
        }

        //异步加载数据树
        setTimeout(function () {
            $scope.query('', true);
        }, 0);

        //取消全部选中
        $scope.cancelSelect = function () {
            var treeObj = $.fn.zTree.init($("#treeNodes"), setting, $scope.ztreeNodeMessage);
            treeObj.cancelSelectedNode();
        }

        //导入素材
        $scope.importMedia = function () {
            var zTree = $.fn.zTree.getZTreeObj("treeNodes");
            var nodes = zTree.getCheckedNodes(true);
            if(nodes.length <= 0) {
                commonService.ctrlError('导入', '请先选择素材');
                return;
            }
            var newSelectObj = [];
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var house = date.getHours();
            var minutes = date.getMinutes();
            var second = date.getSeconds();
            var milsecond = date.getMilliseconds();
            var timeNow = year + "-" + month + "-" + day + " " + house + ":" + minutes + ":" + second;

            for (var i = 0; i <= nodes.length - 1; i++) {
                if (!nodes[i].isParent) {
                    nodes[i].selectTime = timeNow;
                    newSelectObj.push(nodes[i]);
                }
            }
            $scope.$emit('newSelectList',{newSelectList:newSelectObj});

        }

        //滚动条设置
        setTimeout(function () {
            var scroll = new Optiscroll(document.getElementById('scrolls'));
            //滚动底部的时候触发
            $('#scrollleft').on('scrollreachbottom', function (ev) {
            });
        }, 100)

        ////滚动条
        //$scope.scrollHeight = function () {
        //    //console.log($(window).height())
        //    $('#scrolls').css('height', $(window).height() - 310)
        //}
        //
        //$scope.scrollHeight();
        //$(window).resize(function () {
        //    $('#scrolls').css('height', $(window).height() - 310)
        //});

        //默认查找根目录文件
        $scope.query = function (path, all) {
            //测试接口,对接口进行测试
            var $com = $resource("/api/mps-filemanager/file/tree?path=:path&all=:all", {
                path: '@path',
                all: '@all'
            });

            $com.get({ path: path, all: all },
                function (data) {

                    $scope.ztreeNodeMessage = data.message;
                    console.log(data.message)
                    zTreeObj = $.fn.zTree.init($("#treeNodes"), setting, data.message);
                    var type = { "Y": "s", "N": "s" };
                    zTreeObj.setting.check.chkboxType = type;
                })
        }

        //搜索框功能
        $scope.searchKeyword = function () {
            var keyword = $("#keyword").val();
            zTreeObj = $.fn.zTree.init($("#treeNodes"), setting, $scope.ztreeNodeMessage);
            var treeObj = $.fn.zTree.getZTreeObj("treeNodes");
            var nodes = treeObj.getNodesByParamFuzzy("name", keyword, null);
            zTreeObj = $.fn.zTree.init($("#treeNodes"), setting, nodes);
            //filter();
        }

        //过滤ztree显示数据,暂时未用到该功能
        function filter() {
            //获取不符合条件的叶子结点
            var hiddenNodes = zTreeObj.getNodesByFilter(filterFunc);
            //显示上次搜索后背隐藏的结点
            zTreeObj.showNodes(hiddenNodes);

            //查找不符合条件的叶子节点
            function filterFunc(node) {
                var _keywords = $("#keyword").val();

                if (node.isParent || node.name.indexOf(_keywords) != -1) return false;
                return true;
            };
            //hiddenNodes=zTreeObj.getNodesByFilter(filterFunc);
            //隐藏不符合条件的叶子结点
            zTreeObj.hideNodes(hiddenNodes);
        };

    }])