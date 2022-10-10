import { ACTIONS } from './App';
import React from 'react';

export default function DigButton({ dispatch, digit }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.ADD_DIGITS, payload: { digit } })}
    >
      {digit}
    </button>
  );
}
