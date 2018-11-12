var Docker = require('dockerode');
var fs = require('fs');

module.exports = (api, options) => { 
    api.registerCommand('dockerize:build', args => {
        BuildDockerImage();        
      });

    api.registerCommand('dockerize:run', args => {
        CreateAndRunContainer(new Docker());
    });

    api.registerCommand('dockerize:start', args => {
        StartContainer(new Docker());
    });

    api.registerCommand('dockerize:stop', args => {
        StopContainer(new Docker());
    });
    
    api.registerCommand('dockerize:remove', args => {
        RemoveContainer(new Docker());
    });

    function RemoveContainer(docker) {
        docker.listContainers({ all : true }, function (err, containers) {
            if(err) 
                console.log(err);

                containers.forEach(function (containerInfo ) {
                    if(containerInfo.Names.includes("/" + options.pluginOptions.dockerize.imageName + "_dockerized")) {
                        console.log(containerInfo.Names);
                        var container = docker.getContainer(containerInfo.Id);
                        container.remove();
                    }
                });
        });
    }

    function StopContainer(docker) {
        docker.listContainers({ all : true }, function (err, containers) {
            if(err)
                console.log(err);

            containers.forEach(function (containerInfo) {
 
                if(containerInfo.Names.includes("/" + options.pluginOptions.dockerize.imageName + "_dockerized")) {
                    console.log(containerInfo.Names);
                    var container = docker.getContainer(containerInfo.Id);
                    container.stop();
                }
            });
        });
    }

    function CreateAndRunContainer(docker) {
        docker.run(options.pluginOptions.dockerize.imageName, null, process.stdout,{
            "name": options.pluginOptions.dockerize.imageName + "_dockerized",
            "HostConfig": {
                "PortBindings": {
                "80/tcp": [
                    {
                    "HostPort": "8080"
                    }
                ]
                }
            }
            }, function (err, data, container) {
                if(err)
                    console.log(err);

                console.log(data.stream);
            }); 
    }

    function BuildDockerImage() {
        if(!fs.existsSync("./Dockerfile")) {
            console.log("## Error ## --> Docker file has not been generated, please use 'vue invoke dockerize' to generate your custom DockerFile.");
            return;
        }   

        var filesName = [];

        fs.readdirSync(process.cwd()).forEach(file => {
            filesName.push(file);
        });

        var docker = new Docker();

        docker.buildImage({
            context: process.cwd(),
            src: ['Dockerfile', ...filesName]
        }, {
            t: options.pluginOptions.dockerize.imageName
        }, function(error, output) {
            if (error) {
                return console.error(error);
        }
            output.pipe(process.stdout);
        });
    }

    function StartContainer(docker) {
        docker.listContainers({ all : true }, function (err, containers) {

            if(err)
                console.log(err);

            containers.forEach(function (containerInfo) {
                if(containerInfo.Names.includes("/" + options.pluginOptions.dockerize.imageName + "_dockerized")) {
                    var container = docker.getContainer(containerInfo.Id);
                    container.start();
                    container.attach({stream: true, stdout: true, stderr: true}, function (err, stream) {
                        stream.pipe(process.stdout);
                      });
                }
            });
          });
    }
}