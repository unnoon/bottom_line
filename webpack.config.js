module.exports = {
    entry: './test/prototypes/index.ts',
    output: {
        filename: 'bin/bundle.js',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx', 'json']
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