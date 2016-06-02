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

var Header = React.createClass({
  displayName: "Header",
  zipChange: function(e) {
    e.preventDefault();
    var newZipCode = this.refs.input.value;
    this.props.zipCallback(newZipCode);
  },
  render: function(){
    return (
    	<header id="main-header">
    		<div id="logo"></div>
    		<nav id="main-menu">
    			<nav id="search">
            <form name="zipForm" onSubmit={this.zipChange}>
    				  <input id="search-bar" type="text" name="search-bar" minlength="5" maxlength="9" ref="input" placeholder="Enter Zipcode"/>
              <button type="submit" form="zipForm" value="Submit"></button>
            </form>
    			</nav>
        </nav>
    	</header>
    )
  }
});

        //   <div id="nav-buttons">
        //     <a href="#" className="menu1">Menu 1</a>
        //     <a href="#" className="menu2">Menu 2</a>
        //     <a href="#" className="menu3">Menu 3</a>
        //     <a href="#" className="menu4">Menu 4</a>
        //     <a href="#" className="menu5">Menu 5</a>
        //   </div>
        // </nav>
        // <div id="login">
        //   <a href="#">Login/Logout</a>
        // </div>
var TopViewNav = React.createClass({ 
  displayName: "TopViewNav",
  render: function(){
    var selectedEvent = this.props.data.results[this.props.selectedItemIndex];
    if (selectedEvent === undefined) {
      return (<div></div>);
    } else {
        var dur = selectedEvent.duration === undefined ? 0 : selectedEvent.duration + selectedEvent.time;
        var CalDate = moment(selectedEvent.time).format("dddd, MMMM DD, YYYY");
        var Time = moment(selectedEvent.time).format("h:mm A");
        var Duration = dur === 0 ? "" : " to " + moment(dur).format("h:mm A");
        var venue = selectedEvent.venue !== undefined ? selectedEvent.venue : {};
        return (
          <div id="top-view-nav">
            <div className="event-name">{selectedEvent.name}</div>
            <div className="event-date-time">
              <div className="event-date">{CalDate}</div>
              <div className="event-time">{Time}{Duration}</div>
            </div>
            <div className="event-location">
              <div className="location-name">{venue.name || ""}</div>
              <div className="location-address">{venue.address_1 || ""} {venue.address_2 || ""} {venue.address_3 || ""}, {venue.city}, {venue.state}</div>
            </div>
            <div className="event-description">{selectedEvent.description}</div>
          </div>
        )
      }
    }
});

var ShowList = React.createClass({
  render: function(){
    var that = this;
    var listItems = this.props.data.results.map(function(EventItem, index){
      var selectedClass = "";
      if (index === that.props.selectedItemIndex) {
        selectedClass = " selected";
      }
      return <Event key={index} selectedClass={selectedClass} data={EventItem} index={index} clickHandler={that.props.clickHandler}/>;
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
  var classes = "event-item" + this.props.selectedClass
  var dur = EventItem.duration === undefined ? 0 : EventItem.duration + EventItem.time;
  var CalDate = moment(EventItem.time).format("dddd, MMMM DD, YYYY");
  var Time = moment(EventItem.time).format("h:mm A");
  var Duration = dur === 0 ? "" : " to " + moment(dur).format("h:mm A");
  let boundClick = this.props.clickHandler.bind(null, this.props.index);
    return (
        <div className={classes} onClick={boundClick}>
          <div className="item-wrapper">
            <div className="title">{EventItem.name}</div>
            <div className="date-time">
              <div className="date">{CalDate}</div>
              <div className="time">{Time}{Duration}</div>
            </div>
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
        	<ShowList data={this.props.data} clickHandler={this.props.clickHandler} selectedItemIndex={this.props.selectedItemIndex} />
		</div>
    )
  }
});

var PageRender = React.createClass({
  displayName: "PageRender",
  getInitialState: function() {
    return {
      selectedZip: '98122',
      selectedItemIndex: 0,
      data: {
      	results: []
      }
    };
  },
  getMeetupResults: function(zip) {
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
    this.getMeetupResults("98122");

    function requestCurrentPosition(){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(useGeoData);
      }
    }

    function useGeoData(position){
      console.log(position);
    };

    requestCurrentPosition();
  },
  zipCallback: function(selectedZip) {
    console.log("clicked!", selectedZip);
    // this.setState({selectedZip: selectedZip});
    this.getMeetupResults(selectedZip);
  },
  clickHandler: function(newSelectedEventIndex) {
    console.log("clicked!", newSelectedEventIndex);
    this.setState({selectedItemIndex: newSelectedEventIndex});
  },
  render: function(){
    return (
    	<div id="body-wrapper">
	    	<Header zipCallback={this.zipCallback} selectedZip={this.state.selectedZip}/>
	    	<div id="main-wrapper">
	    		<main><div id="mapid"><MapWrapper /></div></main>
	    		<aside id="content-nav">
					<TopViewNav data={this.state.data} selectedItemIndex={this.state.selectedItemIndex}/>
					<BottomViewNav data={this.state.data} clickHandler={this.clickHandler} selectedItemIndex={this.state.selectedItemIndex}/>
				</aside>
			</div>
		</div>
    )
  }
});

ReactDOM.render(<PageRender/>, document.getElementById('react-wrapper'));
