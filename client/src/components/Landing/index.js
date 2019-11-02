import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: ""
    };
  }

  get = async (url) => {
    try {
      const response = await fetch(url);
      let data = await response.json();
      console.log("awaited response", data);
      this.setState({result: data});
    }
    catch(error) {
      console.error('Error:', error);
    }
  };


  render() {
    return (
      <div>
        <div>
          <button onClick={e => this.get("http://localhost:5000/")}>Send GET request to server "/"</button>
          {this.state.result ? "Result: "+this.state.result : ""}
        </div>
      </div>
    );
  }
}

export default withFirebase(Landing);
