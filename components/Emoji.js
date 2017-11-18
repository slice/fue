// @flow

import React from 'react';
import ms from 'ms';
import styled from 'styled-components';
import { Button } from './Controls';
import { monospace } from '../styles/fonts';

const Tools = styled.div`
  margin-right: 1rem;
`;

const DeleteButton = Button.extend.attrs({
  title: 'Delete'
})``;

const StyledEmoji = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0.5rem;
`;

const EmojiRender = styled.div`
  margin-right: 1rem;
`;

const EmojiImage = styled.img.attrs({
  draggable: false
})`
  width: 32px;
  height: 32px;
  object-fit: scale-down;
  cursor: pointer;
`;

const EmojiPlain = styled.span`
  font-family: ${monospace};
  font-size: 0.8em;

  ::before {
    content: ':';
  }
  ::after {
    content: ':';
  }
`;

const EmojiMetadata = styled.div`
  display: flex;
  flex-flow: row nowrap;

  & > *:not(:last-child) {
    margin-right: 0.5rem;
  }
`;

const EmojiLastUsed = styled.div`
  color: #999;
`;

const Rank = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-right: 1rem;
  width: 3.5em;
  text-align: center;

  /* Make the numbers "monospaced". */
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
`;

import type { UsageHistoryEntry } from './Editor';

type Props = {
  name: string,
  emoji: UsageHistoryEntry,
  onDelete: () => void,
  number: number
};

const Emoji = ({ name, emoji, onDelete, number }: Props) => {
  // Determine whether this emoji is a custom emoji (not part of Unicode).
  const isCustom = !isNaN(name) && String(name).length >= 18;

  // Calculate a human-parseable "last used" date.
  const lastUsed =
    emoji.recentUses.length !== 0
      ? ms(Date.now() - Math.max(...emoji.recentUses))
      : 'a while';

  // Humanly format the total uses according to the user's locale.
  // $FlowFixMe
  const uses = new Intl.NumberFormat().format(emoji.totalUses);

  const url = `https://cdn.discordapp.com/emojis/${name}.png`;

  return (
    <StyledEmoji>
      <Rank>#{number + 1}</Rank>

      {/* Emoji toolbar. A flexible strip of buttons that can be used to manage this emoji. */}
      <Tools>
        <DeleteButton onClick={onDelete}>🚮</DeleteButton>
      </Tools>

      {/* A rendered representation of this emoji. */}
      <EmojiRender custom={isCustom}>
        {isCustom ? (
          <EmojiImage
            src={url}
            alt={name}
            title={name}
            onClick={() => window.open(url)}
          />
        ) : (
          <EmojiPlain>{name}</EmojiPlain>
        )}
      </EmojiRender>

      <EmojiMetadata>
        <div>
          <strong>{uses}</strong> total use{emoji.totalUses === 1 ? '' : 's'}
        </div>
        <EmojiLastUsed>last used {lastUsed} ago</EmojiLastUsed>
      </EmojiMetadata>
    </StyledEmoji>
  );
};

export default Emoji;
