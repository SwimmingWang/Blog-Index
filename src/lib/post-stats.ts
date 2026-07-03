type MarkdownPost = {
  body?: string;
};

export function getPostStats(post: MarkdownPost) {
  const plainText = stripMarkdown(post.body ?? "");
  const chineseCharacters = plainText.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
  const englishWords = plainText
    .replace(/[\u4e00-\u9fff]/g, " ")
    .match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g)?.length ?? 0;
  const wordCount = chineseCharacters + englishWords;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 350));

  return {
    wordCount,
    readingMinutes,
    label: `${wordCount.toLocaleString("en-US")} words / ${readingMinutes} min read`
  };
}

function stripMarkdown(markdown: string) {
  return markdown
    .replace(/^---[\s\S]*?---/, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/[#>*_~`|[\]()-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
