import {combineReducers} from 'redux';
import statusReducer from './StatusReducer';
import victimReducer from './VictimReducer';
import saviorReducer from './SaviorReducer';


//Combine all the reducer

const rootReducer = combineReducers({
  saviorReducer,
  statusReducer,
  victimReducer
})

export default rootReducer;
