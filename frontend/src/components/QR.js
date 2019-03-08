import React from 'react';
import QRCode from 'qrcode.react';
import QRStyles from './styles/QRStyles';

const QR = props => {
  return (
    <QRStyles>
      <QRCode {...props} />
    </QRStyles>
  );
};

export default QR;
