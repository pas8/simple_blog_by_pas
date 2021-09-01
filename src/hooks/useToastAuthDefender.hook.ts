import { toast } from 'react-toastify';
export const useToastAuthDefender = () => {
  toast('Only logined users can add posts! Please log in. ', {
    type: 'error',
    theme: 'colored',
    position: 'bottom-right'
  });
};
