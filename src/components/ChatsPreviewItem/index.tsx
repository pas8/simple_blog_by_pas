import { colord } from 'colord';
import { useRouter } from 'next/dist/client/router';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useFindUser } from '../../hooks/useFindUser.hook';
import { getUser } from '../../store/modules/App/selectors';
import Subtitle from '../Subtitle';
import ChatsPreviewItemContainer from './components/ChatsPreviewItemContainer';

const ChatsPreviewIem: FC<{ id: string }> = ({ id }) => {
  const chatUser = useFindUser(id);
  const { push } = useRouter();
  const user = useSelector(getUser);
  const color =
    colord(user?.primaryColor || '').isDark() && colord(chatUser?.primaryColor || '').isDark()
      ? colord(chatUser?.primaryColor || '').invert()
      : chatUser?.primaryColor;
  return (
    //@ts-ignore
    <ChatsPreviewItemContainer color={color} onClick={() => push(`/messages/${user?.id}/${id}`)}>
    {  <img src={chatUser?.photoURL || ''} width={48} height={48} />}
      <Subtitle> {chatUser?.displayName || 'Loading'}</Subtitle>
    </ChatsPreviewItemContainer>
  );
};

export default ChatsPreviewIem;
