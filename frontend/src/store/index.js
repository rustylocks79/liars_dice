import {createStore} from 'redux'

const initialState = {
    testStrings: [{id: 1, title: 'Test Post'}],
    lobbyId: "123456"
}

const reducer = (state = initialState, action) => {
    if (action.type === 'ADD_STRING') {
        return Object.assign({}, state, {
            testStrings: state.testStrings.concat(action.payload)
        })
    }

    if (action.type === 'CREATE_LOBBY') {
        return Object.assign({}, state, {
            lobbyId: action.payload
        })
    }

    return state
}

const store = createStore(reducer)

export default store