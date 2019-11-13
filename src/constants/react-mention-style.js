export default {
  control: {
    backgroundColor: '#fff',

    fontSize: 12,
    fontWeight: 'normal'
  },

  highlighter: {
    overflow: 'hidden'
  },

  input: {
    margin: 0
  },

  '&singleLine': {
    control: {
      display: 'inline-block',

      width: 130
    },

    highlighter: {
      padding: 1,
      border: '2px inset transparent'
    },

    input: {
      padding: 1,

      border: '2px inset'
    }
  },

  '&multiLine': {
    control: {
      border: '0px'
    },

    highlighter: {
      padding: 9
    },

    input: {
      border: '1px solid #ccc',
      borderRadius: '4px',
      boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
      width: '100%',
      padding: ' 6px 12px',
      fontSize: '14px',
      lineHeight: '1.42',
      height: '34px',
      color: '#555',
      outline: 'none'
    }
  },

  suggestions: {
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 10,
      maxHeight: '200px',
      overflow: 'auto'
    },

    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',

      '&focused': {
        backgroundColor: '#cee4e5'
      }
    }
  }
};
