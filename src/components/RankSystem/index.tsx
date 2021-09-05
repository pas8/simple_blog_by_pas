import { colord } from 'colord';
import { capitalize } from 'lodash';
import { Dispatch, FC, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useFindRankD } from '../../hooks/useFindRankD.hook';
import { RankVariants } from '../../models/types';
import { getUser } from '../../store/modules/App/selectors';
import IconButton from '../IconButton';
import Subtitle from '../Subtitle';

const RankSystemContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border-color: ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()};
  & .currentRank {
    background: ${({ theme: { primary } }) => primary};
    color: ${({ theme: { background } }) => background};
  }
  & img {
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
  }
  & h6 {
    display: flex;
    & .content {
      display: flex;
      align-items: center;
    }
    & .rankSvg {
      margin-right: 6px;
    }
    padding: 6px;
    border-bottom: 1px solid;
    border-color: ${({ theme: { text } }) => colord(text).alpha(0.16).toHex()};
    justify-content: space-between;
  }
`;
const RankOfCurrentUserContainer = styled(RankSystemContainer)`
  border-color: ${({ color }) => color};

  margin-bottom: 10px;
  & .currentRank {
    background: ${({ color }) => color};
    color: ${({ theme: { background } }) => background};
  }
`;
const RankSystem: FC<{
  currentRank: RankVariants;
  isSelfPage: boolean;
  setCurrentRank: Dispatch<SetStateAction<RankVariants>>;
  userPhotoURL: string;
}> = ({ currentRank, userPhotoURL, setCurrentRank, isSelfPage }) => {
  //@ts-ignore
  const rankArr = Object.values(RankVariants).reverse();
  const rankIdx = rankArr.findIndex(el => el === currentRank);
  const user = useSelector(getUser);
  return (
    <>
      {user && !isSelfPage && (
        //@ts-ignore
        <RankOfCurrentUserContainer color={user?.primaryColor}>
          <Subtitle className={'currentRank'}>
            <div className={'content'}>
              <svg viewBox={'0 0 24 24'} width={42} height={42} className={'rankSvg'}>
                <path fill={'currentColor'} d={useFindRankD(user?.rank || RankVariants.IMPERATOR)} />
              </svg>
              {capitalize(user?.rank)}
            </div>
            <img src={user?.photoURL} />
          </Subtitle>
        </RankOfCurrentUserContainer>
      )}
      <RankSystemContainer>
        {rankArr.map((rankName, idx) => {
          const d = useFindRankD(rankName);
          const handleChangeRank = () => {
            setCurrentRank(rankArr.find(el => el === rankName) as RankVariants);
          };

          return (
            <Subtitle key={rankName} className={currentRank === rankName ? 'currentRank' : ''}>
              <div className={'content'}>
                <svg viewBox={'0 0 24 24'} width={42} height={42} className={'rankSvg'}>
                  <path fill={'currentColor'} d={d} />
                </svg>
                {capitalize(rankName)}
              </div>
              {isSelfPage && rankIdx === idx && <img src={userPhotoURL} />}
              {!isSelfPage &&
                (rankIdx !== idx ? (
                  <IconButton
                    onClick={handleChangeRank}
                    position={'relative'}
                    d={
                      idx > rankIdx
                        ? 'M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z'
                        : 'M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z'
                    }
                  />
                ) : (
                  <img src={userPhotoURL} />
                ))}
            </Subtitle>
          );
        })}
      </RankSystemContainer>
    </>
  );
};

export default RankSystem;
