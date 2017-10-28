/**
 * Delegates DOM events for performance reasons
 */
export default (filter, cb) => {
    return function(e) {
        let el = e.target;
        do {
            if (!filter(e.target)) {
                continue;
            }
            e.delegateTarget = el;
            cb.apply(this, arguments);
            return;
        } while( (el = el.parentNode) );
    };
}
