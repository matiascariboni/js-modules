/**
 * Replaces HTML comment placeholders in a template string with evaluated JavaScript expressions or statements.
 *
 * @param {string} template - The template string containing HTML comments with JavaScript code to evaluate.
 *                           Comments should be in the format: <!--code-->
 * @param {Object} data - An object containing variables to be made available to the evaluated code.
 *                       The object's keys become variable names accessible within the code blocks.
 *
 * @returns {string} The template string with comments replaced by their evaluated results.
 *                   If evaluation fails or returns undefined, the original comment is preserved.
 *
 * @example
 * // Simple expression evaluation
 * const template = '<div><!--name--></div>';
 * const data = { name: 'John' };
 * replacer(template, data); // Returns: '<div>John</div>'
 *
 * @example
 * // Expression with operations
 * const template = '<span><!--age + 5--></span>';
 * const data = { age: 20 };
 * replacer(template, data); // Returns: '<span>25</span>'
 *
 * @example
 * // Statement execution
 * const template = '<p><!--const result = x * 2; return result;--></p>';
 * const data = { x: 10 };
 * replacer(template, data); // Returns: '<p>20</p>'
 *
 * @throws {Error} Logs a warning to console if code evaluation fails, but doesn't throw.
 *                 Failed evaluations preserve the original comment in the output.
 */

export const replacer = (template, data) => {
    return template.replace(/<!--(.*?)-->/gs, (_, raw_code) => {
        const code = raw_code.trim()
        const isExpression = !code.includes(';') && !code.startsWith('return')
        const body = isExpression ? `return (${code});` : `"use strict";\n${code}`
        try {
            const fn = new Function(...Object.keys(data), body)
            const result = fn(...Object.values(data))
            return result == undefined ? `<!--${code}-->` : result
        } catch (err) {
            console.warn(`Error evaluating expression: <!--${code}-->`, err)
            return `<!--${code}-->`
        }
    })
}