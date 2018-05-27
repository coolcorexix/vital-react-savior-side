export default function victimReducer(state={
  accident: 'undefined',
  phone: "",
  id: undefined,
  address: '',
  coordinates:{
    longitude: undefined,
    latitude: undefined
  }
}, action){
  switch (action.type) {
    case "VICTIM_ACCIDENT":
      {
        state.accident = action.payload;
        return state;
      }
      break;
    case "VICTIM_ID":
      {
        state.id = action.payload;
        return state;
      }
      break;
    case "PHONE_VICTIM":
    {
      state.phone= action.payload;
    }
    case "LOCATION_VICTIM":
    {
      return {...state, coordinates: action.payload};
    }
      break;
    case "ADDRESS_VICTIM":
    {
      return {...state, address: action.payload};
    }
      break;
    default:
      return {...state};
  }


}
