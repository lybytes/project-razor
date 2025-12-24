/**
 * Converts markdown-style **bold** text to HTML <strong> tags
 */
export const formatBoldText = (text: string): string => {
  return text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
};
