module.exports = (api, options, rootOptions) => {
    // modify package.json fields
    api.extendPackage({
      scripts: {
        test: 'vue-cli-service dockerize'
      }
    })

    if(options != undefined && options.productionMode)
    {
        api.render('./template/prod');
        return;
    }

    api.render('./template/dev');

    api.extendPackage({
      scripts: {
        "dockerize:build": 'vue-cli-service dockerize:build',
        "dockerize:start": 'vue-cli-service dockerize:start',
        "dockerize:stop": 'vue-cli-service dockerize:stop',
        "dockerize:run": 'vue-cli-service dockerize:run',
        "dockerize:remove": 'vue-cli-service dockerize:remove'
      }
    })
  }