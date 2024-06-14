const path = require('path');
const nodeExternals = require('webpack-node-externals');


module.exports = {
    mode: 'development',

    entry: './src/index.js',
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                parser: {
                    commonjsMagicComments: true
                }
            },
            {
                test: /\.cs$/,
                use: 'null-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            },
        ]
    },
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        fallback: {
            "fs": false,
            "net": false,
            "tls": false,
            "crypto": require.resolve("crypto-browserify"),
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "stream": require.resolve("stream-browserify"),
            "path": require.resolve("path-browserify"),
            "dgram": false,
            "child_process": false,
            "timers": require.resolve("timers-browserify"),
            "zlib": require.resolve("browserify-zlib"),
            "os": require.resolve("os-browserify/browser"),
            "assert": require.resolve("assert"),
            "util": require.resolve("util"),
            "url": require.resolve("url"),
            "vm": require.resolve("vm-browserify"),
            "constants": require.resolve("constants-browserify"),
            "async_hooks": false,
            "timers/promises": false
        },
        alias: {
            timers: path.resolve(__dirname, 'node_modules/timers-browserify'),
            'timers/promises': path.resolve(__dirname, 'node_modules/timers-browserify/main.js')
        }
    },
    devtool: 'source-map', // Adiciona mapas de fonte para melhor depuração
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    performance: {
        hints: false // Desativa dicas de performance
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    externals: [nodeExternals()],
};
