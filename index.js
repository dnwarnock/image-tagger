const Hapi = require('hapi');
const rp = require('request-promise');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0'
    });

    server.route({
        method: 'POST',
        path:'/',
        config: {
            payload: {
                allow: 'multipart/form-data' // important
            }
        },
        handler: async (request, h) => {
            let imageEncoded = request.payload['image'].toString('base64');
            var options = {
                method: 'POST',
                uri: `https://vision.googleapis.com/v1/images:annotate?key=${process.env.KEY}`,
                body: {
                    requests:[
                        {
                          image: {
                            content: imageEncoded
                          },
                          features: [
                            {
                              type: 'WEB_DETECTION',
                              maxResults: 10
                            }
                          ]
                        }
                    ]
                },
                json: true
            };
            let googleVision = await rp(options);
            let results = googleVision['responses'][0]['webDetection']['webEntities']
                .map(function(entity){
                    return entity['description'];
                });
            return results;
        }
    });

    await server.start();
    console.log('Server running on %ss', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
