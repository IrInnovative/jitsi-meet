import { SET_ROOM } from '../base/conference';
import {
    CONNECTION_ESTABLISHED,
    getURLWithoutParams,
    SET_LOCATION_URL
} from '../base/connection';
import { MiddlewareRegistry } from '../base/redux';

MiddlewareRegistry.register(store => next => action => {
    switch (action.type) {
    case CONNECTION_ESTABLISHED:
        return _connectionEstablished(store, next, action);

    case SET_LOCATION_URL:
    case SET_ROOM:
        return _setLocationURLOrRoom(store, next, action);
    }

    return next(action);
});

/**
 * Notifies the feature app that the action {@link CONNECTION_ESTABLISHED} is
 * being dispatched within a specific redux {@code store}.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code CONNECTION_ESTABLISHED}
 * which is being dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The new state that is the result of the reduction of the
 * specified {@code action}.
 */
function _connectionEstablished(store, next, action) {
    const result = next(action);

    // In the Web app we explicitly do not want to display the hash and
    // query/search URL params. Unfortunately, window.location and, more
    // importantly, its params are used not only in jitsi-meet but also in
    // lib-jitsi-meet. Consequenlty, the time to remove the params is
    // determined by when no one needs them anymore.
    const { history, location } = window;

    if (history
            && location
            && history.length
            && typeof history.replaceState === 'function') {
        const replacement = getURLWithoutParams(location);

        if (location !== replacement) {
            history.replaceState(
                history.state,
                (document && document.title) || '',
                replacement);
        }
    }

    return result;
}

/**
 * Navigates to a route in accord with a specific redux state.
 *
 * @param {Object} state - The redux state which determines/identifies the route
 * to navigate to.
 * @private
 * @returns {void}
 */
function _navigate(state) {
    const { app, getRouteToRender } = state['features/app'];
    const routeToRender = getRouteToRender && getRouteToRender(state);

    app._navigate(routeToRender);
}

/**
 * Notifies the feature app that the action {@link SET_LOCATION_URL} or
 * {@link SET_ROOM} is being dispatched within a specific redux {@code store}.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code SET_LOCATION_URL} or
 * {@code SET_ROOM} which is being dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The new state that is the result of the reduction of the
 * specified {@code action}.
 */
function _setLocationURLOrRoom({ getState }, next, action) {
    const result = next(action);

    _navigate(getState());

    return result;
}
