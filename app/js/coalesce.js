var data_url = "/meetup_results.json";

var Header = React.createClass({	
  displayName: "Header",
  render: function(){
    return (
	<header id="main-header">
		<div id="logo">Logo</div>
		<nav id="main-menu">
			<nav id="search">
				<input type="textbox" name=""/>
			</nav>
			<div id="nav-buttons">
				<a href="#" className="menu1">Menu 1</a>
				<a href="#" className="menu2">Menu 2</a>
				<a href="#" className="menu3">Menu 3</a>
				<a href="#" className="menu4">Menu 4</a>
				<a href="#" className="menu5">Menu 5</a>
			</div>
		</nav>
		<div id="login">
			<a href="#">Login/Logout</a>
		</div>
	</header>
    )
  }
});


var Map = React.createClass({	
  displayName: "Map",
  render: function(){
    return (
		<div id="map"></div>
    )
  }
});

var TopViewNav = React.createClass({	
  displayName: "TopViewNav",
  render: function(){
    return (
		<div id="top-view-nav">
			<div className="event-name">Bliss Wisdom Summer Fair for Father's Day!</div>
			<div className="event-date-time">
				<div className="event-date">Sunday, June 19, 2016</div>
				<div className="event-time">11:00 AM to 5:00 PM</div>
			</div>
			<div className="event-location">
				<div className="location-name">Queens College parking lot #15 (Colden Auditorium)</div>
				<div className="location-address">65-30 Kissena Blvd, Flushing, NY</div>
			</div>
			<div className="event-description">Eat healthy, protect lives, save the planet!
				<br/>
				Outdoor games &crafts, amazing entertainment, bouncers, and healthy foods. Great for families to celebrate Father's Day! Please text Sherry at[masked] to sign up and purchase food vouchers.
			</div>
		</div>
    )
  }
});

var ShowList = React.createClass({
  render: function(){
    var listItems = this.props.data.results.map(function(friend, index){
      return <Event key={index} data={friend}/>;
    });
    return (
      <div>
        {listItems}
      </div>
    )
  }
});

var Event = React.createClass({
  render: function() {
  var EventItem = this.props.data;

  var dur = EventItem.duration === undefined ? 0 : EventItem.duration + EventItem.time
  var CalDate = moment(EventItem.time).format("dddd, MMMM DD, YYYY");
  var Time = moment(EventItem.time).format("h:mm A");
  var Duration = dur === 0 ? "" : "to " + moment(dur).format("h:mm A");

  /*var name = EventItem.venue === undefined ? EventItem.group.name : EventItem.venue.name;*/
    return (
        <div className="event-item">
          <div className="title">{EventItem.name}</div>
          <div className="date-time">
            <div className="date">{CalDate}</div>
            <div className="time">{Time} {Duration}</div>
          </div>
        </div>
      )
  }
});

var BottomViewNav = React.createClass({	
  displayName: "BottomViewNav",
  render: function(){
    return (
		<div id="bottom-view-nav">
        	<ShowList data={this.props.data} />
		</div>
    )
  }
});

var PageRender = React.createClass({	
  displayName: "PageRender",
  getInitialState: function() {
    return {
      data: {
      	results: []
      }
    };
  },

  MeetUpResults: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({ data: data });
        console.log(data)
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function() {
    this.MeetUpResults();
  },
  render: function(){
    return (
    	<div id="body-wrapper">
	    	<Header />
	    	<div id="main-wrapper">
	    		<main><Map /></main>
	    		<aside id="content-nav">
					<TopViewNav />
					<BottomViewNav data={this.state.data}/>
				</aside>
			</div>
		</div>
    )
  }
});

ReactDOM.render(<PageRender url={data_url}/>, document.getElementById('react-wrapper'));
