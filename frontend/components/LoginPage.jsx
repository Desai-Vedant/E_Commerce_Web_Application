import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function LoginPage() {
  const [value, setValue] = React.useState(0); // State for Tabs
  const [formData, setFormData] = React.useState({ userId: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const email = formData.userId;
    const password = formData.password;
    const userData = { email: email, password: password, isSeller: value };
    if (email !== "" && password !== "") {
      axios
        .post("http://localhost:3000/user/login", userData, {
          withCredentials: true,
        })
        .then((response) => {
          // Save data locally only if the response is successful
          localStorage.setItem("user", JSON.stringify(response.data));
          navigate(`/${value ? "sellerhome" : "userhome"}`);
        })
        .catch((error) => {
          // Do not save data or navigate on error
          alert(`Error while Logging In.`);
        });
    } else {
      alert("All the fields are required !");
    }
  };

  return (
    <Box
      sx={{
        width: "400px",
        bgcolor: "background.paper",
        mx: "auto",
        mt: 5,
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        textAlign: "center", // Center-align the content
      }}
    >
      {/* Login Title */}
      <Typography variant="h5" gutterBottom>
        LOGIN
      </Typography>
      <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Customer" />
          <Tab label="Seller" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {/* Customer Login Form */}
        <TextField
          label="User ID"
          variant="outlined"
          fullWidth
          margin="normal"
          name="userId"
          value={formData.userId}
          onChange={handleInputChange}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {/* Seller Login Form */}
        <TextField
          label="User ID"
          variant="outlined"
          fullWidth
          margin="normal"
          name="userId"
          value={formData.userId}
          onChange={handleInputChange}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </CustomTabPanel>
    </Box>
  );
}

export default LoginPage;
