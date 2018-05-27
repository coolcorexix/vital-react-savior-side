export function isOnl(data){
  return (dispatch)=>{
    setTimeout(() => {
            dispatch({type: "IS_ONLINE", payload: data});
        }, 1);
  }
}
export function editPhone(){
  return (dispatch)=>{
    setTimeout(()=>{
      dispatch({type: "EDIT_PHONE", payload: null});
    }, 1);
  }
}
export function drawMarkerState(data){
  return (dispatch)=>{
    setTimeout(() => {
            dispatch({type: "DRAW_MARKER", payload: data});
        }, 1);
  }
}
export function alertEnabled(data){
  return (dispatch)=>{
    setTimeout(() => {
            dispatch({type: "IS_ALERTED", payload: data});
        }, 1);
  }
};
export function isOff(data){
  return (dispatch)=>{
    setTimeout(() => {
            dispatch({type: "IS_OFFLINE", payload: data});
        }, 1);
  }
}
