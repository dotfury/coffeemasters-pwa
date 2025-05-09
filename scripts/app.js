import Menu from './Menu.js';
import Order from './Order.js';
import Router from './Router.js';

// Request persistance storage
(async function() {
    if (navigator.storage && navigator.storage.persist) {
        if (!await navigator.storage.persisted()) {
            const result = await navigator.storage.persist();
            console.log(`The persistance request return: ${result}`);
        } else {
            console.log('already persisting')
        }
    }
})();

(async function() {
    if (navigator.storage && navigator.storage.estimate) {
        const q = await navigator.storage.estimate();
        console.log(`The storage available is ${q.quota/1024/1024}MiB`);
        console.log(`The storage used is: ${q.usage/1024}KiB`);
    }
})();

window.addEventListener("DOMContentLoaded", () => {
    Router.init();
    Menu.load();
    Order.load();
    Order.render();
 } );
