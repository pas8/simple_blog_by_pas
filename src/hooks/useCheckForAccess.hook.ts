import { RankVariants } from '../models/types';

export const useCheckForAccess = (rank: RankVariants) => {
  return rank === RankVariants.TRIARII || rank === RankVariants.IMPERATOR;
};
