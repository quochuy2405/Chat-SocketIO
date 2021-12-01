import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';
const socket = io.connect("http://localhost:4000")
function App() {
  const [ state, setState ] = useState({ message: "", name: "" })
	const [ chat, setChat ] = useState([])
	useEffect(
		() => {

			socket.on("message", ({ name, message }) => {
				setChat([ ...chat, { name, message } ])
			})
		},
		[ chat ]
	)

	const onTextChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value })
	}

	const onMessageSubmit = (e) => {
		const { name, message } = state
		socket.emit("message", { name, message })
		e.preventDefault()
		setState({ message: "", name })
	}

	const renderChat = () => {
		return chat.map(({ name, message }, index) => (
			<div key={index}>
				<h3>
					{name}: <span>{message}</span>
				</h3>
			</div>
		))
	}
  return (
    <div className='App'>
      <form onSubmit={onMessageSubmit}>
        <div>
          <p>name</p>
          <input
            type='text'
            name='name'
            onChange={(e) => onTextChange(e)}
            value={state.name}
          />
        </div>
        <div>
          <p>message</p>{' '}
          <input
            type='text'
            name='message'
            onChange={(e) => onTextChange(e)}
            value={state.message}
          />
        </div>
        <button type='submit'>send</button>
      </form>
      <div>
        <h2>Chat Box</h2>
        {renderChat()}
      </div>
    </div>
  );
}

export default App;
