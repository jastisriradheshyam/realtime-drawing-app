# Real-time Drawing

## Preface
This project was created while learning the react js, rethinkdb, web socket integration from the plural site course : `Building Real-time Apps with React, Socket.io, and RethinkDB`.

The code has been modified to match the latest version of all components at the time of writing, also changed some behaviors like port number passing from env instead of arguments in server app., and many others.

## Description
This application let us collaborate on the drawing (simple black and white) in real time.

### Features used
- RethinkDB change feed
- RxJS streaming capabilities
- Rx Sync buffering capabilities in time of network non-availability
- ReactJS for building UI using component model and also building state based UI.
- Socket.io for web sockets handling

## Tech stack
- NodeJS v12.x
- Socket.io
- RethinkDB v2.4
- ReactJS v16.13.x
- RxJS v6.x
- Rx sync
- simple-react-canvas (just for learning, not a production one)

## Usage

- add the following tables in the RethinkDB
    - `drawings`
        - used for storing the drawing names and id
    - `lines`
        - used to store lines, the actual drawing
    - `timers`

- Server
    - `cd server` from root directory of project
    - `npm start`
        - default port is `8000`
        - with particular port `HTTP_PORT=8001`
        - one can also set different config using env. variables (check in config.js)
- Client
    - `cd client` from root directory of project
    - `npm start`
    - if one want to connect to another server on different port
        - passively (I mean by restarting the server)
            - change `src/config.json`
        - actively (without restarting the server)
            - in URL bar in browser, after the base url all `?PORT_NUMBER`
            - example: if base url is `http://localhost:3000` then to connect to 8001 change the url to `http://localhost:3000?8001` and enter.

## References
Course: https://app.pluralsight.com/library/courses/react-socketio-rethinkdb-building-real-time-apps/table-of-contents