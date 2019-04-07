import { css, Global } from '@emotion/core';
import Link from 'next/link';
import React from 'react';
import styled from '@emotion/styled';

const basicStyles = css`
  margin: 3rem 0;
  padding: 1rem 0.5rem;
  color: black;
  background-color: white;
  border: 1px solid black;
  border-right: none;
  border-bottom: none;
  box-shadow: 5px 5px 0 0 black, 10px 10px 0 0 grey;
  transition: all 0.1s linear;
`;

const Basic = styled.div`
  ${basicStyles};
`;

export default () => (
  <React.Fragment>
    <Global
      styles={css`
          html,
          body {
              min-height: 100%;
              margin: 0;
              padding: 3rem 1rem;
              font-size: 24px;
              font-family: Helvetica, Arial, sans-serif;
              background: rgb(63,81,181);
          }
      `}
    />
    <div>
        <Basic>
          <h1>About</h1>
          <Link href={{ pathname: '/' }}><a>Home</a></Link>
        </Basic>
    </div>
  </React.Fragment>
);