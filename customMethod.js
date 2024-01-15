import Router from '@koa/router'
const router = Router()

const CUSTOM_METHOD = Symbol('feathers/CUSTOM_METHOD');

registerCustomMethod = (verb, path) => {
    return function (method) {
        if (!method[CUSTOM_METHOD]) {
            method[CUSTOM_METHOD] = [];
        }
        method[CUSTOM_METHOD].push({ verb, path });
        return method;
    };
};

function customMethodDecorator(verb, path) {
    return function (target, propertyKey) {
        target[propertyKey] = customMethod(verb, path)(target[propertyKey]);
    };
}

function customMethod(verb, path) {
    return function () {
        if (arguments.length === 1) {
            return registerCustomMethod(verb, path)(arguments[0]);
        }
        return customMethodDecorator(verb, path)(...arguments);
    };
}
customMethodsHandler = (app) => {
    app
        .use(router.routes())
        .use(router.allowedMethods());
    app._customMethodHandler = (basePath, path, method, httpMethod) => {
        router[httpMethod](path, async (ctx, next) => {
            ctx.request.path = basePath;
            ctx.request.headers[http.METHOD_HEADER] = method;
            ctx.request.method = 'POST';
            ctx.feathers = { ...ctx.feathers, params: ctx.params };
            await next();
        });
    };
}
