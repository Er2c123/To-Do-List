import { useEffect, useState } from 'react'
import axios from 'axios'
import '../App.css';

function Homepage() {
  const [itemText, setItemText] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');
  const [displayComp, setDisplayComp] = useState(false);

  //addItem allows for user to add todo items to list
  const addItem = async (e) => {
    e.preventDefault();
    try {
      const bodyParameters = {
        username: localStorage.getItem('username'),
        itemText: itemText,
      };

      const res = await axios.post('http://localhost:9999/api/item',
        bodyParameters,
      )

      const currItems = res.data;
      setItemText('');
      setListItems(currItems);
    } catch (err) {
      console.log(err);
    }

  }

//once user is authorized, then the user's item list is automatically displayed on the screen
  useEffect(() => {
    const getItemsList = async () => {
      const localUsername = localStorage.getItem('username');
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      };
      const bodyParameters = {
        username: localStorage.getItem('username')
      };
      const res = await axios.post('http://localhost:9999/api/items',
        bodyParameters,
        config
      )
      const currItems = res.data;

      setListItems(currItems);
     
    }
    //if username is not stored in local storage, then user is not logged in. So, there shouldn't be an items list displayed
    if (!localStorage.getItem('username')) {
      alert("You need to create acct and login first.")
      setDisplayComp(false);
    } else {
      getItemsList()
      setDisplayComp(true);
    }
  }, []);

  //allows for user to delete items from todo list
  const deleteItem = async (item) => {
    const getItemsList = async () => {

      const localUsername = localStorage.getItem('username');
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      };
      const bodyParameters = {
        username: localStorage.getItem('username')
      };
      const res = await axios.post('http://localhost:9999/api/items',
        bodyParameters,
        config
      )
      const currItems = res.data;

      setListItems(currItems);
    
    }

    try {
      const currUsername = localStorage.getItem('username');
      //currItem is the item that is being removed
      const currItem = item;
      const bodyParameters = {
        username: currUsername,
        item: currItem
      };
      const res = await axios.post('http://localhost:9999/api/item/remove', bodyParameters);
      getItemsList();
      //call getItemsList again to reload the item list
    } catch (err) {
      console.log(err);
    }
  }


  //allows for user to edit what the item text displays
  const updateItem = async (e) => {
    //authorizes user and displays item list for specific user
    const getItemsList = async () => {
      const localUsername = localStorage.getItem('username');
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      };
      const bodyParameters = {
        username: localStorage.getItem('username')
      };
      const res = await axios.post('http://localhost:9999/api/items',
        bodyParameters,
        config
      )
      const currItems = res.data;

      setListItems(currItems);
     
    }

    
    e.preventDefault();
    const localUsername = localStorage.getItem('username');
    const bodyParameters = {
      username: localStorage.getItem('username'),
      isUpdating: isUpdating,
      updateItemText: updateItemText
    };
    const res = await axios.post('http://localhost:9999/api/item/update',
      bodyParameters,
    )

    //sets the item 
    setUpdateItemText('');
    setIsUpdating('');
    getItemsList();
   
  }
  const renderUpdateForm = () => (
    //if an item is currently being updated based on the isUpdating state, then this component will render
    <form className="update-form" onSubmit={(e) => { updateItem(e) }}>
      <input className="update-new-input" type="text" placeholder="New Item" onChange={e => { setUpdateItemText(e.target.value) }} value={updateItemText} />
      <button className="update-new-btn" type="submit"> Edit </button>
    </form>
  )


  return (
    <div>
      {displayComp ?
      //depending on if item is updating, then different component will be rendered
        (<div className="App">
          <h1> Todo List</h1>
          <form className="form" onSubmit={e => addItem(e)}>
            <input type="text" placeholder='Add Todo Item' onChange={e => { setItemText(e.target.value) }} value={itemText} />
            <button type="submit"> Add </button>
          </form>
          <div className="todo-listItems">
            {
              listItems.map(item => (
                <div className="todo-item">
                  {
                    isUpdating === item
                      ?
                      renderUpdateForm()
                      :
                      <>
                        <p className="item-content"> {item} </p>
                        <button className="update-item" onClick={() => { setIsUpdating(item) }}> Edit</button>
                        <button className="delete-item" onClick={() => { deleteItem(item) }}> Delete </button>
                      </>
                  }
                </div>
              ))
            }
          </div>
        </div>) :
        //if user not logged in, then no list should be displayed
        <p class = "homepage-not-logged-in"> First, create an acct and login </p>}

    </div>
  );

}

export default Homepage;
