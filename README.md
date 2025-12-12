# js-modules

A collection of lightweight, zero-dependency JavaScript utilities and tools for modern web development. Each module is designed to solve specific problems with clean APIs and excellent developer experience.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-yellow.svg)](http://vanilla-js.com/)
[![ES6+](https://img.shields.io/badge/ES6+-Supported-green.svg)](https://www.ecma-international.org/)
[![Maintained](https://img.shields.io/badge/Maintained-Yes-brightgreen.svg)](https://github.com/matiascariboni/js-modules)

---

## 📦 Available Modules

### [ReactiveContext](./ReactiveContext)
A lightweight reactive state management system built on ES6 Proxies with event-driven architecture.

**Key Features:**
- Deep reactivity with automatic change tracking
- Read event tracking for lazy loading and analytics
- Event-driven pub/sub pattern
- Array mutation interception
- ~200 lines, zero dependencies

[📖 Full Documentation](./ReactiveContext/README.md)

---

### [DragToScrollOnPc](./DragToScrollOnPc)
Enable drag-to-scroll behavior on desktop browsers, mimicking mobile touch scrolling.

**Key Features:**
- Desktop-first with automatic touch device detection
- Smooth inertial scrolling with momentum
- Axis control (horizontal, vertical, or both)
- Smart cursor changes and click prevention
- Auto-hide scrollbars with cleanup

[📖 Full Documentation](./DragToScrollOnPc/README.md)

---

### [getCssValue](./getCssValue)
Extract and parse CSS property values from CSS strings with automatic type conversion.

**Key Features:**
- Automatic number conversion
- Case-insensitive matching
- Returns null for missing properties
- Ultra lightweight (~10 lines)

[📖 Full Documentation](./getCssValue/README.md)

---

### [replacer](./replacer)
A lightweight template engine that evaluates JavaScript expressions embedded in HTML comments.

**Key Features:**
- Simple `<!--code-->` syntax
- Expression and statement evaluation
- Scoped variable access
- Safe fallback on errors
- Perfect for dynamic HTML generation

[📖 Full Documentation](./replacer/README.md)

---

### [TriggerSpring](./TriggerSpring)
Intelligent scroll snap controller that automatically reveals or hides elements based on visibility.

**Key Features:**
- Smart snap behavior using IntersectionObserver
- Debounced spring effect
- Directional control (left/right)
- Smooth native scrolling
- Auto cleanup

[📖 Full Documentation](./TriggerSpring/README.md)

---

## 🚀 Installation

### Clone the Repository

```bash
git clone https://github.com/matiascariboni/js-modules.git
cd js-modules
```

### Use Individual Modules

Each module is standalone and can be used independently:

```javascript
// Import as ES6 module
import { ReactiveContext } from './js-modules/ReactiveContext/index.js'
import DragToScrollOnPc from './js-modules/DragToScrollOnPc/index.js'
import { getCssValue } from './js-modules/getCssValue/index.js'
import { replacer } from './js-modules/replacer/index.js'
import TriggerSpring from './js-modules/TriggerSpring/index.js'
```

### Copy What You Need

Since each module is self-contained, you can simply copy the folder you need into your project:

```bash
cp -r js-modules/ReactiveContext ./src/modules/
```

---

## 📖 Quick Start Examples

### ReactiveContext

```javascript
import { ReactiveContext } from './ReactiveContext/index.js'

class AppContext extends ReactiveContext {
    constructor() {
        super()
        this.createReactiveFields({
            state: { count: 0 }
        })
    }
}

const ctx = new AppContext()
ctx.on('state:count:change', (data) => {
    console.log(`Count changed: ${data.new_value}`)
})
ctx.state.count = 5  // Triggers event
```

### DragToScrollOnPc

```javascript
import DragToScrollOnPc from './DragToScrollOnPc/index.js'

const container = document.querySelector('.gallery')
const dragger = new DragToScrollOnPc(container, {
    axis: 'x',
    useInertia: true
})
```

### getCssValue

```javascript
import { getCssValue } from './getCssValue/index.js'

const css = 'width: 300px; color: blue;'
getCssValue(css, 'width')  // 300
getCssValue(css, 'color')  // "blue"
```

### replacer

```javascript
import { replacer } from './replacer/index.js'

const template = '<div>Hello, <!--name-->!</div>'
const html = replacer(template, { name: 'Alice' })
// Result: '<div>Hello, Alice!</div>'
```

### TriggerSpring

```javascript
import TriggerSpring from './TriggerSpring/index.js'

new TriggerSpring({
    container: document.querySelector('.slider'),
    trigger: document.querySelector('.slide'),
    callback: () => console.log('Slide fully visible!')
})
```

---

## 🎨 Interactive Examples

Want to see the modules in action? Check out the [examples directory](./examples) with fully functional demos:

- **[reactive-context-demo.html](./examples/reactive-context-demo.html)** - Todo app with real-time reactivity
- **[drag-scroll-gallery.html](./examples/drag-scroll-gallery.html)** - Image gallery with smooth drag scrolling
- **[get-css-value-inspector.html](./examples/get-css-value-inspector.html)** - CSS property inspector tool
- **[replacer-template.html](./examples/replacer-template.html)** - Dynamic card generator with templates
- **[trigger-spring-demo.html](./examples/trigger-spring-demo.html)** - Pull-to-refresh demo

Each example is a complete, standalone HTML file. Just open them in your browser to try them out!

[📖 View Examples Documentation](./examples/README.md)

---

## 🔧 Browser Support

All modules are built with modern JavaScript and require ES6+ support:

### Required Features
- ES6 Modules (`import`/`export`)
- ES6 Classes
- Arrow Functions
- Template Literals
- Destructuring
- Spread Operator

### Module-Specific Requirements

| Module | Additional Requirements |
|--------|------------------------|
| ReactiveContext | `Proxy`, `WeakMap`, Private fields (`#`) |
| DragToScrollOnPc | Pointer Events API, `requestAnimationFrame` |
| getCssValue | None (pure ES6) |
| replacer | `Function` constructor, `RegExp` |
| TriggerSpring | IntersectionObserver API |

### Supported Browsers

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 72+ |
| Firefox | 90+ |
| Safari | 14.1+ |
| Edge | 79+ |

**Note:** Internet Explorer is not supported.

---

## 📁 Project Structure

```
js-modules/
├── ReactiveContext/
│   ├── index.js
│   └── README.md
├── DragToScrollOnPc/
│   ├── index.js
│   └── README.md
├── getCssValue/
│   ├── index.js
│   └── README.md
├── replacer/
│   ├── index.js
│   └── README.md
├── TriggerSpring/
│   ├── index.js
│   └── README.md
├── examples/
│   ├── reactive-context-demo.html
│   ├── drag-scroll-gallery.html
│   ├── get-css-value-inspector.html
│   ├── replacer-template.html
│   ├── trigger-spring-demo.html
│   └── README.md
├── index.js           # Main export file (exports all modules)
├── LICENSE
├── README.md
└── CHANGELOG.md
```

---

## 🎯 Design Philosophy

### Zero Dependencies
All modules are built with vanilla JavaScript and have no external dependencies. This ensures:
- Minimal bundle size
- No dependency conflicts
- Easy integration into any project
- Long-term maintainability

### ES6+ Only
We embrace modern JavaScript features without polyfills or transpilation:
- Clean, readable code
- Native performance
- Smaller file sizes
- Forward compatibility

### Self-Contained Modules
Each module is completely independent:
- Use individually without importing others
- No shared state between modules
- Copy-paste friendly
- Tree-shakeable when bundled

### Developer Experience
APIs are designed to be intuitive and predictable:
- Clear, consistent naming
- Comprehensive error messages
- Detailed documentation with examples
- TypeScript-friendly JSDoc comments

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Reporting Issues

- Use the [GitHub Issues](https://github.com/matiascariboni/js-modules/issues) page
- Search for existing issues before creating a new one
- Include browser version and steps to reproduce
- Provide code examples when possible

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the existing code style
4. Add tests if applicable
5. Update documentation (README.md files)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Style

- Use ES6+ features
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Avoid external dependencies
- Write self-documenting code

### Documentation

When adding or updating modules:
- Update the module's README.md with examples
- Follow the existing documentation structure
- Include real-world use cases
- Add troubleshooting section if needed
- Update CHANGELOG.md following [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

---

## 📄 License

MIT License

Copyright (c) 2025 Matías Cariboni

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a detailed history of changes.

---

## 📬 Contact

**Matías Cariboni**

- GitHub: [@matiascariboni](https://github.com/matiascariboni)
- Repository: [js-modules](https://github.com/matiascariboni/js-modules)

For questions, suggestions, or issues, please use the [GitHub Issues](https://github.com/matiascariboni/js-modules/issues) page.

---

## 🙏 Acknowledgments

Built with ❤️ using vanilla JavaScript and modern web standards.

Special thanks to the web development community for inspiration and feedback.

---

## 🔗 Related Resources

- [MDN Web Docs](https://developer.mozilla.org/) — Comprehensive web development documentation
- [Can I Use](https://caniuse.com/) — Browser compatibility tables
- [ES6 Features](http://es6-features.org/) — Overview of ECMAScript 6 features
- [Keep a Changelog](https://keepachangelog.com/) — Changelog best practices

---

<p align="center">
  <strong>Happy Coding! 🚀</strong>
</p>