'use strict'

const path = require('path')
const fs = require('fs')
const resolveCwd = require('../resolveCwd')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const getBabelCommonConfig = require('./getBabelCommonConfig')

const pkg = require(resolveCwd('package.json'))
const cwd = process.cwd()

function getResolve() {
  const alias = {}
  const resolve = {
    modules: [path.resolve('../../../node_modules'), cwd, 'node_modules'],
    extensions: ['.web.ts', '.web.tsx', '.web.js', '.web.jsx', '.ts', '.tsx', '.js', '.jsx'],
    alias
  }
  const {name} = pkg

  // https://github.com/react-component/react-component.github.io/issues/13
  // just for compatibility， we hope to delete /index.js. just use /src/index.js as all entry
  let pkgSrcMain = resolveCwd('index.js')
  if (!fs.existsSync(pkgSrcMain)) {
    pkgSrcMain = resolveCwd('src/index.js')
    if (!fs.existsSync(pkgSrcMain)) {
      console.error('Get webpack.resolve.alias error: no /index.js or /src/index.js exist !!')
    }
  }

  // resolve import { foo } from 'rc-component'
  // to 'rc-component/index.js' or 'rc-component/src/index.js'
  alias[`${name}$`] = pkgSrcMain

  // resolve import foo from 'rc-component/lib/foo' to 'rc-component/src/foo.js'
  alias[`${name}/lib`] = resolveCwd('./src')

  // resolve examples path
  alias.examples = resolveCwd('./examples')

  alias[name] = cwd
  return resolve
}

const postcssLoader = {
  loader: 'postcss',
  options: {plugins: require('./postcssConfig')}
}
module.exports = {
  getResolve,
  getResolveLoader() {
    return {
      modules: [
        path.resolve(__dirname, '../../../node_modules')
      ],
      moduleExtensions: ['-loader']
    }
  },
  getLoaders() {
    const babelConfig = getBabelCommonConfig()
    const babelLoader = {
      loader: 'babel-loader',
      options: babelConfig
    }
    return [
      Object.assign(
        {
          test: /\.jsx?$/,
          exclude: /node_modules/
        },
        babelLoader
      ),
      {// .hbs 模板 可能暂时没有用到
        test: /\.hbs$/,
        loader: 'handlebars-loader'
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite'
      },
      // Needed for the css-loader when [bootstrap-webpack](https://github.com/bline/bootstrap-webpack)
      // loads bootstrap's css.
      {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        options: {
          limit: 10000,
          minetype: 'application/font-woff'
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        options: {
          limit: 10000,
          minetype: 'application/octet-stream'
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      },
      {
        test: /\.(png|jpg|jpeg|webp)$/i,
        loader: 'file'
      }
    ]
  },
  getCssLoaders(miniCss) {
    let cssLoader = [
      {
        loader: 'css',
        options: {
          importLoaders: 1,
          sourceMap: true
        }
      },
      postcssLoader
    ]
    let lessLoader = cssLoader.concat([
      {
        loader: 'less',
        options: {
          sourceMap: true
        }
      }
    ])
    if (miniCss) {
      cssLoader.unshift(MiniCssExtractPlugin.loader)
      lessLoader.unshift(MiniCssExtractPlugin.loader)
    } else {
      const styleLoader = {
        loader: 'style'
      }
      cssLoader.unshift(styleLoader)
      lessLoader.unshift(styleLoader)
    }
    return [
      {
        test: /\.css$/,
        use: cssLoader
      },
      {
        test: /\.less$/,
        use: lessLoader
      }
    ]
  }
}
