import React, { useReducer } from 'react';
import './style.css';
import DigButton from './DigButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGITS: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  DELETE_DIGITS: 'delete-digit',
  CLEAR: 'clear',
  EVALUATE: 'evaluate',
};

function reducer(state, { type, payload }) {

  switch (type) {
    case ACTIONS.ADD_DIGITS:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (state.currentOperand === '0' && payload.digit === '0') {
        return state;
      }
      if (payload.digit === '.' && state.currentOperand.includes('.')) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.previousOperand == null ||
        state.currentOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
    case ACTIONS.DELETE_DIGITS:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
      default:
  }
}

function evaluate({ previousOperand, currentOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return '';

  let computation = '';
  switch (operation) {
    case '+':
      computation = prev + current;
      break;
    case '-':
      computation = prev - current;
      break;
    case '*':
      computation = prev * current;
      break;
    case '/':
      computation = prev / current;
      break;
      default:
  }
  return computation.toString();
}

// const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
//   maximumFractionDigits: 0,
// });
// function formatOperand(operand) {
//   if (operand == null) return;
// }

// const [integer, decimal] = operand.split('.');
// if (decimal == null) return INTEGER_FORMATTER.format(integer);
// return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;

export default function App() {
  const [{ previousOperand, currentOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {previousOperand} {operation}
        </div>
        <div className="current-operand">{currentOperand}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGITS })}>
        DEL
      </button>
      <OperationButton operation="/" dispatch={dispatch} />

      <DigButton digit="1" dispatch={dispatch} />
      <DigButton digit="2" dispatch={dispatch} />
      <DigButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigButton digit="4" dispatch={dispatch} />
      <DigButton digit="5" dispatch={dispatch} />
      <DigButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigButton digit="7" dispatch={dispatch} />
      <DigButton digit="8" dispatch={dispatch} />
      <DigButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigButton digit="." dispatch={dispatch} />
      <DigButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}
