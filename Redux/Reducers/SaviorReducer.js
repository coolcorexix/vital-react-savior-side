export default function saviorReducer(state={
  id:'',
  phone: undefined,
  locationUpdated: false,
  address: "",
  coordinates:{
    longitude: undefined,
    latitude: undefined
  }
}, action){
  switch (action.type) {
    case "SAVIOR_ID_RETRIEVE":{
      state.id = action.payload;
      return state;
    }
      break;
    case "SAVIOR_PHONE_RETRIEVE":{
      state.phone = action.payload;
      return state;
    }
      break;
    case "SAVIOR_COORDINATES_UPDATE":
    {
      state.locationUpdated = action.payload;
      return state;
    }
      break;
      case "ADDRESS_RETRIEVE":
  {
    return {...state, address: action.payload};
  }
    break;
    case "COORDINATES_RETRIEVE":
  {
    state.coordinates = action.payload;
    return state;
  }
    break;
  default:
    return {...state};
  }
}
