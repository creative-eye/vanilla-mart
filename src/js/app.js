import 'babel-polyfill';

import '../scss/index.scss';

import events from './utils/events';
import MartCtrlView from './mart/views/mart-controller-view';
import MartCtrl from './mart/controllers/mart-controller';
import {
    EL_ADDED,
} from './mart/const/events';

/**
 * Entry point for all js on the page, should be kept as slim as possible
 */
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

/**
 * Start main view controller and the controllers for the page.
 */
function initApp() {
    new MartCtrlView();
    new MartCtrl();
}
