function Keyboard(world, config) {

    console.log('Keyboard', config);

    
    const handlers = {};
    handlers.currentSceneToggleWireframe = currentSceneToggleWireframe;
    window.addEventListener('keydown', onKeyDown);


    function currentSceneToggleWireframe(ev) {
        
        world.get('scene.main').toggleWireframe();

    }

    function onKeyDown(ev) {

        console.log('onKeyDown', ev.key, ev.code);
        const handlerConfig = config.keys[ev.key] || config.code[ev.code];
        if (!handlerConfig) return;

        const handlerName = handlerConfig.action;

        const handler = handlers[handlerName];
        if (!handler) {
            console.warn(`onKeyDown: undefined handler ${handlerName}`);
        }

        handler(ev);
    }

    function addKeyListener(options, handler) {
        if (options.key) {
            config[options.key] = handler;
        }
        if (options.code) {
            config[options.code] = handler;
        }
    }

    return {
        addKeyListener
    }
}

export { Keyboard }