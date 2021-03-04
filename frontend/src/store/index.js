import {createStore} from 'redux'

const initialState = {
    lobbyId: "123456",
    socket: null
}

const reducer = (state = initialState, action) => {
    if (action.type === 'CREATE_LOBBY') {
        return Object.assign({}, state, {
            lobbyId: action.payload.lobbyId,
            socket: action.payload.socket
        })
    }

    if (action.type === 'JOIN_LOBBY') {
        return Object.assign({}, state, {
            lobbyId: action.payload
        })
    }

    return state
}

const store = createStore(reducer)

export default store