import * as React from 'react';
import PropTypes from 'prop-types';
import AnimatedNumber from 'react-animated-number';

const Scores = ({ scores, nickname, scoreUpdates }) => (
  <div className="scores">
    {scores
      && Object.keys(scores)
        .sort((a, b) => scores[b] - scores[a])
        .map(name => (
          <div key={name}>
            <div className="score-row">
              <div className="score-name">
                {name}
                {name === nickname && <small> (you)</small>}
              </div>
              <div className="score-score">
                <div>
                  {name in scores && (
                    <AnimatedNumber
                      style={{
                        transition: '0.8s ease-out',
                        transitionProperty: 'background-color, color, opacity',
                      }}
                      stepPrecision={0}
                      duration={500}
                      frameStyle={perc => (perc === 100 ? {} : {})}
                      initialValue={scores[name]}
                      value={scores[name]}
                    />
                  )}
                </div>
                <div className="score-addition">
                  {name in scoreUpdates && `+${scoreUpdates[name]}`}
                </div>
              </div>
            </div>
          </div>
        ))}
  </div>
);
Scores.propTypes = {
  scores: PropTypes.object.isRequired,
  scoreUpdates: PropTypes.object.isRequired,
  nickname: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};
Scores.defaultProps = {
  nickname: undefined,
};
export default Scores;
