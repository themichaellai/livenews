(function(socket) {
  var DOM = React.DOM;
  var store = {
    messages: [],
    listeners: [],
    addListener: function(cb) {
      this.listeners.push(cb);
    },
    addMessage: function(message) {
      this.messages.push(message);
      this.listeners.forEach(function(l) {
        l.call();
      });
    },
    getMessages: function() {
      return this.messages.reverse();
    }
  };

  socket.on('message', function(data) {
    store.addMessage(data);
  });

  var FeedItem = React.createClass({
    render: function() {
      return DOM.div({
        className: 'feed-item'
      },
        null,
        DOM.p(null, this.props.messageText)
      );
    }
  });

  var FeedItemFactory = React.createFactory(FeedItem);

  window.Feed = React.createClass({
    componentDidMount: function() {
      store.addListener(this.getState);
    },
    getState: function() {
      this.setState({messages: store.getMessages()});
    },
    getInitialState: function() {
      return {messages: store.getMessages()};
    },
    render: function() {
      return DOM.div({
        className: 'feed'
      },
        null,
        this.state.messages.map(function(msg) {
          return FeedItemFactory({
            messageText: msg.message,
            key: msg.message
          });
        })
      )
    }
  });
})(socket);

React.render(React.createElement(Feed, null), document.getElementById('feed'));
