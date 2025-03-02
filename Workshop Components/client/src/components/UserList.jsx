import { useEffect, useState } from "react";

import userService from "../services/userService";

import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
import UserListItem from "./UserListItem";
import UserCreate from "./UserCreate";
import UserInfo from "./UserInfo";
import UserDelete from "./UserDelete";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [showUserCreate, setShowUserCreate] = useState(false);
  const [userIdInfo, setUserIdInfo] = useState(null); // it can be () => undefined
  const [userIdDelete, setUserIdDelete] = useState(null);
  const [userIdEdit, setUserIdEdit] = useState(null);
  const [searchData, setSearchData] = useState({});
  // const [cleanSearch, setCleanSearch] = useState(false);

  useEffect(() => {
    userService.getAll().then((result) => {
      setUsers(result);
    });
  }, []);

  const createUserClickHandler = () => {
    setShowUserCreate(true);
  };

  // if event is triggered set to false and hide the form
  const closeCreateUserClickHandler = () => {
    setShowUserCreate(false);
    setUserIdEdit(null);
  };

  // handler for save the new user
  const saveCreateUserClickHandler = async (e) => {
    // stop the default behaviour
    e.preventDefault();

    // get all the data from the form
    // const userData = Object.fromEntries(new FormData(e.target));
    // const formData = new FormData(e.target);
    const formData = new FormData(e.target.parentElement.parentElement);

    const userData = Object.fromEntries(formData);

    // create new user on the server
    const newUser = await userService.create(userData);
    // console.log(newUser);

    // currentUsers - the current users, this is the old state and we are updating based on it | 1 == 2
    // setUsers(currentUsers => [...currentUsers, newUser]) // 1
    setUsers((state) => [...state, newUser]); // 2

    // update local state
    setShowUserCreate(false);
  };

  const userInfoClickHandler = (userid) => {
    setUserIdInfo(userid);
    // console.log('show info', userid);
  };

  const userInfoCloseHandler = () => {
    setUserIdInfo(null);
  };

  const userDeleteClickHandler = (userId) => {
    setUserIdDelete(userId);
  };

  const userDeleteCloseHandler = () => {
    setUserIdDelete(null);
  };

  // will use the already set user for delete click handler
  const userDeleteHandler = async () => {
    // delete request to server
    await userService.deleteOne(userIdDelete);

    // delete from local state
    setUsers((state) => state.filter((user) => user._id !== userIdDelete));

    // close modal
    setUserIdDelete(null);
  };

  const userEditClickHandler = async (userId) => {
    setUserIdEdit(userId);
  };

  const saveEditUserClickHandler = async (e) => {
    const userId = userIdEdit;
    e.preventDefault();

    // const formData = new FormData(e.target);
    const formData = new FormData(e.target.parentElement.parentElement);
    const userData = Object.fromEntries(formData);

    // update user on server
    const updatedUser = await userService.updateOne(userId, userData);

    // update local state
    setUsers((state) =>
      state.map((user) => (user._id === userId ? updatedUser : user))
    );

    // close modal
    setUserIdEdit(null);
  };

  const searchBarHandler = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target))
    setSearchData(data)
    console.log('searching information', data);
  }

  const clearSearchCloseHandler = (e) => {
    setSearchData(state => ({...state, search: ''}))
    // console.log();
    e.currentTarget.previousElementSibling.value = ''
    console.log('clear input');
    
  }

  return (
    <>
      <section className="card users-container">
        <SearchBar onSearch={searchBarHandler} {...searchData} onClean={clearSearchCloseHandler}/>
        {/* onClean={clearSearchCloseHandler} cleanOrNot={cleanSearch} */}

        {/* pass the new function as onClose */}
        {showUserCreate && (
          <UserCreate
            onClose={closeCreateUserClickHandler}
            onSave={saveCreateUserClickHandler}
          />
        )}

        {userIdInfo && (
          <UserInfo userId={userIdInfo} onClose={userInfoCloseHandler} />
        )}

        {userIdDelete && (
          <UserDelete
            onClose={userDeleteCloseHandler}
            onDelete={userDeleteHandler}
          />
        )}

        {userIdEdit && (
          <UserCreate
            userId={userIdEdit}
            onClose={closeCreateUserClickHandler}
            onEdit={saveEditUserClickHandler}
          />
        )}

        {/* <!-- Table component --> */}
        <div className="table-wrapper">
          {/* <!-- Overlap components  --> */}
          <div className="overlaps">
            {/* <div className="loading-shade"> */}
            {/* <!-- Loading spinner  --> */}
            {/* <div className="spinner"></div> */}
            {/* No users added yet */}
            {/* <div className="table-overlap">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="triangle-exclamation"
                  className="svg-inline--fa fa-triangle-exclamation Table_icon__+HHgn"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M506.3 417l-213.3-364c-16.33-28-57.54-28-73.98 0l-213.2 364C-10.59 444.9 9.849 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM232 168c0-13.25 10.75-24 24-24S280 154.8 280 168v128c0 13.25-10.75 24-23.1 24S232 309.3 232 296V168zM256 416c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 401.9 273.4 416 256 416z"
                  ></path>
                </svg>
                <h2>There is no users yet.</h2>
              </div> */}
            {/* <!-- No content overlap component  --> */}
            {/* <div className="table-overlap">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="triangle-exclamation"
                  className="svg-inline--fa fa-triangle-exclamation Table_icon__+HHgn"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M506.3 417l-213.3-364c-16.33-28-57.54-28-73.98 0l-213.2 364C-10.59 444.9 9.849 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM232 168c0-13.25 10.75-24 24-24S280 154.8 280 168v128c0 13.25-10.75 24-23.1 24S232 309.3 232 296V168zM256 416c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 401.9 273.4 416 256 416z"
                  ></path>
                </svg>
                <h2>Sorry, we couldn't find what you're looking for.</h2>
              </div> */}
            {/* <!-- On error overlap component  --> */}
            {/* <div className="table-overlap">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="triangle-exclamation"
                  className="svg-inline--fa fa-triangle-exclamation Table_icon__+HHgn"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M506.3 417l-213.3-364c-16.33-28-57.54-28-73.98 0l-213.2 364C-10.59 444.9 9.849 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM232 168c0-13.25 10.75-24 24-24S280 154.8 280 168v128c0 13.25-10.75 24-23.1 24S232 309.3 232 296V168zM256 416c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 401.9 273.4 416 256 416z"
                  ></path>
                </svg>
                <h2>Failed to fetch</h2>
              </div> */}
            {/* </div> */}
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>
                  First name
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="arrow-down"
                    className="icon svg-inline--fa fa-arrow-down Table_icon__+HHgn"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path
                      fill="currentColor"
                      d="M374.6 310.6l-160 160C208.4 476.9 200.2 480 192 480s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 370.8V64c0-17.69 14.33-31.1 31.1-31.1S224 46.31 224 64v306.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0S387.1 298.1 374.6 310.6z"
                    ></path>
                  </svg>
                </th>
                <th>
                  Last name
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="arrow-down"
                    className="icon svg-inline--fa fa-arrow-down Table_icon__+HHgn"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path
                      fill="currentColor"
                      d="M374.6 310.6l-160 160C208.4 476.9 200.2 480 192 480s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 370.8V64c0-17.69 14.33-31.1 31.1-31.1S224 46.31 224 64v306.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0S387.1 298.1 374.6 310.6z"
                    ></path>
                  </svg>
                </th>
                <th>
                  Email
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="arrow-down"
                    className="icon svg-inline--fa fa-arrow-down Table_icon__+HHgn"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path
                      fill="currentColor"
                      d="M374.6 310.6l-160 160C208.4 476.9 200.2 480 192 480s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 370.8V64c0-17.69 14.33-31.1 31.1-31.1S224 46.31 224 64v306.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0S387.1 298.1 374.6 310.6z"
                    ></path>
                  </svg>
                </th>
                <th>
                  Phone
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="arrow-down"
                    className="icon svg-inline--fa fa-arrow-down Table_icon__+HHgn"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path
                      fill="currentColor"
                      d="M374.6 310.6l-160 160C208.4 476.9 200.2 480 192 480s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 370.8V64c0-17.69 14.33-31.1 31.1-31.1S224 46.31 224 64v306.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0S387.1 298.1 374.6 310.6z"
                    ></path>
                  </svg>
                </th>
                <th>
                  Created
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="arrow-down"
                    className="icon active-icon svg-inline--fa fa-arrow-down Table_icon__+HHgn"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path
                      fill="currentColor"
                      d="M374.6 310.6l-160 160C208.4 476.9 200.2 480 192 480s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 370.8V64c0-17.69 14.33-31.1 31.1-31.1S224 46.31 224 64v306.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0S387.1 298.1 374.6 310.6z"
                    ></path>
                  </svg>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserListItem
                  key={user._id}
                  {...user}
                  onInfoClick={userInfoClickHandler}
                  onDeleteClick={userDeleteClickHandler}
                  onEditClick={userEditClickHandler}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* <!-- New user button  --> */}
        <button className="btn-add btn" onClick={createUserClickHandler}>
          Add new user
        </button>

        {/* <Pagination /> */}
      </section>
    </>
  );
}
