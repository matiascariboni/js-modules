export default class TriggerSpring {
  constructor(opts) {

    opts = {
      direction: 'left',
      offset: 0,
      delay: 500,
      ...opts
    }

    if (opts.container && !(opts.container instanceof HTMLElement)) {
      throw new Error('TriggerSpring: a valid HTMLElement container is required.')
    }
    if (!(opts.trigger instanceof HTMLElement)) {
      throw new Error('TriggerSpring: a valid HTMLElement trigger is required.')
    }
    if (typeof opts.callback != 'function') {
      throw new Error('TriggerSpring: a valid callback function is required.')
    }
    if (!['left', 'right'].includes(opts.direction)) {
      throw new Error('Direction must be "left" or "right"')
    }
    if (!Number.isInteger(opts.offset)) {
      throw new Error('Offset must be a number')
    }

    this.callback = opts.callback
    this.container = opts.container
    this.scroll_target = opts.target
    this.direction = opts.direction
    this.offset = opts.offset
    this.starting = true

    // Debounce of spring after scroll by 1 sec
    this.spring_push = this.#debounce(() => {
      const container_rect = this.container.getBoundingClientRect()
      const target_rect = this.scroll_target.getBoundingClientRect()
      const relative_left = target_rect.left - container_rect.left + this.container.scrollLeft

      let target_scroll_left

      if (this.direction == 'left') {
        target_scroll_left = relative_left + this.offset
      } else if (this.direction == 'right') {
        const container_width = this.container.clientWidth
        const target_width = this.scroll_target.offsetWidth
        target_scroll_left = relative_left - container_width + target_width + this.offset
      }

      this.container.scrollTo({
        left: Math.max(0, target_scroll_left),
        behavior: 'smooth'
      })
    }, opts.delay)

    const thresholds = [0, 0.05, 0.25, 0.5, 0.75, 1.0]

    const observer = new IntersectionObserver(this.#callbacks, {
      root: opts.container,
      rootMargin: `${opts.offset}px`,
      threshold: thresholds
    })

    observer.observe(opts.trigger)

    //Cleanup
    window.addEventListener('beforeunload', () => { observer.disconnect() })
  }

  #callbacks = (entries) => {
    const entry = entries[0]

    if (
      (entry.intersectionRatio < 1 && entry.intersectionRatio != 0) ||
      (this.starting && entry.intersectionRatio == 1)
    ) {
      // Case user stopped scroll and trigger is not fully viewed, push the scroll to hide the trigger
      this.spring_push()
      this.starting = false
    } else if (!entry.isIntersecting) {
      // Case user partially showed trigger element but immediatly hide it
      this.spring_push.cancel()
    } else if (entry.intersectionRatio == 1) {
      // Case trigger is fully viewed, cancel immediatly the last spring_push
      this.spring_push.cancel()
      this.callback()
    }
  }

  #debounce(func, delay) {
    let timeout_id

    const debounced_fn = function (...args) {
      clearTimeout(timeout_id)
      timeout_id = setTimeout(() => func.apply(this, args), delay)
    }

    debounced_fn.cancel = function () {
      clearTimeout(timeout_id)
      timeout_id = null
    }

    return debounced_fn
  }
}

