export const getCssValue = (css, property) => {
        const regex = new RegExp(`${property}\\s*:\\s*([^;]+)`, 'i')

        const match = css.match(regex)
        if (!match) return null

        const num = Number(match[1].trim())

        if (!isNaN(num)) return num

        return match[1].trim()
    }