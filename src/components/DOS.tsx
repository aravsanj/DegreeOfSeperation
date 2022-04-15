import React from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { AddUser } from "./AddUser";

export const DOS: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const handleOpen: () => void = () => setOpen(true);
  const handleClose: () => void = () => setOpen(false);

  interface UserSelect {
    user1: string;
    user2: string;
  }

  const [user, setUser] = React.useState<UserSelect>({
    user1: "",
    user2: "",
  });

  const handleUserOne = (value: string) => {
    setUser({ ...user, user1: value });
  };

  const handleUserTwo = (value: string) => {
    setUser({ ...user, user2: value });
  };

  interface User {
    name: string;
    friends: Array<string>;
    user1: string;
    user2: string;
  }

  interface Graph {
    [key: string]: Array<string>;
  }

  let initial: Array<User> = [];

  if (localStorage.getItem("users")) {
    initial = JSON.parse(localStorage.getItem("users") || "");
  }
  interface User {
    name: string;
    friends: Array<string>;
  }

  const [users, setUsers] = React.useState<Array<User>>(initial);

  let initialGraph: Graph = {};

  if (localStorage.getItem("graph")) {
    initialGraph = JSON.parse(localStorage.getItem("graph") || "");
  }

  const [graph, setGraph] = React.useState<Graph>(initialGraph);

  const [noPath, setNoPath] = React.useState(false);

  const findAllPaths = (graph: Graph, source: string, destination: string) => {
    let allPaths: any = [];
    const paths: Array<Array<string>> = [];
    const visited: Array<string> = [source];
    const path: Array<string> = [source];

    const findAllPathsHelper = (
      graph: Graph,
      source: string,
      destination: string,
      path: Array<string>
    ) => {
      if (source === destination) {
        allPaths.push(paths.concat(path));
        setNoPath(false);
        return;
      } else if (allPaths.length == 0) setNoPath(true);

      for (let i = 0; i < graph[source].length; i++) {
        if (!visited.includes(graph[source][i])) {
          visited.push(graph[source][i]);
          path.push(graph[source][i]);
          findAllPathsHelper(graph, graph[source][i], destination, path);
          path.pop();
          visited.pop();
        }
      }
    };

    findAllPathsHelper(graph, source, destination, path);
    return allPaths;
  };

  const [alert, setAlert] = React.useState<boolean>(false);

  const [paths, setPaths] = React.useState<Array<Array<string>>>([]);

  const pathExecuter = () => {
    if (user.user1 !== user.user2) {
      setAlert(false);
      setPaths(findAllPaths(graph, user.user1, user.user2));
    } else {
      setPaths([]);
      setAlert(true);
    }
  };

  return (
    <>
      <AddUser
        users={users}
        setUsers={setUsers}
        graph={graph}
        setGraph={setGraph}
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
          height: "50vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ minWidth: 200 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">User 1</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={user.user1}
              label="User 1"
              onChange={(e) =>
                handleUserOne((e.target as HTMLInputElement).value)
              }
            >
              {users.map((user: User, idx: Number): any => {
                return <MenuItem value={user.name}>{user.name}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ minWidth: 200 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">User 2</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={user.user2}
              label="User 2"
              onChange={(e) =>
                handleUserTwo((e.target as HTMLInputElement).value)
              }
            >
              {users.map((user: User, idx: Number): any => {
                return <MenuItem value={user.name}>{user.name}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </Box>
        <Button onClick={() => pathExecuter()} variant="outlined">
          Show paths
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "30px",
        }}
      >
        {paths.length !== 0 &&
          paths.map((path: Array<string>) => (
            <div>
              <Typography>{path.join(" -> ")}</Typography>
            </div>
          ))}
        {paths.length !== 0 && (
          <Typography variant="subtitle2">{`Total paths: ${paths.length}`}</Typography>
        )}
        {alert && <Typography>Please select different users.</Typography>}

        {!alert && noPath && <Typography>No paths found.</Typography>}
      </Box>
    </>
  );
};
