const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
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
        devServer: {
            contentBase: "./dist",
            publicPath: "./dist",
            inline: true,
        },
        optimization: {
            minimize: options.mode === 'production',
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                }),
                new CssMinimizerPlugin(),
                new ImageMinimizerPlugin({
                    minimizer: {
                        implementation: ImageMinimizerPlugin.squooshMinify,
                        options: {
                            encodeOptions: {
                                mozjpeg: {
                                    // That setting might be close to lossless, but it’s not guaranteed
                                    // https://github.com/GoogleChromeLabs/squoosh/issues/85
                                    quality: 100,
                                },
                                webp: {
                                    lossless: 1,
                                },
                                avif: {
                                    // https://github.com/GoogleChromeLabs/squoosh/blob/dev/codecs/avif/enc/README.md
                                    cqLevel: 0,
                                },
                            },
                            // Your options for `squoosh`
                        },
                    },
                }),
            ],
            splitChunks: {
                chunks: "all",
                minSize: 0,
                automaticNameDelimiter: "~",
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                },
            },
            usedExports: true,
            sideEffects: true,
        },
        module: {
            rules: [
                {
                    test: /\.(jpe?g|png)$/i,
                    type: "asset",
                },
                {
                    test: /\.js$/,
                    include: path.resolve(__dirname, 'src/js'),
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    }
                },
                {
                    test: /\.s[ac]ss$/i,
                    include: path.resolve(__dirname, 'src/scss'),
                    use: [
                        // Creates `style` nodes from JS strings
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {}
                        },
                        // Translates CSS into CommonJS
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: false,
                                url: true
                            }
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        [
                                            "postcss-preset-env",
                                            "autoprefixer",
                                            {
                                                // Options
                                            },
                                        ],
                                    ],
                                },
                            },
                        },
                        {
                            loader: "resolve-url-loader"
                        },
                        // Compiles Sass to CSS
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                            }
                        }
                    ],
                },
                // {
                //     test: /\.html$/,
                //     loader: "html-loader",
                //     query: {
                //         helperDirs: [__dirname + "/includes"],
                //     },
                // },
                // {
                //     test: /\.html/,
                //     type: 'asset/resource',
                //     generator: {
                //         filename: 'static/[hash][ext][query]'
                //     }
                // },
                // {
                //     test: /\.html$/,
                //     include: path.resolve(__dirname, 'src/includes'),
                //     use: [{
                //         loader: 'raw-loader',
                //     }],
                // },
                // {
                //     test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                //     use: [{
                //         loader: 'file-loader',
                //         options: {
                //             name: '[name].[ext]',
                //             outputPath: 'fonts/',
                //             publicPath: '../fonts/'
                //         }
                //     }]
                // },
                // {
                //     test: /\.(ttf|eot|svg|png|woff(2)?)(\?[a-z0-9]+)?$/,
                //     use: [{
                //         loader: 'file-loader', options: {name: './img/[name].[ext]'}
                //     }]
                // },
                // {test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000'}
                // {
                //     test: /\.(eot|woff|woff2|ttf|svg)(\?\S*)?$/,
                //     use: [{
                //         loader: 'file-loader',
                //         options: {
                //             name: '[name].[ext]',
                //             outputPath: 'Fonts/',
                //             publicPath: 'Fonts/'
                //         }
                //     }]
                // }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: "./css/style.bundle.css"
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'src/views/index.html',
                inject: false
            }),
            new HtmlWebpackPlugin({
                filename: 'main.html',
                template: 'src/views/main.html',
                sources: false
            }),
            new HtmlWebpackPlugin({
                filename: 'second.html',
                template: 'src/views/second.html',
                inject: false
            }),
            new CopyPlugin(
                {
                    patterns: [
                        {
                            from: "./src/favicon",
                            to: "./favicon"
                        },
                        {
                            from: "./src/img",
                            to: "./img"
                        },
                    ]
                }),

        ]
    };
}