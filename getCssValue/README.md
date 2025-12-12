# getCssValue

A lightweight utility function to extract and parse CSS property values from CSS strings. Automatically converts numeric values to numbers while preserving non-numeric values as strings.

---

## ✨ Features

- 🎯 **Simple API** — Single function, straightforward usage
- 🔢 **Smart Parsing** — Automatically converts numeric values to numbers
- 📝 **String Preservation** — Non-numeric values returned as strings
- 🔍 **Case Insensitive** — Works regardless of property name casing
- 🪶 **Ultra Lightweight** — Just a few lines of code, zero dependencies
- ⚡ **Fast** — Uses efficient regex matching

---

## 🚀 Quick Start

```javascript
import { getCssValue } from './getCssValue/index.js'

const css = `
    width: 300px;
    height: 200px;
    background-color: #ff0000;
    display: flex;
    opacity: 0.8;
`

// Get numeric values (returned as numbers)
getCssValue(css, 'width')    // 300
getCssValue(css, 'height')   // 200
getCssValue(css, 'opacity')  // 0.8

// Get string values (returned as strings)
getCssValue(css, 'background-color')  // "#ff0000"
getCssValue(css, 'display')           // "flex"

// Non-existent property
getCssValue(css, 'margin')  // null
```

---

## 📖 How It Works

The function uses a regular expression to:

1. **Match the property** — Finds `property: value` pattern (case-insensitive)
2. **Extract the value** — Captures everything between `:` and `;`
3. **Parse numbers** — Attempts to convert the value to a number
4. **Return appropriately** — Returns number if parseable, otherwise returns string

```javascript
// Step-by-step example
const css = 'width: 300px; color: blue;'

// For 'width':
// 1. Regex matches: "width: 300px"
// 2. Extracts: "300px"
// 3. Trims: "300px"
// 4. Number("300px") → 300
// 5. Returns: 300

// For 'color':
// 1. Regex matches: "color: blue"
// 2. Extracts: "blue"
// 3. Trims: "blue"
// 4. Number("blue") → NaN
// 5. Returns: "blue"
```

---

## 📚 API Reference

### `getCssValue(css, property)`

Extracts a CSS property value from a CSS string.

| Parameter | Type | Description |
|-----------|------|-------------|
| `css` | `string` | CSS string containing property declarations |
| `property` | `string` | CSS property name to extract (case-insensitive) |

**Returns:** `number | string | null`
- `number` if the value is numeric (e.g., `300`, `0.8`, `-10`)
- `string` if the value is non-numeric (e.g., `"flex"`, `"#ff0000"`)
- `null` if the property is not found

```javascript
getCssValue('width: 100px', 'width')          // 100
getCssValue('color: red', 'color')            // "red"
getCssValue('margin: 10px', 'padding')        // null
getCssValue('OPACITY: 0.5', 'opacity')        // 0.5 (case-insensitive)
```

---

## 🎯 Common Use Cases

### Parsing Inline Styles

```javascript
const element = document.querySelector('.box')
const inlineStyles = element.getAttribute('style')

const width = getCssValue(inlineStyles, 'width')
const height = getCssValue(inlineStyles, 'height')

console.log(`Dimensions: ${width}x${height}`)
```

---

### Extracting Values from Style Blocks

```javascript
const styleBlock = `
    .container {
        max-width: 1200px;
        padding: 20px;
        margin: 0 auto;
        background: linear-gradient(to right, #667eea, #764ba2);
    }
`

const maxWidth = getCssValue(styleBlock, 'max-width')      // 1200
const padding = getCssValue(styleBlock, 'padding')         // 20
const background = getCssValue(styleBlock, 'background')   // "linear-gradient(to right, #667eea, #764ba2)"
```

---

### CSS-in-JS String Parsing

```javascript
const styles = {
    button: `
        width: 150px;
        height: 40px;
        border-radius: 4px;
        font-size: 16px;
    `
}

const buttonWidth = getCssValue(styles.button, 'width')         // 150
const borderRadius = getCssValue(styles.button, 'border-radius') // 4
const fontSize = getCssValue(styles.button, 'font-size')        // 16
```

---

### Validating CSS Properties

```javascript
function hasProperty(css, property) {
    return getCssValue(css, property) !== null
}

const css = 'display: flex; align-items: center;'

hasProperty(css, 'display')        // true
hasProperty(css, 'align-items')    // true
hasProperty(css, 'justify-content') // false
```

---

### Dynamic Style Manipulation

```javascript
function updateStyleValue(css, property, newValue) {
    const currentValue = getCssValue(css, property)
    
    if (currentValue !== null) {
        const regex = new RegExp(`${property}\\s*:\\s*[^;]+`, 'i')
        return css.replace(regex, `${property}: ${newValue}`)
    }
    
    return css + `${property}: ${newValue};`
}

let css = 'width: 100px; height: 200px;'
css = updateStyleValue(css, 'width', '150px')
// Result: 'width: 150px; height: 200px;'
```

---

## 🧩 Real-World Example: Style Analyzer

```javascript
import { getCssValue } from './getCssValue/index.js'

class StyleAnalyzer {
    constructor(cssString) {
        this.css = cssString
    }

    getDimensions() {
        return {
            width: getCssValue(this.css, 'width'),
            height: getCssValue(this.css, 'height'),
            minWidth: getCssValue(this.css, 'min-width'),
            maxWidth: getCssValue(this.css, 'max-width')
        }
    }

    getSpacing() {
        return {
            margin: getCssValue(this.css, 'margin'),
            padding: getCssValue(this.css, 'padding'),
            gap: getCssValue(this.css, 'gap')
        }
    }

    getColors() {
        return {
            color: getCssValue(this.css, 'color'),
            background: getCssValue(this.css, 'background'),
            backgroundColor: getCssValue(this.css, 'background-color'),
            borderColor: getCssValue(this.css, 'border-color')
        }
    }

    getNumericProperties() {
        const properties = ['width', 'height', 'padding', 'margin', 'font-size', 'opacity']
        return properties
            .map(prop => ({ [prop]: getCssValue(this.css, prop) }))
            .filter(obj => typeof Object.values(obj)[0] === 'number')
            .reduce((acc, obj) => ({ ...acc, ...obj }), {})
    }
}

// Usage
const css = `
    width: 300px;
    height: 200px;
    padding: 20px;
    background-color: #3498db;
    opacity: 0.9;
    display: flex;
`

const analyzer = new StyleAnalyzer(css)

console.log(analyzer.getDimensions())
// { width: 300, height: 200, minWidth: null, maxWidth: null }

console.log(analyzer.getNumericProperties())
// { width: 300, height: 200, padding: 20, opacity: 0.9 }
```

---

## 🧩 Real-World Example: CSS Variable Extractor

```javascript
import { getCssValue } from './getCssValue/index.js'

class CSSVariableExtractor {
    constructor(cssString) {
        this.css = cssString
        this.variables = this.extractVariables()
    }

    extractVariables() {
        const varRegex = /--([\w-]+)\s*:\s*([^;]+)/g
        const variables = {}
        let match

        while ((match = varRegex.exec(this.css)) !== null) {
            const varName = match[1]
            const varValue = match[2].trim()
            const numValue = Number(varValue)
            
            variables[varName] = isNaN(numValue) ? varValue : numValue
        }

        return variables
    }

    getVariable(name) {
        return this.variables[name] ?? null
    }

    getAllVariables() {
        return { ...this.variables }
    }
}

// Usage
const cssVars = `
    :root {
        --primary-color: #3498db;
        --spacing-unit: 8px;
        --border-radius: 4px;
        --transition-speed: 0.3s;
        --max-width: 1200px;
    }
`

const extractor = new CSSVariableExtractor(cssVars)

console.log(extractor.getVariable('primary-color'))  // "#3498db"
console.log(extractor.getVariable('spacing-unit'))   // "8px"
console.log(extractor.getAllVariables())
// { 
//   "primary-color": "#3498db",
//   "spacing-unit": "8px",
//   "border-radius": "4px",
//   ...
// }
```

---

## 💡 Tips & Best Practices

### ✅ Do

```javascript
// Check for null before using
const width = getCssValue(css, 'width')
if (width !== null) {
    console.log(`Width is: ${width}`)
}

// Use with computed styles
const computedStyle = window.getComputedStyle(element)
const cssText = computedStyle.cssText
const fontSize = getCssValue(cssText, 'font-size')

// Handle both number and string returns
const value = getCssValue(css, 'display')
if (typeof value === 'number') {
    console.log(`Numeric value: ${value}`)
} else if (typeof value === 'string') {
    console.log(`String value: ${value}`)
}

// Case-insensitive matching works
getCssValue(css, 'WIDTH')        // ✅ Works
getCssValue(css, 'width')        // ✅ Works
getCssValue(css, 'Width')        // ✅ Works
```

### ❌ Avoid

```javascript
// Don't assume return type without checking
const width = getCssValue(css, 'width')
width.toFixed(2)  // ❌ Could be null or string

// Don't use for complex parsing
const transform = getCssValue(css, 'transform')
// ❌ Returns full string like "rotate(45deg) scale(1.2)"
// Better to use specialized transform parser

// Don't modify original CSS string improperly
let css = 'width: 100px;'
css = css.replace('width', 'height')  // ❌ Fragile
// ✅ Use proper CSS manipulation instead
```

---

## 🔍 Technical Details

### Regex Pattern

The function uses this regex pattern:

```javascript
new RegExp(`${property}\\s*:\\s*([^;]+)`, 'i')
```

Breaking it down:
- `${property}` — The CSS property name
- `\\s*` — Optional whitespace
- `:` — The colon separator
- `\\s*` — Optional whitespace
- `([^;]+)` — Capture group: everything except semicolon
- `'i'` flag — Case-insensitive matching

### Number Conversion

The function uses `Number()` for conversion:

```javascript
Number("300px")       // 300 (strips units)
Number("0.8")         // 0.8
Number("-10")         // -10
Number("flex")        // NaN (returns original string)
Number("rgb(0,0,0)")  // NaN (returns original string)
```

---

## ⚠️ Limitations

### Units Are Stripped

```javascript
getCssValue('width: 100px', 'width')  // 100 (not "100px")
getCssValue('margin: 2rem', 'margin') // 2 (not "2rem")
```

If you need to preserve units, check the return type:

```javascript
const css = 'width: 100px'
const raw = css.match(/width\s*:\s*([^;]+)/i)?.[1].trim()  // "100px"
```

### Shorthand Properties

```javascript
const css = 'margin: 10px 20px 30px 40px;'
getCssValue(css, 'margin')  // "10px 20px 30px 40px" (string, not individual values)
```

For shorthand parsing, you'll need additional logic:

```javascript
function parseMargin(css) {
    const margin = getCssValue(css, 'margin')
    if (typeof margin === 'string') {
        return margin.split(/\s+/).map(Number)
    }
    return [margin, margin, margin, margin]
}
```

### Multi-line Values

```javascript
const css = `
    background: linear-gradient(
        to right,
        #667eea,
        #764ba2
    );
`
// May not capture properly due to semicolon expectation
```

For complex multi-line values, consider using a proper CSS parser.

---

## 🐛 Troubleshooting

### Returns null unexpectedly

**Check:** Property name spelling and format

```javascript
getCssValue('background-color: red', 'backgroundColor')  // null ❌
getCssValue('background-color: red', 'background-color') // "red" ✅
```

### Number conversion not working

**Check:** Value contains non-numeric characters

```javascript
getCssValue('width: 100px', 'width')     // 100 ✅ (strips 'px')
getCssValue('width: calc(100%)', 'width') // "calc(100%)" ✅ (kept as string)
```

### Case sensitivity issues

This shouldn't happen (regex is case-insensitive), but verify:

```javascript
getCssValue('WIDTH: 100px', 'width')     // 100 ✅
getCssValue('Width: 100px', 'WIDTH')     // 100 ✅
```