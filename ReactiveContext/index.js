/**
 * Array methods that mutate the array and should trigger events
 * @constant {string[]}
 */
const ARRAY_MUTATORS = [
    'push', 'pop', 'shift', 'unshift',
    'splice', 'sort', 'reverse', 'fill', 'copyWithin'
]

/**
 * Base class for creating reactive contexts with event-driven state management.
 *
 * Reactive fields emit events when their values are read or changed. Objects
 * and arrays can be reassigned at any level, but doing so will remove their
 * nested reactivity (a warning will be logged).
 *
 * @example Basic usage
 * class AppContext extends ReactiveContext {
 *     constructor() {
 *         super()
 *         this.createReactiveFields({
 *             state: {
 *                 count: 0,
 *                 user: { name: '', authenticated: false }
 *             },
 *             items: []
 *         })
 *     }
 * }
 *
 * const ctx = new AppContext()
 *
 * // Listening to reads
 * ctx.on('state:count:read', (data) => {
 *     console.log(`Count was read: ${data.value}`)
 * })
 *
 * // Listening to changes
 * ctx.on('state:count:change', (data) => {
 *     console.log(`Count: ${data.old_value} → ${data.new_value}`)
 * })
 *
 * // Primitive read (emit event)
 * const x = ctx.state.count              // ✅ Emits 'state:count:read' and 'state:read'
 *
 * // Primitive changes (emit events)
 * ctx.state.count = 5                    // ✅ Emits 'state:count:change' and 'state:change'
 * ctx.state.user.name = 'John'           // ✅ Emits 'state.user:name:change' and 'state.user:change'
 *
 * // Array mutations (emit events)
 * ctx.items.push('new item')             // ✅ Emits 'items:change'
 * ctx.items[0] = 'modified'              // ✅ Emits 'items:0:change' and 'items:change'
 *
 * // Object/array reassignment (allowed with warning, loses nested reactivity)
 * ctx.state.user = { name: 'Jane' }      // ⚠️ Warning + emits event
 */
export class ReactiveContext {
    #listeners = {}
    #proxy_cache = new WeakMap()
    #fields = {}

    /**
     * Creates reactive fields that emit events on reads and changes.
     *
     * @param {Object} definitions - Object mapping field names to initial values
     * @throws {TypeError} If a field name already exists on the instance
     *
     * @example
     * this.createReactiveFields({
     *     state: { count: 0, loading: false },
     *     user: { profile: { name: '', avatar: null } },
     *     tags: []
     * })
     */
    createReactiveFields(definitions) {
        for (const [field_name, initial_value] of Object.entries(definitions)) {
            if (Object.prototype.hasOwnProperty.call(this, field_name)) {
                throw new TypeError(`Field '${field_name}' already exists`)
            }

            this.#fields[field_name] = this.#createReactive(initial_value, field_name)

            Object.defineProperty(this, field_name, {
                get: () => this.#fields[field_name],
                set: (new_value) => {
                    const old_value = this.#fields[field_name]

                    if (old_value !== null && old_value !== undefined && typeof old_value === 'object') {
                        const type = Array.isArray(old_value) ? 'array' : 'object'
                        console.warn(
                            `⚠️ Reassigning root ${type} '${field_name}' removes its reactivity. ` +
                            `Consider modifying its properties instead.`
                        )
                    }

                    this.#fields[field_name] = this.#createReactive(new_value, field_name)

                    this.#emit(`${field_name}:change`, {
                        prop: field_name,
                        old_value,
                        new_value,
                        timestamp: Date.now()
                    })
                },
                enumerable: true,
                configurable: false
            })
        }
    }

    /**
     * Creates a deeply reactive proxy for an object or array.
     *
     * @private
     * @param {Object|Array} target - Value to make reactive
     * @param {string} namespace - Event namespace for this level
     * @returns {Proxy|*} Reactive proxy for objects/arrays, original value for primitives
     */
    #createReactive(target, namespace) {
        if (target === null || typeof target !== 'object') {
            return target
        }

        if (this.#proxy_cache.has(target)) {
            return this.#proxy_cache.get(target)
        }

        const proxy = new Proxy(target, {
            get: (obj, prop) => {
                const value = obj[prop]

                if (Array.isArray(obj) && ARRAY_MUTATORS.includes(prop)) {
                    return (...args) => {
                        const result = Array.prototype[prop].apply(obj, args)

                        this.#emit(`${namespace}:change`, {
                            method: prop,
                            args,
                            length: obj.length,
                            timestamp: Date.now()
                        })

                        return result
                    }
                }

                if (value !== null && typeof value === 'object') {
                    return this.#createReactive(value, `${namespace}.${prop}`)
                }

                // Emit read events for primitive values
                if (typeof prop === 'string' && !prop.startsWith('_')) {
                    this.#emit(`${namespace}:${prop}:read`, {
                        prop,
                        value,
                        timestamp: Date.now()
                    })

                    this.#emit(`${namespace}:read`, {
                        prop,
                        value,
                        timestamp: Date.now()
                    })
                }

                return value
            },

            set: (obj, prop, new_value) => {
                const old_value = obj[prop]

                if (old_value !== null && old_value !== undefined && typeof old_value === 'object') {
                    const type = Array.isArray(old_value) ? 'array' : 'object'
                    console.warn(
                        `⚠️ Reassigning ${type} '${prop}' removes its reactivity. ` +
                        `Consider modifying its properties instead.`
                    )
                }

                obj[prop] = new_value

                this.#emit(`${namespace}:${prop}:change`, {
                    prop,
                    old_value,
                    new_value,
                    timestamp: Date.now()
                })

                this.#emit(`${namespace}:change`, {
                    prop,
                    old_value,
                    new_value,
                    timestamp: Date.now()
                })

                return true
            }
        })

        this.#proxy_cache.set(target, proxy)

        return proxy
    }

    /**
     * Emits an event to all registered listeners.
     *
     * @private
     * @param {string} event - Event name
     * @param {*} data - Data to pass to listeners
     */
    #emit(event, data) {
        if (!this.#listeners[event]) return

        for (const callback of this.#listeners[event]) {
            try {
                callback(data, this)
            } catch (error) {
                console.error(`Error in listener for "${event}":`, error)
            }
        }
    }

    /**
     * Registers an event listener.
     *
     * @param {string} event - Event name (e.g., 'state:count:change', 'state:count:read')
     * @param {Function} callback - Handler receiving (data, context) parameters
     * @returns {Function} Cleanup function to unregister the listener
     *
     * @example Specific property change listener
     * const cleanup = ctx.on('state:count:change', (data, context) => {
     *     console.log(`Count: ${data.old_value} → ${data.new_value}`)
     * })
     *
     * cleanup() // Remove listener
     *
     * @example Specific property read listener
     * ctx.on('state:count:read', (data) => {
     *     console.log(`Count was read: ${data.value}`)
     * })
     *
     * @example Generic namespace listener
     * ctx.on('state:change', (data) => {
     *     console.log(`Property '${data.prop}' changed`)
     * })
     *
     * @example Array listener
     * ctx.on('items:change', (data) => {
     *     if (data.method) {
     *         console.log(`Array.${data.method}() called`)
     *     }
     * })
     */
    on(event, callback) {
        if (!this.#listeners[event]) {
            this.#listeners[event] = []
        }

        this.#listeners[event].push(callback)

        return () => this.off(event, callback)
    }

    /**
     * Removes a specific event listener.
     *
     * @param {string} event - Event name
     * @param {Function} callback - Handler function to remove
     *
     * @example
     * const handler = (data) => console.log(data)
     * ctx.on('state:change', handler)
     * ctx.off('state:change', handler)
     */
    off(event, callback) {
        if (!this.#listeners[event]) return

        const index = this.#listeners[event].indexOf(callback)

        if (index > -1) {
            this.#listeners[event].splice(index, 1)
        }
    }

    /**
     * Registers a one-time listener that removes itself after execution.
     *
     * @param {string} event - Event name
     * @param {Function} callback - Handler function
     * @returns {Function} Cleanup function
     *
     * @example
     * ctx.once('state:ready:change', (data) => {
     *     console.log('State ready for the first time')
     * })
     */
    once(event, callback) {
        const wrapper = (data, ctx) => {
            callback(data, ctx)
            this.off(event, wrapper)
        }

        return this.on(event, wrapper)
    }

    /**
     * Removes all listeners for an event, or all listeners entirely.
     *
     * @param {string|null} [event=null] - Event name, or null for all
     *
     * @example
     * ctx.removeAllListeners('state:change') // Specific event
     * ctx.removeAllListeners()               // All events
     */
    removeAllListeners(event = null) {
        if (event) {
            this.#listeners[event] = []
        } else {
            this.#listeners = {}
        }
    }

    /**
     * Gets all event names with registered listeners.
     *
     * @returns {string[]} Array of event names
     */
    getRegisteredEvents() {
        return Object.keys(this.#listeners)
    }

    /**
     * Gets the listener count for an event.
     *
     * @param {string} event - Event name
     * @returns {number} Number of listeners
     */
    getListenerCount(event) {
        return this.#listeners[event]?.length ?? 0
    }

    /**
     * Checks if an event has listeners.
     *
     * @param {string} event - Event name
     * @returns {boolean} True if listeners exist
     */
    hasListeners(event) {
        return this.getListenerCount(event) > 0
    }
}