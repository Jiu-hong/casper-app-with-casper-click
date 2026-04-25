import React, { useState } from 'react';
import { useClickRef } from '@make-software/csprclick-ui';
import { Section } from './Section';

export const SignMessage = () => {
  const clickRef = useClickRef();
  const activeAccount = clickRef?.getActiveAccount();

  const [message, setMessage] = useState<string>('Hello from CSPR.click!');
  const [signatureHex, setSignatureHex] = useState<string>('');
  const [status, setStatus] = useState<string>('Idle');

  const handleSignMessage = (evt: React.MouseEvent) => {
    evt.preventDefault();

    if (!activeAccount?.public_key) {
      alert('Please connect your account first.');
      return;
    }

    setStatus('Waiting for wallet approval...');
    setSignatureHex('');

    // Call signMessage with the raw string and the active public key
    clickRef
      ?.signMessage(message, activeAccount.public_key)
      .then((res: any) => {
        if (res?.cancelled) {
          setStatus('User cancelled the signing request.');
          setSignatureHex('');
        } else if (res?.signatureHex) {
          // Success: The signature is returned as a hex string
          setStatus('Message signed successfully!');
          setSignatureHex(res.signatureHex);
        } else {
          setStatus('Failed to sign message for an unknown reason.');
          setSignatureHex('');
        }
      })
      .catch((err: any) => {
        setStatus('Error signing message.');
        setSignatureHex('');
        console.error('Error signing message:', err);
      });
  };

  return (
    <>
      <Section withBackground>
        <div style={{ padding: '0 10px', width: '100%' }}>
          {activeAccount ? (
            <form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  <strong>Message to sign:</strong>
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <button
                  onClick={handleSignMessage}
                  style={{
                    padding: '8px 16px',
                    cursor: 'pointer',
                    background: '#e5002a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}>
                  Sign Message
                </button>
              </div>
              <div style={{ marginTop: '10px' }}>
                <p>
                  <strong>Status:</strong> {status}
                </p>
                {signatureHex && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Signature (Hex):</strong>
                    <pre
                      style={{
                        background: '#f4f4f4',
                        padding: '10px',
                        borderRadius: '4px',
                        overflowX: 'auto',
                        marginTop: '5px'
                      }}>
                      {signatureHex}
                    </pre>
                  </div>
                )}
              </div>
            </form>
          ) : (
            <p>Please connect your wallet first.</p>
          )}
        </div>
      </Section>
    </>
  );
};
