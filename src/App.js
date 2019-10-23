import React, {Component, Fragment} from "react";
import axios from "axios";
import "./App.css";
import logo from "./logo.png";

class App extends Component {
  constructor(prop) {
    super(prop);

    this.state = {
      date: this.getCurrentDate(),
      contributors: []
    };
  }

  async componentDidMount() {
    await this.fetchTopContributions();
  }

  async fetchTopContributions() {
    try {
      const baseUrl = "https://api.ebird.org/v2";
      const date = this.state.date.split("-").join("/");
      const url = `${baseUrl}/product/top100/SG/${date}`;

      console.log(url);

      const headers = {
        "X-eBirdApiToken": process.env.REACT_APP_EBIRD_API_TOKEN
      };

      const {data} = await axios.get(url, {headers});

      this.setState({contributors: data});
    } catch (err) {
      console.error(err);
    }
  }

  getCurrentDate() {
    const d = new Date(Date.now());
    return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join("-");
  }

  datePicker = event => {
    this.setState({date: event.target.value}, () => {
      this.fetchTopContributions();
    });
  };

  renderProfileLink(contributor) {
    if (contributor && contributor.profileHandle) {
      return (
        <Fragment>
          {" - "}
          <a
            href={`https://ebird.org/profile/${contributor.profileHandle}/world`}
          >
            Profile
          </a>
        </Fragment>
      );
    }
  }

  renderTopContributions() {
    if (this.state.contributors.length === 0) {
      return <h2>No records found for {this.state.date}</h2>;
    }

    return this.state.contributors.map(contributor => (
      <div className="contributor" key={contributor.userId}>
        <h2>
          {contributor.userDisplayName}
          {this.renderProfileLink(contributor)}
        </h2>
        <p>Number of species observed: {contributor.numSpecies}</p>
      </div>
    ));
  }

  render() {
    return (
      <div className="App">
        <img className="logo" alt="logo" src={logo} />
        <h1>Top Contributors in Singapore</h1>
        <input type="date" onChange={this.datePicker} value={this.state.date} />
        {this.renderTopContributions()}
      </div>
    );
  }
}

export default App;
