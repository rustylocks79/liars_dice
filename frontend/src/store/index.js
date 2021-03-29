import {createStore} from 'redux'

const initialState = {
    lobbyId: "123456",
    socket: null,
    players: [],
    bots: [],
    numDice: 0,
    host: "",

    hand: [],
    //TODO: dice counts, players and bots separate dice count lists, or a combined list of players
    currentBid: "",
    bidOwner: "",
    currentPlayer: ""
}

const reducer = (state = initialState, action) => {
    if (action.type === 'CREATE_LOBBY') {
        return Object.assign({}, state, {
            lobbyId: action.payload.lobbyId,
            socket: action.payload.socket,
            players: action.payload.players,
            bots: action.payload.bots,
            numDice: action.payload.numDice,
            host: action.payload.host
        })
    }

    if (action.type === 'JOIN_LOBBY_ID') {
        return Object.assign({}, state, {
            lobbyId: action.payload.lobbyId,
            players: action.payload.players,
            bots: action.payload.bots,
            numDice: action.payload.numDice,
            host: action.payload.host
        })
    }

    if (action.type === 'JOIN_LOBBY_SOCKET') {
        return Object.assign({}, state, {
            socket: action.payload.socket
        })
    }

    return state
}

const store = createStore(reducer)

export default store