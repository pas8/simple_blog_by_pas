import { colord } from 'colord';
import { useRouter } from 'next/dist/client/router';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useFindRankD } from '../../hooks/useFindRankD.hook';
import { useFindUser } from '../../hooks/useFindUser.hook';
import { useValidateColor } from '../../hooks/useValidateColor.hook';
import { getUser } from '../../store/modules/App/selectors';
import Subtitle from '../Subtitle';
import ChatsPreviewItemContainer from './components/ChatsPreviewItemContainer';

const ChatsPreviewIem: FC<{ id: string }> = ({ id }) => {
  const chatUser = useFindUser(id);
  const { push } = useRouter();
  const user = useSelector(getUser);
  const color = useValidateColor(chatUser?.primaryColor || '');
  const d = useFindRankD(chatUser?.rank!);

  return (
    //@ts-ignore
    <ChatsPreviewItemContainer color={color} onClick={() => push(`/messages/${user?.id}/${id}`)}>
      {<img src={chatUser?.photoURL || ''} width={48} height={48} />}

      <Subtitle>
        <svg viewBox={'0 0 24 24'} width={42} height={42}>
          <path d={d} fill={'currentcolor'} />
        </svg>
        {chatUser?.displayName || 'Loading'}
      </Subtitle>
    </ChatsPreviewItemContainer>
  );
};

export default ChatsPreviewIem;
