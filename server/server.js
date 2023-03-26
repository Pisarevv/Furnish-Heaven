(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('http'), require('fs'), require('crypto')) :
        typeof define === 'function' && define.amd ? define(['http', 'fs', 'crypto'], factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Server = factory(global.http, global.fs, global.crypto));
}(this, (function (http, fs, crypto) {
    'use strict';

    function _interopDefaultLegacy(e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
    var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
    var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);

    class ServiceError extends Error {
        constructor(message = 'Service Error') {
            super(message);
            this.name = 'ServiceError';
        }
    }

    class NotFoundError extends ServiceError {
        constructor(message = 'Resource not found') {
            super(message);
            this.name = 'NotFoundError';
            this.status = 404;
        }
    }

    class RequestError extends ServiceError {
        constructor(message = 'Request error') {
            super(message);
            this.name = 'RequestError';
            this.status = 400;
        }
    }

    class ConflictError extends ServiceError {
        constructor(message = 'Resource conflict') {
            super(message);
            this.name = 'ConflictError';
            this.status = 409;
        }
    }

    class AuthorizationError extends ServiceError {
        constructor(message = 'Unauthorized') {
            super(message);
            this.name = 'AuthorizationError';
            this.status = 401;
        }
    }

    class CredentialError extends ServiceError {
        constructor(message = 'Forbidden') {
            super(message);
            this.name = 'CredentialError';
            this.status = 403;
        }
    }

    var errors = {
        ServiceError,
        NotFoundError,
        RequestError,
        ConflictError,
        AuthorizationError,
        CredentialError
    };

    const { ServiceError: ServiceError$1 } = errors;


    function createHandler(plugins, services) {
        return async function handler(req, res) {
            const method = req.method;
            console.info(`<< ${req.method} ${req.url}`);

            // Redirect fix for admin panel relative paths
            if (req.url.slice(-6) == '/admin') {
                res.writeHead(302, {
                    'Location': `http://${req.headers.host}/admin/`
                });
                return res.end();
            }

            let status = 200;
            let headers = {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            };
            let result = '';
            let context;

            // NOTE: the OPTIONS method results in undefined result and also it never processes plugins - keep this in mind
            if (method == 'OPTIONS') {
                Object.assign(headers, {
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Credentials': false,
                    'Access-Control-Max-Age': '86400',
                    'Access-Control-Allow-Headers': 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, X-Authorization, X-Admin'
                });
            } else {
                try {
                    context = processPlugins();
                    await handle(context);
                } catch (err) {
                    if (err instanceof ServiceError$1) {
                        status = err.status || 400;
                        result = composeErrorObject(err.code || status, err.message);
                    } else {
                        // Unhandled exception, this is due to an error in the service code - REST consumers should never have to encounter this;
                        // If it happens, it must be debugged in a future version of the server
                        console.error(err);
                        status = 500;
                        result = composeErrorObject(500, 'Server Error');
                    }
                }
            }

            res.writeHead(status, headers);
            if (context != undefined && context.util != undefined && context.util.throttle) {
                await new Promise(r => setTimeout(r, 500 + Math.random() * 500));
            }
            res.end(result);

            function processPlugins() {
                const context = { params: {} };
                plugins.forEach(decorate => decorate(context, req));
                return context;
            }

            async function handle(context) {
                const { serviceName, tokens, query, body } = await parseRequest(req);
                if (serviceName == 'admin') {
                    return ({ headers, result } = services['admin'](method, tokens, query, body));
                } else if (serviceName == 'favicon.ico') {
                    return ({ headers, result } = services['favicon'](method, tokens, query, body));
                }

                const service = services[serviceName];

                if (service === undefined) {
                    status = 400;
                    result = composeErrorObject(400, `Service "${serviceName}" is not supported`);
                    console.error('Missing service ' + serviceName);
                } else {
                    result = await service(context, { method, tokens, query, body });
                }

                // NOTE: logout does not return a result
                // in this case the content type header should be omitted, to allow checks on the client
                if (result !== undefined) {
                    result = JSON.stringify(result);
                } else {
                    status = 204;
                    delete headers['Content-Type'];
                }
            }
        };
    }



    function composeErrorObject(code, message) {
        return JSON.stringify({
            code,
            message
        });
    }

    async function parseRequest(req) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const tokens = url.pathname.split('/').filter(x => x.length > 0);
        const serviceName = tokens.shift();
        const queryString = url.search.split('?')[1] || '';
        const query = queryString
            .split('&')
            .filter(s => s != '')
            .map(x => x.split('='))
            .reduce((p, [k, v]) => Object.assign(p, { [k]: decodeURIComponent(v) }), {});
        const body = await parseBody(req);

        return {
            serviceName,
            tokens,
            query,
            body
        };
    }

    function parseBody(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', (chunk) => body += chunk.toString());
            req.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (err) {
                    resolve(body);
                }
            });
        });
    }

    var requestHandler = createHandler;

    class Service {
        constructor() {
            this._actions = [];
            this.parseRequest = this.parseRequest.bind(this);
        }

        /**
         * Handle service request, after it has been processed by a request handler
         * @param {*} context Execution context, contains result of middleware processing
         * @param {{method: string, tokens: string[], query: *, body: *}} request Request parameters
         */
        async parseRequest(context, request) {
            for (let { method, name, handler } of this._actions) {
                if (method === request.method && matchAndAssignParams(context, request.tokens[0], name)) {
                    return await handler(context, request.tokens.slice(1), request.query, request.body);
                }
            }
        }

        /**
         * Register service action
         * @param {string} method HTTP method
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        registerAction(method, name, handler) {
            this._actions.push({ method, name, handler });
        }

        /**
         * Register GET action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        get(name, handler) {
            this.registerAction('GET', name, handler);
        }

        /**
         * Register POST action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        post(name, handler) {
            this.registerAction('POST', name, handler);
        }

        /**
         * Register PUT action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        put(name, handler) {
            this.registerAction('PUT', name, handler);
        }

        /**
         * Register PATCH action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        patch(name, handler) {
            this.registerAction('PATCH', name, handler);
        }

        /**
         * Register DELETE action
         * @param {string} name Action name. Can be a glob pattern.
         * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
         */
        delete(name, handler) {
            this.registerAction('DELETE', name, handler);
        }
    }

    function matchAndAssignParams(context, name, pattern) {
        if (pattern == '*') {
            return true;
        } else if (pattern[0] == ':') {
            context.params[pattern.slice(1)] = name;
            return true;
        } else if (name == pattern) {
            return true;
        } else {
            return false;
        }
    }

    var Service_1 = Service;

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    var util = {
        uuid
    };

    const uuid$1 = util.uuid;


    const data = fs__default['default'].existsSync('./data') ? fs__default['default'].readdirSync('./data').reduce((p, c) => {
        const content = JSON.parse(fs__default['default'].readFileSync('./data/' + c));
        const collection = c.slice(0, -5);
        p[collection] = {};
        for (let endpoint in content) {
            p[collection][endpoint] = content[endpoint];
        }
        return p;
    }, {}) : {};

    const actions = {
        get: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            let responseData = data;
            for (let token of tokens) {
                if (responseData !== undefined) {
                    responseData = responseData[token];
                }
            }
            return responseData;
        },
        post: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            console.log('Request body:\n', body);

            // TODO handle collisions, replacement
            let responseData = data;
            for (let token of tokens) {
                if (responseData.hasOwnProperty(token) == false) {
                    responseData[token] = {};
                }
                responseData = responseData[token];
            }

            const newId = uuid$1();
            responseData[newId] = Object.assign({}, body, { _id: newId });
            return responseData[newId];
        },
        put: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            console.log('Request body:\n', body);

            let responseData = data;
            for (let token of tokens.slice(0, -1)) {
                if (responseData !== undefined) {
                    responseData = responseData[token];
                }
            }
            if (responseData !== undefined && responseData[tokens.slice(-1)] !== undefined) {
                responseData[tokens.slice(-1)] = body;
            }
            return responseData[tokens.slice(-1)];
        },
        patch: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            console.log('Request body:\n', body);

            let responseData = data;
            for (let token of tokens) {
                if (responseData !== undefined) {
                    responseData = responseData[token];
                }
            }
            if (responseData !== undefined) {
                Object.assign(responseData, body);
            }
            return responseData;
        },
        delete: (context, tokens, query, body) => {
            tokens = [context.params.collection, ...tokens];
            let responseData = data;

            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                if (responseData.hasOwnProperty(token) == false) {
                    return null;
                }
                if (i == tokens.length - 1) {
                    const body = responseData[token];
                    delete responseData[token];
                    return body;
                } else {
                    responseData = responseData[token];
                }
            }
        }
    };

    const dataService = new Service_1();
    dataService.get(':collection', actions.get);
    dataService.post(':collection', actions.post);
    dataService.put(':collection', actions.put);
    dataService.patch(':collection', actions.patch);
    dataService.delete(':collection', actions.delete);


    var jsonstore = dataService.parseRequest;

    /*
     * This service requires storage and auth plugins
     */

    const { AuthorizationError: AuthorizationError$1 } = errors;



    const userService = new Service_1();

    userService.get('me', getSelf);
    userService.post('register', onRegister);
    userService.post('login', onLogin);
    userService.get('logout', onLogout);


    function getSelf(context, tokens, query, body) {
        if (context.user) {
            const result = Object.assign({}, context.user);
            delete result.hashedPassword;
            return result;
        } else {
            throw new AuthorizationError$1();
        }
    }

    function onRegister(context, tokens, query, body) {
        return context.auth.register(body);
    }

    function onLogin(context, tokens, query, body) {
        return context.auth.login(body);
    }

    function onLogout(context, tokens, query, body) {
        return context.auth.logout();
    }

    var users = userService.parseRequest;

    const { NotFoundError: NotFoundError$1, RequestError: RequestError$1 } = errors;


    var crud = {
        get,
        post,
        put,
        patch,
        delete: del
    };


    function validateRequest(context, tokens, query) {
        /*
        if (context.params.collection == undefined) {
            throw new RequestError('Please, specify collection name');
        }
        */
        if (tokens.length > 1) {
            throw new RequestError$1();
        }
    }

    function parseWhere(query) {
        const operators = {
            '<=': (prop, value) => record => record[prop] <= JSON.parse(value),
            '<': (prop, value) => record => record[prop] < JSON.parse(value),
            '>=': (prop, value) => record => record[prop] >= JSON.parse(value),
            '>': (prop, value) => record => record[prop] > JSON.parse(value),
            '=': (prop, value) => record => record[prop] == JSON.parse(value),
            ' like ': (prop, value) => record => record[prop].toLowerCase().includes(JSON.parse(value).toLowerCase()),
            ' in ': (prop, value) => record => JSON.parse(`[${/\((.+?)\)/.exec(value)[1]}]`).includes(record[prop]),
        };
        const pattern = new RegExp(`^(.+?)(${Object.keys(operators).join('|')})(.+?)$`, 'i');

        try {
            let clauses = [query.trim()];
            let check = (a, b) => b;
            let acc = true;
            if (query.match(/ and /gi)) {
                // inclusive
                clauses = query.split(/ and /gi);
                check = (a, b) => a && b;
                acc = true;
            } else if (query.match(/ or /gi)) {
                // optional
                clauses = query.split(/ or /gi);
                check = (a, b) => a || b;
                acc = false;
            }
            clauses = clauses.map(createChecker);

            return (record) => clauses
                .map(c => c(record))
                .reduce(check, acc);
        } catch (err) {
            throw new Error('Could not parse WHERE clause, check your syntax.');
        }

        function createChecker(clause) {
            let [match, prop, operator, value] = pattern.exec(clause);
            [prop, value] = [prop.trim(), value.trim()];

            return operators[operator.toLowerCase()](prop, value);
        }
    }


    function get(context, tokens, query, body) {
        validateRequest(context, tokens);

        let responseData;

        try {
            if (query.where) {
                responseData = context.storage.get(context.params.collection).filter(parseWhere(query.where));
            } else if (context.params.collection) {
                responseData = context.storage.get(context.params.collection, tokens[0]);
            } else {
                // Get list of collections
                return context.storage.get();
            }

            if (query.sortBy) {
                const props = query.sortBy
                    .split(',')
                    .filter(p => p != '')
                    .map(p => p.split(' ').filter(p => p != ''))
                    .map(([p, desc]) => ({ prop: p, desc: desc ? true : false }));

                // Sorting priority is from first to last, therefore we sort from last to first
                for (let i = props.length - 1; i >= 0; i--) {
                    let { prop, desc } = props[i];
                    responseData.sort(({ [prop]: propA }, { [prop]: propB }) => {
                        if (typeof propA == 'number' && typeof propB == 'number') {
                            return (propA - propB) * (desc ? -1 : 1);
                        } else {
                            return propA.localeCompare(propB) * (desc ? -1 : 1);
                        }
                    });
                }
            }

            if (query.offset) {
                responseData = responseData.slice(Number(query.offset) || 0);
            }
            const pageSize = Number(query.pageSize) || 10;
            if (query.pageSize) {
                responseData = responseData.slice(0, pageSize);
            }

            if (query.distinct) {
                const props = query.distinct.split(',').filter(p => p != '');
                responseData = Object.values(responseData.reduce((distinct, c) => {
                    const key = props.map(p => c[p]).join('::');
                    if (distinct.hasOwnProperty(key) == false) {
                        distinct[key] = c;
                    }
                    return distinct;
                }, {}));
            }

            if (query.count) {
                return responseData.length;
            }

            if (query.select) {
                const props = query.select.split(',').filter(p => p != '');
                responseData = Array.isArray(responseData) ? responseData.map(transform) : transform(responseData);

                function transform(r) {
                    const result = {};
                    props.forEach(p => result[p] = r[p]);
                    return result;
                }
            }

            if (query.load) {
                const props = query.load.split(',').filter(p => p != '');
                props.map(prop => {
                    const [propName, relationTokens] = prop.split('=');
                    const [idSource, collection] = relationTokens.split(':');
                    console.log(`Loading related records from "${collection}" into "${propName}", joined on "_id"="${idSource}"`);
                    const storageSource = collection == 'users' ? context.protectedStorage : context.storage;
                    responseData = Array.isArray(responseData) ? responseData.map(transform) : transform(responseData);

                    function transform(r) {
                        const seekId = r[idSource];
                        const related = storageSource.get(collection, seekId);
                        delete related.hashedPassword;
                        r[propName] = related;
                        return r;
                    }
                });
            }

        } catch (err) {
            console.error(err);
            if (err.message.includes('does not exist')) {
                throw new NotFoundError$1();
            } else {
                throw new RequestError$1(err.message);
            }
        }

        context.canAccess(responseData);

        return responseData;
    }

    function post(context, tokens, query, body) {
        console.log('Request body:\n', body);

        validateRequest(context, tokens);
        if (tokens.length > 0) {
            throw new RequestError$1('Use PUT to update records');
        }
        context.canAccess(undefined, body);

        body._ownerId = context.user._id;
        let responseData;

        try {
            responseData = context.storage.add(context.params.collection, body);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    function put(context, tokens, query, body) {
        console.log('Request body:\n', body);

        validateRequest(context, tokens);
        if (tokens.length != 1) {
            throw new RequestError$1('Missing entry ID');
        }

        let responseData;
        let existing;

        try {
            existing = context.storage.get(context.params.collection, tokens[0]);
        } catch (err) {
            throw new NotFoundError$1();
        }

        context.canAccess(existing, body);

        try {
            responseData = context.storage.set(context.params.collection, tokens[0], body);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    function patch(context, tokens, query, body) {
        console.log('Request body:\n', body);

        validateRequest(context, tokens);
        if (tokens.length != 1) {
            throw new RequestError$1('Missing entry ID');
        }

        let responseData;
        let existing;

        try {
            existing = context.storage.get(context.params.collection, tokens[0]);
        } catch (err) {
            throw new NotFoundError$1();
        }

        context.canAccess(existing, body);

        try {
            responseData = context.storage.merge(context.params.collection, tokens[0], body);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    function del(context, tokens, query, body) {
        validateRequest(context, tokens);
        if (tokens.length != 1) {
            throw new RequestError$1('Missing entry ID');
        }

        let responseData;
        let existing;

        try {
            existing = context.storage.get(context.params.collection, tokens[0]);
        } catch (err) {
            throw new NotFoundError$1();
        }

        context.canAccess(existing);

        try {
            responseData = context.storage.delete(context.params.collection, tokens[0]);
        } catch (err) {
            throw new RequestError$1();
        }

        return responseData;
    }

    /*
     * This service requires storage and auth plugins
     */

    const dataService$1 = new Service_1();
    dataService$1.get(':collection', crud.get);
    dataService$1.post(':collection', crud.post);
    dataService$1.put(':collection', crud.put);
    dataService$1.patch(':collection', crud.patch);
    dataService$1.delete(':collection', crud.delete);

    var data$1 = dataService$1.parseRequest;

    const imgdata = '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Td4DLneAwSddMiRH8tMU8nng/Yy+KQsM3AKBNbe35j5OH4A0dbV8AxwcAqMFyl73eHd3e2//nmn29wOGi3Kv+RixSgAAEkxpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOmlwdGNFeHQ9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBFeHQvMjAwOC0wMi0yOS8iCiAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICB4bWxuczpwbHVzPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3htcC8xLjAvIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOjdjZDM3NWM3LTcwNmItNDlkMy1hOWRkLWNmM2Q3MmMwY2I4ZCIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2NGY2YTJlYy04ZjA5LTRkZTMtOTY3ZC05MTUyY2U5NjYxNTAiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxMmE1NzI5Mi1kNmJkLTRlYjQtOGUxNi1hODEzYjMwZjU0NWYiCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IldpbmRvd3MiCiAgIEdJTVA6VGltZVN0YW1wPSIxNjEzMzAwNzI5NTMwNjQzIgogICBHSU1QOlZlcnNpb249IjIuMTAuMTIiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICBwaG90b3Nob3A6Q3JlZGl0PSJHZXR0eSBJbWFnZXMvaVN0b2NrcGhvdG8iCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIgogICB4bXBSaWdodHM6V2ViU3RhdGVtZW50PSJodHRwczovL3d3dy5pc3RvY2twaG90by5jb20vbGVnYWwvbGljZW5zZS1hZ3JlZW1lbnQ/dXRtX21lZGl1bT1vcmdhbmljJmFtcDt1dG1fc291cmNlPWdvb2dsZSZhbXA7dXRtX2NhbXBhaWduPWlwdGN1cmwiPgogICA8aXB0Y0V4dDpMb2NhdGlvbkNyZWF0ZWQ+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpMb2NhdGlvbkNyZWF0ZWQ+CiAgIDxpcHRjRXh0OkxvY2F0aW9uU2hvd24+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpMb2NhdGlvblNob3duPgogICA8aXB0Y0V4dDpBcnR3b3JrT3JPYmplY3Q+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpBcnR3b3JrT3JPYmplY3Q+CiAgIDxpcHRjRXh0OlJlZ2lzdHJ5SWQ+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpSZWdpc3RyeUlkPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjOTQ2M2MxMC05OWE4LTQ1NDQtYmRlOS1mNzY0ZjdhODJlZDkiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoV2luZG93cykiCiAgICAgIHN0RXZ0OndoZW49IjIwMjEtMDItMTRUMTM6MDU6MjkiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogICA8cGx1czpJbWFnZVN1cHBsaWVyPgogICAgPHJkZjpTZXEvPgogICA8L3BsdXM6SW1hZ2VTdXBwbGllcj4KICAgPHBsdXM6SW1hZ2VDcmVhdG9yPgogICAgPHJkZjpTZXEvPgogICA8L3BsdXM6SW1hZ2VDcmVhdG9yPgogICA8cGx1czpDb3B5cmlnaHRPd25lcj4KICAgIDxyZGY6U2VxLz4KICAgPC9wbHVzOkNvcHlyaWdodE93bmVyPgogICA8cGx1czpMaWNlbnNvcj4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgcGx1czpMaWNlbnNvclVSTD0iaHR0cHM6Ly93d3cuaXN0b2NrcGhvdG8uY29tL3Bob3RvL2xpY2Vuc2UtZ20xMTUwMzQ1MzQxLT91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29vZ2xlJmFtcDt1dG1fY2FtcGFpZ249aXB0Y3VybCIvPgogICAgPC9yZGY6U2VxPgogICA8L3BsdXM6TGljZW5zb3I+CiAgIDxkYzpjcmVhdG9yPgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaT5WbGFkeXNsYXYgU2VyZWRhPC9yZGY6bGk+CiAgICA8L3JkZjpTZXE+CiAgIDwvZGM6Y3JlYXRvcj4KICAgPGRjOmRlc2NyaXB0aW9uPgogICAgPHJkZjpBbHQ+CiAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5TZXJ2aWNlIHRvb2xzIGljb24gb24gd2hpdGUgYmFja2dyb3VuZC4gVmVjdG9yIGlsbHVzdHJhdGlvbi48L3JkZjpsaT4KICAgIDwvcmRmOkFsdD4KICAgPC9kYzpkZXNjcmlwdGlvbj4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PmWJCnkAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflAg4LBR0CZnO/AAAARHRFWHRDb21tZW50AFNlcnZpY2UgdG9vbHMgaWNvbiBvbiB3aGl0ZSBiYWNrZ3JvdW5kLiBWZWN0b3IgaWxsdXN0cmF0aW9uLlwvEeIAAAMxSURBVHja7Z1bcuQwCEX7qrLQXlp2ynxNVWbK7dgWj3sl9JvYRhxACD369erW7UMzx/cYaychonAQvXM5ABYkpynoYIiEGdoQog6AYfywBrCxF4zNrX/7McBbuXJe8rXx/KBDULcGsMREzCbeZ4J6ME/9wVH5d95rogZp3npEgPLP3m2iUSGqXBJS5Dr6hmLm8kRuZABYti5TMaailV8LodNQwTTUWk4/WZk75l0kM0aZQdaZjMqkrQDAuyMVJWFjMB4GANXr0lbZBxQKr7IjI7QvVWkok/Jn5UHVh61CYPs+/i7eL9j3y/Au8WqoAIC34k8/9k7N8miLcaGWHwgjZXE/awyYX7h41wKMCskZM2HXAddDkTdglpSjz5bcKPbcCEKwT3+DhxtVpJvkEC7rZSgq32NMSBoXaCdiahDCKrND0fpX8oQlVsQ8IFQZ1VARdIF5wroekAjB07gsAgDUIbQHFENIDEX4CQANIVe8Iw/ASiACLXl28eaf579OPuBa9/mrELUYHQ1t3KHlZZnRcXb2/c7ygXIQZqjDMEzeSrOgCAhqYMvTUE+FKXoVxTxgk3DEPREjGzj3nAk/VaKyB9GVIu4oMyOlrQZgrBBEFG9PAZTfs3amYDGrP9Wl964IeFvtz9JFluIvlEvcdoXDOdxggbDxGwTXcxFRi/LdirKgZUBm7SUdJG69IwSUzAMWgOAq/4hyrZVaJISSNWHFVbEoCFEhyBrCtXS9L+so9oTy8wGqxbQDD350WTjNESVFEB5hdKzUGcV5QtYxVWR2Ssl4Mg9qI9u6FCBInJRXgfEEgtS9Cgrg7kKouq4mdcDNBnEHQvWFTdgdgsqP+MiluVeBM13ahx09AYSWi50gsF+I6vn7BmCEoHR3NBzkpIOw4+XdVBBGQUioblaZHbGlodtB+N/jxqwLX/x/NARfD8ADxTOCKIcwE4Lw0OIbguMYcGTlymEpHYLXIKx8zQEqIfS2lGJPaADFEBR/PMH79ErqtpnZmTBlvM4wgihPWDEEhXn1LISj50crNgfCp+dWHYQRCfb2zgfnBZmKGAyi914anK9Coi4LOMhoAn3uVtn+AGnLKxPUZnCuAAAAAElFTkSuQmCC';
    const img = Buffer.from(imgdata, 'base64');

    var favicon = (method, tokens, query, body) => {
        console.log('serving favicon...');
        const headers = {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        };
        let result = img;

        return {
            headers,
            result
        };
    };

    var require$$0 = "<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>SUPS Admin Panel</title>\r\n    <style>\r\n        * {\r\n            padding: 0;\r\n            margin: 0;\r\n        }\r\n\r\n        body {\r\n            padding: 32px;\r\n            font-size: 16px;\r\n        }\r\n\r\n        .layout::after {\r\n            content: '';\r\n            clear: both;\r\n            display: table;\r\n        }\r\n\r\n        .col {\r\n            display: block;\r\n            float: left;\r\n        }\r\n\r\n        p {\r\n            padding: 8px 16px;\r\n        }\r\n\r\n        table {\r\n            border-collapse: collapse;\r\n        }\r\n\r\n        caption {\r\n            font-size: 120%;\r\n            text-align: left;\r\n            padding: 4px 8px;\r\n            font-weight: bold;\r\n            background-color: #ddd;\r\n        }\r\n\r\n        table, tr, th, td {\r\n            border: 1px solid #ddd;\r\n        }\r\n\r\n        th, td {\r\n            padding: 4px 8px;\r\n        }\r\n\r\n        ul {\r\n            list-style: none;\r\n        }\r\n\r\n        .collection-list a {\r\n            display: block;\r\n            width: 120px;\r\n            padding: 4px 8px;\r\n            text-decoration: none;\r\n            color: black;\r\n            background-color: #ccc;\r\n        }\r\n        .collection-list a:hover {\r\n            background-color: #ddd;\r\n        }\r\n        .collection-list a:visited {\r\n            color: black;\r\n        }\r\n    </style>\r\n    <script type=\"module\">\nimport { html, render } from 'https://unpkg.com/lit-html?module';\nimport { until } from 'https://unpkg.com/lit-html/directives/until?module';\n\nconst api = {\r\n    async get(url) {\r\n        return json(url);\r\n    },\r\n    async post(url, body) {\r\n        return json(url, {\r\n            method: 'POST',\r\n            headers: { 'Content-Type': 'application/json' },\r\n            body: JSON.stringify(body)\r\n        });\r\n    }\r\n};\r\n\r\nasync function json(url, options) {\r\n    return await (await fetch('/' + url, options)).json();\r\n}\r\n\r\nasync function getCollections() {\r\n    return api.get('data');\r\n}\r\n\r\nasync function getRecords(collection) {\r\n    return api.get('data/' + collection);\r\n}\r\n\r\nasync function getThrottling() {\r\n    return api.get('util/throttle');\r\n}\r\n\r\nasync function setThrottling(throttle) {\r\n    return api.post('util', { throttle });\r\n}\n\nasync function collectionList(onSelect) {\r\n    const collections = await getCollections();\r\n\r\n    return html`\r\n    <ul class=\"collection-list\">\r\n        ${collections.map(collectionLi)}\r\n    </ul>`;\r\n\r\n    function collectionLi(name) {\r\n        return html`<li><a href=\"javascript:void(0)\" @click=${(ev) => onSelect(ev, name)}>${name}</a></li>`;\r\n    }\r\n}\n\nasync function recordTable(collectionName) {\r\n    const records = await getRecords(collectionName);\r\n    const layout = getLayout(records);\r\n\r\n    return html`\r\n    <table>\r\n        <caption>${collectionName}</caption>\r\n        <thead>\r\n            <tr>${layout.map(f => html`<th>${f}</th>`)}</tr>\r\n        </thead>\r\n        <tbody>\r\n            ${records.map(r => recordRow(r, layout))}\r\n        </tbody>\r\n    </table>`;\r\n}\r\n\r\nfunction getLayout(records) {\r\n    const result = new Set(['_id']);\r\n    records.forEach(r => Object.keys(r).forEach(k => result.add(k)));\r\n\r\n    return [...result.keys()];\r\n}\r\n\r\nfunction recordRow(record, layout) {\r\n    return html`\r\n    <tr>\r\n        ${layout.map(f => html`<td>${JSON.stringify(record[f]) || html`<span>(missing)</span>`}</td>`)}\r\n    </tr>`;\r\n}\n\nasync function throttlePanel(display) {\r\n    const active = await getThrottling();\r\n\r\n    return html`\r\n    <p>\r\n        Request throttling: </span>${active}</span>\r\n        <button @click=${(ev) => set(ev, true)}>Enable</button>\r\n        <button @click=${(ev) => set(ev, false)}>Disable</button>\r\n    </p>`;\r\n\r\n    async function set(ev, state) {\r\n        ev.target.disabled = true;\r\n        await setThrottling(state);\r\n        display();\r\n    }\r\n}\n\n//import page from '//unpkg.com/page/page.mjs';\r\n\r\n\r\nfunction start() {\r\n    const main = document.querySelector('main');\r\n    editor(main);\r\n}\r\n\r\nasync function editor(main) {\r\n    let list = html`<div class=\"col\">Loading&hellip;</div>`;\r\n    let viewer = html`<div class=\"col\">\r\n    <p>Select collection to view records</p>\r\n</div>`;\r\n    display();\r\n\r\n    list = html`<div class=\"col\">${await collectionList(onSelect)}</div>`;\r\n    display();\r\n\r\n    async function display() {\r\n        render(html`\r\n        <section class=\"layout\">\r\n            ${until(throttlePanel(display), html`<p>Loading</p>`)}\r\n        </section>\r\n        <section class=\"layout\">\r\n            ${list}\r\n            ${viewer}\r\n        </section>`, main);\r\n    }\r\n\r\n    async function onSelect(ev, name) {\r\n        ev.preventDefault();\r\n        viewer = html`<div class=\"col\">${await recordTable(name)}</div>`;\r\n        display();\r\n    }\r\n}\r\n\r\nstart();\n\n</script>\r\n</head>\r\n<body>\r\n    <main>\r\n        Loading&hellip;\r\n    </main>\r\n</body>\r\n</html>";

    const mode = process.argv[2] == '-dev' ? 'dev' : 'prod';

    const files = {
        index: mode == 'prod' ? require$$0 : fs__default['default'].readFileSync('./client/index.html', 'utf-8')
    };

    var admin = (method, tokens, query, body) => {
        const headers = {
            'Content-Type': 'text/html'
        };
        let result = '';

        const resource = tokens.join('/');
        if (resource && resource.split('.').pop() == 'js') {
            headers['Content-Type'] = 'application/javascript';

            files[resource] = files[resource] || fs__default['default'].readFileSync('./client/' + resource, 'utf-8');
            result = files[resource];
        } else {
            result = files.index;
        }

        return {
            headers,
            result
        };
    };

    /*
     * This service requires util plugin
     */

    const utilService = new Service_1();

    utilService.post('*', onRequest);
    utilService.get(':service', getStatus);

    function getStatus(context, tokens, query, body) {
        return context.util[context.params.service];
    }

    function onRequest(context, tokens, query, body) {
        Object.entries(body).forEach(([k, v]) => {
            console.log(`${k} ${v ? 'enabled' : 'disabled'}`);
            context.util[k] = v;
        });
        return '';
    }

    var util$1 = utilService.parseRequest;

    var services = {
        jsonstore,
        users,
        data: data$1,
        favicon,
        admin,
        util: util$1
    };

    const { uuid: uuid$2 } = util;


    function initPlugin(settings) {
        const storage = createInstance(settings.seedData);
        const protectedStorage = createInstance(settings.protectedData);

        return function decoreateContext(context, request) {
            context.storage = storage;
            context.protectedStorage = protectedStorage;
        };
    }


    /**
     * Create storage instance and populate with seed data
     * @param {Object=} seedData Associative array with data. Each property is an object with properties in format {key: value}
     */
    function createInstance(seedData = {}) {
        const collections = new Map();

        // Initialize seed data from file    
        for (let collectionName in seedData) {
            if (seedData.hasOwnProperty(collectionName)) {
                const collection = new Map();
                for (let recordId in seedData[collectionName]) {
                    if (seedData.hasOwnProperty(collectionName)) {
                        collection.set(recordId, seedData[collectionName][recordId]);
                    }
                }
                collections.set(collectionName, collection);
            }
        }


        // Manipulation

        /**
         * Get entry by ID or list of all entries from collection or list of all collections
         * @param {string=} collection Name of collection to access. Throws error if not found. If omitted, returns list of all collections.
         * @param {number|string=} id ID of requested entry. Throws error if not found. If omitted, returns of list all entries in collection.
         * @return {Object} Matching entry.
         */
        function get(collection, id) {
            if (!collection) {
                return [...collections.keys()];
            }
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!id) {
                const entries = [...targetCollection.entries()];
                let result = entries.map(([k, v]) => {
                    return Object.assign(deepCopy(v), { _id: k });
                });
                return result;
            }
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }
            const entry = targetCollection.get(id);
            return Object.assign(deepCopy(entry), { _id: id });
        }

        /**
         * Add new entry to collection. ID will be auto-generated
         * @param {string} collection Name of collection to access. If the collection does not exist, it will be created.
         * @param {Object} data Value to store.
         * @return {Object} Original value with resulting ID under _id property.
         */
        function add(collection, data) {
            const record = assignClean({ _ownerId: data._ownerId }, data);

            let targetCollection = collections.get(collection);
            if (!targetCollection) {
                targetCollection = new Map();
                collections.set(collection, targetCollection);
            }
            let id = uuid$2();
            // Make sure new ID does not match existing value
            while (targetCollection.has(id)) {
                id = uuid$2();
            }

            record._createdOn = Date.now();
            targetCollection.set(id, record);
            return Object.assign(deepCopy(record), { _id: id });
        }

        /**
         * Replace entry by ID
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {number|string} id ID of entry to update. Throws error if not found.
         * @param {Object} data Value to store. Record will be replaced!
         * @return {Object} Updated entry.
         */
        function set(collection, id, data) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }

            const existing = targetCollection.get(id);
            const record = assignSystemProps(deepCopy(data), existing);
            record._updatedOn = Date.now();
            targetCollection.set(id, record);
            return Object.assign(deepCopy(record), { _id: id });
        }

        /**
         * Modify entry by ID
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {number|string} id ID of entry to update. Throws error if not found.
         * @param {Object} data Value to store. Shallow merge will be performed!
         * @return {Object} Updated entry.
         */
        function merge(collection, id, data) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }

            const existing = deepCopy(targetCollection.get(id));
            const record = assignClean(existing, data);
            record._updatedOn = Date.now();
            targetCollection.set(id, record);
            return Object.assign(deepCopy(record), { _id: id });
        }

        /**
         * Delete entry by ID
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {number|string} id ID of entry to update. Throws error if not found.
         * @return {{_deletedOn: number}} Server time of deletion.
         */
        function del(collection, id) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            if (!targetCollection.has(id)) {
                throw new ReferenceError('Entry does not exist: ' + id);
            }
            targetCollection.delete(id);

            return { _deletedOn: Date.now() };
        }

        /**
         * Search in collection by query object
         * @param {string} collection Name of collection to access. Throws error if not found.
         * @param {Object} query Query object. Format {prop: value}.
         * @return {Object[]} Array of matching entries.
         */
        function query(collection, query) {
            if (!collections.has(collection)) {
                throw new ReferenceError('Collection does not exist: ' + collection);
            }
            const targetCollection = collections.get(collection);
            const result = [];
            // Iterate entries of target collection and compare each property with the given query
            for (let [key, entry] of [...targetCollection.entries()]) {
                let match = true;
                for (let prop in entry) {
                    if (query.hasOwnProperty(prop)) {
                        const targetValue = query[prop];
                        // Perform lowercase search, if value is string
                        if (typeof targetValue === 'string' && typeof entry[prop] === 'string') {
                            if (targetValue.toLocaleLowerCase() !== entry[prop].toLocaleLowerCase()) {
                                match = false;
                                break;
                            }
                        } else if (targetValue != entry[prop]) {
                            match = false;
                            break;
                        }
                    }
                }

                if (match) {
                    result.push(Object.assign(deepCopy(entry), { _id: key }));
                }
            }

            return result;
        }

        return { get, add, set, merge, delete: del, query };
    }


    function assignSystemProps(target, entry, ...rest) {
        const whitelist = [
            '_id',
            '_createdOn',
            '_updatedOn',
            '_ownerId'
        ];
        for (let prop of whitelist) {
            if (entry.hasOwnProperty(prop)) {
                target[prop] = deepCopy(entry[prop]);
            }
        }
        if (rest.length > 0) {
            Object.assign(target, ...rest);
        }

        return target;
    }


    function assignClean(target, entry, ...rest) {
        const blacklist = [
            '_id',
            '_createdOn',
            '_updatedOn',
            '_ownerId'
        ];
        for (let key in entry) {
            if (blacklist.includes(key) == false) {
                target[key] = deepCopy(entry[key]);
            }
        }
        if (rest.length > 0) {
            Object.assign(target, ...rest);
        }

        return target;
    }

    function deepCopy(value) {
        if (Array.isArray(value)) {
            return value.map(deepCopy);
        } else if (typeof value == 'object') {
            return [...Object.entries(value)].reduce((p, [k, v]) => Object.assign(p, { [k]: deepCopy(v) }), {});
        } else {
            return value;
        }
    }

    var storage = initPlugin;

    const { ConflictError: ConflictError$1, CredentialError: CredentialError$1, RequestError: RequestError$2 } = errors;

    function initPlugin$1(settings) {
        const identity = settings.identity;

        return function decorateContext(context, request) {
            context.auth = {
                register,
                login,
                logout
            };

            const userToken = request.headers['x-authorization'];
            if (userToken !== undefined) {
                let user;
                const session = findSessionByToken(userToken);
                if (session !== undefined) {
                    const userData = context.protectedStorage.get('users', session.userId);
                    if (userData !== undefined) {
                        console.log('Authorized as ' + userData[identity]);
                        user = userData;
                    }
                }
                if (user !== undefined) {
                    context.user = user;
                } else {
                    throw new CredentialError$1('Invalid access token');
                }
            }

            function register(body) {
                if (body.hasOwnProperty(identity) === false ||
                    body.hasOwnProperty('password') === false ||
                    body[identity].length == 0 ||
                    body.password.length == 0) {
                    throw new RequestError$2('Missing fields');
                } else if (context.protectedStorage.query('users', { [identity]: body[identity] }).length !== 0) {
                    throw new ConflictError$1(`A user with the same ${identity} already exists`);
                } else {
                    const newUser = Object.assign({}, body, {
                        [identity]: body[identity],
                        hashedPassword: hash(body.password)
                    });
                    const result = context.protectedStorage.add('users', newUser);
                    delete result.hashedPassword;

                    const session = saveSession(result._id);
                    result.accessToken = session.accessToken;

                    return result;
                }
            }

            function login(body) {
                const targetUser = context.protectedStorage.query('users', { [identity]: body[identity] });
                if (targetUser.length == 1) {
                    if (hash(body.password) === targetUser[0].hashedPassword) {
                        const result = targetUser[0];
                        delete result.hashedPassword;

                        const session = saveSession(result._id);
                        result.accessToken = session.accessToken;

                        return result;
                    } else {
                        throw new CredentialError$1('Login or password don\'t match');
                    }
                } else {
                    throw new CredentialError$1('Login or password don\'t match');
                }
            }

            function logout() {
                if (context.user !== undefined) {
                    const session = findSessionByUserId(context.user._id);
                    if (session !== undefined) {
                        context.protectedStorage.delete('sessions', session._id);
                    }
                } else {
                    throw new CredentialError$1('User session does not exist');
                }
            }

            function saveSession(userId) {
                let session = context.protectedStorage.add('sessions', { userId });
                const accessToken = hash(session._id);
                session = context.protectedStorage.set('sessions', session._id, Object.assign({ accessToken }, session));
                return session;
            }

            function findSessionByToken(userToken) {
                return context.protectedStorage.query('sessions', { accessToken: userToken })[0];
            }

            function findSessionByUserId(userId) {
                return context.protectedStorage.query('sessions', { userId })[0];
            }
        };
    }


    const secret = 'This is not a production server';

    function hash(string) {
        const hash = crypto__default['default'].createHmac('sha256', secret);
        hash.update(string);
        return hash.digest('hex');
    }

    var auth = initPlugin$1;

    function initPlugin$2(settings) {
        const util = {
            throttle: false
        };

        return function decoreateContext(context, request) {
            context.util = util;
        };
    }

    var util$2 = initPlugin$2;

    /*
     * This plugin requires auth and storage plugins
     */

    const { RequestError: RequestError$3, ConflictError: ConflictError$2, CredentialError: CredentialError$2, AuthorizationError: AuthorizationError$2 } = errors;

    function initPlugin$3(settings) {
        const actions = {
            'GET': '.read',
            'POST': '.create',
            'PUT': '.update',
            'PATCH': '.update',
            'DELETE': '.delete'
        };
        const rules = Object.assign({
            '*': {
                '.create': ['User'],
                '.update': ['Owner'],
                '.delete': ['Owner']
            }
        }, settings.rules);

        return function decorateContext(context, request) {
            // special rules (evaluated at run-time)
            const get = (collectionName, id) => {
                return context.storage.get(collectionName, id);
            };
            const isOwner = (user, object) => {
                return user._id == object._ownerId;
            };
            context.rules = {
                get,
                isOwner
            };
            const isAdmin = request.headers.hasOwnProperty('x-admin');

            context.canAccess = canAccess;

            function canAccess(data, newData) {
                const user = context.user;
                const action = actions[request.method];
                let { rule, propRules } = getRule(action, context.params.collection, data);

                if (Array.isArray(rule)) {
                    rule = checkRoles(rule, data);
                } else if (typeof rule == 'string') {
                    rule = !!(eval(rule));
                }
                if (!rule && !isAdmin) {
                    throw new CredentialError$2();
                }
                propRules.map(r => applyPropRule(action, r, user, data, newData));
            }

            function applyPropRule(action, [prop, rule], user, data, newData) {
                // NOTE: user needs to be in scope for eval to work on certain rules
                if (typeof rule == 'string') {
                    rule = !!eval(rule);
                }

                if (rule == false) {
                    if (action == '.create' || action == '.update') {
                        delete newData[prop];
                    } else if (action == '.read') {
                        delete data[prop];
                    }
                }
            }

            function checkRoles(roles, data, newData) {
                if (roles.includes('Guest')) {
                    return true;
                } else if (!context.user && !isAdmin) {
                    throw new AuthorizationError$2();
                } else if (roles.includes('User')) {
                    return true;
                } else if (context.user && roles.includes('Owner')) {
                    return context.user._id == data._ownerId;
                } else {
                    return false;
                }
            }
        };



        function getRule(action, collection, data = {}) {
            let currentRule = ruleOrDefault(true, rules['*'][action]);
            let propRules = [];

            // Top-level rules for the collection
            const collectionRules = rules[collection];
            if (collectionRules !== undefined) {
                // Top-level rule for the specific action for the collection
                currentRule = ruleOrDefault(currentRule, collectionRules[action]);

                // Prop rules
                const allPropRules = collectionRules['*'];
                if (allPropRules !== undefined) {
                    propRules = ruleOrDefault(propRules, getPropRule(allPropRules, action));
                }

                // Rules by record id 
                const recordRules = collectionRules[data._id];
                if (recordRules !== undefined) {
                    currentRule = ruleOrDefault(currentRule, recordRules[action]);
                    propRules = ruleOrDefault(propRules, getPropRule(recordRules, action));
                }
            }

            return {
                rule: currentRule,
                propRules
            };
        }

        function ruleOrDefault(current, rule) {
            return (rule === undefined || rule.length === 0) ? current : rule;
        }

        function getPropRule(record, action) {
            const props = Object
                .entries(record)
                .filter(([k]) => k[0] != '.')
                .filter(([k, v]) => v.hasOwnProperty(action))
                .map(([k, v]) => [k, v[action]]);

            return props;
        }
    }

    var rules = initPlugin$3;

    var identity = "email";
    var protectedData = {
        users: {
            "35c62d76-8152-4626-8712-eeb96381bea8": {
                email: "peter@abv.bg",
                hashedPassword: "83313014ed3e2391aa1332615d2f053cf5c1bfe05ca1cbcb5582443822df6eb1"
            },
            "847ec027-f659-4086-8032-5173e2f9c93a": {
                email: "john@abv.bg",
                hashedPassword: "83313014ed3e2391aa1332615d2f053cf5c1bfe05ca1cbcb5582443822df6eb1"
            }
        },
        sessions: {
        }
    };
    var seedData = {
        storeProducts: {
            "53d4dbf5-7f41-47ba-b485-43eccb91cb95": {
                category: "Furniture",
                type: "Table",
                model: "Opulent Oaken Boardroom Table",
                year: 2023,
                description: "The Opulent Oaken Boardroom Table exudes an air of sophistication and luxury. Crafted from the finest oak wood, its smooth surface is polished to a glossy finish that radiates a warm, golden hue. Its sturdy legs are intricately carved, featuring elegant curves and ornate details that add a touch of glamour to any corporate setting. This table is designed to impress and command attention, providing a regal centerpiece for important meetings and high-level negotiations. With its impeccable craftsmanship and timeless design, the Opulent Oaken Boardroom Table is sure to make a lasting impression on all who gather around it.",
                price: 1235,
                imgUrl: "https://www.bentleydesigns.com/images/products/large/3074_10186.jpg",
                material: "Oak",
                rating: 9.5,
                _createdOn: 1615545143015,
                _id: "53d4dbf5-7f41-47ba-b485-43eccb91cb95"
            },
            "22d4dbf5-7f41-47ba-b485-43eccb91cb95": {
                category: "Bedroom",
                type: "Bed",
                model: "Regal Slumber Haven",
                year: 2022,
                description: "The Regal Slumber Haven is a masterpiece of comfort and luxury, designed for those who seek the ultimate in sleeping experiences. Its plush mattress is generously filled with the finest materials, providing a cloud-like softness that cradles the body in a cocoon of relaxation. The headboard is a work of art, upholstered in sumptuous fabric and adorned with intricate details that catch the eye and draw the attention. The frame is crafted from the finest hardwood, finished to a high gloss that enhances its natural beauty and strength. Whether one is seeking a peaceful night's rest or simply a place to relax and unwind, the Regal Slumber Haven is the perfect sanctuary. ",
                price: 2235,
                imgUrl: "https://www.idfdesign.com/images/luxury-classic-bed-and-canopy-bed/r45-bed-carved-beds-3.jpg",
                material: "Hardwood",
                rating: 8.8,
                _createdOn: 1615545143015,
                _id: "22d4dbf5-7f41-47ba-b485-43eccb91cb95"
            },
            "23s4dbf5-7f41-47ba-b485-43eccb91cb95": {
                category: "Kitchen",
                type: "Sink",
                model: "Luminous Cascade",
                year: 2015,
                description: "This sink boasts a sleek and modern design that resembles the stunning display of the northern lights. Its flowing water stream creates a mesmerizing visual effect that will elevate the look of any kitchen.",
                price: 235,
                imgUrl: "https://www.ikea.com/us/en/images/products/havsen-apron-front-double-bowl-sink-white__0866246_pe671652_s5.jpg?f=s",
                material: "Hardwood",
                rating: 4,
                _createdOn: 1615545143015,
                _id: "22d4dbf5-7f41-47ba-b485-43eccb91cb95"
            },
            "23s4dbf5-7f41-47ba-b485-43esdd91cb95": {
                category: "Bathroom",
                type: "Sink",
                model: "Elegance Flow",
                year: 2023,
                description: "The Elegance Flow sink is a luxurious addition to any bathroom. Its sleek and modern design is accented by a luminous chrome finish that exudes sophistication. The gentle flow of water creates a soothing ambiance that transforms any bathroom into a spa-like oasis. The sink is crafted from high-quality materials that ensure durability and longevity, making it a smart investment for any homeowner.",
                price: 890,
                imgUrl: "https://www.lussostone.com/images/elegance-pull-out-kitchen-mixer-tap-vello-undermount-sink-in-brushed-gold-p4926-26635_medium.jpg",
                material: "Chrome",
                rating: 9.2,
                _createdOn: 1646520438593,
                _id: "d1e7fa1c-2b0f-4ccf-8ed7-1b2e00e192a8"
            },
            "f9c54df6-2d99-4bfe-b7dc-4d4b4e4f6f8c": {
                category: "Furniture",
                type: "Table",
                model: "Rustic Farmhouse",
                year: 2022,
                description: "The Rustic Farmhouse dining table is a stunning centerpiece for any dining room. Its solid wood construction and distressed finish create a warm, inviting atmosphere that is perfect for family gatherings and dinner parties. The table is designed to comfortably seat six to eight people, and its sturdy construction ensures that it will last for generations. The unique design features a trestle-style base with a simple, yet elegant silhouette that complements a variety of decor styles. This table is a true statement piece that will elevate any dining room.",
                price: 1250,
                imgUrl: "https://static.povison.com/media/catalog/product/1/-/1-1000_10.jpg",
                material: "Solid Wood",
                rating: 6.2,
                _createdOn: 1646786949000,
                _id: "f9c54df6-249d-4bfe-b7dc-4d4b4e4f6f8c"
            },
            "6a954fcf-45e6-46b6-800d-b5a42c5dce89": {
                category: "Kitchen",
                type: "Sink",
                model: "Crystal Clear",
                year: 2016,
                description: "A modern glass sink that adds a touch of elegance and sophistication to your kitchen. The transparent design showcases the beauty of flowing water, making it a conversation piece.",
                price: 265,
                imgUrl: "https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg",
                material: "Tempered Glass",
                rating: 4.5,
                _createdOn: 1615555143015,
                _id: "6a954fcf-45e6-46b6-800d-b5a42c5dce89"
              },
              "b05a6e70-8c17-4e3f-b5a5-5a29f3e24b1d": {
                category: "Kitchen",
                type: "Sink",
                model: "Classic Farmhouse",
                year: 2017,
                description: "This timeless farmhouse sink brings a touch of rustic charm to your kitchen. The deep basin accommodates large pots and pans, while the durable ceramic material ensures it lasts for years.",
                price: 300,
                imgUrl: "https://images.pexels.com/photos/276524/pexels-photo-276524.jpeg",
                material: "Ceramic",
                rating: 4.7,
                _createdOn: 1615565143015,
                _id: "b05a6e70-8c17-4e3f-b5a5-5a29f3e24b1d"
              },
              "4e4a12f0-a48c-4a9a-8f27-3b3d3d3e2f93": {
                category: "Kitchen",
                type: "Sink",
                model: "Stainless Sleek",
                year: 2018,
                description: "A sleek and functional stainless steel sink that offers ample space and durability. The undermount design allows for easy cleanup and a seamless look in any contemporary kitchen.",
                price: 250,
                imgUrl: "https://images.pexels.com/photos/1757285/pexels-photo-1757285.jpeg",
                material: "Stainless Steel",
                rating: 4.3,
                _createdOn: 1615575143015,
                _id: "4e4a12f0-a48c-4a9a-8f27-3b3d3d3e2f93"
              },
              "e5deee6d-1d17-47f7-84e4-84a7a9a9aade": {
                category: "Kitchen",
                type: "Sink",
                model: "Eco Stone",
                year: 2019,
                description: "This eco-friendly sink is made from a composite of natural materials and recycled stone. The result is a durable and stylish option that complements any modern kitchen design.",
                price: 320,
                imgUrl: "https://images.pexels.com/photos/1101578/pexels-photo-1101578.jpeg",
                material: "Composite",
                rating: 4.6,
                _createdOn: 1615585143015,
                _id: "888a12f0-a48c-4a9a-8f27-3b3d3d3e2f93"
              },
              "8967d0f6-0c7e-4d31-9637-18426b9f9b82": {
                category: "Kitchen",
                type: "Sink",
                model: "Granite Elegance",
                year: 2020,
                description: "This beautiful granite sink offers a natural look and robust performance. Its nonporous surface is resistant to heat, stains, and scratches, making it an ideal choice for any kitchen.",
                price: 345,
                imgUrl: "https://images.pexels.com/photos/1069369/pexels-photo-1069369.jpeg",
                material: "Granite",
                rating: 4.8,
                _createdOn: 1615595143015,
                _id: "8967d0f6-0c7e-4d31-9637-18426b9f9b82"
              },
              "f5c8e5f1-5892-4c9a-8f6d-cf6dcf2a05b6": {
                category: "Kitchen",
                type: "Sink",
                model: "Rustic Copper",
                year: 2021,
                description: "This handcrafted copper sink adds a warm, rustic touch to your kitchen. The hammered finish and natural patina create a unique, vintage appearance that will stand out in any space.",
                price: 375,
                imgUrl: "https://images.pexels.com/photos/237727/pexels-photo-237727.jpeg",
                material: "Copper",
                rating: 4.4,
                _createdOn: 1615605143015,
                _id: "f5c8e5f1-5892-4c9a-8f6d-cf6dcf2a05b6"
              },
              "aca4c2d9-f4df-4f18-8d61-ebb01b1e6ef4": {
                category: "Kitchen",
                type: "Sink",
                model: "Porcelain Beauty",
                year: 2017,
                description: "This elegant porcelain sink features a smooth, glossy finish that is easy to clean and maintain. Its classic design complements both traditional and contemporary kitchen styles.",
                price: 290,
                imgUrl: "https://images.pexels.com/photos/2993482/pexels-photo-2993482.jpeg",
                material: "Porcelain",
                rating: 4.5,
                _createdOn: 1615615143015,
                _id: "aca4c2d9-f4df-4f18-8d61-ebb01b1e6ef4"
              },
              "d6d3e6b9-cb3f-4b56-8c34-e6aae0f53a2c": {
                category: "Kitchen",
                type: "Sink",
                model: "Concrete Minimalist",
                year: 2018,
                description: "This minimalist concrete sink offers a unique and modern aesthetic for your kitchen. The durable material and smooth finish provide a functional and stylish addition to any space.",
                price: 310,
                imgUrl: "https://images.pexels.com/photos/242236/pexels-photo-242236.jpeg",
                material: "Concrete",
                rating: 4.1,
                _createdOn: 1615625143015,
                _id: "366sc2d9-f4df-4f18-8d61-ebb01b1e6ef4"
              },
              "b4f1d1e9-9a4e-4e80-8a57-776db50a5f1b": {
                category: "Kitchen",
                type: "Sink",
                model: "Cornerstone",
                year: 2020,
                description: "This corner sink is a space-saving solution for smaller kitchens or tight spaces. Its stainless steel construction ensures durability and easy maintenance, while its smart design maximizes counter space.",
                price: 280,
                imgUrl: "https://images.pexels.com/photos/2988421/pexels-photo-2988421.jpeg",
                material: "Stainless Steel",
                rating: 4.2,
                _createdOn: 1615635143015,
                _id: "b4f1d1e9-9a4e-4e80-8a57-776db50a5f1b"
              },
              "0e5a7f5d-ef5d-4b8e-b5c7-5e5a1c7a9da4": {
                category: "Kitchen",
                type: "Sink",
                model: "Modern Matte Black",
                year: 2019,
                description: "This matte black sink brings a contemporary touch to your kitchen with its sleek design and bold color. Its durable material resists scratches and stains, ensuring a lasting and stylish addition to your space.",
                price: 325,
                imgUrl: "https://images.pexels.com/photos/2504911/pexels-photo-2504911.jpeg",
                material: "Composite",
                rating: 4.6,
                _createdOn: 1615645143015,
                _id: "0e5a7f5d-ef5d-4b8e-b5c7-5e5a1c7a9da4"
              },
              "c6b0f6ab-8d9a-47da-9c5f-6c813e6f74cd": {
                category: "Kitchen",
                type: "Sink",
                model: "Rounded Ceramic",
                year: 2018,
                description: "This beautiful rounded ceramic sink features a smooth, glossy finish that is easy to clean and maintain. Its curved design adds a touch of elegance to any kitchen and complements a variety of styles.",
                price: 275,
                imgUrl: "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg",
                material: "Ceramic",
                rating: 4.4,
                _createdOn: 1615655143015,
                _id: "c6b0f6ab-8d9a-47da-9c5f-6c813e6f74cd"
              },
              "1d93a7c9-9a8a-490d-bde9-84d2b13f8b62": {
                category: "Kitchen",
                type: "Sink",
                model: "Apron Front Marble",
                year: 2020,
                description: "This elegant apron front marble sink adds a touch of luxury to your kitchen. The durable and heat-resistant material offers a sophisticated look, perfect for both traditional and contemporary styles.",
                price: 395,
                imgUrl: "https://images.pexels.com/photos/1454804/pexels-photo-1454804.jpeg",
                material: "Marble",
                rating: 4.7,
                _createdOn: 1615665143015,
                _id: "1d93a7c9-9a8a-490d-bde9-84d2b13f8b62"
              },
              "c6b0f6ab-8d9a-47da-9c5f-6c813e6f74cd": {
                category: "Kitchen",
                type: "Sink",
                model: "Rounded Ceramic",
                year: 2018,
                description: "This beautiful rounded ceramic sink features a smooth, glossy finish that is easy to clean and maintain. Its curved design adds a touch of elegance to any kitchen and complements a variety of styles.",
                price: 275,
                imgUrl: "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg",
                material: "Ceramic",
                rating: 4.4,
                _createdOn: 1615655143015,
                _id: "c6b0f6ab-8d9a-47da-9c5f-6c813e6f74cd"
              },
              "3c9f6cdd-6d7a-4e61-aa3f-1d95d3f0a235": {
                category: "Kitchen",
                type: "Sink",
                model: "Drop-in Acrylic",
                year: 2017,
                description: "This lightweight drop-in acrylic sink offers a budget-friendly option for your kitchen. The durable material resists stains and scratches, while its high-gloss finish adds a touch of style to your space.",
                price: 215,
                imgUrl: "https://images.pexels.com/photos/2993487/pexels-photo-2993487.jpeg",
                material: "Acrylic",
                rating: 3.9,
                _createdOn: 1615685143015,
                _id: "3c9f6cdd-6d7a-4e61-aa3f-1d95d3f0a235"
              },
              "5ec4e1e6-57c6-4e6d-b2c9-7726b2e6d3cd": {
                category: "Kitchen",
                type: "Sink",
                model: "Freestanding Farmhouse",
                year: 2016,
                description: "This freestanding farmhouse sink is perfect for those who want a vintage-inspired kitchen. The large basin is perfect for washing large pots and pans, while the sturdy construction ensures durability.",
                price: 420,
                imgUrl: "https://images.pexels.com/photos/209189/pexels-photo-209189.jpeg",
                material: "Fireclay",
                rating: 4.5,
                _createdOn: 1615705143015,
                _id: "5ec4e1e6-57c6-4e6d-b2c9-7726b2e6d3cd"
              },
              "6fb7b6d9-a9a7-4a4f-96e4-e384cb4b4c4e": {
                category: "Kitchen",
                type: "Sink",
                model: "Glass Vessel",
                year: 2020,
                description: "This stunning glass vessel sink adds a touch of modern elegance to your kitchen. The transparent design showcases the beauty of flowing water, creating a mesmerizing visual effect.",
                price: 330,
                imgUrl: "https://images.pexels.com/photos/34153/pexels-photo.jpg",
                material: "Glass",
                rating: 4.1,
                _createdOn: 1615715143015,
                _id: "6fb7b6d9-a9a7-4a4f-96e4-e384cb4b4c4e"
              },
              "7f8a985b-bd5c-4677-8fcd-9f3bfc3a6f54": {
                category: "Kitchen",
                type: "Sink",
                model: "Wall-mounted Utility",
                year: 2019,
                description: "This wall-mounted utility sink is perfect for laundry rooms or garages. Its durable construction can withstand heavy use, while the deep basin offers ample space for soaking and washing.",
                price: 255,
                imgUrl: "https://images.pexels.com/photos/209282/pexels-photo-209282.jpeg",
                material: "Stainless Steel",
                rating: 3.8,
                _createdOn: 1615725143015,
                _id: "7f8a985b-bd5c-4677-8fcd-9f3bfc3a6f54"
              },
              "9ea12d9f-6c61-4e4a-8b4d-1de218a46c6c": {
                category: "Kitchen",
                type: "Sink",
                model: "Contemporary Copper",
                year: 2021,
                description: "This contemporary copper sink adds warmth and style to your kitchen. The hand-hammered finish and rich patina create a stunning focal point, while the durable material ensures long-lasting beauty.",
                price: 380,
                imgUrl: "https://images.pexels.com/photos/459688/pexels-photo-459688.jpeg",
                material: "Copper",
                rating: 4.8,
                _createdOn: 1615745143015,
                _id: "9ea12d9f-6c61-4e4a-8b4d-1de218a46c6c"
              },
              "a0e6cf4a-4b4f-4f6b-bb63-2b6576e912fd": {
                category: "Kitchen",
                type: "Sink",
                model: "Top-mount Single Basin",
                year: 2016,
                description: "This top-mount single basin sink offers a simple and affordable option for any kitchen. Its stainless steel construction ensures durability and easy cleaning, while its compact design is perfect for smaller spaces.",
                price: 210,
                imgUrl: "https://images.pexels.com/photos/628736/pexels-photo-628736.jpeg",
                material: "Stainless Steel",
                rating: 3.7,
                _createdOn: 1615755143015,
                _id: "a0e6cf4a-4b4f-4f6b-bb63-2b6576e912fd"
              },
              "b0c2e78d-8d84-4a31-88e3-3e3d3d3e3a9f": {
                category: "Kitchen",
                type: "Sink",
                model: "Compact Bar Sink",
                year: 2017,
                description: "This compact bar sink is perfect for small kitchens, wet bars, or outdoor entertaining areas. Its stainless steel construction is durable and easy to clean, while its sleek design adds a touch of style.",
                price: 175,
                imgUrl: "https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg",
                material: "Stainless Steel",
                rating: 3.5,
                _createdOn: 1615765143015,
                _id: "b0c2e78d-8d84-4a31-88e3-3e3d3d3e3a9f"
              },
              "d2a2c76e-9af9-4bca-8eb1-7ef842f1d6ec": {
                category: "Living Room",
                type: "Sofa",
                model: "Urban Loft",
                year: 2020,
                description: "This Urban Loft sofa combines comfort and style, making it the perfect addition to any living room. Its clean lines and plush cushions create a modern look, while its sturdy construction ensures durability.",
                price: 895,
                imgUrl: "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg",
                material: "Fabric",
                rating: 4.5,
                _createdOn: 1615785143015,
                _id: "d2a2c76e-9af9-4bca-8eb1-7ef842f1d6ec"
              },
              "e3d9b9ac-1e36-476c-85f3-3b7d3e3e3f7e": {
                category: "Bedroom",
                type: "Bed",
                model: "Modern Platform",
                year: 2021,
                description: "This modern platform bed adds a touch of sophistication to your bedroom. Its sleek design and low profile make it an ideal choice for contemporary spaces, while its sturdy construction ensures a comfortable night's sleep.",
                price: 725,
                imgUrl: "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg",
                material: "Wood",
                rating: 4.7,
                _createdOn: 1615795143015,
                _id: "e3d9b9ac-1e36-476c-85f3-3b7d3e3e3f7e"
              },
              "f4c1e21f-5e6a-4b7c-8e5d-2f6576f1e1df": {
                category: "Bathroom",
                type: "Bathtub",
                model: "Freestanding Soaker",
                year: 2019,
                description: "This freestanding soaker bathtub provides a luxurious bathing experience. Its spacious design and comfortable contours make it the perfect place to unwind after a long day, while its elegant design adds style to any bathroom.",
                price: 1290,
                imgUrl: "https://images.pexels.com/photos/382167/pexels-photo-382167.jpeg",
                material: "Acrylic",
                rating: 4.8,
                _createdOn: 1615805143015,
                _id: "f4c1e21f-5e6a-4b7c-8e5d-2f6576f1e1df"
              },
              "1a2b3c4d-1234-5678-90ab-cdef12345678": {
                category: "Outdoor",
                type: "Patio Furniture",
                model: "Wicker Lounge Set",
                year: 2020,
                description: "This wicker lounge set is perfect for relaxing and entertaining outdoors. Its comfortable cushions and durable construction make it ideal for any weather, while its timeless design complements a variety of patio styles.",
                price: 1295,
                imgUrl: "https://images.pexels.com/photos/210531/pexels-photo-210531.jpeg",
                material: "Wicker",
                rating: 4.6,
                _createdOn: 1615865143015,
                _id: "1a2b3c4d-1234-5678-90ab-cdef12345678"
              },
              "2b3c4d5e-2345-6789-01bc-def234567890": {
                category: "Dining Room",
                type: "Dining Table",
                model: "Rustic Farmhouse",
                year: 2019,
                description: "This rustic farmhouse dining table adds charm and warmth to your dining room. Its solid wood construction ensures durability, while its large size is perfect for family gatherings and dinner parties.",
                price: 850,
                imgUrl: "https://images.pexels.com/photos/298842/pexels-photo-298842.jpeg",
                material: "Wood",
                rating: 4.4,
                _createdOn: 1615875143015,
                _id: "2b3c4d5e-2345-6789-01bc-def234567890"
              },
              "3c4d5e6f-3456-7890-12cd-ef3456789012": {
                category: "Living Room",
                type: "Coffee Table",
                model: "Industrial Chic",
                year: 2018,
                description: "This industrial chic coffee table adds a touch of urban style to your living room. Its combination of wood and metal materials creates a unique look, while its sturdy construction ensures durability.",
                price: 295,
                imgUrl: "https://images.pexels.com/photos/279719/pexels-photo-279719.jpeg",
                material: "Wood and Metal",
                rating: 4.2,
                _createdOn: 1615885143015,
                _id: "3c4d5e6f-3456-7890-12cd-ef3456789012"
              },
              "1a2b3c4d-1234-5678-90ab-cdef12345678": {
                category: "Outdoor",
                type: "Patio Furniture",
                model: "Wicker Lounge Set",
                year: 2020,
                description: "This wicker lounge set is perfect for relaxing and entertaining outdoors. Its comfortable cushions and durable construction make it ideal for any weather, while its timeless design complements a variety of patio styles.",
                price: 1295,
                imgUrl: "https://images.pexels.com/photos/210531/pexels-photo-210531.jpeg",
                material: "Wicker",
                rating: 4.6,
                _createdOn: 1615865143015,
                _id: "1a2b3c4d-1234-5678-90ab-cdef12345678"
              }
            
            
            
            




        },
        userProducts: {
            "chf54df6-2d99-4bfe-b7dc-4d4b4e4f6f8c": {
                category: "Furniture",
                type: "Table",
                model: "Warden table",
                year: 2022,
                description: "The Warden dining table is a stunning centerpiece for any dining room. Its solid wood construction and distressed finish create a warm, inviting atmosphere that is perfect for family gatherings and dinner parties. The table is designed to comfortably seat six to eight people, and its sturdy construction ensures that it will last for generations. The unique design features a trestle-style base with a simple, yet elegant silhouette that complements a variety of decor styles. This table is a true statement piece that will elevate any dining room.",
                price: 1250,
                imgUrl: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                material: "Solid Wood",
                _createdOn: 1646786949000,
                _id: "f9c54df6-249d-4bfe-b7dc-4d4b4e4f6f8c",
                _ownerId: "e8c00bac5dfd8059763a2645f06ab97394675795f95516e4f30f5ab8837792fd"
            },
            "hgt98yh6-3jkl-1bnp-9qrs-7tuv2wxy4za": {
                category: "Furniture",
                type: "Sofa",
                model: "Mid-Century Modern",
                year: 2023,
                description: "The Mid-Century Modern sofa is a stylish and comfortable addition to any living room. Its clean lines and tufted back cushions evoke the iconic designs of the 1950s and 60s, while its plush seat cushions provide modern comfort. The sofa is upholstered in a soft, durable fabric that is available in a range of colors to suit any decor. With room for three people, this sofa is perfect for entertaining guests or relaxing with family. The solid wood frame and legs ensure durability and stability for years to come.",
                price: 1499,
                imgUrl: "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                material: "Solid Wood, Fabric",
                _createdOn: 1647846931000,
                _id: "hgt98yh6-3jkl-1bnp-9qrs-7tuv2wxy4za",
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8"
            },
            "fdg67tyu-9ijk-2mnb-8vfr-1qaz5tgb3ed": {
                category: "Furniture",
                type: "Bed",
                model: "Modern Platform",
                year: 2023,
                description: "The Modern Platform bed is a sleek and minimalist piece that will elevate any bedroom. Its low profile design creates a clean and contemporary look, while the solid wood construction ensures durability and stability. The platform base eliminates the need for a box spring, making it a convenient and space-saving option. The bed is available in a range of sizes and finishes to fit any room and style.",
                price: 899,
                imgUrl: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                material: "Solid Wood",
                _createdOn: 1648434961000,
                _id: "fdg67tyu-9ijk-2mnb-8vfr-1qaz5tgb3ed",
                _ownerId: "b8a67cde9f801234567890cd"
            },
            "abc23def-4ghi-5jkl-6mno-7pqr8stu9vw": {
                category: "Furniture",
                type: "Chair",
                model: "Eames Lounge",
                year: 2022,
                description: "The Eames Lounge chair is a classic and timeless design that has been in production for over 60 years. Its iconic silhouette and luxurious leather upholstery make it a statement piece in any room. The chair features a swivel base and reclining backrest for maximum comfort and versatility. The solid wood frame and premium materials ensure durability and longevity. The Eames Lounge chair is the perfect addition to any home or office.",
                price: 2999,
                imgUrl: "https://images.pexels.com/photos/220749/pexels-photo-220749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                material: "Solid Wood, Leather",
                _createdOn: 1649080354000,
                _id: "abc23def-4ghi-5jkl-6mno-7pqr8stu9vw",
                _ownerId: "c9b68cdea0801234567890ef"
            },
            "zxc98vbn-7mlo-5kji-3hgf-1dsaqwertyu": {
                category: "Furniture",
                type: "Desk",
                model: "Mid-Century Modern",
                year: 2023,
                description: "The Mid-Century Modern desk is a stylish and functional addition to any home office or workspace. Its clean lines and simple design evoke the iconic designs of the 1950s and 60s, while the solid wood construction ensures durability and stability. The desk features ample storage space with two drawers and an open shelf, making it a versatile option for organizing your work essentials. The desk is available in a range of finishes to suit any decor style.",
                price: 799,
                imgUrl: "https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                material: "Solid Wood",
                _createdOn: 1649652362000,
                _id: "zxc98vbn-7mlo-5kji-3hgf-1dsaqwertyu",
                _ownerId: "d0c79def1a901234567890ab"
            },
            "asd56fgh-1qwe-9zxc-2rty-8vbn0uio7lk": {
                category: "Furniture",
                type: "Sofa",
                model: "Sectional",
                year: 2022,
                description: "The Sectional sofa is a spacious and comfortable seating option for any living room. Its modular design allows for easy customization to fit any space and lifestyle. The plush cushions and soft upholstery make it a cozy and inviting place to relax and unwind. The sofa is available in a range of colors and fabrics to suit any decor style.",
                price: 1499,
                imgUrl: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                material: "Fabric",
                _createdOn: 1650327293000,
                _id: "asd56fgh-1qwe-9zxc-2rty-8vbn0uio7lk",
                _ownerId: "e1d23abc456f890ghi7jklm"
            },
            "poi98uyt-5tgb-2wsx-9ijn-7ujh1qaz4rfv": {
                category: "Furniture",
                type: "Bookcase",
                model: "Industrial",
                year: 2023,
                description: "The Industrial bookcase is a rugged and functional storage solution for any home or office. Its open shelving design allows for easy organization and display of books, decor, and more. The metal frame and distressed wood shelves create an industrial chic look that is both stylish and sturdy. The bookcase is available in a range of sizes and configurations to fit any space and storage needs.",
                price: 599,
                imgUrl: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                material: "Metal, Wood",
                _createdOn: 1650989851000,
                _id: "poi98uyt-5tgb-2wsx-9ijn-7ujh1qaz4rfv",
                _ownerId: "f2e34bcd567g890hij1klm2"
            },
            "mnb43vfr-7ujh-9okm-1qaz-2wsx8edc6ty": {
                category: "Furniture",
                type: "Dresser",
                model: "Mid-Century Modern",
                year: 2022,
                description: "The Mid-Century Modern dresser is a stylish and functional piece that will elevate any bedroom. Its clean lines and tapered legs evoke the iconic designs of the 1950s and 60s, while the solid wood construction ensures durability and longevity. The dresser features six spacious drawers, providing ample storage space for clothing and accessories. The dresser is available in a range of finishes to suit any decor style.",
                price: 899,
                imgUrl: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                material: "Solid Wood",
                _createdOn: 1651652764000,
                _id: "mnb43vfr-7ujh-9okm-1qaz-2wsx8edc6ty",
                _ownerId: "g3f45cde67890hija1klm2n"
            }
        },

        userCarts: {
            "995s8uyt-5tgb-2wsx-9ijn-7ujh1qaz4rfv": {
                _id: "poi98uyt-5tgb-2wsx-9ijn-7ujh1qaz4rfv",
                _productId : "poi98uyt-5tgb-2wsx-9ijn-7ujh1qaz4rfv",
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                _createdOn: 1650989851000          
            },
            "aezs5uyt-5tgb-2wsx-9ijn-7ujh1qaz4rfv": {
                _id: "eki55uyt-5tgb-2wsx-9ijn-7ujh1qaz4rfv",
                _productId : "mnb43vfr-7ujh-9okm-1qaz-2wsx8edc6ty",
                _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
                _createdOn: 1650989851000          
            }
        }
    };
    var rules$1 = {
        users: {
            ".create": false,
            ".read": [
                "Owner"
            ],
            ".update": false,
            ".delete": false
        }
    };
    var settings = {
        identity: identity,
        protectedData: protectedData,
        seedData: seedData,
        rules: rules$1
    };

    const plugins = [
        storage(settings),
        auth(settings),
        util$2(),
        rules(settings)
    ];

    const server = http__default['default'].createServer(requestHandler(plugins, services));

    const port = 3030;
    server.listen(port);
    console.log(`Server started on port ${port}. You can make requests to http://localhost:${port}/`);
    console.log(`Admin panel located at http://localhost:${port}/admin`);

    var softuniPracticeServer = {

    };

    return softuniPracticeServer;

})));
