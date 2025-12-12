# Examples

Interactive examples demonstrating each module in action. Open these HTML files in your browser to see the modules in use.

## 📂 Available Examples

### [reactive-context-demo.html](./reactive-context-demo.html)
**Todo App with ReactiveContext**

A fully functional todo application showcasing:
- Real-time reactive state updates
- Event tracking (reads and changes)
- Array mutation handling
- Filtering and statistics
- Live event log visualization

**Features:**
- Add, complete, and delete todos
- Filter by all/active/completed
- Live statistics dashboard
- Event debugging panel

---

### [drag-scroll-gallery.html](./drag-scroll-gallery.html)
**Image Gallery with DragToScrollOnPc**

An interactive image gallery demonstrating:
- Smooth drag-to-scroll behavior
- Momentum-based inertia
- Configurable physics settings
- Real-time controls

**Features:**
- Drag to scroll horizontally
- Adjust inertia duration and friction
- Change scroll axis
- Automatic scrollbar hiding

---

### [replacer-template.html](./replacer-template.html)
**Dynamic Card Generator with replacer**

A template engine playground showing:
- HTML template evaluation
- JavaScript expression support
- Multiple preset templates
- Dynamic data binding

**Features:**
- Blog post templates
- Product card templates
- User profile templates
- Statistics dashboard templates
- Custom field creation
- Live preview

---

### [trigger-spring-carousel.html](./trigger-spring-carousel.html)
**Story Carousel with TriggerSpring**

A full-screen story carousel featuring:
- Intelligent scroll snapping
- Progress indicators
- Keyboard navigation
- Smooth animations

**Features:**
- Automatic snap to stories
- Left/right navigation
- Keyboard arrow support
- Configurable snap behavior
- Progress tracking

---

### [get-css-value-inspector.html](./get-css-value-inspector.html)
**CSS Inspector with getCssValue**

A CSS property extraction tool demonstrating:
- Property parsing from CSS strings
- Automatic type conversion
- Computed style extraction
- Quick property inspection

**Features:**
- Preset CSS templates
- Quick property buttons
- Results history
- Extract styles from live elements
- Type identification

---

## 🚀 How to Use

1. **Clone or download the repository:**
   ```bash
   git clone https://github.com/matiascariboni/js-modules.git
   cd js-modules/examples
   ```

2. **Open any example in your browser:**
   ```bash
   # Using a simple HTTP server (recommended)
   python -m http.server 8000
   # Then visit http://localhost:8000/reactive-context-demo.html
   
   # Or just open the file directly
   open reactive-context-demo.html
   ```

3. **Important:** Make sure the parent directory structure is intact so the examples can import the modules:
   ```
   js-modules/
   ├── examples/
   │   ├── reactive-context-demo.html
   │   ├── drag-scroll-gallery.html
   │   └── ...
   ├── ReactiveContext/
   │   └── index.js
   ├── DragToScrollOnPc/
   │   └── index.js
   └── ...
   ```

---

## 💡 Learning Path

**Beginner:**
1. Start with `get-css-value-inspector.html` - simplest module
2. Try `replacer-template.html` - template basics

**Intermediate:**
3. Explore `reactive-context-demo.html` - reactivity concepts
4. Test `drag-scroll-gallery.html` - interaction handling

**Advanced:**
5. Study `trigger-spring-carousel.html` - complex coordination

---

## 🔧 Customization

Each example is self-contained and can be easily modified:

- **Styles:** All CSS is inline in `<style>` tags
- **Logic:** All JavaScript is in `<script type="module">` tags
- **Data:** Sample data is defined in the scripts

Feel free to:
- Change colors and layouts
- Modify functionality
- Add new features
- Use as templates for your projects

---

## 🐛 Troubleshooting

### Examples not loading modules

**Problem:** Browser shows "Failed to load module"

**Solution:** Make sure you're serving the files over HTTP (not opening directly as `file://`):
```bash
# Use any static server
python -m http.server 8000
# or
npx serve
# or
php -S localhost:8000
```

### CORS errors

**Problem:** Browser blocks module imports

**Solution:** Serve files from a local web server (see above)

### Examples not working on mobile

**Note:** `DragToScrollOnPc` and `TriggerSpring` are designed for desktop. They automatically disable on touch devices as intended.

---

## 📝 Contributing Examples

Have an idea for a new example? Contributions are welcome!

**Guidelines:**
- Keep examples self-contained (single HTML file)
- Include clear documentation in comments
- Demonstrate specific features or use cases
- Follow the existing styling patterns
- Make it interactive and educational

---

## 📄 License

All examples are released under the MIT License, same as the main project.

Feel free to use them as starting points for your own projects!