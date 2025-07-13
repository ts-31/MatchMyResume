export function calculateMatchScore(resumeText, jobText) {
  const resumeWords = new Set(resumeText.toLowerCase().split(/\W+/));
  const jdWords = jobText.toLowerCase().split(/\W+/).filter(word => word.length > 3);

  const matched = jdWords.filter(word => resumeWords.has(word));
  const score = Math.floor((matched.length / jdWords.length) * 100);

  return {
    score: `${score}%`,
    keywordsMatched: matched.length,
    totalKeywords: jdWords.length,
  };
}
