import firebase from '../../Firebase/config/firebase';
export default function statusReducer(state={
  isOnl: true,
  drawMarker: false,
  isAlerted: false,
  editPhone: false
}, action){
  switch (action.type) {
    case 'EDIT_PHONE':
    {
      state.editPhone = true;
      return state;
    }
    case "IS_ONLINE":
    {
      state.isOnl = true;
      firebase.database().ref(`OnlineSavior/${action.payload.key}`).set(action.payload.data);
      return state;
    }
      break;
    case "IS_OFFLINE":
      {
        state.isOnl = false;
        firebase.database().ref('OnlineSavior').remove(action.payload);
        firebase.database().ref(`OnlineSavior/${action.payload.key}`).off();
        return state;
      }
        break;
      case 'DRAW_MARKER':
      {
        state.drawMarker = action.payload;
        return state;
      }
      break;
      case "IS_ALERTED":
      {
        state.isAlerted = action.payload;
      }
    default:
      return {...state};
  }
}
