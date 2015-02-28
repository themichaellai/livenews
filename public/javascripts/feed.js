var DOM = React.DOM;
var feed = document.getElementById('feed').attributes['data-posts'];
var bootstrap = JSON.parse(feed.value);
feed.value = '';
var store = {
  posts: bootstrap.reverse(),
  listeners: [],
  addListener: function(cb) {
    this.listeners.push(cb);
  },
  addPost: function(post) {
    this.posts.unshift(post);
    this.listeners.forEach(function(l) {
      l.call();
    });
  },
  getPosts: function() {
    return this.posts;
  }
};

socket.on('new-post', function(data) {
  store.addPost(data.post);
});

var FeedItem = React.createClass({
  displayName: 'FeedItem',
  render: function() {
    var post = this.props.post;
    var publishedAt = new Date(post.publishedAt);
    return DOM.div({
      className: 'feed-item-container row'
    },
      null,
      DOM.div({
        className: 'feed-item-info col-sm-12 col-md-2'
      },
        null,
        DOM.time({
        },
          publishedAt.toDateString() + ' ' + publishedAt.toLocaleTimeString()
        )
      ),
      DOM.div({
        className: 'feed-item-content col-sm-12 col-md-10'
      },
        null,
        'title' in post? DOM.h2({
            className: 'feed-item-title'
          },
            post.title
          ) : null,
        'imageFilename' in post? DOM.img({
          src: '/images/' + post.imageFilename
        }) : null,
        DOM.p(null, post.text)
      )
    );
  }
});

var FeedItemFactory = React.createFactory(FeedItem);

var Feed = React.createClass({
  displayName: 'Feed',
  componentDidMount: function() {
    store.addListener(this.getState);
  },
  getState: function() {
    this.setState({posts: store.getPosts()});
  },
  getInitialState: function() {
    return {posts: store.getPosts()};
  },
  render: function() {
    return DOM.div({
      className: 'feed'
    },
      null,
      this.state.posts.map(function(post) {
        return FeedItemFactory({
          post: post,
          key: post._id
        });
      })
    );
  }
});

React.render(React.createElement(Feed, null), document.getElementById('feed'));
