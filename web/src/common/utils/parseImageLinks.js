/**
 * Parse image links in text and convert them to img tags
 * 解析文本中的图片链接并转换为 img 标签
 * 
 * Format: @https://example.com/image.png or @ https://example.com/image.png
 * 格式：@https://图片链接 或 @ https://图片链接（可以有空格）
 * 
 * @param {string} text - The text containing image links
 * @returns {string} - Text with img tags
 */
export function parseImageLinks(text) {
  if (!text || typeof text !== 'string') {
    return text
  }

  // Regular expression to match @https://... or @ https://... (with optional space)
  // Support common image formats: jpg, jpeg, png, gif, webp, svg
  // 正则表达式匹配 @https://... 或 @ https://... 格式的图片链接（允许有空格）
  const imagePattern = /@\s*(https?:\/\/[^\s<>"]+?\.(?:jpg|jpeg|png|gif|webp|svg|JPG|JPEG|PNG|GIF|WEBP|SVG))\s*/gi

  // Replace image links with img tags
  // 将图片链接替换为 img 标签
  const result = text.replace(imagePattern, (match, url) => {
    return `<img src="${url}" class="inline-image" alt="image" />`
  })

  return result
}

/**
 * Parse image links in HTML content
 * 解析 HTML 内容中的图片链接
 * 
 * @param {string} html - HTML content
 * @returns {string} - HTML with img tags
 */
export function parseImageLinksInHTML(html) {
  if (!html || typeof html !== 'string') {
    return html
  }

  // First, decode common HTML entities that might affect @ symbol
  // 首先，解码可能影响 @ 符号的常见 HTML 实体
  let processedHtml = html
    .replace(/&commat;/gi, '@')
    .replace(/&#64;/g, '@')
    .replace(/&#x40;/gi, '@')

  // Debug: log original content
  // 调试：记录原始内容
  if ((html.includes('@') || html.includes('&commat;') || html.includes('&#64;')) && html.includes('http')) {
    console.log('[parseImageLinks] Original HTML:', html)
    if (processedHtml !== html) {
      console.log('[parseImageLinks] After entity decode:', processedHtml)
    }
  }

  // Pattern 1: Handle rich text editor auto-linking: @<a href="...">...</a>
  // 模式1：处理富文本编辑器自动转换的链接：@<a href="...">...</a>
  const linkPattern = /@\s*<a[^>]+href=["'](https?:\/\/[^"']+?\.(?:jpg|jpeg|png|gif|webp|svg|JPG|JPEG|PNG|GIF|WEBP|SVG))[^"']*["'][^>]*>.*?<\/a>\s*/gi
  
  processedHtml = processedHtml.replace(linkPattern, (match, url) => {
    console.log('[parseImageLinks] Found link pattern:', match, 'URL:', url)
    return `<img src="${url}" class="inline-image" alt="image" />`
  })

  // Pattern 2: Handle plain text format: @https://... or @ https://...
  // 模式2：处理纯文本格式：@https://... 或 @ https://...
  const imagePattern = /@\s*(https?:\/\/[^\s<>"]+?\.(?:jpg|jpeg|png|gif|webp|svg|JPG|JPEG|PNG|GIF|WEBP|SVG))\s*/gi

  const result = processedHtml.replace(imagePattern, (match, url) => {
    console.log('[parseImageLinks] Found plain text pattern:', match, 'URL:', url)
    return `<img src="${url}" class="inline-image" alt="image" />`
  })

  if (result !== html) {
    console.log('[parseImageLinks] Result HTML:', result)
  }

  return result
}

