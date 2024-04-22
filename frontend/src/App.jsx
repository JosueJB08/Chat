import { useState } from 'react';
import './App.css'
import io from 'socket.io-client'
import Chat from './Chat';
import { Container,Card, Icon,Form, FormField,Button } from 'semantic-ui-react'



const socket = io.connect("http://localhost:3001");

function App() {

  const [username, setUsername]= useState("");
  const [room, setRoom]= useState("");
  const [showChat, setShowChat]= useState(false);


  const joinRoom = () =>{
    if (username !== "" && room !== "" ) {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  }


  return (
    <Container>
      {!showChat ? (
        <Card fluid>
          <Card.Content header="UNIRME AL CHAT"/>
          <Card.Content> 
            <Form>
              <FormField>
                <label>Usuario</label>
                <input type="text" placeholder='Username'
                  onChange={
                  e => setUsername(e.target.value)} />
              </FormField>
              <FormField>
                <label>ID de la sala</label>
                <input type="text" placeholder='Id Sala'
                  onChange={
                  e => setRoom(e.target.value)} />
              </FormField>
              <Button onClick={joinRoom}>Unirme</Button>
            </Form>
          </Card.Content>
          <Card.Content extra>
            <Icon name='user'/> 
          </Card.Content>
        </Card>
        )
        :
        (
        <Chat socket={socket} username={username} room={room}/>
      )}

    </Container>

  )
}

export default App
