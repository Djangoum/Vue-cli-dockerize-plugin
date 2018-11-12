module.exports = api => {
    api.describeConfig({
        // Unique ID for the config
        id: 'djangoum.dockerize',
        // Displayed name
        name: 'Dockerize Configuration',
        // Shown below the name
        description: 'Dockerize your app quick and easy to share your development with docker',
        files : {
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
                        message : 'Name for your docker image',
                        default: 'testimage',
                        description: 'This will be used to create an image of your application in order to create a container or to publish it to your docker hub. This name will be used also if you run a container with the previously created image.',
                        value: data.vue.pluginOptions.dockerize.imageName,
                        group: 'Docker configuration'
                    }
                    ]
                }
                ]
            }),

          onWrite: ({ prompts, api, answers }) => {            
            api.setData('vue', { pluginOptions : {
                dockerize : {
                    imageName : answers.imageName
                }
            }});
        } 
      });
  }