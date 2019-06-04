const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ImageMinPlugin = require('imagemin-webpack-plugin').default;
const TerserPlugin = require('terser-webpack-plugin');
const CssOptimizer = require('optimize-css-assets-webpack-plugin');
module.exports = (env, options) => {
    return {
        entry: {
            main: './src/js/index.js',
            second: './src/js/second.js'
        }
        ,
        output: {
            filename: 'js/[name].bundle.js',
            path: path.resolve(__dirname, 'dist')
        },
        devtool: "source-map",
        // devServer: {
        //     // contentBase: "./dist",
        //     // publicPath: "./dist"
        //     inline:true,
        // },
        optimization: {
            minimize: options.mode == 'production',
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                }),
                new CssOptimizer({})
            ],
            splitChunks: {
                chunks: "all",
                minSize: 0,
            },
            usedExports: true,
            sideEffects: true
        },
        module: {
            rules: [
                // {
                //     test: /\.(png|jpg|gif|svg)$/,
                //     exclude: [
                //         path.resolve(__dirname, './node_modules'),
                //     ],
                //     use: {
                //         loader: 'file-loader',
                //         options: {
                //             name: '[path][name]-[hash].[ext]',
                //             outputPath: '../',
                //             publicPath: '/dist',
                //         },
                //     },
                // },
                // {
                //     test: /\.svg$/,
                //     include: [
                //         path.resolve(__dirname, './node_modules'),
                //     ],
                //     use: {
                //         loader: 'svg-inline-loader',
                //         options: {
                //             name: '[name]-[hash].[ext]',
                //         },
                //     },
                // },
                {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src/js'),
                // exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },

                {
                    test: /\.scss$/,
                    include: path.resolve(__dirname, 'src/scss'),
                    use: [
                        // {
                        //     loader: 'style-loader'
                        // },
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {}
                        },
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: false,
                                url: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins() {
                                    return [
                                        require('precss'),
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        },
                        {
                            loader: "resolve-url-loader"
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                            }
                        }
                    ]
                },
                {
                    test: /\.html$/,
                    include: path.resolve(__dirname, 'src/includes'),
                    use: [{
                        loader: 'raw-loader',
                    }],
                },
                {
                       test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                    use: [{
                        loader:'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/',
                            publicPath: '../fonts/'
                        }}]
           },
           //      {
           //          test: /\.(ttf|eot|svg|png|woff(2)?)(\?[a-z0-9]+)?$/,
           //          use: [{
           //              loader: 'file-loader', options: {name: './img/[name].[ext]'}
           //          }]
           //      }
           //      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
           //      {
           //          test: /\.(eot|woff|woff2|ttf|svg)(\?\S*)?$/,
           //          use: [{
           //              loader: 'file-loader',
           //              options: {
           //                  name: '[name].[ext]',
           //                  outputPath: 'Fonts/',
           //                  publicPath: 'Fonts/'
           //              }
           //          }]
           //      }
            ]
        },
        plugins: [
            new CleanPlugin(),
            new MiniCssExtractPlugin({
                filename: "./css/style.bundle.css"
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'src/views/index.html',
                inject: false
            }),
            new HtmlWebpackPlugin({
                filename: 'second.html',
                template: 'src/views/second.html',
                inject: false
            }),
            new CopyPlugin([
                {
                    from: "./src/favicon",
                    to: "./favicon"
                },
                {
                    from: "./src/img",
                    to: "./img"
                },
            ]),
            new ImageMinPlugin({
                test: /\.(jpe?g|png|gif|svg)$/i,
                disable: options.mode !== 'production',
                pngquant: {
                    quality: '85-90'
                }
            }),
        ]
    };
}