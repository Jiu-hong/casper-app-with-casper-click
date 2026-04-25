import React from 'react';
import { TransferCSPR, SignMessage, Section } from './components';
import Container from '../container';
import { useClickRef } from '@make-software/csprclick-ui';

export const LandingBrief = () => {
  const clickRef = useClickRef();

  return (
    <Container>
      <h3>🔝 Sign in</h3>
      <Section>
        <span>
          Now, go back to the top of the page and sign in with your favorite wallet. Or, click here:
          <b
            onClick={(event) => {
              event.preventDefault();
              clickRef?.signIn();
            }}>
            {' '}
            Connect
          </b>
          .
        </span>
      </Section>
    </Container>
  );
};

export const SignedInBrief = () => {
  return (
    <Container>
      <h3>🎉 Awesome! You have successfully signed in! What&#39;s next?</h3>
      <h3>☕ Transfer CSPRs on testnet</h3>
      <TransferCSPR />
      <h3>✍️ Sign Message</h3>
      <SignMessage />
    </Container>
  );
};
