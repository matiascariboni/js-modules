# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Additional utility modules
- TypeScript type definitions
- Unit tests for all modules
- Performance benchmarks

---

## [1.0.0] - 2025-12-12

### Added

#### ReactiveContext
- Deep reactive state management system based on ES6 Proxies
- Read event tracking for monitoring property access
- Write event tracking for monitoring property changes
- Automatic array mutation interception (push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin)
- Event system with specific and generic event patterns
- Support for nested object and array reactivity
- Methods: `createReactiveFields()`, `on()`, `off()`, `once()`, `removeAllListeners()`, `getRegisteredEvents()`, `getListenerCount()`, `hasListeners()`
- Warning system for object/array reassignment
- WeakMap-based proxy caching

#### DragToScrollOnPc
- Drag-to-scroll functionality for desktop browsers
- Automatic detection and disabling on touch/coarse-pointer devices
- Axis control (horizontal, vertical, or both)
- Inertial scrolling with customizable physics
- Smart velocity tracking with exponential smoothing
- Debounced spring effect after scroll stops
- Idle detection to skip inertia on stationary releases
- Recent movement window for intentional gesture detection
- Automatic cursor management (grab/grabbing)
- Click prevention after drag gestures
- Interactive element detection (links, buttons, inputs)
- Programmatic scrollbar hiding with restoration
- Shadow DOM support
- Pointer capture for reliable tracking
- Configurable options: `axis`, `desktopOnly`, `cancelClickOnDrag`, `dragThresholdPx`, `useInertia`, `inertiaDurationMs`, `inertiaMultiplier`, `minInertiaAmplitudePx`, `easingFriction`, `inertiaIdleTimeoutMs`, `recentWindowMs`, `minRecentTravelPx`, `setCursors`, `preventTextSelection`, `cursorGrab`, `cursorGrabbing`, `touchAction`, `interactiveSelector`, `hideScrollbars`
- `destroy()` method for cleanup

#### getCssValue
- CSS property value extraction from CSS strings
- Automatic type conversion (numbers vs strings)
- Case-insensitive property matching
- Returns `null` for non-existent properties
- Regex-based efficient parsing
- Handles numeric values with units (strips units and returns number)

#### replacer
- Template engine using HTML comment syntax (`<!--code-->`)
- JavaScript expression evaluation
- JavaScript statement execution
- Automatic detection of expressions vs statements
- Scoped variable access through data object
- Error handling with original comment preservation
- Undefined result handling
- Support for multi-line code blocks
- Strict mode execution for statements

#### TriggerSpring
- Intelligent scroll snap behavior using IntersectionObserver
- Automatic reveal/hide of trigger elements based on visibility
- Debounced spring effect after scroll stops
- Directional control (left or right edge snapping)
- Configurable offset for fine-tuned positioning
- Smooth native scrolling animation
- Callback execution when trigger is fully visible
- Automatic observer cleanup on page unload
- Multiple threshold monitoring (0, 0.05, 0.25, 0.5, 0.75, 1.0)
- Configurable options: `container`, `trigger`, `callback`, `direction`, `offset`, `delay`
- Input validation with descriptive error messages

#### Documentation
- Comprehensive README.md for each module
- Main project README.md with overview and quick start
- Code examples and real-world use cases
- API reference for all modules
- Browser compatibility information
- Troubleshooting guides
- Security considerations (especially for replacer)
- Tips and best practices
- Technical implementation details

#### Interactive Examples
- reactive-context-demo.html - Todo app demonstrating reactive state management
- drag-scroll-gallery.html - Image gallery with drag-to-scroll functionality
- get-css-value-inspector.html - CSS property extraction and inspection tool
- replacer-template.html - Dynamic card generator with multiple presets
- trigger-spring-demo.html - Pull-to-refresh implementation
- Examples README.md with usage instructions and troubleshooting

#### Project Structure
- MIT License
- Individual module folders with self-contained code
- ES6 module exports
- JSDoc comments for better IDE support
- Main index.js for convenient imports

---

## [0.0.0] - 2025-11-26

### Added
- Initial project structure
- Basic module scaffolding
- License file (MIT)

---

[Unreleased]: https://github.com/matiascariboni/js-modules/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/matiascariboni/js-modules/releases/tag/v1.0.0
[0.0.0]: https://github.com/matiascariboni/js-modules/releases/tag/v0.0.0