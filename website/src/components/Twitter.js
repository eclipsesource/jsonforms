import React from 'react'
import PropTypes from 'prop-types'

// based on react-tweet-embed, see https://github.com/capaj/react-tweet-embed
const callbacks = []

function addScript(src, cb) {
  if (callbacks.length === 0) {
    callbacks.push(cb)
    var s = document.createElement('script')
    s.setAttribute('src', src)
    s.onload = () => callbacks.forEach((cb) => cb())
    document.body.appendChild(s)
  } else {
    callbacks.push(cb)
  }
}

class Twitter extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    options: PropTypes.object,
    protocol: PropTypes.string,
    onTweetLoadSuccess: PropTypes.func,
    onTweetLoadError: PropTypes.func,
    className: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number
  }

  static defaultProps = {
    protocol: 'https:',
    options: {},
    className: null
  }

  state = {
    isLoading: true
  }

  loadTweetForProps(props) {
    const renderTweet = () => {
      const twttr = window['twttr']
      twttr.ready().then(({ widgets }) => {
        // Clear previously rendered tweet before rendering the updated tweet id
        if (this._div) {
          this._div.innerHTML = ''
        }

        const { onTweetLoadSuccess, onTweetLoadError } = props
        widgets
          .createTimeline(
            {
              sourceType: 'profile',
              screenName: 'jsonforms'
            },
            document.getElementById('timeline'),
            {
              width: props.width || 300,
              height: props.height || 300,
              related: 'twitterdev,twitterapi',
              dnt: true
            }).then((twitterWidgetElement) => {
              this.setState({
                isLoading: false
              })
              onTweetLoadSuccess && onTweetLoadSuccess(twitterWidgetElement)
            })
          .catch(onTweetLoadError)
      })
    }

    const twttr = window['twttr']
    if (!(twttr && twttr.ready)) {
      const isLocal = window.location.protocol.indexOf('file') >= 0
      const protocol = isLocal ? this.props.protocol : ''

      addScript(`${protocol}//platform.twitter.com/widgets.js`, renderTweet)
    } else {
      renderTweet()
    }
  }

  componentDidMount() {
    this.loadTweetForProps(this.props)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.id !== nextProps.id ||
      this.props.className !== nextProps.className
    )
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.id !== nextProps.id) {
      this.loadTweetForProps(nextProps)
    }
  }

  render() {
    const { props, state } = this

    return (
      <div
        className={this.props.className}
        id="timeline"
        ref={(c) => {
          this._div = c
        }}
      >
        {state.isLoading && props.placeholder}
      </div>
    )
  }
}

export default Twitter;
