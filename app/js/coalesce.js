const React = window.React;
const { Map, TileLayer, Marker, Popup } = window.ReactLeaflet;

class MapWrapper extends React.Component {
  constructor() {
    super();
    this.state = {
      lat: 47.6081392,
      lng: -122.3313049,
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
				<input id="search-bar" type="textbox" name="search-bar" minlength="5" maxlength="9"/>
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

var TopViewNav = React.createClass({ 
  displayName: "TopViewNav",
  render: function(){
    var selectedEvent = this.props.data.results[this.props.selectedItemIndex];
    if (selectedEvent === undefined) {
      return (<div></div>);
    } else {
     console.log(selectedEvent);
        var dur = selectedEvent.duration === undefined ? 0 : selectedEvent.duration + selectedEvent.time;
        var CalDate = moment(selectedEvent.time).format("dddd, MMMM DD, YYYY");
        var Time = moment(selectedEvent.time).format("h:mm A");
        var Duration = dur === 0 ? "" : " to " + moment(dur).format("h:mm A");
        return (
          <div id="top-view-nav">
            <div className="event-name">{selectedEvent.name}</div>
            <div className="event-date-time">
              <div className="event-date">{CalDate}</div>
              <div className="event-time">{Time}{Duration}</div>
            </div>
            <div className="event-location">
              <div className="location-name">{selectedEvent.venue.name || ""}</div>
              <div className="location-address">{selectedEvent.venue.address_1 || ""} {selectedEvent.venue.address_2 || ""} {selectedEvent.venue.address_3 || ""}, {selectedEvent.venue.city}, {selectedEvent.venue.state}</div>
            </div>
            <div className="event-description">{selectedEvent.description}</div>
          </div>
        )
      }
    }
});

var ShowList = React.createClass({
  render: function(){
    this.props.data.results.shift();
    var that = this;
    var listItems = this.props.data.results.map(function(EventItem, index){
      return <Event key={index} data={EventItem} index={index} clickHandler={that.props.clickHandler}/>;
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
  let boundClick = this.props.clickHandler.bind(this, this.props.index);
    return (
        <div className="event-item" onClick={boundClick}>
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
        	<ShowList data={this.props.data} clickHandler={this.props.clickHandler} />
		</div>
    )
  }
});

var PageRender = React.createClass({
  selectedItemIndex: 0,
  displayName: "PageRender",
  getInitialState: function() {
    return {
      data: {
      	results: []
      }
    };
  },
  MeetUpResults: function(zip) {
    var url = "http://localhost:9000/api/getEvents?zip=" + zip;
    $.ajax({
      url: url,
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
    this.MeetUpResults("98122");
  },
  clickHandler: function(newSelectedEventIndex) {
    console.log("clicked!", newSelectedEventIndex);
  },
  render: function(){
    return (
    	<div id="body-wrapper">
	    	<Header />
	    	<div id="main-wrapper">
	    		<main><div id="mapid"><MapWrapper /></div></main>
	    		<aside id="content-nav">
					<TopViewNav data={this.state.data} selectedItemIndex={this.selectedItemIndex}/>
					<BottomViewNav data={this.state.data} clickHandler={this.clickHandler}/>
				</aside>
			</div>
		</div>
    )
  }
});

ReactDOM.render(<PageRender url={data_url}/>, document.getElementById('react-wrapper'));
