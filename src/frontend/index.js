//localStorage.setItem( 'log', 'info' );
//import 'ulog';

import '../../static/fonts/fontawesome-free-5.15.3-web/css/all.min.css';
import '../../static/css/main.css';

import { config as worldConfig } from './config/index.js';
import { World } from './libs/World.js';

new World( worldConfig );


