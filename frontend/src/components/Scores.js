import * as React from 'react';
import PropTypes from 'prop-types';
import AnimatedNumber from 'react-animated-number';

const Scores = ({ players, nickname }) => (
  <div className="scores">
    {players
      .filter(player => player.active)
      .sort((p1, p2) => p2.score - p1.score)
      .map(player => (
        <div key={player.nickname}>
          <div className="score-row">
            <div className="score-name">
              {player.nickname}
              {player.nickname === nickname && <small> (you)</small>}
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
              {player.scoreUpdate > 0 && (
                <div className="score-addition">{`+${player.scoreUpdate}`}</div>
              )}
              {player.scoreUpdate < 0 && (
                <div className="score-addition">{`${player.scoreUpdate}`}</div>
              )}
            </div>
          </div>
        </div>
      ))}
  </div>
);
Scores.propTypes = {
  players: PropTypes.array.isRequired,
  nickname: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};
Scores.defaultProps = {
  nickname: undefined,
};
export default Scores;
