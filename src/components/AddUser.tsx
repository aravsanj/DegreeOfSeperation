import React, { useEffect } from "react";
import {
  Typography,
  Modal,
  Button,
  Box,
  Fab,
  TextField,
  FormGroup,
  FormLabel,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 400,
  minWidth: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

interface User {
  name: string;
  friends: Array<string>;
}

interface Graph {
  [key: string]: Array<string>;
}

interface Props {
  users: Array<User>;
  setUsers: ([]) => void;
  graph: Graph;
  setGraph: (graph: Graph) => void;
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

export const AddUser: React.FC<Props> = ({
  users,
  setUsers,
  graph,
  setGraph,
  open,
  handleOpen,
  handleClose,
}) => {
  const [user, setUser] = React.useState<User>({
    name: "",
    friends: [],
  });

  const closeModal = () => {
    setUser({
      name: "",
      friends: [],
    });
    setAlert(false);
    handleClose();
  };

  function handleInput(value: string): void {
    setAlert(false);
    setUser({
      ...user,
      name: value,
    });
  }

  function handleChange(value: string): void {
    if (user.friends.includes(value)) {
      setUser({
        ...user,
        friends: user.friends.filter((friend) => friend !== value),
      });
    } else {
      setUser({
        ...user,
        friends: [...user.friends, value],
      });
    }
  }

  const [alert, setAlert] = React.useState<boolean>(false);

  const usernames: Array<string> = Object.keys(graph);

  function updateUsers() {
    if (user.name !== "" && !usernames.includes(user.name)) {
      users.map((usr) => {
        if (user.friends.includes(usr.name)) {
          usr.friends.push(user.name);
        }
        if (
          usr.friends.includes(user.name) &&
          !graph[usr.name].includes(user.name)
        ) {
          graph[usr.name].push(user.name);
        }
      });

      setUsers([...users, user]);
      setGraph({ ...graph, [user.name]: user.friends });
      closeModal();
    } else {
      setAlert(true);
    }
  }

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("graph", JSON.stringify(graph));
  }, [users]);

  return (
    <div>
      <Box sx={{ position: "fixed", right: "30px", bottom: "30px" }}>
        <Fab color="primary" aria-label="add" onClick={handleOpen}>
          <AddIcon />
        </Fab>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", marginBottom: 2 }}
              component="h2"
            >
              Add a new user
            </Typography>
            <TextField
              placeholder="Name"
              variant="standard"
              onChange={(e) => handleInput(e.target.value)}
              required
            />
            {alert && (
              <Typography variant="caption" component="p" sx={{ color: "red" }}>
                *Blank name or user already exists.
              </Typography>
            )}

            <Box sx={{ height: 200, overflow: "auto", marginTop: "20px" }}>
              <FormGroup>
                <>
                  <FormLabel>Select friends</FormLabel>
                  <>
                    {users.map((user) => (
                      <FormControlLabel
                        value={user.name}
                        control={<Checkbox />}
                        label={user.name}
                        onChange={(e) =>
                          handleChange((e.target as HTMLInputElement).value)
                        }
                      />
                    ))}
                  </>
                </>
              </FormGroup>
            </Box>
            <Box sx={{ marginTop: "20px" }}>
              <Button variant="contained" color="primary" onClick={updateUsers}>
                Add
              </Button>
            </Box>
          </>
        </Box>
      </Modal>
    </div>
  );
};
