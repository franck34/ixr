function Debug() {

    var namespaces = [];
    var levels;
    var all = false;

    var css = {
        debug:'background: darkgray; color: white;',
        error:'background: darkred; color: white;',
        warn:'background: orange; color: white;',
        info:'background: darkgreen; color: white;'
    };

    function enable(namespace, levelsWanted) {
        if (levelsWanted) {
            levels = levelsWanted;
        }

        if (namespace === '*') {
            all = true;
            return;
        }
        namespaces.push(namespace);
    }

    function isIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (
            msie > 0 ||
            !!navigator.userAgent.match(/Trident.*rv\:11\./)
        ) {
            return true;
        }
        return false;
    }

    function instance(ns) {

        if (!all && !namespaces.length) return function() {};

        var p = document.location.pathname;
        if (p === '/') p = '';
        ns = p+'/js/'+ns;

        function _log(level, argz) {
            if (!all && namespaces.indexOf(ns) === -1) return;
            if (levels && levels.length && levels.indexOf(level) === -1) return;

            var args = Array.prototype.slice.call(argz);
            for (var i = 0; i < args.length; i++) {
                if (args[i] && args[i].replace) {
                    args[i] = args[i].replace(/%([a-zA-Z%])/g, function(match, format) {
                        if (match === '%%') return match;
                        return args.splice(i+1, 1);
                    });
                }
            }

            if (!isIE()) {
                [].unshift.call(args, css[level]);
                [].unshift.call(args, '%c '+ns+' ');
            }
            console.log.apply(console, args);
        }

        function logger() { _log('debug', arguments); }

        logger.error = function() { _log('error', arguments); };
        logger.warn = function() { _log('warn', arguments); };
        logger.info = function() { _log('info', arguments); };

        return logger;
    }

    var f = function(ns) {
        return instance(ns);
    };

    f.enable = enable;

    return f;
}

export { Debug }

