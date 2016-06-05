const React = window.React;
const { Map, TileLayer, Marker, Popup } = window.ReactLeaflet;

class MapWrapper extends React.Component {
    constructor() {
        super();
        this.state = {
            position: {
                current: {
                    lat: 39.8282,
                    lon: -98.5795,
                    zoom: 4
                }
            }
        };
        this.markerClickHandler = this.markerClickHandler.bind(this);
    }

    markerClickHandler(evt) {
        this.recenterMap(evt.latlng.lat, evt.latlng.lng, 14);
    }

    recenterMap(lat, lon, zoom) {
        this.setState({
            position: {
                current: {
                    lat: lat,
                    lon: lon,
                    zoom: zoom
                }
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.markers.results.length > 0) {
            // this.recenterMap(nextProps.markers.results[0].venue.lat, nextProps.markers.results[0].venue.lon, 14)
        // }

        if (nextProps.newCenter !== undefined) {
            console.log(nextProps.newCenter);
            this.recenterMap(nextProps.newCenter.lat, nextProps.newCenter.lon, nextProps.newCenter.zoom);
        }
    }

    render() {
        var that = this;

        var markers = this.props.markers.results.map(function(EventItem, index) {
            return (
                <Marker position={[EventItem.venue.lat, EventItem.venue.lon]} key={index} listIndex={index} onClick={that.markerClickHandler}>
                    <Popup>
                        <span className="marker_text"><span className="title">{EventItem.name}</span><br/>{EventItem.venue.name || ""}<br/>{EventItem.venue.address_1 || ""} {EventItem.venue.address_2 || ""} {EventItem.venue.address_3 || ""}, {EventItem.venue.city}, {EventItem.venue.state}</span>
                    </Popup>
                </Marker>
            );
        });

        return (
            <Map center={[this.state.position.current.lat, this.state.position.current.lon]} zoom={this.state.position.current.zoom}>
                <TileLayer
                    attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                    url='http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
                    subdomains='abcd'
                    maxZoom='19'
                />
                {markers}
            </Map>
        );

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

class Header extends React.Component {
    displayName: "Header"

    constructor() {
        super();
        this.searchSubmit = this.searchSubmit.bind(this);
    }

    searchSubmit(evt) {
        evt.preventDefault();
        var newSearchInput = this.refs.input.value;
        this.props.searchCallback(newSearchInput);
    }

    render() {
        return (
            <header id="main-header">
                <div id="logo"></div>
                <nav id="main-menu">
                    <nav id="search">
                        <form id="zipForm" name="zipForm" onSubmit={this.searchSubmit}>
                            <input id="search-bar" type="text" name="search-bar" pattern="\d{5}?" maxLength="5" ref="input" placeholder="Enter a zip code"/>
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

            var description = selectedEvent.description.replace(/<img[^>]*>/g,"");
            return (
                <div id="top-view-nav">
                    <div className="event-name"><a href={selectedEvent.event_url} target="_blank">{selectedEvent.name}</a></div>
                    <div className="event-date-time">
                        <div className="event-date">{CalDate}</div>
                        <div className="event-time">{Time}{Duration}</div>
                    </div>
                    <div className="event-location">
                        <div className="location-name">{venue.name || ""}</div>
                        <div className="location-address">{venue.address_1 || ""} {venue.address_2 || ""} {venue.address_3 || ""}, {venue.city}, {venue.state}</div>
                    </div>
                    <div className="event-description" dangerouslySetInnerHTML={{__html: description}} />
                </div>
            )
        }
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
        var that = this;
        var listItems = this.props.data.results.map(function(EventItem, index){
            var selectedClass = "";

            if (index === that.props.selectedItemIndex) {
                selectedClass = " selected";
            }
            return <Event key={index} selectedClass={selectedClass} data={EventItem} index={index} clickHandler={that.props.clickHandler}/>;
        });

        return (
            <div id="bottom-view-nav">
                <div>{listItems}</div>
            </div>
        )
    }
}

class PageRender extends React.Component {
    displayName: "PageRender"

    constructor() {
        super();
        this.state = {
            searchInput: undefined,
            selectedItemIndex: 0,
            events: {
                results: []
            },
            centerPos: {
                lat: 39.8282,
                lon: -98.5795,
                zoom: 4
            }
        };
        this.clickHandler = this.clickHandler.bind(this);
        this.searchCallback = this.searchCallback.bind(this);
    }

    componentDidMount() {
        function requestCurrentPosition(){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(useGeoData);
            }
        };

        function useGeoData(position){
          console.log(position);
        };

        requestCurrentPosition();
    }

    getLatLong(zip) {
        var url = "http://localhost:9000/api/getLatLong?zip=" + zip;

        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    centerPos: {
                        lat: data.latitude,
                        lon: data.longitude,
                        zoom: 12
                    }
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }

    getMeetupResults(searchArea) {
        console.log("searchArea:", searchArea);
        var url = "http://localhost:9000/api/getOpenEvents?searchArea=" + searchArea;

        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                var events = [];

                data.results.forEach(function(EventItem, index) {
                    if (EventItem.venue !== null && EventItem.venue !== undefined) {
                        events.push(EventItem);
                    }
                });

                this.setState({ events: { results: events } });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }

    searchCallback(searchInput) {
        this.getLatLong(searchInput);
        this.getMeetupResults(searchInput);
    }

    clickHandler(newSelectedEventIndex) {
        this.setState({selectedItemIndex: newSelectedEventIndex});
    }

    render() {
        return (
            <div id="body-wrapper">
                <Header searchCallback={this.searchCallback} searchInput={this.state.searchInput}/>
                <div id="main-wrapper">
                    <main><div id="mapid"><MapWrapper markers={this.state.events} clickHandler={this.clickHandler} newCenter={this.state.centerPos} selectedItemIndex={this.state.selectedItemIndex}/></div></main>
                    <aside id="content-nav">
                        <TopViewNav data={this.state.events} selectedItemIndex={this.state.selectedItemIndex}/>
                        <BottomViewNav data={this.state.events} clickHandler={this.clickHandler} selectedItemIndex={this.state.selectedItemIndex}/>
                    </aside>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<PageRender/>, document.getElementById('react-wrapper'));
