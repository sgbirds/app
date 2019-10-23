import React, {Component, Fragment} from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      contributors: []
    };
  }

  async componentDidMount() {
    try {
      const baseUrl = "https://api.ebird.org/v2";
      const url = `${baseUrl}/product/top100/SG/2019/10/21`;

      const headers = {
        "X-eBirdApiToken": process.env.REACT_APP_EBIRD_API_TOKEN
      };

      const {data} = await axios.get(url, {headers});

      this.setState({contributors: data});
    } catch (err) {
      console.error(err);
    }
  }

  addProfileLink(contributor) {
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

  render() {
    return (
      <div className="App">
        <h1>Top Contributors in Singapore</h1>
        {this.state.contributors.map(contributor => (
          <div className="contributor" key={contributor.userId}>
            <h2>
              {contributor.userDisplayName}
              {this.addProfileLink(contributor)}
            </h2>
            <p>Number of species sighted: {contributor.numSpecies}</p>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
