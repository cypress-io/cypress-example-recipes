module.exports = {
  "__version": "1.1.3",
  "adds numbers": {
    "1": 5,
    "2": 11,
    "negatives": -9
  },
  "UI to Vuex store": {
    "has loading, newTodo and todos properties": {
      "1": [
        "loading",
        "todos",
        "newTodo"
      ]
    },
    "starts empty": {
      "1": {
        "todos": [],
        "newTodo": ""
      }
    },
    "can enter new todo text": {
      "1": "learn how to test with Cypress.io"
    },
    "stores todos in the store": {
      "1": [
        {
          "title": "first todo",
          "completed": false
        },
        {
          "title": "second todo",
          "completed": false
        }
      ]
    },
    "stores todos in the store (with ids)": {
      "1": [
        {
          "title": "first todo",
          "completed": false,
          "id": "1"
        },
        {
          "title": "second todo",
          "completed": false,
          "id": "2"
        }
      ]
    }
  },
  "Vuex store": {
    "starts empty": {
      "1": []
    },
    "can enter new todo text": {
      "1": "learn how to test with Cypress.io"
    },
    "can compare the entire store": {
      "1": {
        "loading": false,
        "todos": [],
        "newTodo": ""
      }
    },
    "starts typing after delayed server response": {
      "1": "<input autofocus=\"autofocus\"\n  autocomplete=\"off\"\n  placeholder=\"What needs to be done?\"\n  class=\"new-todo\">"
    },
    "can add a todo, type and compare entire store": {
      "1": {
        "loading": false,
        "todos": [
          {
            "title": "a random todo",
            "completed": false,
            "id": "1"
          }
        ],
        "newTodo": "learn how to test with Cypress.io"
      }
    },
    "can add a particular todo": {
      "1": [
        {
          "title": "a single todo 1",
          "completed": false,
          "id": "2"
        }
      ]
    },
    "can add two todos and delete one": {
      "1": [
        {
          "title": "todo 2",
          "completed": false,
          "id": "4"
        }
      ]
    },
    "can be driven by dispatching actions": {
      "1": {
        "loading": false,
        "todos": [
          {
            "title": "a new todo",
            "completed": false,
            "id": "1"
          }
        ],
        "newTodo": ""
      }
    }
  },
  "Store actions": {
    "changes the state": {
      "1": {
        "loading": false,
        "todos": [],
        "newTodo": ""
      }
    },
    "changes the state after delay": {
      "1": {
        "loading": false,
        "todos": [],
        "newTodo": ""
      }
    },
    "calls server": {
      "1": {
        "title": "a new todo",
        "completed": false,
        "id": "1"
      }
    },
    "calls server with delay": {
      "1": {
        "title": "a new todo",
        "completed": false,
        "id": "1"
      }
    }
  },
  "via API": {
    "adds todo deep": {
      "1": [
        {
          "title": "first todo",
          "completed": false,
          "id": "1"
        },
        {
          "title": "second todo",
          "completed": false,
          "id": "2"
        }
      ]
    },
    "adds and deletes a todo": {
      "1": [
        {
          "title": "first todo",
          "completed": false,
          "id": "1"
        }
      ]
    }
  },
  "API": {
    "is adding todo item": {
      "1": {
        "title": "first item",
        "completed": false,
        "id": "1"
      }
    }
  }
}
