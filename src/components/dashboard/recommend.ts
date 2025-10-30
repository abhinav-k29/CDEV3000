import { LearningModule, User } from '../../../src/App';

export type RecommendationBuckets = {
  recommended: LearningModule[];
  newAndNoteworthy: LearningModule[];
  popularInDept: LearningModule[];
  becauseYouCompleted: LearningModule[];
};

export function recommendModules(user: User, all: LearningModule[]): RecommendationBuckets {
  const popular = [...all].sort((a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0));
  const recent = [...all].slice(-8);

  const deptKey = user.department.split(' ')[0].toLowerCase();
  const byDept = all.filter(m => m.category.toLowerCase().includes(deptKey));

  const completedTags = new Set<string>();
  all.filter(m => m.progress === 100).forEach(m => m.tags.forEach(t => completedTags.add(t)));
  const similar = all.filter(m => m.tags.some(t => completedTags.has(t)) && m.progress < 100);

  return {
    recommended: popular.slice(0, 10),
    newAndNoteworthy: recent,
    popularInDept: byDept.slice(0, 10),
    becauseYouCompleted: similar.slice(0, 10),
  };
}


