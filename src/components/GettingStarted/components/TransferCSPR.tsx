import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Section } from './Section';
import { AccountIdenticon, useClickRef } from '@make-software/csprclick-ui';
import { SendResult, TransactionStatus } from '@make-software/csprclick-core-types';
import { NativeTransferBuilder, PublicKey } from 'casper-js-sdk';
import Prism from 'prismjs';
import { Button, FlexRow, Link } from '@make-software/cspr-design';

export const StyledTD = styled.td(({ theme }) =>
  theme.withMedia({
    fontWeight: '600',
    margin: '4px 15px 4px 0',
    display: 'block'
  })
);

export const SpanTruncated = styled.span(({ theme }) =>
  theme.withMedia({
    display: 'inline-block',
    fontFamily: 'JetBrains Mono',
    width: ['150px', '350px', '100%'],
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  })
);

const StyledTitle = styled.div(({ theme }) =>
  theme.withMedia({
    color: theme.styleguideColors.fillSecondary
  })
);

export const TransferCSPR = () => {
  const [transactionHash, setTransactionHash] = useState<string | undefined>(undefined);
  const [waitingResponse, setWaitingResponse] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>('2.5');
  const recipientPk = '0203596b49460de7900614b5e25a1fa1861b3eb944c42bea18fc7506b220fd4d9d61';

  const clickRef = useClickRef();
  const activeAccount = clickRef?.getActiveAccount();

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  const handleSignTransaction = (evt: any) => {
    evt.preventDefault();
    const senderPk = activeAccount?.public_key?.toLowerCase() || '';
    const amountInMotes = Math.floor(parseFloat(amount || '0') * 1000000000).toString();
    const transaction = new NativeTransferBuilder()
      .from(PublicKey.fromHex(senderPk))
      .target(PublicKey.fromHex(recipientPk))
      .amount(amountInMotes)
      .id(Date.now())
      .chainName(clickRef.chainName!)
      .payment(100_000_000)
      .build();

    const txData = transaction.toJSON() as any;
    const txHash = txData.hash;
    console.log('transaction_hash:', txHash);
    setTransactionHash(txHash);

    const onStatusUpdate = (status: string, data: any) => {
      console.log('STATUS UPDATE', status, data);
      if (status === TransactionStatus.SENT) setWaitingResponse(true);
    };

    clickRef
      .send(txData, senderPk, onStatusUpdate)
      .then((res: SendResult | undefined) => {
        setWaitingResponse(false);
      })
      .catch(() => {
        setWaitingResponse(false);
      });
  };

  return (
    <>
      <Section withBackground>
        <table>
          <tbody>
            <tr>
              <StyledTD>Send:</StyledTD>
              <td>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.1"
                  style={{ width: '80px', marginRight: '8px' }}
                />
                CSPR
              </td>
            </tr>
            <tr>
              <StyledTD>From:</StyledTD>
              <td>
                <i>your account</i>
              </td>
            </tr>
            <tr>
              <StyledTD>To:</StyledTD>
              <td>
                <FlexRow gap={8} align="center">
                  <AccountIdenticon hex={recipientPk} size="sm"></AccountIdenticon>
                  <SpanTruncated>{recipientPk}</SpanTruncated>
                </FlexRow>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                {activeAccount?.public_key && (
                  <>
                    <Button onClick={(evt) => handleSignTransaction(evt)}>
                      <StyledTitle>Sign transaction</StyledTitle>
                    </Button>
                  </>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {transactionHash && (
          <div style={{ marginTop: '16px' }}>
            <span style={{ display: 'block', marginBottom: '8px', wordBreak: 'break-all' }}>
              <strong>Transaction Hash:</strong> {transactionHash}
            </span>
            <Link
              color={'inherit'}
              href={`${clickRef?.appSettings?.csprlive_url}deploy/${transactionHash}`}
              target="_blank">
              Check transfer status on CSPR.live
            </Link>
          </div>
        )}
        {waitingResponse && (
          <span className="listening-notice">Listening for transaction processing messages...</span>
        )}
      </Section>
    </>
  );
};
