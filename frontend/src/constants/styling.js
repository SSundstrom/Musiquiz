import React from 'react';
import { Global, css } from '@emotion/core';

export const theme = {
  host: '#BADA55',
  leader: '#F3BD34',
  player: '#3466F3',
};
export const GlobalSyles = () => (
  <Global
    styles={css`
      @import url('https://fonts.googleapis.com/css?family=Montserrat:400,700');
      body {
        margin: 0;
        padding: 0;

        font-weight: 700;
        font-size: 20px;
        color: #fff;
      }

      * {
        font-family: 'Montserrat';
        box-sizing: border-box;
        text-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
      }

      *:focus {
        outline: none;
      }
      body,
      html,
      #root,
      .background {
        position: relative;
        height: 100%;
      }
      h1 {
        text-align: center;
        font-size: 52px;
        margin: 0;
      }
      h2 {
        text-align: center;
        margin-top: 0;
      }
      select {
        background-color: #fff;
        display: block;
        width: 100%;
        padding: 15px;
        font-size: 18px;
        margin-bottom: 30px;
        text-shadow: none;
      }
      label {
        margin-bottom: 10px;
      }
      input[type='text'],
      input[type='number'] {
        border: none;
        border-radius: 7px;
        padding: 0.5em;
        font-size: 18px;
        display: block;
        width: 100%;
        margin-bottom: 20px;
        margin-top: 10px;
        text-shadow: none;
      }
    `}
  />
);
