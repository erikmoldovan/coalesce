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

class Header extends React.Component {
  displayName: "Header"

  zipChange(e) {
    e.preventDefault();
    var newZipCode = this.refs.input.value;
    this.props.zipCallback(newZipCode);
  }

  render() {
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
}

class TopViewNav extends React.Component { 
  displayName: "TopViewNav"

  render() {
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
}

class ShowList extends React.Component {
  render() {
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
}

class Event extends React.Component {
  render() {
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
}

class BottomViewNav extends React.Component {	
  displayName: "BottomViewNav"

  render() {
    return (
  		<div id="bottom-view-nav">
        <ShowList data={this.props.data} clickHandler={this.props.clickHandler} selectedItemIndex={this.props.selectedItemIndex} />
  		</div>
    )
  }
}

class PageRender extends React.Component {
  displayName: "PageRender"

  constructor() {
    super();
    this.state = {
      selectedZip: '98122',
      selectedItemIndex: 0,
      data: {
      	results: []
      }
    };
  }

  getMeetupResults(zip) {
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
  }

  componentDidMount() {
    this.getMeetupResults("98122");

    function requestCurrentPosition(){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(useGeoData);
      }
    };

    function useGeoData(position){
      console.log(position);
    };
  }

  zipCallback(selectedZip) {
    console.log("clicked!", selectedZip);
    // this.setState({selectedZip: selectedZip});
    this.getMeetupResults(selectedZip);
  }

  clickHandler(newSelectedEventIndex) {
    console.log("clicked!", newSelectedEventIndex);
    this.setState({selectedItemIndex: newSelectedEventIndex});
  }

  render() {
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
}

ReactDOM.render(<PageRender/>, document.getElementById('react-wrapper'));
