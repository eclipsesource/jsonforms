import * as installCE from 'document-register-element/pony';
import 'jsdom-global/register';
declare let global;
installCE(global, 'force');
