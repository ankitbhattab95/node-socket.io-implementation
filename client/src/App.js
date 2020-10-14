import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import classes from './App.module.css'
import io from 'socket.io-client'
const endPoint = process.env.REACT_APP_WS_HOST

const socket = io(endPoint)

console.log('WS endPoint -------', endPoint)

function App() {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState(null);
  const [usernameSubmit, setUsernameSubmit] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState([]);

  const usernameRef = useRef(null)
  const messageRef = useRef(null)
  const divRef = useRef(null);

  useEffect(() => {
    if (usernameSubmit) {
      messageRef.current.focus()
      socket.on('chat message', function (msg) {
        setReceivedMessage((prevReceivedMessage) => [...prevReceivedMessage, msg])
      })
    }
    else {
      usernameRef.current.focus()
    }
  }, [usernameSubmit]);

  useEffect(() => {
    if (divRef.current) {
      const scrollHeight = divRef.current.scrollHeight;
      const height = divRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      divRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  });


  const onSubmit = async (event) => {
    event.preventDefault()
    if (message.trim().length > 0) {
      messageRef.current.focus()
      socket.emit('chat message', { username: username, message: message });
      setMessage("")
    }
  }

  const onUsernameSubmit = async (event) => {
    event.preventDefault()
    setUsername(username.charAt(0).toUpperCase() + username.slice(1))
    setUsernameSubmit(true)
  }

  const handleMessage = (event) => {
    setMessage(event.target.value)
  }

  const handleUsername = (event) => {
    setUsername(event.target.value)
  }

  const allMsg = receivedMessage.map((element, i) => {
    return (
      <span key={i} className={(element.username.toLowerCase() === username.toLowerCase()) ?
        classes.container2 :
        classes.container1}>
        <span className={(element.username.toLowerCase() === username.toLowerCase()) ?
          [classes.msgStyle1, classes.speechbubbleL, classes.speechbubbleleft].join(' ') :
          [classes.msgStyle2, classes.speechbubbleR, classes.speechbubbleright].join(' ')}>
          <b>{(element.username.toLowerCase() === username.toLowerCase()) ? "You" : element.username}</b>
          <br />
          {element.message.trim().split('\n').map(el => (<>{el}<br /></>))}
        </span  >
      </span>
    )
  })
  if (usernameSubmit) {
    return (
      <div className={classes.container}>
        <div className={classes.header}>
          Socket.io Implementation | {username.charAt(0).toUpperCase() + username.slice(1)}
        </div>
        <div ref={divRef} className={classes.container3}>
          {allMsg}
        </div>
        <Form className={classes.footer} onSubmit={(event) => onSubmit(event)}>
          <FormControl as="textarea" className={classes.input}
            ref={messageRef}
            onChange={(event) => { handleMessage(event) }}
            value={message}
            placeholder="Type a message"
          />
          <Button type="submit" variant="primary">Send</Button>
        </Form>
      </div >
    );
  }
  else {
    return (
      <Form className={classes.userform} onSubmit={(event) => onUsernameSubmit(event)}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control ref={usernameRef} required placeholder="Enter a dummy username"
            onChange={(event) => handleUsername(event)} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    )
  }
}

export default App;
