import * as React from 'react';
import AnimatedNumber from 'react-animated-number';

class Scores extends React.Component {
  render() {
    return (
      <div className="scores">
        {Object.keys(this.props.score).sort((a, b) => this.props.score[b]-this.props.score[a]).map((name) => (
          <div key={name}>
            <div className="score-row">
              <div className="score-name">
                {name}
                <small>{name === this.props.nickname && ' (you)'}</small>
              </div>
              <div className="score-score">
                <div>
                  {(name in this.props.score ) && 
                    <AnimatedNumber
                      style={{
                          transition: '0.8s ease-out',
                          transitionProperty:
                              'background-color, color, opacity'
                      }}
                      stepPrecision={0}
                      duration={500}
                      frameStyle={perc => (
                          perc === 100 ? {} : {}
                      )}
                      initialValue={this.props.score[name]}
                      value={this.props.score[name]}
                    />
                  }
                </div>
                <div className="score-addition">
                  {(name in this.props.scoreUpdates) && '+' + this.props.scoreUpdates[name]}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }


}

export default Scores;