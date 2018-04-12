/**
 * Created by chenqi1 on 2017/10/9.
 */
app.controller('PTlistCtrl', ['$scope', 'staticData', '$resource', 'commonService', '$timeout', '$state', 'checkBtnService',
    function ($scope, staticData, $resource, commonService, $timeout, $state, checkBtnService) {
        //点位状态选项绑定
        $scope.stateGroup = staticData.deviceState
        //点位类型绑定
        $scope.PTtype = staticData.PTtype

        $scope.cityList = []

        //分页每页条目数
        $scope.pageSize = staticData.pageSize
        //分页索引显示数
        $scope.maxSize = staticData.pageMaxSize


        //查询点位城市数据
        $scope.queryCity = function () {
            var $com = $resource($scope.app.host + '/api/cinema-point/point/pointLocation?pointType=')
            $com.get(function (res) {
                $scope.cityList = res.message
            })
        }

        //查询待添加点位角标数值
        $scope.queryTipNum = function () {
            var $com = $resource($scope.app.host + '/api/cinema-point/usefulPoint?province=&city=&district=&pointName=&pointType=&pageNo=&pageSize=')
            $com.get(function (res) {
                $scope.tipNum = res.total
            })
        }

        //查询列表
        $scope.query = function (province, city, district, pointName, pointType, state, pageNo, pageSize) {

            var $com = $resource($scope.app.host +
                "/api/cinema-point/point?province=:province&city=:city&district=:district&pointName=:pointName&pointType=:pointType&state=:state&pageNo=:pageNo&pageSize=:pageSize", {
                    province: '@province',
                    city: '@city',
                    district: '@district',
                    pointName: '@pointName',
                    pointType: '@pointType',
                    state: '@state',
                    pageNo: '@pageNo',
                    pageSize: '@pageSize'
                });

            $com.get({ province: province, city: city, district: district, pointName: pointName, pointType: pointType, state: state, pageNo: pageNo, pageSize: pageSize },
                function (res) {
                    $scope.countMap = res.countMap
                    $scope.datas = res.pointList.dataList
                    $scope.deviceList = res.pointList.dataList

                    if (res.pointList.pages == 0) {
                        res.pointList.pages++;
                    }
                    $scope.numPages = res.pointList.pages
                    $scope.currentPage = res.pointList.pageNo
                    $scope.totalItems = res.pointList.total + 1

                })
        }

        $scope.search = function (selected, selected2, selected3, keyword, type, state, pageNo, pageSize, e) {
            if (keyword) {
                keyword = keyword.replace(/&/g, '%26')
            }
            if (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    $scope.query(selected, selected2, selected3, keyword, type, state, pageNo, pageSize)
                }
            } else {
                $scope.query(selected, selected2, selected3, keyword, type, state, pageNo, pageSize)
            }
        }

        //---初始查询----
        $scope.queryCity()
        $scope.queryTipNum()
        $scope.query('', '', '', '', '', '', 1, $scope.pageSize)




        $scope.c = function (selected, selected2, selected3, keyword, type, state, pageNo, pageSize) {
            $scope.selected2 = "";
            $scope.selected3 = "";
            $scope.query(selected, $scope.selected2, $scope.selected3, keyword, type, state, pageNo, pageSize)
        };

        $scope.c2 = function (selected, selected2, selected3, keyword, type, state, pageNo, pageSize) {
            $scope.selected3 = "";
            $scope.query(selected, selected2, $scope.selected3, keyword, type, state, pageNo, pageSize)
        };

        $scope.c3 = function (selected, selected2, selected3, keyword, type, state, pageNo, pageSize) {
            $scope.query(selected, selected2, selected3, keyword, type, state, pageNo, pageSize)
        }

        //查看详情
        $scope.PTdetail = function (id) {
            commonService.editPT(id)
        }

        //点位编辑
        $scope.editPT = function (id, bool) {

            checkBtnService.check("/api/cinema-point/point/:pointId", 'PUT').then(function () {
                commonService.editPT(id, bool).result.then(function () {

                    $scope.query()
                })
            })
        }

        //每隔0.5s进行请求刷新
        $scope.refresh = function (taskId) {

            var $com = $resource($scope.app.host + '/api/cinema-point/point/:taskId/taskstate', { taskId: '@taskId' })

            $com.get({ taskId: taskId }, function (res) {
                if (res.success) {
                    if (res.code == 'upload_success') {
                        $scope.onLoading = false
                        //截图成功，打开截图模态框
                        commonService.showSS(res.data)
                    }
                    else {
                        $timeout(function () {
                            $scope.refresh(taskId)
                        }, 500)
                    }
                } else {
                    $scope.onLoading = false
                    commonService.ctrlError('操作', res.message)
                }
            })


            //测试
            //commonService.showSS()
        }

        //打开查看截图模态框
        $scope.showSS = function (pointId) {
            $scope.onLoading = true

            //先请求截图接口，终端开始截图
            //var sendObj = {}
            //sendObj.pointId = pointId

            var $com = $resource($scope.app.host + "/api/cinema-point/point/:pointId/screenshot", { pointId: '@pointId' })
            $com.save({ pointId: pointId }, function (res) {

                if (res.success) {
                    $scope.refresh(res.data.taskId)
                } else {
                    commonService.ctrlError('操作', res.message)
                    $scope.onLoading = false
                }
            })


            //测试
            //$scope.refresh()

        }
        //添加点位
        $scope.addPoint = function () {
            commonService.addPoint();
        }

    }])

//添加点位列表
app.controller('addPTlistCtrl', ['$scope', 'staticData', '$resource', 'commonService', '$http', '$timeout',
    function ($scope, staticData, $resource, commonService, $http, $timeout) {

        //点位类型绑定
        $scope.PTtype = staticData.PTtype

        $scope.cityList = []

        //分页每页条目数
        $scope.pageSize = staticData.pageSize
        //分页索引显示数
        $scope.maxSize = staticData.pageMaxSize

        //查询添加点位权限
        $scope.checkExamine = function () {

            var $com = $resource($scope.app.host + '/api/cinema-point/point')
            $com.save({}, function (res) {
                if (res.code == 'noPop' && res.access == "notpermission") {
                    //没审核权限，只显示状态
                    $scope.onlyShowState = true
                } else if (res.access == "havepermmison") {
                    //有审核权限，显示操作项
                    $scope.onlyShowState = false
                }
            })


            //var promise = $http({method: 'put', url: $scope.app.host + '/api/cinema-point/point'})
            //promise.then(function(res){
            //    if(res.data.code == 'noPop' && res.data.access == "notpermission"){
            //        //没审核权限，只显示状态
            //        $scope.onlyShowState = true
            //    }else if(res.data.access == "havepermmison"){
            //        //有审核权限，显示操作项
            //        $scope.onlyShowState = false
            //    }
            //})
        }

        //查询点位城市数据
        $scope.queryCity = function () {
            var $com = $resource($scope.app.host + '/api/cinema-point/point/pointLocation?pointType=')
            $com.get(function (res) {
                $scope.cityList = res.message
            })
        }
        //查询待添加点位角标数值
        $scope.queryTipNum = function () {
            var $com = $resource($scope.app.host + '/api/cinema-point/usefulPoint?province=&city=&district=&pointName=&pointType=&pageNo=&pageSize=')
            $com.get(function (res) {
                $scope.tipNum = res.total
            })
        }

        //查询列表
        $scope.query = function (province, city, district, pointName, pointType, pageNo, pageSize) {

            var $com = $resource($scope.app.host +

                "/api/cinema-point/usefulPoint?province=:province&city=:city&district=:district&pointName=:pointName&pointType=:pointType&pageNo=:pageNo&pageSize=:pageSize", {
                    province: '@province',
                    city: '@city',
                    district: '@district',
                    pointName: '@pointName',
                    pointType: '@pointType',
                    pageNo: '@pageNo',
                    pageSize: '@pageSize'
                });

            $com.get({ province: province, city: city, district: district, pointName: pointName, pointType: pointType, pageNo: pageNo, pageSize: pageSize },
                function (res) {
                    $scope.datas = res.dataList

                    $scope.totalItems = res.total + 1
                    $scope.numPages = res.pages
                    if ($scope.numPages == 0) {
                        $scope.numPages++
                    }
                    $scope.currentPage = res.pageNo
                })
        }

        $scope.search = function (selected, selected2, selected3, keyword, type, pageNo, pageSize, e) {
            if (keyword) {
                keyword = keyword.replace(/&/g, '%26')
            }
            if (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    $scope.query(selected, selected2, selected3, keyword, type, pageNo, pageSize)
                }
            } else {
                $scope.query(selected, selected2, selected3, keyword, type, pageNo, pageSize)
            }
        }

        //点位添加
        $scope.examine = function (groupId) {

            var sendObj = {
                groupId: groupId,
            }
            commonService.ctrlModal("addPT").result.then(function () {

                var $com = $resource($scope.app.host + '/api/cinema-point/point/add/point')
                $com.save({}, sendObj, function (res) {
                    res.success ?
                        commonService.ctrlSuccess("操作") :
                        commonService.ctrlError("操作", res.message)
                    $scope.query()
                    $scope.queryTipNum()
                })
            })
        }

        $scope.c = function (selected, selected2, selected3, keyword, type) {
            $scope.selected2 = "";
            $scope.selected3 = "";
            $scope.query(selected, $scope.selected2, $scope.selected3, keyword, type)
        };

        $scope.c2 = function (selected, selected2, selected3, keyword, type) {
            $scope.selected3 = "";
            $scope.query(selected, selected2, $scope.selected3, keyword, type)
        };

        $scope.c3 = function (selected, selected2, selected3, keyword, type) {
            $scope.query(selected, selected2, selected3, keyword, type)
        }


        //---初始查询----
        $scope.checkExamine()
        $scope.queryCity()
        $scope.query('', '', '', '', '', 1, $scope.pageSize)
        $scope.queryTipNum()


    }])

//添加点位下终端设置主副屏
app.controller('addPTterminalCtrl', ['$scope', 'staticData', '$resource', 'commonService', '$http', '$stateParams',
    function ($scope, staticData, $resource, commonService, $http, $stateParams) {

        $scope.groupId = $stateParams.id
        console.log($scope.groupId)
        $scope.datas = {}
        //屏幕绑定
        //$scope.mainScreen = false
        //$scope.otherScreen1 = false
        //$scope.otherScreen2 = false
        //$scope.otherScreen3 = false


        function creatObj() {
            for (var i = 0; i < $scope.datas.length; i++) {
                $scope.selectObj[$scope.datas[i].deviceScreenType] = 'aaaaa'
                if (i > 0) {
                    $scope.otherScreen.push($scope.datas[i])
                }
            }
        }
        //creatObj()

        $scope.queryTipNum = function () {
            var $com = $resource($scope.app.host + '/api/cinema-point/usefulPoint?province=&city=&district=&pointName=&pointType=&pageNo=&pageSize=')
            $com.get(function (res) {
                $scope.tipNum = res.total
            })
        }
        $scope.queryTipNum()

        //查询添加点位权限
        $scope.query = function (groupId) {
            var $com = $resource($scope.app.host +
                "/api/cinema-point/point/:groupId/groupInfo", {
                    groupId: '@groupId'
                });
            $com.get({ groupId: groupId },
                function (data) {
                    $scope.datas = data.message
                    $scope.selectObj = {}
                    $scope.otherScreen = []
                    creatObj()
                })
        }
        $scope.query($scope.groupId)

        //设置屏幕
        $scope.setScreen = function (deviceId, num) {
            console.log(num == 2 && $scope.otherScreen1)
            if ((num == 1 && $scope.mainScreen) || (num == 2 && $scope.otherScreen1) || (num == 3 && $scope.otherScreen2) || (num == 4 && $scope.otherScreen3)) {
                commonService.ctrlError('操作', '该屏幕以被设置')
                return
            }
            var screenData = {
                deviceScreenType: num,
                groupId: $scope.groupId
            }
            var $comUpdate = $resource($scope.app.host + "/api/cinema-point/point/:deviceId/setScreenType", { deviceId: '@deviceId' }, {
                'update': { method: 'PUT' }
            });

            $comUpdate.update({ deviceId: deviceId }, screenData, function (res) {
                if (res.success) {
                    commonService.ctrlSuccess('设置');
                    $scope.query($scope.groupId)
                    //$state.go('app.order.checkSheetList')
                } else {
                    //$('.btnSubmit').attr('disabled',false)
                    //$scope.errorMsg = res.message
                    commonService.ctrlError('设置', res.message)
                }
            });
        }

        //清空屏幕
        $scope.deleteScreenType = function () {
            var groupId = $scope.groupId
            var $comUpdate = $resource($scope.app.host + "/api/cinema-point/point/:groupId/deleteScreenType", { groupId: '@groupId' }, {
                'update': { method: 'PUT' }
            });
            $comUpdate.update({ groupId: groupId }, {}, function (res) {
                if (res.success) {
                    commonService.ctrlSuccess('设置');
                    $scope.query($scope.groupId)
                    //$state.go('app.order.checkSheetList')
                } else {
                    //$('.btnSubmit').attr('disabled',false)
                    //$scope.errorMsg = res.message
                    commonService.ctrlError('设置', res.message)
                }
            });
        }
        //---测试数据---
        //
        //$scope.datas = [
        //    {
        //        "deviceId":"5f0137a9e57143dc975bfe932b60bd60",
        //        "deviceNewId": "123243432",
        //        "deviceMac": "AF:23:4A:2B:3C:5A",
        //        "deviceName": "1223",
        //        "deviceProvince": "湖北省",
        //        "deviceCity": "武汉",
        //        "deviceDistrict": "武昌区",
        //        "detailAddress": "武昌火车站",
        //        "isOnline":"Y",
        //        "deviceScreenType":1
        //    },
        //    {
        //        "deviceId":"5f0137a9e57143dc975bfe932b60bd60",
        //        "deviceNewId": "123243432",
        //        "deviceMac": "AF:23:4A:2B:3C:5A",
        //        "deviceName": "1223",
        //        "deviceProvince": "湖北省",
        //        "deviceCity": "武汉",
        //        "deviceDistrict": "武昌区",
        //        "detailAddress": "武昌火车站",
        //        "isOnline":"Y",
        //        "deviceScreenType":2               //1：主屏 2：副屏1 3：副屏2 4：副屏3   0：其它
        //    },
        //    {
        //        "deviceId":"6f0137a9e57c975bfe932b60bd60",
        //        "deviceNewId": "123243432",
        //        "deviceMac": "AF:23:4A:2B:3C:5A",
        //        "deviceName": "1223",
        //        "deviceProvince": "湖北省",
        //        "deviceCity": "武汉",
        //        "deviceDistrict": "武昌区",
        //        "detailAddress": "武昌火车站",
        //        "isOnline":"Y",
        //        "deviceScreenType":3              //1：主屏 2：副屏1 3：副屏2 4：副屏3   0：其它
        //    },
        //    {
        //        "deviceId":"9f0137a9e57143dc975bfe932b",
        //        "deviceNewId": "123243432",
        //        "deviceMac": "AF:23:4A:2B:3C:5A",
        //        "deviceName": "1223",
        //        "deviceProvince": "湖北省",
        //        "deviceCity": "武汉",
        //        "deviceDistrict": "武昌区",
        //        "detailAddress": "武昌火车站",
        //        "isOnline":"Y",
        //        "deviceScreenType":4               //1：主屏 2：副屏1 3：副屏2 4：副屏3   0：其它
        //    }
        //]



    }])

//查看点位截图控制器
app.controller('ShowSSCtrl', ['$scope', '$modalInstance', '$resource', '$state', 'commonService', 'info', 'formatDateService', 'staticData', '$q',
    function ($scope, $modalInstance, $resource, $state, commonService, info, formatDateService, staticData, $q) {

        var host = staticData.hostUrl
        var picHost = staticData.picHost
        var deviceData = info.data

        //$scope.deviceName = deviceData.deviceName
        //$scope.deviceId = deviceData.deviceId
        //$scope.time = formatDateService.getNowFormatDate()


        //---测试---

        //deviceData =  [
        //    {"md5": "589d36ea057a4b82a5244f31200f65e6","screenType":1},
        //    {"md5": "589d36ea057a4b82a5244f31200f65e6","screenType":2}
        //    ]

        //---测试结束---

        $scope.queryImg = function (md5) {

            var $com = $resource(host + '/api/background/mps-upload/file/' + md5)
            var defer = $q.defer();
            $com.get(function (res) {

                if (res.success) {
                    $scope.path = picHost + res.data.path
                } else {
                    commonService.ctrlError('操作', res.message)
                }

                defer.resolve(res)
            })
            return defer.promise
        }


        //获取原图地址

        angular.forEach(deviceData, function (item, index) {
            var res = 'imgSrc' + index

            $scope.queryImg(item.md5).then(function () {
                $scope[res] = $scope.path
            })
        })

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }])

//点位播放列表
app.controller('playListCtrl', ['$scope', 'staticData', '$resource', 'commonService', '$http', '$stateParams', 'adService',
    function ($scope, staticData, $resource, commonService, $http, $stateParams, adService) {

        $scope.statId = $stateParams.id
        $scope.name = $stateParams.name
        console.log($scope.statId)
        $scope.pointType = false
        $scope.datas = {}
        //屏幕绑定
        //$scope.mainScreen = false
        //$scope.otherScreen1 = false
        //$scope.otherScreen2 = false
        //$scope.otherScreen3 = false

        //分页每页条目数
        $scope.pageSize = 20
        //分页索引显示数

        $scope.maxSize = staticData.pageMaxSize
        //时间插件
        $scope.logSearchCond = staticData.logSearchCond
        $scope.fromDate = undefined
        $scope.fromHour = undefined
        $scope.fromMin = undefined

        $scope.option1 = {
            locale: 'zh-cn',
            format: 'YYYY-MM-DD',
            showClear: true,
            minDate: '2017-11-01'

        }
        $scope.option2 = {
            locale: 'zh-cn',
            format: 'HH',
            showClear: true
            //minDate: '2017-11-01 00:00'
            //maxDate: new Date()
            //debug: true
        }
        $scope.fromDate = new Date()
        $scope.startHour = new Date()
        $scope.endHour = '2017-11-01 23:00'

        //var datas = {"success":true,"code":null,"message":{"results":[{"timeRange":"00:00:00 - ","resourceId":"a376e81c46bd47ab9e633f7a5b4de5e1","orderId":"DEFAULT_ORDER_8","status":"未播放","orderId2":"DEFAULT_ORDER_8","resourceId2":"1a9dd46768254707a78e4d8a174216ac","materialName":"2_2D+Z_游戏混剪+logo_3840x1080.mp4","adBillName":null},{"timeRange":"00:00:15 - ","resourceId":"c449402d448a49b5973e6fd8b16e2fa9","orderId":"4ab280b4b572489d8cba3bbd9e747df3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"hh  soldier_4K_2dpz_nologo.mp4","adBillName":"枪战"},{"timeRange":"00:00:34 - ","resourceId":"c97db71ce1d5404b836ac4e63d0336c4","orderId":"DEFAULT_ORDER_3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"1_2D+Z_DEEPUB-游戏篇_3840x1080.mp4","adBillName":null},{"timeRange":"00:00:54 - ","resourceId":"4581a5b3de414f2b89631963d381faa9","orderId":"DEFAULT_ORDER_13","status":"未播放","orderId2":"DEFAULT_ORDER_13","resourceId2":"990c36d7e899498d94050a4f616c764a","materialName":"3_2DPZ_bizhi.mp4","adBillName":null},{"timeRange":"00:01:09 - ","resourceId":"c449402d448a49b5973e6fd8b16e2fa9","orderId":"4ab280b4b572489d8cba3bbd9e747df3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"hh  soldier_4K_2dpz_nologo.mp4","adBillName":"枪战"},{"timeRange":"00:01:28 - ","resourceId":"a376e81c46bd47ab9e633f7a5b4de5e1","orderId":"DEFAULT_ORDER_8","status":"未播放","orderId2":"DEFAULT_ORDER_8","resourceId2":"1a9dd46768254707a78e4d8a174216ac","materialName":"2_2D+Z_游戏混剪+logo_3840x1080.mp4","adBillName":null},{"timeRange":"00:01:43 - ","resourceId":"c449402d448a49b5973e6fd8b16e2fa9","orderId":"4ab280b4b572489d8cba3bbd9e747df3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"hh  soldier_4K_2dpz_nologo.mp4","adBillName":"枪战"},{"timeRange":"00:02:02 - ","resourceId":"c97db71ce1d5404b836ac4e63d0336c4","orderId":"DEFAULT_ORDER_3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"1_2D+Z_DEEPUB-游戏篇_3840x1080.mp4","adBillName":null},{"timeRange":"00:02:22 - ","resourceId":"4581a5b3de414f2b89631963d381faa9","orderId":"DEFAULT_ORDER_13","status":"未播放","orderId2":"DEFAULT_ORDER_13","resourceId2":"990c36d7e899498d94050a4f616c764a","materialName":"3_2DPZ_bizhi.mp4","adBillName":null},{"timeRange":"00:02:37 - ","resourceId":"c449402d448a49b5973e6fd8b16e2fa9","orderId":"4ab280b4b572489d8cba3bbd9e747df3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"hh  soldier_4K_2dpz_nologo.mp4","adBillName":"枪战"},{"timeRange":"00:02:56 - ","resourceId":"a376e81c46bd47ab9e633f7a5b4de5e1","orderId":"DEFAULT_ORDER_8","status":"未播放","orderId2":"DEFAULT_ORDER_8","resourceId2":"1a9dd46768254707a78e4d8a174216ac","materialName":"2_2D+Z_游戏混剪+logo_3840x1080.mp4","adBillName":null},{"timeRange":"00:03:11 - ","resourceId":"c449402d448a49b5973e6fd8b16e2fa9","orderId":"4ab280b4b572489d8cba3bbd9e747df3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"hh  soldier_4K_2dpz_nologo.mp4","adBillName":"枪战"},{"timeRange":"00:03:30 - ","resourceId":"c97db71ce1d5404b836ac4e63d0336c4","orderId":"DEFAULT_ORDER_3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"1_2D+Z_DEEPUB-游戏篇_3840x1080.mp4","adBillName":null},{"timeRange":"00:03:50 - ","resourceId":"4581a5b3de414f2b89631963d381faa9","orderId":"DEFAULT_ORDER_13","status":"未播放","orderId2":"DEFAULT_ORDER_13","resourceId2":"990c36d7e899498d94050a4f616c764a","materialName":"3_2DPZ_bizhi.mp4","adBillName":null},{"timeRange":"00:04:05 - ","resourceId":"c449402d448a49b5973e6fd8b16e2fa9","orderId":"4ab280b4b572489d8cba3bbd9e747df3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"hh  soldier_4K_2dpz_nologo.mp4","adBillName":"枪战"},{"timeRange":"00:04:24 - ","resourceId":"a376e81c46bd47ab9e633f7a5b4de5e1","orderId":"DEFAULT_ORDER_8","status":"未播放","orderId2":"DEFAULT_ORDER_8","resourceId2":"1a9dd46768254707a78e4d8a174216ac","materialName":"2_2D+Z_游戏混剪+logo_3840x1080.mp4","adBillName":null},{"timeRange":"00:04:39 - ","resourceId":"c449402d448a49b5973e6fd8b16e2fa9","orderId":"4ab280b4b572489d8cba3bbd9e747df3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"hh  soldier_4K_2dpz_nologo.mp4","adBillName":"枪战"},{"timeRange":"00:04:58 - ","resourceId":"c97db71ce1d5404b836ac4e63d0336c4","orderId":"DEFAULT_ORDER_3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"1_2D+Z_DEEPUB-游戏篇_3840x1080.mp4","adBillName":null},{"timeRange":"00:05:18 - ","resourceId":"4581a5b3de414f2b89631963d381faa9","orderId":"DEFAULT_ORDER_13","status":"未播放","orderId2":"DEFAULT_ORDER_13","resourceId2":"990c36d7e899498d94050a4f616c764a","materialName":"3_2DPZ_bizhi.mp4","adBillName":null},{"timeRange":"00:05:33 - ","resourceId":"c449402d448a49b5973e6fd8b16e2fa9","orderId":"4ab280b4b572489d8cba3bbd9e747df3","status":"未播放","orderId2":null,"resourceId2":null,"materialName":"hh  soldier_4K_2dpz_nologo.mp4","adBillName":"枪战"}],"pageNo":1,"pageSize":20,"total":3441,"pages":173},"data":null}
        //查询
        $scope.query = function (pointId, beginTime, endTime, pageNo, pageSize) {
            var $com = $resource($scope.app.host + '/api/cinema-point/point/:pointId/playList?beginTime=:beginTime&endTime=:endTime&pageNo=:pageNo&pageSize=:pageSize', {
                pointId: '@pointId', beginTime: '@beginTime', endTime: '@endTime', pageNo: '@pageNo', pageSize: '@pageSize'
            })
            $com.get({ pointId: pointId, beginTime: beginTime, endTime: endTime, pageNo: pageNo, pageSize: pageSize }, function (res) {
                if (res.success) {
                    $scope.datas = res.message.results
                    $scope.totalItems = res.message.total
                    $scope.numPages = res.message.pages
                    $scope.currentPage = res.message.pageNo
                    if($scope.datas.length > 0){
                        if($scope.datas[0].materialName2 != null){
                            $scope.pointType = true
                        }
                    }
                //console.log( $scope.datas)

                    //$scope.totalItems = res.total;
                    //$scope.numPages = res.pages;
                    //$scope.currentPage = res.pageNo;
                }
            })
        }
        //$scope.query($scope.statId , ' ' , ' ' , 1 , 20)
        //条件搜索e
        $scope.search = function (fromDate, startHour, endHour, pageNo, pageSize) {
            if (fromDate) {
                var fromDate = $scope.fromDate._d
                //console.log($scope.fromDate._d)
                if (!fromDate) {
                    return
                }
                var fromDateTrans = adService.formatDate(fromDate)
            }
            if (startHour) {
                var startHour = $scope.startHour._d
                //console.log($scope.startHour._d)
                var startHourTrans = adService.formatHourTime(startHour)
            }
            if (endHour) {
                var endHour = $scope.endHour._d
                var endHourTrans = adService.formatHourTime(endHour)
            }

            if (endHourTrans < startHourTrans) {
                //alert(0)
                commonService.ctrlError('结束时间不得早于开始时间');
            } else {
                //console.log(fromDateTrans + ' ' + startHourTrans)
                //console.log(fromDateTrans + ' ' + endHourTrans)
                var startTime = fromDateTrans + ' ' + startHourTrans;
                var endTime = fromDateTrans + ' ' + endHourTrans;
                $scope.query($scope.statId, startTime, endTime, pageNo, pageSize)

            }
        }



        $scope.return = function () {
            history.back();
        }

    }])


//点位播放列表
app.controller('wifiProbeList', ['$scope', 'staticData', '$resource', 'commonService', '$http', '$stateParams', 'adService', '$timeout',
    function ($scope, staticData, $resource, commonService, $http, $stateParams, adService, $timeout) {

        $scope.pointId = $stateParams.id
        $scope.name = $stateParams.name
        $scope.pageSize = 20
        //console.log($scope.pointId)
        $scope.datas = {}
        //屏幕绑定
        //$scope.mainScreen = false
        //$scope.otherScreen1 = false
        //$scope.otherScreen2 = false
        //$scope.otherScreen3 = false

        //时间插件
        $scope.logSearchCond = staticData.logSearchCond
        $scope.fromDate = undefined

        $scope.option1 = {
            locale: 'zh-cn',
            format: 'YYYY-MM-DD',
            showClear: true,
            minDate: '2017-11-01'

        }


        $scope.yesterday = new Date()
        $scope.fromDate = new Date()
        $scope.yesterday.setTime($scope.yesterday.getTime()-24*60*60*1000);
        //$scope.fromDate = new Date()
        //$scope.yesterday.setTime($scope.yesterday.getTime());

        $scope.yesterday = adService.formatDate($scope.yesterday)
        //console.log($scope.yesterday)

        //下载
        //$scope.download = function(type){
        //    var downloadAddress = '/api/cinema-point/point/'+$scope.pointId+'/exportExcel?type='+type;
        //    window.location=downloadAddress;
        //}
        //查询
        $scope.query = function (pointId, date, pageNo, pageSize) {
            var $com = $resource($scope.app.host + '/api/cinema-point/point/:pointId/visitorFlowOfAll?date=:date&pageNo=:pageNo&pageSize=:pageSize', {
                pointId: '@pointId', date: '@date', pageNo: '@pageNo', pageSize: '@pageSize'
            })
            $com.get({pointId : pointId, date : date , pageNo : pageNo , pageSize : pageSize},function(res){
                if(res.success){
                    $scope.datas = res.message.dataList
                    $scope.totalItems =   res.message.total
                    $scope.numPages = res.message.pages
                    $scope.currentPage = res.message.pageNo
                }
            })
        }
        $scope.query($scope.pointId , $scope.yesterday , 1 , 20)
        //条件搜索e
        $scope.search = function (fromDate) {
            if (fromDate) {
                var fromDate = $scope.fromDate._d
                //console.log($scope.fromDate._d)
                var fromDateTrans = adService.formatDate(fromDate)
                //console.log(fromDateTrans)
                //获取在线终端数
                var $getActiveNum = $resource("/api/cinema-point/point/:pointId/visitorFlowByDay?date=:date", { pointId : '@pointId' , date: '@date' });
                $getActiveNum.get({
                    pointId: $scope.pointId,
                    date: fromDateTrans
                }, function (data) {
                    if (data.success) {
                        $scope.onlineAllTime = data.message.time;
                        $scope.onlineAllCount = data.message.count;
                        $timeout(function () {
                            initEchart();
                            console.log('123213')
                        }, 30);
                    } else {
                        console.log('参数获取失败');
                    }
                });
            }
        }

        //下载
        $scope.downLoad = function(pointId , type){
            var $getActiveNum = $resource("/api/cinema-point/point/:pointId/exportExcel?type=:type", { pointId: '@pointId' , type : '@type'});
            $getActiveNum.get({
                pointId : $scope.pointId,
                type: type
            }, function (data) {
                if (data.success) {
                    console.log('开始下载')
                } else {
                    console.log('参数获取失败');
                }
            });
        }
        function initEchart() {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('warnAll'));
            $(window).resize(function () {
                myChart.resize()
            })
            // 指定图表的配置项和数据
            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                grid: [
                    {left: 50, right: 30}
                ],
                xAxis: [{
                    data: $scope.onlineAllTime,
                    //data: ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],

                    boundaryGap: false,
                    axisLine: {
                        show: true,
                        onZero: true,
                        lineStyle: {
                            color: '#9ea0ae',
                            width: 1,
                            type: 'solid'
                        }
                    }
                }],
                yAxis: [{
                    axisLine: {
                        show: true,
                        onZero: true,
                        lineStyle: {
                            color: '#9ea0ae',
                            width: 1,
                            type: 'solid'
                        }
                    }
                }],
                series: [{
                    name: '人',
                    type: 'line',
                    //data: [100,300,600,1400,200,89,799,20,300,600,1400,200,89,799,20,300,600,1400,200,89,799,20,2300,5000],
                    data: $scope.onlineAllCount,

                    itemStyle: {
                        normal: {
                            color: '#eab73d',
                            lineStyle: {
                                color: '#eab73d',
                                width: 3
                            }
                        }
                    }
                }]
            };

            myChart.setOption(option);
        }

        // 指定图表的配置项和数据
        //$timeout(function () {
        //    initEchart();
        //    //console.log('123213')
        //}, 30);

        $scope.return = function () {
            history.back();
        }

    }])

app.controller('pointDateCtrl', ['$scope', 'staticData', '$resource', 'commonService', '$http', '$stateParams', '$timeout',
    function ($scope, staticData, $resource, commonService, $http, $stateParams, $timeout) {
        $scope.pointName = $stateParams.pointName

        $scope.titleText = '201801';

        // $scope.getData = function (date) {

        // }
        //$scope.getData('201801');

       // $scope.startCalendar = function () {
            $('#calendar').fullCalendar({
                header: {
                    left: '',
                    center: 'prev,title,next',
                    right: ''
                },
                firstDay: 1,
                editable: false,
                timeFormat: 'H:mm',
                axisFormat: 'H:mm',
                titleFormat: 'yyyyMMMM',
                selectable: true,
                selectHelper: true,

                next: function () {
                    alert('next');
                },
                dayClick: function (date, allDay, jsEvent, view) {
                    console.log(date);
                    console.log(allDay);
                    console.log(jsEvent);
                    console.log(view);
                },

                events: function (start, end, callback) {
                    var view = $('#calendar').fullCalendar('getView');
                    console.log(view.title);
                    var events = [];
                    var $com = $resource($scope.app.host + '/api/mps-adschedule/playlist/pointPlayDetail/:pointId/:date/:pointType', {
                        pointId: '@pointId', date: '@date', pointType: '@pointType'
                    })
                    $com.get({ pointId: $stateParams.id, date: view.title, pointType: $stateParams.pointType}, function (res) {
                        if (res.success) {
                            $scope.calendarData = res;
                            //$scope.startCalendar();
                            events = $scope.calendarData.message;
                            callback(events);
                        }
                    })
                },

                eventClick: function (event, jsEvent, view) {

                    var year=event.start.getFullYear();//获取完整的年份(4位,1970)  
                    var month=event.start.getMonth()+1;//获取月份(0-11,0代表1月,用的时候记得加上1)  
                    if(month<=9){  
                        month="0"+month;  
                    }  
                    var date=event.start.getDate();//获取日(1-31)  
                    if(date<=9){  
                        date="0"+date;  
                    }  
                    var dateformat=year+"-"+month+"-"+date;  

                    console.log(dateformat);
                    
                    commonService.showPlayList($stateParams.id,dateformat,event.deviceType,event.resourceIds);
                    
                    console.log(event);
                    console.log(jsEvent);
                    console.log(view);
                }


            });
       // }
       $scope.returnBack = function () {
        history.back();
    }


        // $scope.$watch('titleText',function(newValue,oldValue, scope){
        //     console.log('change');
        //     $scope.getData(newValue);
        // });
        
    //     var watch = $scope.$watch('name',function(newValue,oldValue, scope){

    //         console.log(newValue);
    
    //         console.log(oldValue);
    
    // });

    }])