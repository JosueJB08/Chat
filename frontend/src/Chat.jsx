import  { useEffect, useState } from 'react'
import { Card,CardContent,Container, Form, Icon, Message, } from 'semantic-ui-react'
import ScrollToBottom from 'react-scroll-to-bottom'

const Chat = ({socket,username,room}) =>{

    const [currentMessage, setCurrentMessage] = useState("");
    const [messagesList, setMessagesList] = useState([]);

    const sendMessage = async () => {
        if(username && currentMessage){
            const info = {
                message:currentMessage, 
                room:room,
                author: username,
                time: new Date(Date.now()).getHours() + ":" 
                + new Date(Date.now()).getMinutes() +  ":"
                + new Date(Date.now()).getSeconds()
            };
            
            await socket.emit("send_messages", info);
            setMessagesList((list) => [...list,info]);
            setCurrentMessage("");
        }
    }

    useEffect(() => {
        const messageHanle = (data)=>{
            setMessagesList((list) => [...list,data]);
        }
        socket.on("receive_message", messageHanle);
        return () => socket.off("receive_message", messageHanle);
    },[socket])

    return (
        <Container >
            <Card fluid>
                <CardContent header={`Chat online || Sala : ${room}`} />
                <ScrollToBottom>
                    <CardContent style = {{height:"400px", padding:"5px"}}>
                        {messagesList.map((item,i)=>{
                            return <span key={i}>
                                <Message style={{
                                    textAlign:
                                    username === item.author ? 'right' : 'left'}}
                                success = {username === item.author}
                                info={username!==item.author}>
                                    <Message.Header>{item.message}</Message.Header>
                                    <p>
                                    Enviado por: <strong>{item.author}</strong> <i>A las :{item.time}</i>
                                    </p>
                                </Message>
                            </span>
                            
                        })}
                    </CardContent>
                </ScrollToBottom>
                <CardContent extra>
                    <Form>
                        <Form.Field >
                            <div className='ui action input'>
                                <input 
                                    value={currentMessage}
                                    type="text" 
                                    placeholder='Mensaje'
                                    onChange={ e => setCurrentMessage(e.target.value)}
                                    onKeyUp={(e)=>{
                                        if(e.key==="Enter") sendMessage()
                                    }}
                                />
                                <button type="button" onClick={() =>sendMessage()} className='ui teal icon right labeled button'>
                                    <Icon name='send'/>
                                    Enviar
                                </button>
                            </div>
                            
                        </Form.Field>
                        <Card.Content extra>
                            <Icon name='user'/> <label>{username}</label>
                        </Card.Content>
                    </Form>
                </CardContent>
            </Card>
        </Container>
    )


}

export default Chat