export function retrieveLocationVictim(data){
  return (dispatch)=>{
    setTimeout(() => {
            dispatch({type: "LOCATION_VICTIM", payload: data});
        }, 20);
  }
}
export function retrievePhoneVictim(data){
  return (dispatch)=>{
    setTimeout(() => {
            dispatch({type: "PHONE_VICTIM", payload: data});
        }, 20);
  }
}
export function retrieveAccidentVictim(data){
  return (dispatch)=>{
    setTimeout(() => {
            dispatch({type: "VICTIM_ACCIDENT", payload: data});
        }, 20);
  }
}
export function retrieveVictimId(data){
  return (dispatch)=>{
    setTimeout(() => {
            dispatch({type: "VICTIM_ID", payload: data});
        }, 10);
  }
}
export function retrieveAddressVictim(data){
  return (dispatch)=>{
    setTimeout(() => {
            dispatch({type: "ADDRESS_VICTIM", payload: data});
        }, 20);
  }
}
