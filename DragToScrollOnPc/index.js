/**
 * @class DragToScrollOnPC
 * @classdesc Drag into a container on pc as could do it in a mobile
 * @author Matías Cariboni
 * @version 1.0.0
 * @since 1.0.0
 * @typedef {Object} DragToScrollOptions
 * @property {'x'|'y'|'both'} [axis='both'] Limit dragging to one axis or both.
 * @property {boolean} [desktopOnly=true] If true, do nothing on touch/coarse-pointer devices.
 * @property {boolean} [cancelClickOnDrag=true] Prevent clicks after a drag gesture.
 * @property {number} [dragThresholdPx=3] Distance (px) before we consider it a drag.
 * @property {boolean} [useInertia=true] Enable inertial scrolling on release.
 * @property {number} [inertiaDurationMs=600] Duration of the inertia animation in ms.
 * @property {number} [inertiaMultiplier=600] Multiplier for velocity -> travel distance (px = px/ms * multiplier).
 * @property {number} [minInertiaAmplitudePx=5] Minimum travel (px) to start inertia.
 * @property {number} [easingFriction=6] Exponential friction coefficient (higher = stops sooner).
 * @property {number} [inertiaIdleTimeoutMs=150] If the pointer has been idle for ≥ this time (ms) before release, skip inertia.
 * @property {number} [recentWindowMs=300] Lookback window (ms) to measure recent displacement before release.
 * @property {number} [minRecentTravelPx=10] Minimum net travel (px) within the lookback window to allow inertia.
 * @property {boolean} [setCursors=true] Toggle grab/grabbing cursors while dragging.
 * @property {boolean} [preventTextSelection=true] Temporarily disable user selection while dragging.
 * @property {string}  [cursorGrab='grab'] CSS cursor when idle.
 * @property {string}  [cursorGrabbing='grabbing'] CSS cursor while dragging.
 * @property {string}  [touchAction='pan-x pan-y'] Applied to element to avoid conflicts on Pointer Events.
 * @property {string}  [interactiveSelector='a,button,input,textarea,select,[contenteditable],[draggable="true"]']
 * Elements that should not initiate drag when pressed.
 * @property {boolean} [hideScrollbars=true] Hide scrollbars while the module is active and restore on destroy().
 */

export default class DragToScrollOnPC {
  /**
   * @param {HTMLElement} element The scrollable container.
   * @param {DragToScrollOptions} [options] Optional configuration.
   */
  constructor(element, options = {}) {
    if (!element || !(element instanceof HTMLElement)) {
      throw new Error('DragToScrollOnPC: a valid HTMLElement is required.');
    }

    /** @type {DragToScrollOptions} */
    this.opts = {
      axis: 'both',
      desktopOnly: true,
      cancelClickOnDrag: true,
      dragThresholdPx: 3,
      useInertia: true,
      inertiaDurationMs: 600,
      inertiaMultiplier: 600,
      minInertiaAmplitudePx: 5,
      easingFriction: 6,
      inertiaIdleTimeoutMs: 150,
      recentWindowMs: 300,
      minRecentTravelPx: 10,
      setCursors: true,
      preventTextSelection: true,
      cursorGrab: 'grab',
      cursorGrabbing: 'grabbing',
      touchAction: 'pan-x pan-y',
      interactiveSelector:
        'a,button,input,textarea,select,[contenteditable],[draggable="true"]',
      hideScrollbars: true,
      ...options,
    };

    this.el = element;

    // Early exit on touch / coarse pointer if desktopOnly.
    this.isCoarsePointer =
      (typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(pointer: coarse)').matches) ||
      (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);

    if (this.opts.desktopOnly && this.isCoarsePointer) {
      this._noop = true;
      return;
    }

    // Internal state
    this.isDown = false;
    this.dragged = false;
    this.startX = 0;
    this.startY = 0;
    this.startScrollLeft = 0;
    this.startScrollTop = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.lastT = 0;
    this.velocityX = 0; // px/ms
    this.velocityY = 0; // px/ms
    this._rafId = null;

    // Recent moves buffer (per gesture)
    this._recentMoves = []; // items: { t, x, y }

    // Style preparation
    this._origCursor = this.el.style.cursor;
    this._origUserSelect = this.el.style.userSelect;
    this._origTouchAction = this.el.style.touchAction;

    if (this.opts.setCursors) {
      this.el.style.cursor = this.opts.cursorGrab;
    }
    if (this.opts.touchAction) {
      this.el.style.touchAction = this.opts.touchAction;
    }

    // --- Hide scrollbars (programmatic, restored on destroy) ---
    this._origScrollbarWidth = this.el.style.scrollbarWidth;  // Firefox
    this._origMsOverflowStyle = this.el.style.msOverflowStyle; // Legacy IE/Edge

    if (this.opts.hideScrollbars) {
      // Inline properties for Firefox / legacy IE
      this.el.style.scrollbarWidth = 'none';
      this.el.style.msOverflowStyle = 'none';

      // For WebKit (Chrome/Edge/Safari), inject a style with ::-webkit-scrollbar rule.
      // We scope it to a class we add to this element.
      this._hideClass = DragToScrollOnPC._getOrCreateHideClass(this._getRootNode());
      this.el.classList.add(this._hideClass);
    }

    // Event bindings
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUpLike = this._onPointerUpLike.bind(this);
    this._onClickCapture = this._onClickCapture.bind(this);

    this.el.addEventListener('pointerdown', this._onPointerDown);
    this.el.addEventListener('pointermove', this._onPointerMove);
    this.el.addEventListener('pointerup', this._onPointerUpLike);
    this.el.addEventListener('pointercancel', this._onPointerUpLike);
    this.el.addEventListener('mouseleave', this._onPointerUpLike);

    if (this.opts.cancelClickOnDrag) {
      this.el.addEventListener('click', this._onClickCapture, true);
    }
  }

  /**
   * Remove all listeners and restore original styles.
   */
  destroy() {
    if (this._noop) return;

    this.el.removeEventListener('pointerdown', this._onPointerDown);
    this.el.removeEventListener('pointermove', this._onPointerMove);
    this.el.removeEventListener('pointerup', this._onPointerUpLike);
    this.el.removeEventListener('pointercancel', this._onPointerUpLike);
    this.el.removeEventListener('mouseleave', this._onPointerUpLike);
    if (this.opts.cancelClickOnDrag) {
      this.el.removeEventListener('click', this._onClickCapture, true);
    }

    // Restore styles
    if (this.opts.setCursors) {
      this.el.style.cursor = this._origCursor;
    }
    if (this.opts.preventTextSelection) {
      this.el.style.userSelect = this._origUserSelect;
    }
    if (this.opts.touchAction) {
      this.el.style.touchAction = this._origTouchAction;
    }

    if (this.opts.hideScrollbars) {
      this.el.style.scrollbarWidth = this._origScrollbarWidth;
      this.el.style.msOverflowStyle = this._origMsOverflowStyle;
      if (this._hideClass) {
        this.el.classList.remove(this._hideClass);
        // Optional: if no elements still use the class in this root, we could remove the <style>.
        // We keep the style for reuse to avoid churn.
      }
    }

    this._cancelRaf();
    this.dragged = false;
    this._recentMoves.length = 0;
  }

  /** @param {PointerEvent} e */
  _onPointerDown(e) {
    // Only primary button for mouse; allow pen as well.
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    // Ignore interactive targets (links, inputs, etc.)
    if (
      this.opts.interactiveSelector &&
      e.target instanceof Element &&
      e.target.closest(this.opts.interactiveSelector)
    ) {
      return;
    }

    this.isDown = true;
    this.dragged = false;

    if (this.opts.setCursors) {
      this.el.style.cursor = this.opts.cursorGrabbing;
    }
    if (this.opts.preventTextSelection) {
      this.el.style.userSelect = 'none';
    }

    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startScrollLeft = this.el.scrollLeft;
    this.startScrollTop = this.el.scrollTop;

    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.lastT = e.timeStamp;
    this.velocityX = 0;
    this.velocityY = 0;

    // Reset recent moves buffer for this gesture
    this._recentMoves.length = 0;
    this._recentMoves.push({ t: e.timeStamp, x: e.clientX, y: e.clientY });

    this.el.setPointerCapture?.(e.pointerId);
    // Prevent native image drag/selection
    e.preventDefault();
  }

  /** @param {PointerEvent} e */
  _onPointerMove(e) {
    if (!this.isDown) return;

    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;

    if (!this.dragged) {
      const dist2 = dx * dx + dy * dy;
      if (dist2 > this.opts.dragThresholdPx * this.opts.dragThresholdPx) {
        this.dragged = true;
      }
    }

    // Apply scroll in opposite direction to the drag
    if (this.opts.axis === 'x' || this.opts.axis === 'both') {
      this.el.scrollLeft = this.startScrollLeft - dx;
    }
    if (this.opts.axis === 'y' || this.opts.axis === 'both') {
      this.el.scrollTop = this.startScrollTop - dy;
    }

    // Velocity estimation (px/ms) with simple smoothing
    const dt = e.timeStamp - this.lastT;
    if (dt > 0) {
      const instVX = (e.clientX - this.lastX) / dt;
      const instVY = (e.clientY - this.lastY) / dt;
      this.velocityX = 0.8 * this.velocityX + 0.2 * instVX;
      this.velocityY = 0.8 * this.velocityY + 0.2 * instVY;
    }
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.lastT = e.timeStamp;

    // Track recent moves (prune outside window)
    this._recentMoves.push({ t: e.timeStamp, x: e.clientX, y: e.clientY });
    const cutoff = e.timeStamp - this.opts.recentWindowMs;
    while (this._recentMoves.length && this._recentMoves[0].t < cutoff) {
      this._recentMoves.shift();
    }
  }

  /** @param {PointerEvent|MouseEvent} e */
  _onPointerUpLike(e) {
    if (!this.isDown) return;
    this.isDown = false;

    if (e instanceof PointerEvent) {
      this.el.releasePointerCapture?.(e.pointerId);
    }

    if (this.opts.setCursors) {
      this.el.style.cursor = this.opts.cursorGrab;
    }
    if (this.opts.preventTextSelection) {
      this.el.style.userSelect = this._origUserSelect;
    }

    if (this.dragged && this.opts.useInertia) {
      // Idle-time and recent-travel guards
      const idleMs =
        (typeof e.timeStamp === 'number' ? e.timeStamp : performance.now()) -
        this.lastT;
      const idleTooLong = idleMs >= this.opts.inertiaIdleTimeoutMs;

      let recentTravel = 0;
      if (this._recentMoves.length >= 2) {
        const first = this._recentMoves[0];
        const last = this._recentMoves[this._recentMoves.length - 1];
        const dx = last.x - first.x;
        const dy = last.y - first.y;
        if (this.opts.axis === 'x') recentTravel = Math.abs(dx);
        else if (this.opts.axis === 'y') recentTravel = Math.abs(dy);
        else recentTravel = Math.hypot(dx, dy);
      }
      const tooLittleRecentTravel =
        recentTravel < this.opts.minRecentTravelPx;

      if (!idleTooLong && !tooLittleRecentTravel) {
        this._applyInertia();
      }
    }

    // Cleanup gesture-specific state
    this.dragged = false;
    this._recentMoves.length = 0;
  }

  /** @param {MouseEvent} e */
  _onClickCapture(e) {
    if (this.dragged) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.dragged = false;
  }

  _cancelRaf() {
    if (this._rafId != null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  _applyInertia() {
    const {
      inertiaDurationMs,
      inertiaMultiplier,
      minInertiaAmplitudePx,
      easingFriction,
      axis,
    } = this.opts;

    const initialLeft = this.el.scrollLeft;
    const initialTop = this.el.scrollTop;
    const maxLeft = Math.max(0, this.el.scrollWidth - this.el.clientWidth);
    const maxTop = Math.max(0, this.el.scrollHeight - this.el.clientHeight);

    const amplitudeX = this.velocityX * inertiaMultiplier; // px
    const amplitudeY = this.velocityY * inertiaMultiplier; // px

    const shouldX =
      (axis === 'x' || axis === 'both') &&
      Math.abs(amplitudeX) >= minInertiaAmplitudePx &&
      maxLeft > 0;

    const shouldY =
      (axis === 'y' || axis === 'both') &&
      Math.abs(amplitudeY) >= minInertiaAmplitudePx &&
      maxTop > 0;

    if (!shouldX && !shouldY) return;

    const targetLeft = shouldX
      ? clamp(initialLeft - amplitudeX, 0, maxLeft)
      : initialLeft;
    const targetTop = shouldY
      ? clamp(initialTop - amplitudeY, 0, maxTop)
      : initialTop;

    const start = performance.now();

    const step = (now) => {
      const t = (now - start) / inertiaDurationMs;
      if (t >= 1) {
        if (shouldX) this.el.scrollLeft = targetLeft;
        if (shouldY) this.el.scrollTop = targetTop;
        this._rafId = null;
        return;
      }
      const ease = Math.exp(-easingFriction * t); // exponential ease-out

      if (shouldX) {
        this.el.scrollLeft = targetLeft + (initialLeft - targetLeft) * ease;
      }
      if (shouldY) {
        this.el.scrollTop = targetTop + (initialTop - targetTop) * ease;
      }

      this._rafId = requestAnimationFrame(step);
    };

    this._cancelRaf();
    this._rafId = requestAnimationFrame(step);

    function clamp(v, min, max) {
      return v < min ? min : v > max ? max : v;
    }
  }

  // --- Utilities for style injection ---

  /** Returns the node to inject styles into (Document or ShadowRoot). */
  _getRootNode() {
    const root = this.el.getRootNode ? this.el.getRootNode() : document;
    return root;
  }

  /**
   * Ensure a hide-scrollbar style exists in the given root and return the class name to use.
   * We generate a unique class per root, inject a <style> with the ::-webkit-scrollbar rule,
   * and reuse it for subsequent instances in the same root (Document or ShadowRoot).
   * @param {Document|ShadowRoot} root
   * @returns {string} className to add to the element
   */
  static _getOrCreateHideClass(root) {
    if (!this._styleRegistry) this._styleRegistry = new WeakMap();

    let entry = this._styleRegistry.get(root);
    if (entry) return entry.className;

    const className = 'd2s-hide-scrollbar';
    const styleEl = (root instanceof ShadowRoot)
      ? document.createElement('style') // must be created in document, then appended to shadow
      : document.createElement('style');

    styleEl.type = 'text/css';
    styleEl.textContent =
      `
.${className} {
  scrollbar-width: none;      /* Firefox */
  -ms-overflow-style: none;   /* IE 10+ */
}
.${className}::-webkit-scrollbar {
  display: none;              /* Chrome/Safari/WebKit */
}
`.trim();

    // Append into the proper place
    if (root instanceof ShadowRoot) {
      root.appendChild(styleEl);
    } else {
      (root.head || root.documentElement || root).appendChild(styleEl);
    }

    this._styleRegistry.set(root, { className, styleEl });
    return className;
  }
}
