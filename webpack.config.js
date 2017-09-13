module.exports = {
    entry: './test/prototypes/index.ts',
    output: {
        filename: 'bin/tmp/bundle.js',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.jsx', 'json']
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    devtool: "source-map"
};