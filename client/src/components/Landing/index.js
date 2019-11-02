import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: ""
    };
  }

  post = async (url) => {
    try {
      let body = { firebaseIdToken: null };
      if(this.props.firebase.auth.currentUser) {
        const idToken = await this.props.firebase.auth.currentUser.getIdToken(true);
        console.log(idToken);
        body.firebaseIdToken = idToken;
      }


      const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(body) // body data type must match "Content-Type" header
      });
      const data = await response.json();
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
          <button onClick={e => this.post("http://localhost:5000/")}>Send GET request to server "/"</button>
        </div>

        <br/>

        <div>
          <button onClick={e => this.post("http://localhost:5000/loggedIn")}>Send GET request to server "/loggedIn"</button>
        </div>

        <br/>

        {this.state.result ? "Result: "+this.state.result : ""}
      </div>
    );
  }
}

export default withFirebase(Landing);
