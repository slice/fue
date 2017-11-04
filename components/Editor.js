import { Component } from 'react';
import PropTypes from 'prop-types';

import Emoji from './Emoji';
const UPPER_LIMIT = 100;

export default class Editor extends Component {
  state = {
    editing: false,
    error: null,
    parsed: null,
    exported: null,
  }

  exportRef = null

  static propTypes = {
    editing: PropTypes.bool,
  }

  handleJSON = ({ target: { value: json } }) => {
    try {
      const parsed = JSON.parse(json);
      console.log('parsed', parsed);
      this.setState({
        editing: true,
        parsed,
      });
    } catch (e) {
      this.setState({
        error: `invalid json: ${e}`,
      });
    }
  }

  handleExport = () => {
    console.log('exporting');
    this.setState({
      exported: JSON.stringify(this.state.parsed),
    }, () => {
      this.exportRef.select();
    });
  }

  render() {
    if (this.state.editing && this.state.parsed) {
      // sort the fue list
      const sortedEmoji = Object.entries(this.state.parsed)
        .sort((first, second) => second[1].totalUses - first[1].totalUses)
        .slice(0, UPPER_LIMIT);

      const emojiListing = sortedEmoji.map(([name, emoji]) => {
        const onDelete = () => {
          console.log('delete', name);
          const surgery = { ...this.state.parsed };
          delete surgery[name];
          this.setState({ parsed: surgery });
        };
        return <Emoji onDelete={onDelete} key={name} name={name} emoji={emoji}/>;
      });

      return (
        <div id='editor'>
          { /* export */ }
          <button type='button' onClick={this.handleExport}>export!</button>
          { this.state.exported ?
            <div id='export'>
              <textarea ref={(t) => { this.exportRef = t; } } value={this.state.exported} readOnly/><br/>
              <small>
                press ctrl/cmd+c to copy!
                then pop open the dev tools and <strong>replace</strong> the
                stored <code>EmojiUsageHistory</code> value.
                then refresh (ctrl/cmd+r)!
              </small>
            </div> : null }

          <div className='listing'>{emojiListing}</div>
        </div>
      );
    } else {
      return (
        <div id='staging'>
          { /* help */ }
          <h3>fue</h3>
          <p>manage your <b>f</b>requently <b>u</b>sed <b>e</b>moji without shame. by slice</p>

          { /* entry */ }
          <textarea onChange={this.handleJSON} placeholder='enter json here'></textarea>
          { this.state.error ? <div className='error'>{this.state.error}</div> : null }

          { /* but how */ }
          <h4>how?</h4>
          <p>
            open dev tools &rarr; application &rarr; <code>EmojiUsageHistory</code><br/>
            copy the json value and paste it into the textbox above.
            you&apos;ll be able to edit your frequently used emoji.
            from there, you can export the new value.
          </p>
          <p><strong>to open:</strong></p>
          <ul>
            <li>win/linux: ctrl+shift+i</li>
            <li>mac: cmd+opt+i</li>
          </ul>
          <img style={{ width: '100%' }} src='https://i.imgur.com/bESNwYs.gif'/>

          <style jsx>{`
            textarea, .error {
              padding: .5rem;
            }

            .error {
              background: pink;
              margin: 1rem;
              font-family: monospace;
            }
        `}</style>
        </div>
      );
    }
  }
}
