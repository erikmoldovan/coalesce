var data_url = "/gallery_info.json",
    container_el = document.getElementById("content");

var Gallery = React.createClass({
  getInitialState: function() {
    return {
      data: {
        table: {
          assets: []
        }
      }
    };
  },

  loadImagesFromServer: function() {
    $.ajax({
      url: this.props.url,
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
    this.loadImagesFromServer();
  },

  render: function() {
    return (
      <div className="gallery">
        <h1>{this.state.data.table.title}</h1>
        <Grid data={this.state.data} />
      </div>
    );
  }
});

var Grid = React.createClass({
  render: function() {
    var imageNodes = this.props.data.table.assets.map(function(asset) {
      return (
        <Image key={asset.table.asset_id} data={asset.table} />
      );
    });

    return (
      <div className="grid">
        {imageNodes}
      </div>
    );
  }
});

var Image = React.createClass({
  render: function() {
    var href = "http://www.gettyimages.com";

    return (
      <div className="image-container">
        <img src={this.props.data.gallery_preview_comp_url} />
        <div className="caption-container">
          <div>{this.props.data.caption}</div>
          <div>
            <span>{this.props.data.date_created}</span>
            <span> | </span>
            <span>Credits {this.props.data.artist}</span>
          </div>
          <div>
            <a href={href + this.props.data.landing_url}>License this image</a>
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <Gallery url={data_url} />,
  container_el
);