import {createStore} from 'redux'

const initialState = {
    lobbyId: "",
    socket: null,
    players: [],
    bots: [],
    numDice: 0,
    host: "",

    hand: [],
    activeDice: [],
    currentBid: "",
    bidOwner: "",
    currentPlayer: 0,
    bidHistory: [],

    index: 0
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

    if (action.type === 'START_GAME') {
        return Object.assign({}, state, {
            index: action.payload.index,
            activeDice: action.payload.activeDice,
            currentPlayer: action.payload.currentPlayer,
            players: action.payload.players,
            bots: action.payload.bots,
            bidHistory: [],
            hand: action.payload.hand
        })
    }

    if(action.type === 'RAISE') {
        return Object.assign({}, state, {
            bidHistory: action.payload.bidHistory,
            currentPlayer: action.payload.currentPlayer
        })
    }

    if(action.type === 'DOUBT') {
        return Object.assign({}, state, {
            bidHistory: [],
            currentPlayer: action.payload.currentPlayer,
            activeDice: action.payload.activeDice,
            hand: action.payload.hand
        })
    }
    return state
}

const store = createStore(reducer)

export default store