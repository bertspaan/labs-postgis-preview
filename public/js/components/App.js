class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      FeatureCollection: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSQLUpdate = this.handleSQLUpdate.bind(this);
  }

  processTopoJson(topojson) {
    // convert topojson coming over the wire to geojson using mapbox omnivore
    const features = omnivore.topojson.parse(topojson); // should this return a featureCollection?  Right now it's just an array of features.
    const geoFeatures = features.filter(feature => feature.geometry);
    if (geoFeatures.length) {
      this.setState({
        FeatureCollection: {
          type: 'FeatureCollection',
          features: geoFeatures,
        },
      });
    }
  }

  handleSubmit() {
    const SQL = this.mirror.getSQL();

    fetch(`/sql?q=${encodeURIComponent(SQL)}`)
      .then(res => res.json())
      .then((json) => {
        if (!json.error) {
          this.processTopoJson(json);
        } else {
          console.log(json.error);
        }
      });
  }

  handleSQLUpdate(SQL) {
    this.setState({ SQL });
  }

  render() {
    return (
      <div id="container">
        <div id="sidebar">
          <div className="col-md-12">
            <Mirror ref={(ref) => { this.mirror = ref; }}/>
            <div id="history-previous" className="btn btn-info disabled">
              <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
            </div>
            <div id="history-next" className="btn btn-info disabled">
              <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
            </div>
            <button id="run" type="submit" className="btn btn-info pull-right has-spinner" href="#" onClick={this.handleSubmit}>
              <span className="spinner"><i className="fa fa-refresh fa-spin"></i></span>
              Submit
            </button>
            <div id="notifications"></div>
            <div id="download">
              <h4>Download</h4>
              <button id="geojson" className="btn btn-info pull-left">Geojson</button>
              <button id="csv" className="btn btn-info pull-left">CSV</button>
            </div>
          </div>
          </div>
          <Map FeatureCollection={this.state.FeatureCollection}/>
          <div id="table">
          <table id="example" className="table table-striped table-bordered" cellSpacing="0">
            <thead>

            </thead>
            <tfoot>

            </tfoot>
            <tbody>

            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
    <App />,
    document.getElementById('root'),
);