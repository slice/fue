import ms from 'ms';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { monospace } from '../styles/fonts';

const Tools = styled.div`
  margin-right: 1rem;
`;

const DeleteButton = styled.button.attrs({
  type: 'button',
  title: 'Delete'
})`
  background: #fff;
  border: solid 1px #ddd;
  border-radius: 0.15rem;
  cursor: pointer;
`;

const StyledEmoji = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0.5rem;

  &:nth-child(2n) {
    background-color: #fafafa;
  }
`;

const EmojiRender = styled.div`
  margin-right: 1rem;
`;

const EmojiImage = styled.img`
  width: 32px;
  height: 32px;
  object-fit: scale-down;
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

const Emoji = ({ name, emoji, onDelete }) => {
  // Determine whether this emoji is a custom emoji (not part of Unicode).
  const isCustom = !isNaN(name) && String(name).length >= 18;

  // Calculate a human-parseable "last used" date.
  const lastUsed =
    emoji.recentUses.length !== 0
      ? ms(Date.now() - Math.max(...emoji.recentUses))
      : 'a while';

  // Humanly format the total uses according to the user's locale.
  const uses = new Intl.NumberFormat().format(emoji.totalUses);

  return (
    <StyledEmoji>
      {/* Emoji toolbar. A flexible strip of buttons that can be used to manage this emoji. */}
      <Tools>
        <DeleteButton onClick={onDelete}>🚮</DeleteButton>
      </Tools>

      {/* A rendered representation of this emoji. */}
      <EmojiRender custom={isCustom}>
        {isCustom ? (
          <EmojiImage
            src={`https://cdn.discordapp.com/emojis/${name}.png`}
            alt={name}
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

Emoji.propTypes = {
  name: PropTypes.string,
  emoji: PropTypes.object,
  onDelete: PropTypes.func
};

export default Emoji;
