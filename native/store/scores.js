import axios from 'axios'

import CONFIG from '../api-routes'
const apiURL = CONFIG.API_URL

const defaultUserScores = []

/*--------actions-------*/

const GET_USER_SCORES = 'GET_USER_SCORES'

/*--------action creators-------*/

const getUserScores = users => ({ type: GET_USER_SCORES, users })

/*--------thunk creators-------*/

export const fetchUserScores = (communityId, month) => dispatch => {
  axios.
  get(`${apiURL}/communities/${communityId}/scores/${month}`)
    .then(res => {
      dispatch(getUserScores(res.data || defaultUserScores))})
    .catch(err => console.log(err))
}

/*--------reducer-------*/

export default function (state = defaultUserScores, action) {
  switch (action.type) {
    case GET_USER_SCORES:
      return action.users;
    default:
      return state;
  }
}
