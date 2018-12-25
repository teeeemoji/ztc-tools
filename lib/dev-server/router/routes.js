let routes = function (router) {

  // 定义控制器的路由映射
  // 为什么不用文件遍历自动映射？
  // 为了安全，要对每一个暴露出来的接口，都要手动加，这样才有印象，否则，未做校验的 delete 接口可能就会自动暴露出来了
  let controller = {

    '/_examples_/list': './examples/list'

  }
  for (x in controller) {
    router.use(x, require(controller[x]))
  }

  router.redirect('/', '/_examples_/list')
}

module.exports = routes
