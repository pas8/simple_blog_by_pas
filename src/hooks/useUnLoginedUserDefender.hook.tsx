import { useRouter } from 'next/dist/client/router';
import { getUser } from '../store/modules/App/selectors';
import { useSelector } from 'react-redux';
import { FC, ReactNode, useEffect } from 'react';
import { ProfileType } from '../models/types';
import { toast } from 'react-toastify';

export const useUnLoginedUserDefender = (
  id: string,
  aditionalCondition: boolean = false
): [boolean, any, ProfileType] => {
  const user = useSelector(getUser);

  const { push } = useRouter();

  const isUserPage = user?.id === id;
  const isCondition = !isUserPage || aditionalCondition;

  useEffect(() => {
    if (isCondition) push('/');
  }, [isCondition]);

  if (isCondition)
    toast('U are impostor!', {
      type: 'info',
      theme: 'colored',
      position: 'bottom-right'
    });
  return [isCondition, <></>, user];
};
