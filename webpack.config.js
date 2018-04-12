/**
 * Created by chenqi1 on 2017/6/6.
 */
var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')

module.exports = {
    //入口文件
    entry:  {
        app: __dirname + "/admin/index.js",
        vendor: __dirname + "/admin/vendor.js"
        },
    output: {
        path: __dirname + "/admin/dist",//打包后的文件存放的地方
        filename: "[name].bundle.js",//打包后输出文件的文件名
        publicPath: 'admin/dist/',
        chunkFilename: '[name].chunk.js'
    },
    module: {//在配置文件里添加JSON loader
        loaders: [
            {
                test: /\.(less|css)$/,
                use : ['style-loader','css-loader','less-loader']
            },
            {
                test : /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                use : [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000
                        //name: utils.assetsPath('/admin/dist/[name].[ext]')
                    }
                }]
            },
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use:[{
                    loader : 'babel-loader',
                    options: {presets: ['es2015']},
                }],
            },
        ],
    },
    plugins : [
        new webpack.LoaderOptionsPlugin ({
            options : {
                postcss : function(){
                    return [
                        require('autoprefixer')({
                            browsers : ['ie>=8' , '>1% in CN']
                        })
                    ]
                }
            }
        })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, './'),  // New
    },
}