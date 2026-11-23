import type { Express, Request, Response } from "express";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  description?: string;
};

let todos: Todo[] = [
  { id: 1, title: "Task 1", completed: false },
  { id: 2, title: "Task 2", completed: true },
  { id: 3, title: "Task 3", completed: false },
  { id: 4, title: "Task 4", completed: true },
];

export default function WorkingWithRemoteArrays(app: Express) {
  const getTodos = (req: Request, res: Response) => {
    const { completed } = req.query;
    if (completed !== undefined) {
      const completedBool = completed === "true";
      res.json(todos.filter((todo) => todo.completed === completedBool));
      return;
    }
    res.json(todos);
  };

  const getTodoById = (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const todo = todos.find((todo) => todo.id === parseInt(id));
    res.json(todo);
  };

  const createTodo = (req: Request, res: Response) => {
    todos.push({
      id: new Date().getTime(),
      title: "New Task",
      completed: false,
    });
    res.json(todos);
  };

  const removeTodo = (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((todo) => todo.id === parseInt(id));
    todos.splice(todoIndex, 1);
    res.json(todos);
  };

  const updateTodoTitle = (req: Request<{ id: string; title: string }>, res: Response) => {
    const { id, title } = req.params;
    const todo = todos.find((todo) => todo.id === parseInt(id));
    todo.title = title;
    res.json(todos);
  };

  const updateTodoCompleted = (
    req: Request<{ id: string; completed: string }>,
    res: Response,
  ) => {
    const { id, completed } = req.params;
    const todo = todos.find((todo) => todo.id === parseInt(id));
    todo.completed = completed === "true";
    res.json(todos);
  };

  const updateTodoDescription = (
    req: Request<{ id: string; description: string }>,
    res: Response,
  ) => {
    const { id, description } = req.params;
    const todo = todos.find((todo) => todo.id === parseInt(id));
    todo.description = description;
    res.json(todos);
  };

  const updateTodo = (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));

    if (todoIndex === -1) {
      res.status(404).json({
        message: `Unable to update Todo with ID ${id}`,
      });
      return;
    }

    todos = todos.map((t) =>
      t.id === parseInt(id) ? { ...t, ...req.body } : t
    );

    res.sendStatus(200);
  };

  const postNewTodo = (req: Request, res: Response) => {
    const newTodo = { ...req.body, id: new Date().getTime() };
    todos.push(newTodo);
    res.json(newTodo);
  };

  const deleteTodo = (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));

    if (todoIndex === -1) {
      res.status(404).json({
        message: `Unable to delete Todo with ID ${id}`,
      });
      return;
    }

    todos.splice(todoIndex, 1);
    res.sendStatus(200);
  };

  app.get("/lab5/todos", getTodos);
  app.get("/lab5/todos/create", createTodo);
  app.get("/lab5/todos/:id/delete", removeTodo);
  app.get("/lab5/todos/:id/title/:title", updateTodoTitle);
  app.get("/lab5/todos/:id/completed/:completed", updateTodoCompleted);
  app.get("/lab5/todos/:id/description/:description", updateTodoDescription);
  app.get("/lab5/todos/:id", getTodoById);
  app.put("/lab5/todos/:id", updateTodo);
  app.post("/lab5/todos", postNewTodo);
  app.delete("/lab5/todos/:id", deleteTodo);
}
