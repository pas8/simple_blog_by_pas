import { FC } from 'react';
import { useFindRankD } from '../../hooks/useFindRankD.hook';
import { useFindUser } from '../../hooks/useFindUser.hook';
import { KickedUserType } from '../../models/types';
import Subtitle from '../Subtitle';

const KickedUserItem: FC<KickedUserType> = props => {
  const { by, id, isAskedForRestoring, reason, when } = props;

  const byUser = useFindUser(by);
  const kickedUser = useFindUser(id);

  return (
    <Subtitle>
      <img src={kickedUser?.photoURL || ''} />
      <svg viewBox={'0 0 24 24'} width={42} height={42} className={'rankSvg'}>
        <path fill={'currentColor'} d={useFindRankD(kickedUser?.rank!)} />
      </svg>
      {kickedUser.displayName}
    </Subtitle>
  );
};

export default KickedUserItem;
