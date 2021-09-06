export const useValidateNumber = (num: number): string => {
  return num > 1000 ? (num + '')[0] + 'K' : num + '';
};
