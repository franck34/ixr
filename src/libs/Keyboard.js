function Keyboard(world, config) {

    if ( config.disable ) return;
    console.log('Keyboard', config);

    config.keydown = { };
    config.keyup = { };

    const status = {};

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    PubSub.subscribe('XREnter', disableLoopKeys);
    PubSub.subscribe('XRExit', enableLoopKeys);

    const renderer = world.get('renderer.main');
    renderer.addRenderJob(loopKeys);

    function enableLoopKeys() {

        renderer.addRenderJob(loopKeys);

    }

    function disableLoopKeys() {

        renderer.removeRenderJob(loopKeys);

    }

    function loopKeys( delta, time ) {

        for ( const k in status ) {
            status[ k ].since = delta; 
            config.keydown[ k ]( delta, time, status[k].ev );
        }

    }

    function getConfigHandler( ev ) {

        let handler = config.keydown[ ev.key ];

        if ( !r ) {

            handler = config.keydown[ ev.code ];

        }


        if ( handler ) {
            
            return {
                
                id:ev.code,
                handler
            
            }
        }


        return undefined;

    }

    function onKeyDown(ev) {

        const now = Date.now();
        
        let handler = getConfigHandler(ev);
        if (!handler) {
            return;
        }

        if (!statusKeys[ev.key]) {
            statusKeys[ev.key] = { start: now, since: 0, ev };
            console.log('onKeyDown - key ', ev.key);
        }
        
        if (!statusCodes[ev.code]) {
            statusCodes[ev.code] = { start: now, since: 0, ev, handler };
            console.log('onKeyDown - code ', ev.code);
        }
        

    }
    
    function onKeyUp(ev) {

        const handler = config.keyup.keys[ev.key] || config.keyup.codes[ev.code];
        if (!handler) return;
        
        console.log('onKeyUp', ev.key, ev.code);
        delete statusKeys[ev.key];
        delete statusCodes[ev.code];

        handler(ev);

    }


    function addKeyListener(options) {

        if (!options.event) {
            throw new Error('addKeyListener: event type is mandatory (i.e keydown)');
        }

        if (options.event != 'keydown' && options.event != 'keyup') {
            throw new Error('addKeyListener: event type not allowed');
        }

        if (options.key) {

            console.log(`addKeyListener: adding ${options.event} key ${options.key}`);
            config[options.event]['keys'][options.key] = options.handler;

        }

        if (options.code) {

            console.log(`addKeyListener: adding handler ${options.event} code ${options.code}`);
            config[options.event]['codes'][options.code] = options.handler;

        }

    }

    const keyboardManager = {
        addKeyListener
    }

    world.set('keyboardManager', keyboardManager);

    return keyboardManager;
}

export { Keyboard }