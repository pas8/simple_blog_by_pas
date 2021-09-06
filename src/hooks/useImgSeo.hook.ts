import { PostType } from '../models/types';

export const useImgSeo = (props: PostType[]):any[] => {
  return props.map(({ bg_image, Title }) => ({ alt: Title, url: bg_image }));
};
