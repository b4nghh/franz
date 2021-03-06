import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import Webview from 'react-electron-web-view';

import Button from '../ui/Button';

const messages = defineMessages({
  buttonCancel: {
    id: 'subscriptionPopup.buttonCancel',
    defaultMessage: '!!!Cancel',
  },
  buttonDone: {
    id: 'subscriptionPopup.buttonDone',
    defaultMessage: '!!!Done',
  },
});

@observer
export default class SubscriptionPopup extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    closeWindow: PropTypes.func.isRequired,
    completeCheck: PropTypes.func.isRequired,
    isCompleted: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  state = {
    isFakeLoading: false,
  };

  // We delay the window closing a bit in order to give
  // the Recurly webhook a few seconds to do it's magic
  delayedCloseWindow() {
    this.setState({
      isFakeLoading: true,
    });

    setTimeout(() => {
      this.props.closeWindow();
    }, 4000);
  }

  render() {
    const { url, closeWindow, completeCheck, isCompleted } = this.props;
    const { intl } = this.context;

    return (
      <div className="subscription-popup">
        <div className="subscription-popup__content">
          <Webview
            className="subscription-popup__webview"

            autosize
            src={encodeURI(url)}
            disablewebsecurity
            onDidNavigate={completeCheck}
            // onNewWindow={(event, url, frameName, options) =>
            //   openWindow({ event, url, frameName, options })}
          />
        </div>
        <div className="subscription-popup__toolbar franz-form">
          <Button
            label={intl.formatMessage(messages.buttonCancel)}
            buttonType="secondary"
            onClick={closeWindow}
            disabled={isCompleted}
          />
          <Button
            label={intl.formatMessage(messages.buttonDone)}
            onClick={() => this.delayedCloseWindow()}
            disabled={!isCompleted}
            loaded={!this.state.isFakeLoading}
          />
        </div>
      </div>
    );
  }
}
