export function saviorCoordinatesUpdate(data){
  return (dispatch)=>{
    setTimeout(() => {
            dispatch({type: "SAVIOR_COORDINATES_UPDATE", payload: data});
        }, 10);
  }
}
export function saviorIdRetrieve(data){
  return (dispatch)=>{
    setTimeout(() => {
            dispatch({type: "SAVIOR_ID_RETRIEVE", payload: data});
        }, 200);
  }
}
export function saviorPhoneRetrieve(data){
  return (dispatch)=>{
    setTimeout(() => {
            dispatch({type: "SAVIOR_PHONE_RETRIEVE", payload: data});
        }, 10);
  }
}
