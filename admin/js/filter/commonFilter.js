/**
 * Created by chenqi1 on 2017/6/15.
 */
'use strict';

/* Filters */
// need load the moment.js to use this filter.
angular.module('app')
    .filter('fromNow', function () {
        return function (date) {
            return moment(date).fromNow();
        }
    })

    //是否在线样式
    .filter('onlineStyle', function () {
        return function (statusId) {
            var statusStyle
            switch (statusId) {
                case 'Y':
                    statusStyle = 'onlineIcon'
                    break

                case 'N':
                    statusStyle = 'offlineIcon'
                    break
            }
            return statusStyle
        }
    })

    //终端激活时间显示
    .filter('terminalTime', function () {
        var roleNum
        return function (arr) {
            if (arr === null) {
                roleNum = '-'
            } else {
                roleNum = arr
            }
            return roleNum
        }
    })

    //包名显示
    .filter('packageNameTrans', function () {
        var roleNum
        return function (arr) {
            if (arr === null) {
                roleNum = '无'
            } else {
                roleNum = arr
            }
            return roleNum
        }
    })

    //终端状态显示
    .filter('terminalState', function () {
        return function (state) {
            var status
            switch (state) {
                case 'Y':
                    status = '在线'
                    break
                case 'N':
                    status = '离线'
                    break
            }
            return status
        }
    })

    //是否激活样式
    .filter('terminalActiveStyle', function () {
        return function (state) {
            var status
            switch (state) {
                case 'Y':
                    status = '已激活'
                    break
                case 'N':
                    status = '未激活'
                    break
            }
            return status
        }
    })


    //是否显示待办事项
    .filter('showNoData', function () {
        var bool
        return function (dataList) {
            if (!!dataList && dataList.length === 0 || dataList == null) {
                bool = true
            }
            else {
                bool = false
            }
            return bool
        }
    })

    //popover的过滤器
    .filter('popoverText', function () {
        var text
        return function (array) {
            if (!!array && array.length === 0 && array == null) {
                text = ''
            } else {
                text = array.join(',')
            }
            return text
        }
    })

    //素材大小格式转换
    .filter('sizeFormat', function () {
        var formatSize
        return function (size) {
            if(size){
                var size = parseInt(size)
                formatSize = (size / 1024) / 1024
                return formatSize.toFixed(2)
            }
            else {
                return formatSize = '-'
            }
        }
    })

    //产品授权码字母大小写转换
    .filter('upperCase', function () {
        var upperCase
        return function (data) {
            if (data) {
                upperCase = data.toUpperCase();
            }
            return upperCase
        }
    })

    //根据更新包路径截取包名字段
    .filter('getPackName', function () {
        var path
        return function (data) {
            if (data) {
                path = data.split("/")
                path = path[path.length - 1]
                return path
            }
        }
    })

    //限制描述长度
    .filter('limitLength', function () {
        var str
        var limitLength
        return function (data, length) {
            limitLength = length ? length : 20
            if (data != '') {
                if (data.split('').length > limitLength) {
                    str = data.substring(0, limitLength).concat('...')
                } else {
                    str = data
                }
            } else {
                str = ''
            }
            return str
        }
    })
    //发送模块的状态标志
    .filter('sendExecuteState', function () {
        var str
        var limitLength
        return function (data) {
            switch(data){
                case 1: str = "待审核"; break;
                case 2: str = "正在发送"; break;
                case 3: str = '已完成'; break;
                case 4: str = '已失效'; break;
                case 5: str = '已驳回'; break;
                case 6: str = '待发送'; break;
            }
            return str
        }
    })
//秒换成时分格式
    .filter('timeChange', function () {
        var str;
        return function (data) {
            var h = Math.floor(data / 3600);
            var m = Math.floor((data / 60 % 60));
            var s = Math.floor((data % 60));
            h = h < 10 ? '0'+h : h;
            m = m < 10 ? '0'+m : m;
            s = s < 10 ? '0'+s : s;
            return str = h + ":" + m + ":" + s ;
        };
    })
    //截取产品ID后8位
    .filter('cutProdIdLength', function () {
        var str
        return function (data) {
            if (data) {
                str = data.slice(-9)
            }
            return str
        }
    })

    //截取终端ID后8位
    .filter('cutDeviceIdLength', function () {
        var str
        return function (data) {
            if (data) {
                str = data.slice(-8).toUpperCase()
            }
            return str
        }
    })

    //搜索结果面包屑路径显示
    .filter('getCurrentPath', function () {
        var path
        return function (data) {
            if (data === '') {
                path = '搜索结果'
            } else {
                path = data
            }
            return path
        }
    })

    //根据文件类型不同区分显示图标
    .filter('formatIcon', function () {
        var className
        return function (data) {
            if(data){
                if (data == 'picture') {
                    className = 'picType'
                }
                else if (data == 'video') {
                    className = 'videoType'
                } else {
                    className = 'otherType'
                }
            }else {
                className = 'dirType'
            }
            return className
        }
    })

    //获取头文字D
    .filter('firstName', function () {
        return function (data) {
            return data.charAt(0);
        }
    })

    //获取设备开关机状态
    .filter('getOnOff' , function(){
        return function (data){
            var bool
            if(data){
                switch (data) {
                    case '在线':
                        bool = true
                        break
                    case '已关机':
                        bool = false
                        break
                }
            }
            return bool
        }
    })

    //获取审核状态
    .filter('getExamine' , function(){
        return function (data){
            var str
            if(data){
                switch (data) {
                    case 1:
                        str = "审核通过"
                        break
                    case 2:
                        str = "审核不通过"
                        break
                    case 3:
                        str = "待审核"
                        break
                    case 4:
                        str = "审核通过"
                        break
                }
            }

            return str
        }
    })
    // 1代表出售 2代表赠送 3代表自营 4代表置换

    //项目来源
    .filter('getProjectSource' , function(){
        return function (data){
            var str
            if(data){
                switch (data) {
                    case 1 :
                        str = '出售'
                        break
                    case 2 :
                        str = '赠送'
                        break
                    case 3 :
                        str = '自营'
                        break
                    case 4 :
                        str = '置换'
                        break
                }
            }
            return str
        }
    })
    //项目费用类别
    .filter('getProjectCost' , function(){
        return function (data){
            var str
            if(data){
                if(data.length == 2){
                    str = "内容制作费   媒体投放费"

                }else if(data[0] == 1){
                    str = '内容制作费'
                }else if(data[0] == 2){
                    str = '媒体投放费'
                }
            }
            return str
        }
    })
    //客户类别
    .filter('getCustomerCategory' , function(){
        return function (data){
            var str
            if(data){
                switch(data){
                    case 1 :
                        str = '直客'
                        break
                    case 2 :
                        str = '代理'
                        break
                }
            }
            return str
        }
    })

    //点位模块过滤器
    //获取点位类型
    .filter('getPTtype' , function(){
        return function (data){
            var str
            if(parseInt(data)){
                switch(parseInt(data)){
                    case 1:
                        str="3*3"
                        break
                    case 2:
                        str="3*4"
                        break
                    case 3:
                        str="1*2"
                        break
                    case 4:
                        str="单屏"
                        break
                    case 5:
                        str="1+1+1"
                        break
                }
            }
            return str
        }
    })

    //billType
    .filter('billType' , function(){

        return function (data){
            var str
            if(data){
                switch(data){

                    case 1:
                        str="视频"
                        break
                    case 2:
                        str="游戏"
                }
            }
            return str
        }
    })

    //parseInt
    .filter('parseInt' , function(){

        return function (data){
            var str
            if(data){
                str = parseInt(data)
            }
            return str
        }
    })

    //获取是否设置主/副屏
    .filter('getScreenType' , function(){

        return function (data){
            var str
                switch(data){

                    case true:
                        str="是"
                        break
                    case false:
                        str="否"
                        break
                }
            return str
        }
    })

    .filter('statusType' , function(){
        return function (data){
            var str
            if(data){
                switch(data){                
                    case 1:
                        str="待审核"
                        break
                    case 2:
                        str="已审核不通过"
                        break                    
                    case 3:
                        str="投放中"
                        break
                    case 4:
                        str="已结束"
                        break
                    case 5:
                        str="已过期"
                        break
                }
            }
            
            if(data === 0) {
                str="草稿"
            }
            return str
        }
    })

    //是否是定制播放时段判断
    .filter('showTimeFlag' , function(){
        return function (data){
            var str
            if(data){
                str = "是"
            } else {
                str = "否"
            }
            return str
        }
    })

    //播放次数或时段
    .filter('getPlayTimes' , function(){
        return function (data){
            var str
            if(data.length = 0){
                str = "不限"
            } else {
                str = "有限"
            }
            return str
        }
    })
    //点位状态回显
    .filter('pointStatus' , function(){
        return function (data){
            var str
            if(data){
                switch(data){

                    case 1:
                        str="已完成"
                        break
                    case 2:
                        str="下刊完成"
                        break
                    case 3:
                        str="正在发送"
                        break                    
                    case 4:
                        str="正在下刊"
                        break
                    case 5:
                        str="发送失败"
                        break
                    case 6:
                        str="下刊失败"
                        break
                }
            }
            return str
        }
    })

    //获取广告单审核状态
    .filter('getSheetCheck' , function(){
        return function (data){
            var str
            if(data){
                switch (data) {
                    case 1:
                        str = '待审核'
                        break
                    case 2:
                        str = '审核不通过'
                        break
                    case 3:
                        str = '审核通过'
                        break
                    case 4:
                        str = '审核通过'
                        break
                    case 5:
                        str = '过期'
                        break
                }
            }
            return str
        }
    })

    //获取头文字D
    .filter('getParseInt', function () {
        return function (data) {
            if(data) {
                return parseInt(data) + "秒"
            } else {
                return "暂无"
            }
        }
    })
