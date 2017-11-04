import ms from 'ms';

import PropTypes from 'prop-types';

const Emoji = ({ name, emoji, onDelete }) => {
  const isCustom = !isNaN(name) && String(name).length >= 18;

  const lastUsed = emoji.recentUses.length !== 0
    ? ms(Date.now() - Math.max(...emoji.recentUses))
    : 'a while';

  return (
    <div className='emoji'>
      <div className='tools'>
        <button type='button' title='delete' onClick={onDelete}>🚮</button>
      </div>

      <div className={`rendered ${isCustom ? 'custom' : 'normal'}`}>
        {isCustom ? <img src={`https://cdn.discordapp.com/emojis/${name}.png`} alt={name}/> : name}
      </div>

      <div className='parts'>
        <div className='uses'>
          <strong>{emoji.totalUses}</strong>{' '}
          total use{emoji.totalUses === 1 ? '' : 's'}
        </div>
        <div className='last-used muted'>
          last used {lastUsed} ago
        </div>
      </div>

      <style jsx>{`
        .emoji .tools {
          margin-right: 1rem;
        }

        .emoji img {
          width: 32px;
          height: 32px;
          object-fit: scale-down;
        }

        .emoji .parts {
          display: flex;
          flex-flow: row nowrap;
        }

        .emoji .parts > div:not(:last-child) {
          margin-right: .5rem;
        }

        .muted {
          color: #999;
        }

        .emoji {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          padding: .5rem;
        }

        .emoji .rendered {
          margin-right: 1rem;
        }

        .emoji .rendered.normal {
          font-family: monospace;
          font-size: .8em;
        }

        .emoji .rendered.normal::before { content: ':'; }
        .emoji .rendered.normal::after { content: ':'; }

        .emoji:nth-child(2n) {
          background-color: #fafafa;
        }
      `}</style>
    </div>
  );
};

Emoji.propTypes = {
  name: PropTypes.string,
  emoji: PropTypes.object,

  onDelete: PropTypes.func,
};

export default Emoji;
