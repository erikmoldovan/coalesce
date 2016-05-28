const React = window.React;
const { Map, TileLayer, Marker, Popup } = window.ReactLeaflet;

class MapWrapper extends React.Component {
  constructor() {
    super();
    this.state = {
      lat: 40.7128,
      lng: -74.0059,
      zoom: 13,
    };
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <Map center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        <Marker position={position}>
          <Popup>
            <span>A pretty CSS3 popup. <br/> Easily customizable.</span>
          </Popup>
        </Marker>
      </Map>
    );
  }
}

var data_url = "/meetup_results.json";

var Header = React.createClass({	
  displayName: "Header",
  render: function(){
    return (
	<header id="main-header">
		<div id="logo"></div>
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


// var Map = React.createClass({	
//   displayName: "Map",
//   render: function(){
//     return (
// 		<div id="mapid"></div>
//     )
//   }
// });

var TopViewNav = React.createClass({ 
  displayName: "TopViewNav",
  render: function(){
    var selected = this.props.data.results[0];
    if (selected === undefined) {
      return (<div></div>);
    } else {
     console.log(selected);
        var dur = selected.duration === undefined ? 0 : selected.duration + selected.time;
        var CalDate = moment(selected.time).format("dddd, MMMM DD, YYYY");
        var Time = moment(selected.time).format("h:mm A");
        var Duration = dur === 0 ? "" : " to " + moment(dur).format("h:mm A");
        return (
          <div id="top-view-nav">
            <div className="event-name">{selected.name}</div>
            <div className="event-date-time">
              <div className="event-date">{CalDate}</div>
              <div className="event-time">{Time}{Duration}</div>
            </div>
            <div className="event-location">
              <div className="location-name">{selected.venue.name || ""}</div>
              <div className="location-address">{selected.venue.address_1 || ""} {selected.venue.address_2 || ""} {selected.venue.address_3 || ""}, {selected.venue.city}, {selected.venue.state}</div>
            </div>
            <div className="event-description">{selected.description}</div>
          </div>
        )
      }
    }
});

var ShowList = React.createClass({
  render: function(){
    this.props.data.results.shift();
    var listItems = this.props.data.results.map(function(EventItem, index){
      return <Event key={index} data={EventItem}/>;
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

  var dur = EventItem.duration === undefined ? 0 : EventItem.duration + EventItem.time;
  var CalDate = moment(EventItem.time).format("dddd, MMMM DD, YYYY");
  var Time = moment(EventItem.time).format("h:mm A");
  var Duration = dur === 0 ? "" : " to " + moment(dur).format("h:mm A");
    return (
        <div className="event-item">
          <div className="title">{EventItem.name}</div>
          <div className="date-time">
            <div className="date">{CalDate}</div>
            <div className="time">{Time}{Duration}</div>
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
      url: "http://localhost:9000/api/getEvents",
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({ data: data });
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
	    		<main><div id="mapid"><MapWrapper /></div></main>
	    		<aside id="content-nav">
					<TopViewNav data={this.state.data}/>
					<BottomViewNav data={this.state.data}/>
				</aside>
			</div>
		</div>
    )
  }
});

ReactDOM.render(<PageRender url={data_url}/>, document.getElementById('react-wrapper'));
