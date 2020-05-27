import * as React from 'react';
import AnimatedNumber from 'react-animated-number';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ScoreStyles from './styles/ScoreStyles';
import IconButton from './styles/IconButton';
import { HostConsumer } from '../context/hostContext';

const Scores = () => (
  <HostConsumer>
    {context => (
      <ScoreStyles>
        {context.state.players
          .sort((p1, p2) => p2.score - p1.score)
          .map(player => (
            <div key={player.nickname}>
              <div className="score-row">
                {context.state.isHost && context.state.showSettings && (
                  <IconButton onClick={() => context.onKickPlayer(player.nickname)} type="button">
                    <FontAwesomeIcon icon="times" />
                  </IconButton>
                )}
                <div className="score-name">
                  {player.nickname}
                  {player.nickname === context.state.nickname && <small> (you)</small>}
                </div>
                <div className="score-score">
                  <div>
                    <AnimatedNumber
                      style={{
                        transition: '0.8s ease-out',
                        transitionProperty: 'background-color, color, opacity',
                      }}
                      stepPrecision={0}
                      duration={500}
                      frameStyle={perc => (perc === 100 ? {} : {})}
                      initialValue={player.score}
                      value={player.score}
                    />
                  </div>
                  {player.scoreUpdate > 0 && <div className="score-addition">{`+${player.scoreUpdate}`}</div>}
                  {player.scoreUpdate < 0 && <div className="score-addition">{`${player.scoreUpdate}`}</div>}
                </div>
              </div>
            </div>
          ))}
      </ScoreStyles>
    )}
  </HostConsumer>
);
export default Scores;
