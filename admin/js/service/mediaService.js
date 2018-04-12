/**
 * Created by chenqi1 on 2017/6/16.
 */

//返回上一级操作
app.service('backPathService', [function () {
    this.getBackSpace = function (data) {
        var arr
        arr = data.split("/")
        arr.pop()
        arr = arr.join('/')
        return arr
    }

    this.getCurrentSpace = function (data) {
        var arr
        arr = data.split("/")
        arr = arr[arr.length - 1]
        return arr
    }
}])

app.service('mediaService', [function () {
    //删除项获取path和dir并拼装
    this.getSelectedMedia = function (data, orginData, path) {
        var gettype = Object.prototype.toString
        var sendObj = {}
        var selectedMediaArr = []
        if (gettype.call(data) == '[object String]') {

            angular.forEach(orginData, function (item) {
                if (item.fullName == data) {
                    var selectedMediaObj = {}
                    selectedMediaObj.path = item.fullName
                    selectedMediaObj.dir = item.dir
                    selectedMediaObj.name = item.name
                    selectedMediaArr.push(selectedMediaObj)
                }
            })

        } else if (gettype.call(data) == '[object Array]') {

            angular.forEach(orginData, function (item) {
                angular.forEach(data, function (name) {
                    if (item.fullName == name) {
                        var selectedMediaObj = {}
                        selectedMediaObj.path = item.fullName
                        selectedMediaObj.dir = item.dir
                        selectedMediaObj.name = item.name
                        selectedMediaArr.push(selectedMediaObj)
                    }
                })
            })
        }
        sendObj.fileList = selectedMediaArr
        return sendObj
    }

    //该service用于检测当前是否有正在重命名项，防止同时多项重命名
    this.checkRename = function(selector){
        var trArr = $(selector),
        bool = true

        angular.forEach(trArr , function(item){
            if($(item).hasClass('editTr') == true){
                bool = false
            }
        })

        return bool
    }



}])

//获取节目删除项
app.service('programService' , [function(){

    this.getSelectedProgram = function(data, orginData){
        var gettype = Object.prototype.toString
        var sendObj = {}
        var selectedProgramArr = []
        if (gettype.call(data) == '[object String]') {
            angular.forEach(orginData, function (item) {
                if (item.materialListId == data) {
                    selectedProgramArr.push(data)
                }
            })

        } else if (gettype.call(data) == '[object Array]') {

            angular.forEach(orginData, function (item) {
                angular.forEach(data, function (name) {
                    if (item.materialListId == name) {
                        selectedProgramArr.push(name)
                    }
                })
            })
        }
        sendObj.ids = selectedProgramArr
        return sendObj
    }

    this.limitNameLength = function(data){
        if(!!data){
            var name = data,
                bool
            name = name.split('')

            name.length <= 20? bool = true: bool = false

            return bool
        }

    }

}])

//设备相关服务
app.service('deviceService' , [function(){

    //获取设备删除项
    this.getSelectedDevice = function(data, orginData){
        var gettype = Object.prototype.toString
        var sendObj = {}
        var selectedProgramArr = []
        if (gettype.call(data) == '[object String]') {
            angular.forEach(orginData, function (item) {
                if (item.deviceId == data) {
                    selectedProgramArr.push(data)
                }
            })

        } else if (gettype.call(data) == '[object Array]') {

            angular.forEach(orginData, function (item) {
                angular.forEach(data, function (name) {
                    if (item.deviceId == name) {
                        selectedProgramArr.push(name)
                    }
                })
            })
        }
        sendObj.deviceIdList = selectedProgramArr
        return sendObj
    }

    //获取添加设备项
    this.getAddDevice = function(data, orginData){
        var gettype = Object.prototype.toString
        var sendObj = {}
        var selectedProgramArr = []
        if (gettype.call(data) == '[object String]') {
            angular.forEach(orginData, function (item) {
                if (item.deviceId == data) {
                    selectedProgramArr.push(item)
                }
            })

        } else if (gettype.call(data) == '[object Array]') {

            angular.forEach(orginData, function (item) {
                angular.forEach(data, function (name) {
                    if (item.deviceId == name) {
                        selectedProgramArr.push(item)
                    }
                })
            })
        }
        sendObj.deviceList = selectedProgramArr
        return sendObj
    }
}])