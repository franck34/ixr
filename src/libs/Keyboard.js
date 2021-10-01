function Keyboard( world, config ) {

    if ( config.disable ) return;
    console.log( 'Keyboard', config );

    const allowedEvents = [ 'keyup', 'keydown' ];

    config.keydown = { };
    config.keyup = { };

    const status = { };
    let keyCount = 0;

    window.addEventListener( 'keydown', onKeyDown );
    window.addEventListener( 'keyup', onKeyUp );

    PubSub.subscribe( 'XREnter', disableLoopKeys );
    PubSub.subscribe( 'XRExit', enableLoopKeys );

    const renderer = world.get( 'renderer.main' );
    renderer.addRenderJob( loopKeys );

    function enableLoopKeys() {

        renderer.addRenderJob( loopKeys );

    }

    function disableLoopKeys() {

        renderer.removeRenderJob( loopKeys );

    }

    function loopKeys( delta, time ) {

        //console.log('loopKeys', Date.now(), status);
        keyCount = 0;

        for ( const k in status ) {

            status[ k ].since = delta;
            status[ k ].handler( delta, time, status[k].ev );
            status[ k ].consummed = true;
            delete status[ k ];

        }

    }

    function getConfigHandler( evName, ev ) {

        let handlers = config[ evName ][ ev.key ];

        if ( !handlers ) {

            handlers = config[ evName ][ ev.code ];

        }

        return handlers;

    }

    function onKeyDown( ev ) {

        ev.stopPropagation();

        const now = Date.now();
        
        let handler = getConfigHandler( 'keydown', ev );
        if ( !handler ) {
            //console.log('no handler', ev.key, ev.code)
            return;
        }

        const obj = { start: now, since: 0, ev, handler };

        let inserted = false;
        if ( !status[ev.key] || !status[ev.code] ) {
            status[ev.key] = obj;
            inserted = true;
        }
        
        if ( !status[ev.code] ) {
            status[ev.code] = obj;
            inserted = true;
        }
        
        if ( inserted ) {
            //console.log('onKeyDown', ev.key, ev.code);
        }

    }

    function onKeyUp( ev ) {

        ev.stopPropagation();

        let handler = getConfigHandler( 'keyup', ev );
        if ( !handler ) {
            return;
        }   
        
        //console.log( 'onKeyUp', ev.key, ev.code );

        handler( 0, 0, ev );

        delete status[ev.key];
        delete status[ev.code];

        return false;
    }

    function addKeyListener( options ) {

        if ( !options.id ) {
            throw new Error( 'addKeyListener: missing id (ev.code or ev.key)' );
        }

        let eventName;
        let handlerType;

        for ( eventName of allowedEvents ) {
            
            if ( !options[eventName] ) continue;

            handlerType = typeof options[eventName];
            if ( handlerType!= 'function' ) {
                throw new Error( `addKeyListener: event ${eventName}, expected a function, received ${handlerType}` );
            }

            //console.log( `addKeyListener: register event ${eventName} id=${options.id}` );
            config[eventName][options.id] = options[eventName];
        }

        return;

    }

    function removeKeyListeners( key ) {

        for ( eventName of allowedEvents ) {
            
            if ( !options[eventName] ) continue;
            //console.log( 'event', eventName );

            handlerType = typeof options[eventName];
            if ( handlerType!= 'function' ) {
                throw new Error( `addKeyListener: event ${eventName}, expected a function, received ${handlerType}` );
            }

            //console.log( `addKeyListener: register event ${eventName} id=${options.id}` );
            config[eventName][options.id] = options[eventName];
        }

    }

    const keyboardManager = {
        addKeyListener,
        //removeKeyListeners
    }

    world.set( 'keyboardManager', keyboardManager );

    return keyboardManager;
}

export { Keyboard }