// @flow

import * as React from 'react';

import styled from 'styled-components';
import validator from 'is-my-json-valid';
import Emoji from './Emoji';
import { Button } from './Controls';
import { monospace } from '../styles/fonts';

const UPPER_LIMIT = 100;
const createValidator = () =>
  validator({
    required: true,
    type: 'object',
    minProperties: 1,
    patternProperties: {
      '^\\w|\\d+$': {
        type: 'object',
        properties: {
          recentUses: { type: 'array', items: { type: 'number' } },
          frecency: { type: 'number' },
          score: { type: 'number' },
          totalUses: { type: 'number' }
        },
        required: ['frecency', 'recentUses', 'score', 'totalUses']
      }
    },

    // Disallow any other properties.
    additionalProperties: false
  });

const Error = styled.div`
  white-space: pre;
  background: pink;
  margin: 1rem;
  padding: 1rem;
  font-family: ${monospace};
  overflow-x: auto;
`;

const JSONPasteArea = styled.textarea`
  font-family: ${monospace};
  padding: 1rem;
  font-size: 1.2em;
  border: solid 1px #ccc;
  border-radius: 0.15rem;
  resize: none;
`;

const JSONExportArea = JSONPasteArea.extend`
  margin-top: 1rem;
  font-size: 0.5rem;
  padding: 1em;
`;

const Container = styled.div`
  max-width: 45rem;
  margin: 0 auto;
`;

const Header = styled.h1`
  letter-spacing: -0.05rem;
  font-weight: 800;
  font-size: 3rem;
`;

const Listing = styled.div`
  margin: 1rem 0;
`;

export type UsageHistoryEntry = {
  totalUses: number,
  recentUses: Array<number>,
  frecency: number,
  score: number
};

type UsageHistory = {
  [identifier: string]: UsageHistoryEntry
};

type State = {
  editing: boolean,
  error: ?string,
  parsed: ?UsageHistory,
  exported: ?mixed
};

export default class Editor extends React.Component<{}, State> {
  state: State = {
    editing: false,
    error: null,
    parsed: null,
    exported: null
  };

  exportRef: ?HTMLTextAreaElement = null;

  handleJSON = ({ currentTarget: { value: json } }: any) => {
    const schema = createValidator();
    try {
      const parsed = JSON.parse(json);

      if (!schema(parsed)) {
        this.setState({
          error: `Validation error: ${JSON.stringify(schema.errors)}`
        });
        return;
      }

      console.log('parsed', parsed);
      this.setState({ editing: true, parsed });
    } catch (e) {
      this.setState({ error: `Invalid JSON: ${e}` });
    }
  };

  handleExport = () => {
    console.log('exporting');
    this.setState({ exported: JSON.stringify(this.state.parsed) }, () => {
      if (this.exportRef) this.exportRef.select();
    });
  };

  render() {
    if (this.state.editing && this.state.parsed) {
      // Sort the frequently used emoji by total uses, and truncate the array
      // by the upper limit constant.
      const entries = Object.entries(this.state.parsed);

      // Flow is disabled on the next line because of the lack of good support for Object.entries.
      // See: https://github.com/facebook/flow/issues/2174
      const sortedEmoji = entries /* $FlowFixMe */
        .sort((first, second) => second[1].totalUses - first[1].totalUses)
        .slice(0, UPPER_LIMIT);

      const emojiListing = sortedEmoji.map(([name, emoji], number) => {
        const onDelete = () => {
          // Immutability!
          const clone = { ...this.state.parsed };
          delete clone[name];
          this.setState({ parsed: clone });
        };
        return (
          /* $FlowFixMe (See above.) */
          <Emoji
            onDelete={onDelete}
            key={name}
            name={name}
            emoji={emoji}
            number={number}
          />
        );
      });

      return (
        <Container>
          <Header>Editor</Header>
          <p>Click on the 🚮 button to delete an emoji.</p>

          {/* A button that will export the JSON. */}
          <Button onClick={this.handleExport} jumbo>
            Export
          </Button>
          {this.state.exported ? (
            <div id="export">
              <JSONExportArea
                innerRef={t => {
                  this.exportRef = t;
                }}
                onClick={() => this.exportRef && this.exportRef.select()}
                value={this.state.exported}
                readOnly
              />
              <br />
              <small>
                Press CTRL/⌘+C to copy. Then, pop open the developer tools again
                and <strong>replace</strong> the stored{' '}
                <code>EmojiUsageHistory</code> value. Then refresh (CTRL/⌘+R)!
              </small>
            </div>
          ) : null}

          <Listing>{emojiListing}</Listing>
        </Container>
      );
    } else {
      return (
        <Container>
          {/* Introduction. */}
          <Header>fue</Header>
          <p>Manage your frequently used emoji on Discord without shame.</p>
          <small>by slice#4274</small>

          <h4>Disclaimer</h4>
          <p>
            This broke someone&apos;s client. Please take caution before doing
            this. I take no responsiblity for what might happen.
          </p>

          {/* entry */}
          <JSONPasteArea
            onChange={this.handleJSON}
            placeholder="Paste JSON here..."
          />
          {this.state.error ? <Error>{this.state.error}</Error> : null}

          <h4>How?</h4>
          <p>
            Open the developer tools &rarr; Application &rarr;{' '}
            <code>EmojiUsageHistory</code>
            <br />
            Copy the JSON value and paste it into the textbox above. You&apos;ll
            be able to edit your frequently used emoji. From there, you can
            export the new value and paste it back into your client.
          </p>
          <p>
            <strong>To open the developer tools:</strong>
          </p>
          <ul>
            <li>Windows/Linux: CTRL+SHIFT+I</li>
            <li>Mac: ⌘+⌥+I</li>
          </ul>
          <img
            style={{ width: '100%' }}
            src="https://i.imgur.com/bESNwYs.gif"
          />
        </Container>
      );
    }
  }
}
