import styled from 'styled-components';

const SettingsStyles = styled.div`
  .setting {
    display: grid;
    grid-template-columns: 2fr 1fr;
  }
  .settings-header {
    display: flex;
    justify-content: space-between;
  }
  .cog {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
`;

export default SettingsStyles;
