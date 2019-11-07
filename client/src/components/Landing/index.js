import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: "(Click one of the buttons to see the results of each request)"
    };
  }

  post = async (endpoint) => {
    this.setState({result:""});
    try {
      let body = {
        firebaseIdToken: null,
        firebaseUid: null
      };

      //if the user is logged in, try to get the firebase token
      if(this.props.firebase.auth.currentUser) {
        const idToken = await this.props.firebase.auth.currentUser.getIdToken(true);
        console.log("got token from firebase!", idToken);
        body.firebaseIdToken = idToken;
        body.firebaseUid = this.props.firebase.auth.currentUser.uid;
      }

      //send the PORT request with the token (or not) in the body of the request
      const response = await fetch(process.env.REACT_APP_SERVER_URL+endpoint, {
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
      console.log("response from server", data);
      this.setState({result: data});
    }
    catch(error) {
      console.error('Error:', error);
    }
  };


  render() {
    const links = ["","loggedIn","roleA","roleB","roleAorB"];
    return (
      <div>
        {links.map((l,i) =>
          <div key={i}>
            <button onClick={e => this.post("/"+l)}>Send GET request to server "/{l}"</button>
            <br/><br/>
          </div>
        )}

        <hr/>

        <strong>Results: </strong>{this.state.result}
      </div>
    );
  }
}

export default withFirebase(Landing);
