// cartReducer.js

const initialState = {
  items: [],
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      // Check if the item is already in the cart
      const itemIndex = state.items.findIndex((item) => item.id === action.payload.id);
      if (itemIndex > -1) {
        // If the item is already in the cart, update the quantity
        const updatedItems = [...state.items];
        updatedItems[itemIndex].quantity += 1;
        return { ...state, items: updatedItems };
      }
      // If the item is not in the cart, add it to the cart
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };

    case 'REMOVE_FROM_CART':
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };

    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    default:
      return state;
  }
};
