import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import getCsrf from "../util/getCsrf";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [todosLoaded, setTodosLoaded] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string>("");

  useEffect(() => {
    getCsrf().then((res) => {
      setCsrfToken(res.csrfToken);
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetch(`${import.meta.env.VITE_API_URL}/todo`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-CSRF-Token": csrfToken,
        },
        credentials: "include",
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setTodos(data);
          setTodosLoaded(true);
        });
    }
  }, [authenticated]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL, {
      query: {
        user_jwt: localStorage.getItem("token"),
      },
    });

    socket.on("created", (todoFromSocket: Todo) => {
      setTodos((todos) => [...todos, todoFromSocket]);
    });
    socket.on("deleted", (idObject: { id: number }) => {
      setTodos((todos) => todos.filter((todo) => todo.id !== idObject.id));
    });
    socket.on("updated", (todoFromSocket: Todo) => {
      setTodos((todos) =>
        todos.map((todo) => {
          if (todoFromSocket.id === todo.id) {
            todo = todoFromSocket;
          }
          return todo;
        })
      );
    });
  }, []);

  const createTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const titleOfTodo = (event.target as HTMLFormElement).titleOfTodo.value;
    const description = (event.target as HTMLFormElement).description.value;

    fetch(`${import.meta.env.VITE_API_URL}/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({
        title: titleOfTodo,
        completed: false,
        description,
      }),
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then(() => {
        (event.target as HTMLFormElement).titleOfTodo.value = "";
        (event.target as HTMLFormElement).description.value = "";
      });
  };

  const deleteTask = (id: number) => {
    fetch(`${import.meta.env.VITE_API_URL}/todo/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-CSRF-Token": csrfToken,
      },
      credentials: "include",
    });
  };

  const completeTask = (id: number) => {
    fetch(`${import.meta.env.VITE_API_URL}/todo/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({
        completed: true,
      }),
      credentials: "include",
    });
  };

  const uncompleteTask = (id: number) => {
    fetch(`${import.meta.env.VITE_API_URL}/todo/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({
        completed: false,
      }),
      credentials: "include",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Home
            </h1>
          </div>
        </header>
        <main>
          {/* Create new */}
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="rounded-lg">
                {authenticated ? (
                  <form className="space-y-6" onSubmit={createTask}>
                    <div>
                      <label
                        htmlFor="titleOfTodo"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Title
                      </label>
                      <div className="mt-1">
                        <input
                          id="titleOfTodo"
                          name="titleOfTodo"
                          type="text"
                          autoComplete="title"
                          required
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <div className="mt-1">
                        <input
                          id="description"
                          name="description"
                          type="text"
                          autoComplete="description"
                          required
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-6">
                    <p className="text-lg text-gray-500">
                      Please login to create a todo.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="rounded-lg">
                {authenticated ? (
                  <div className="p-6">
                    <ul className="space-y-6">
                      {todosLoaded &&
                        todos.map((todo) => {
                          return (
                            <TodoItem
                              key={todo.id}
                              id={todo.id}
                              title={todo.title}
                              description={todo.description}
                              completed={todo.completed}
                              deleteTask={deleteTask}
                              completeTask={completeTask}
                              uncompleteTask={uncompleteTask}
                              csrfToken={csrfToken}
                            />
                          );
                        })}
                    </ul>
                  </div>
                ) : (
                  <div className="p-6">
                    <p className="text-lg text-gray-500">
                      Please login to see your todos.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function TodoItem(
  props: Readonly<{
    id: number;
    title: string;
    description: string;
    completed: boolean;
    deleteTask: (id: number) => void;
    completeTask: (id: number) => void;
    uncompleteTask: (id: number) => void;
    csrfToken: string;
  }>
) {
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(props.title);
  const [description, setDescription] = useState(props.description);

  const editModeOn = () => {
    setEdit(true);
  };

  const editModeOff = () => {
    setEdit(false);
  };

  const saveEdit = () => {
    fetch(`${import.meta.env.VITE_API_URL}/todo/${props.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-CSRF-Token": props.csrfToken,
      },
      body: JSON.stringify({
        title: (
          document.getElementById(`titleOfTodo-${props.id}`) as HTMLInputElement
        ).value,
        description: (
          document.getElementById(`description-${props.id}`) as HTMLInputElement
        ).value,
      }),
      credentials: "include",
    }).then(() => {
      setTitle(
        (document.getElementById(`titleOfTodo-${props.id}`) as HTMLInputElement)
          .value
      );
      setDescription(
        (document.getElementById(`description-${props.id}`) as HTMLInputElement)
          .value
      );
      setEdit(false);
    });
  };

  return (
    <li className="border-2 border-black space-y-2 p-4">
      {!edit ? (
        <div>
          <h5 className="font-semibold text-xl">{props.title}</h5>
          {props.description}
        </div>
      ) : (
        <form>
          <div>
            <label
              htmlFor={`titleOfTodo-${props.id}`}
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <div className="mt-1">
              <input
                id={`titleOfTodo-${props.id}`}
                name={`titleOfTodo-${props.id}`}
                type="text"
                autoComplete="title"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                defaultValue={title}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor={`description-${props.id}`}
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <div className="mt-1">
              <input
                id={`description-${props.id}`}
                name={`description-${props.id}`}
                type="text"
                autoComplete="description"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                defaultValue={description}
              />
            </div>
          </div>
        </form>
      )}
      <div className="space-x-2">
        {!edit ? (
          <button
            onClick={editModeOn}
            className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={saveEdit}
              className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Save
            </button>
            <button
              onClick={editModeOff}
              className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Cancel
            </button>
          </>
        )}
        {props.completed ? (
          <button
            onClick={() => {
              props.uncompleteTask(props.id);
            }}
            className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Uncomplete
          </button>
        ) : (
          <button
            onClick={() => {
              props.completeTask(props.id);
            }}
            className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Complete
          </button>
        )}
        <button
          onClick={() => {
            props.deleteTask(props.id);
          }}
          className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default Home;
