export function sanitizeTextContainerHtml(text: string): string {
    if (!text) return '';
    text = text.replace(/&/g, '&amp;');
    const allowedTags = ['strong', 'em', 'b', 'i', 'u', 'br'];

    return text.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tagName) => {
        tagName = tagName.toLowerCase();
        return allowedTags.includes(tagName) ? match : match.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    });
}