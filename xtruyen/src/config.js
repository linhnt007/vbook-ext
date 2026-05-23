// Configuration for XTruyen extension
const BASE_URL = "https://xtruyen.vn";

// Normalize URLs - convert relative to absolute
function normalizeUrl(link) {
    if (!link) return "";
    if (link.startsWith("http")) {
        return link;
    }
    if (link.startsWith("/")) {
        return BASE_URL + link;
    }
    return BASE_URL + "/" + link;
}

// Extract clean text
function cleanText(text) {
    if (!text) return "";
    return text.trim().replace(/\s+/g, " ");
}

// Extract clean HTML
function cleanHtml(html) {
  if (!html) return "";

  //   // 1. Remove all tags except <br>
  //   html = html.replace(/<(?!br\s*\/?)[^>]+>/gi, "");

  //   // 2. Collapse multiple <br> into a single one
  //   html = html.replace(/(<br\s*\/?>\s*)+/gi, "<br>");

  //   // 3. Trim leading/trailing whitespace or <br>
  //   html = html.replace(/^(<br\s*\/?>)+|(<br\s*\/?>)+$/gi, "");

  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<a[^>]*>.*?<\/a>/gi, "")
    .replace(/<\/?(?:div|span)[^>]*>/gi, "")
    .replace(/&(?:nbsp|amp|quot|lt|gt);/g, "")
    .replace(/(<br>\s*){2,}/g, "<br>")
    .replace(/^(?:<br>\s*)+|(?:<br>\s*)+$/g, "")
    .replace(/[\\]/g, "")
    .replace(/[\u201c\u201d"]/g, '"')
    .replace(/>\s+</g, "><")
    .replace(/\s+/g, " ")
    .replace(/ch\*t/gi, "chết")
    .replace(/gi\*t/gi, "giết")
    .replace(/s\*t/gi, "sát")
    .replace(/v\*n/gi, "vẫn")
    .replace(/th\*/gi, "thi")
    .replace(/\//g, "")
    .replace(/ƣ/g, "ư")
    .trim();
}

// Filter cover images - avoid ads, banners, logos
function filterCoverImage(src) {
    if (!src) return "";
    
    // Blacklist common ad/banner patterns
    let blacklist = ['ads', 'banner', 'logo', 'icon', 'avatar', 'default', 'placeholder', 'loading'];
    let srcLower = src.toLowerCase();
    
    for (let i = 0; i < blacklist.length; i++) {
        if (srcLower.includes(blacklist[i])) {
            return "";
        }
    }
    
    return normalizeUrl(src);
}

// Get best cover image from element
function getBestCoverImage(item) {
    if (!item) return "";
    
    // Try specific selectors first
    let img = item.select("img[alt*='cover']").first();
    if (!img) img = item.select("img[src*='cover']").first();
    if (!img) img = item.select("img[class*='thumb']").first();
    if (!img) img = item.select("img").first();
    
    if (img) {
        let src = img.attr("data-src") || img.attr("src");
        return filterCoverImage(src);
    }
    
    return "";
}

// Remove duplicate novels by URL
function deduplicateNovels(novels) {
    let seen = {};
    let result = [];
    
    for (let i = 0; i < novels.length; i++) {
        let novel = novels[i];
        let normalizedLink = (novel.link || "").toLowerCase().trim();
        
        if (normalizedLink && !seen[normalizedLink]) {
            seen[normalizedLink] = true;
            result.push(novel);
        }
    }
    
    return result;
}
