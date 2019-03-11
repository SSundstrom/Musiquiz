import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import screenfull from 'screenfull';
import FullScreenButtonStyles from './styles/FullScreenButtonStyles';

const FullScreenButton = () => {
  const [fullScreen, toggleFullScreen] = useState(false);
  let icon;
  if (fullScreen) {
    icon = 'compress';
  } else {
    icon = 'expand';
  }

  if (screenfull.enabled) {
    return (
      <FullScreenButtonStyles>
        <FontAwesomeIcon
          icon={icon}
          onClick={() => {
            if (screenfull.enabled) {
              screenfull.toggle();
            }
            toggleFullScreen(!fullScreen);
          }}
        />
      </FullScreenButtonStyles>
    );
  }
  return null;
};

export default FullScreenButton;
