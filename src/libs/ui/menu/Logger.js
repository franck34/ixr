import "ulog"
import anylogger from "anylogger";

//localStorage.setItem('log', 'info;test:*=debug')


function UIMenuLogger( context ) {
    
    /************************************************************************************************
     * Integrity check
     ***********************************************************************************************/

    console.assert(typeof context === 'object','context should be an object');

     /************************************************************************************************
     * Variables & constantes (locales)
     ***********************************************************************************************/

    const log = anylogger('UIMenuLogger');
    
    let keyboardManager;

    /************************************************************************************************
     * init
     ***********************************************************************************************/
     
    init();

    /************************************************************************************************
     * Private methods
     ***********************************************************************************************/

    function onKeyUp(delta, time, ev) {
        log.info('onKeyUp', ev);
    }

    function registerEvents() {
        
        keyboardManager.addKeyListener( { id:'KeyL', keyup:onKeyUp } );  

    }

    function init() {

        keyboardManager = context.get('keyboardManager');

        if ( !keyboardManager ) {

            console.warn('UIMenuLogger: failed to initialize: keyboardManager manager not found');
            return;

        } 
        
        // Note: keyboardManager handle install/remove events for XR enter/exit
        registerEvents();

    }

    /************************************************************************************************
     * Public methods
     ***********************************************************************************************/

    // No public methods yet


    return {

    }

}

export { UIMenuLogger }