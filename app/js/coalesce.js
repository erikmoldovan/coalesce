var TopViewNav = React.createClass({	
  displayName: "TopViewNav",
  render: function(){
    return (
		<div class="event-name">Bliss Wisdom Summer Fair for Father's Day!</div>
		<div class="event-date-time">
			<div class="event-date">Sunday, June 19, 2016</div>
			<div class="event-time">11:00 AM to 5:00 PM</div>
		</div>
		<div class="event-location">
			<div class="location-name">Queens College parking lot #15 (Colden Auditorium)</div>
			<div class="location-address">65-30 Kissena Blvd, Flushing, NY</div>
		</div>
		<div class="event-description">Eat healthy, protect lives, save the planet!
			<br>
			Outdoor games &crafts, amazing entertainment, bouncers, and healthy foods. Great for families to celebrate Father's Day! Please text Sherry at[masked] to sign up and purchase food vouchers.
		</div>
    )
  }
});

ReactDOM.render(<TopViewNav />, null, document.getElementById('top-view-nav'));
