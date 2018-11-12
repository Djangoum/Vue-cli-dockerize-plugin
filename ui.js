module.exports = api => {
    api.describeConfig({
        // Unique ID for the config
        id: 'djangoum.dockerize',
        // Displayed name
        name: 'Dockerize Configuration',
        // Shown below the name
        description: 'Dockerize your app quick and easy to share your development with docker',

        icon: 'local_shipping',
        files : {
            dockerize : {
                js: ['dockerize.config.js'],
            },
            vue: {
                js: ['vue.config.js']
            }
        },        

        onRead: ({ data, cwd }) => ({
            tabs: [
                {
                  id: 'General configuration',
                  label: 'General',
                  // Optional
                  icon: 'Docker related configuration',
                  prompts: [
                    {
                        name: 'imageName',
                        type: 'input',
                        default: 'testimage',
                        description: 'Name for your docker image'
                    }
                  ]
                }
              ]
          }),

          onWrite: ({ prompts, answers, data, files, cwd, api }) => {
            // ...
          }
      });
  }