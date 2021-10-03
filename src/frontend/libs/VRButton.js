class VRButton {

    constructor( renderer, options ) {

        this.renderer = renderer;

        if ( options !== undefined ) {

            this.onSessionStart = options.onSessionStart;
            this.onSessionEnd = options.onSessionEnd;
            this.sessionInit = options.sessionInit;
            this.sessionMode = ( options.inline !== undefined && options.inline ) ? 'inline' : 'immersive-vr';

        } else {

            this.sessionMode = 'immersive-vr';

        }
        
        if ( this.sessionInit === undefined ) {

            this.sessionInit = {
                optionalFeatures: [ 'local-floor', 'bounded-floor' ]
            };

        }

        this.options = options;

    }

    createButton() {

        const self = this;
		
        const button = document.createElement( 'button' );
        button.className = 'XRButton';

        function showEnterVR( /*device*/ ) {

            let currentSession = null;

            function onSessionStarted( refSpace ) {

                refSpace.addEventListener( 'end', onSessionEnded );
                self.renderer.xr.setSession( refSpace );
                button.textContent = 'EXIT VR';

                PubSub.publish( 'XREnter' );
                currentSession = refSpace;

                if ( self.onSessionStart !== undefined ) self.onSessionStart();

            }

            function onSessionEnded( /*event*/ ) {

                currentSession.removeEventListener( 'end', onSessionEnded );
                button.innerHTML = '<i class="fas fa-vr-cardboard"></i>';
                PubSub.publish( 'XRExit' );
                currentSession = null;

                if ( self.onSessionEnd !== undefined ) {
                    self.onSessionEnd();
                }

            }

            button.style.display = '';
            button.style.cursor = 'pointer';
            button.innerHTML = '<i class="fas fa-vr-cardboard"></i>';

            button.onclick = function () {

                if ( currentSession === null ) {

                    // WebXR's requestReferenceSpace only works if the corresponding feature
                    // was requested at session creation time. For simplicity, just ask for
                    // the interesting ones as optional features, but be aware that the
                    // requestReferenceSpace call will fail if it turns out to be unavailable.
                    // ('local' is always available for immersive sessions and doesn't need to
                    // be requested separately.)

                    const sessionInit = {
                        optionalFeatures: [ 'local-floor', 'bounded-floor', 'hand-tracking' ]
                    };
					
                    navigator.xr.requestSession( 'immersive-vr', sessionInit ).then( onSessionStarted );

                } else {

                    currentSession.end();

                }

            };

        }

        function disableButton() {

            button.style.display = '';
            button.style.cursor = 'auto';
            button.onmouseenter = null;
            button.onmouseleave = null;
            button.onclick = null;

        }

        function showWebXRNotFound() {

            disableButton();
            button.textContent = 'Optimized for Oculus Quest 2';

        }

        function testImmersiveResult( supported ) {

            if ( self.options.vrStatus ) {
                self.options.vrStatus( supported );
            }

            if ( supported ) {
                showEnterVR();
                return;
            }
			
            showWebXRNotFound();
        }

        function testXRBrowser() {

            if ( 'xr' in navigator ) {

                navigator
                    .xr
                    .isSessionSupported( 'immersive-vr' )
                    .then( testImmersiveResult );

                button.style.display = 'none';
                return button;

            }
			

            const message = document.createElement( 'a' );

            if ( window.isSecureContext === false ) {

                message.href = document.location.href.replace( /^http:/, 'https:' );
                message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message

            } else {

                message.href = 'https://immersiveweb.dev/';
                message.innerHTML = 'WEBXR NOT AVAILABLE';

            }

            message.style.textDecoration = 'none';

            return message;

        }

        return testXRBrowser();

    }

}

export { VRButton };
