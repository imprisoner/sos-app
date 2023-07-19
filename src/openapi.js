import swagger from 'feathers-swagger';
import koaSend from 'koa-send';
import path from 'path';
import {createRequire} from 'node:module'

const getSwaggerInitializerScript = ({ docsJsonPath, ctx, req }) => {
  const headers = (req && req.headers) || (ctx && ctx.headers);
  const basePath = headers['x-forwarded-prefix'] ?? '';
  // language=JavaScript
  return `
      window.onload = function() {
        var script = document.createElement('script');
        script.onload = function () {
          window.ui = SwaggerUIBundle({
            url: "${basePath}${docsJsonPath}",
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset,
              SwaggerUIApiKeyAuthFormPlugin,
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout",
            configs: {
              apiKeyAuthFormPlugin: {
                forms: {
                  BearerAuth: {
                    fields: {
                      email: {
                        type: 'text',
                        label: 'E-Mail-Address',
                      },
                      password: {
                        type: 'password',
                        label: 'Password',
                      },
                    },
                    authCallback(values, callback) {
                      window.ui.fn.fetch({
                        url: '/authentication',
                        method: 'post',
                        headers: {
                          Accept: 'application/json',
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          strategy: 'local',
                          ...values
                        }),
                      }).then(function (response) {
                        const json = JSON.parse(response.data);
                        if (json.accessToken) {
                          callback(null, json.accessToken);
                        } else {
                          callback('error while login');
                        }
                      }).catch(function (err) {
                        console.log(err, Object.entries(err));
                        callback('error while login');
                      });
                    },
                  }
                },
                localStorage: {
                  BearerAuth: {}
                }
              }
            }
          });
        };

        script.src = '${basePath}/swagger-ui-apikey-auth-form.js';
        document.head.appendChild(script)
      };
    `;
};

export default (app) => {
  app.use(async (ctx, next) => {
    if (ctx.req.url === '/swagger-ui-apikey-auth-form.js') {

      const require = createRequire(import.meta.url)

      const absoluteFilePath = require.resolve(
        '@mairu/swagger-ui-apikey-auth-form/dist/swagger-ui-apikey-auth-form.js'
        );
      const relativeFilePath = path.basename(absoluteFilePath);
      const sendOptions = { root: path.dirname(absoluteFilePath) };

      await koaSend(ctx, relativeFilePath, sendOptions);
    } else {
      await next();
    }
  });

  app.configure(swagger.customMethodsHandler);

  app.configure(
    swagger({
      specs: {
        info: {
          title: 'Testing feathers swagger with dove',
          version: '1.0.0',
          description: 'Testing feathers swagger with dove using koa',
        },
        components: {
          securitySchemes: {
            BearerAuth: {
              type: 'http',
              scheme: 'bearer',
            },
          },
        },
        security: [{ BearerAuth: [] }],
      },
      
      ui: swagger.swaggerUI({ getSwaggerInitializerScript }),
      prefix: /api\/v\d\//,
      versionPrefix: 'v1',
      docsPath: '/docs'
    })
  );
};