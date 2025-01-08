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

function RegisterPage() {
  const [value, setValue] = React.useState(0); // State for Tabs
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const name = formData.name;
    const email = formData.email;
    const password = formData.password;
    if (name !== "" && email !== "" && password !== "") {
      const userData = {
        name: name,
        email: email,
        password: password,
        isSeller: value,
      };

      axios
        .post("http://localhost:3000/user/register", userData, {
          withCredentials: true,
        })
        .then((response) => {
          // Save data locally only if the response is successful
          localStorage.setItem("user", JSON.stringify(response.data));
          navigate(`/${value ? "sellerhome" : "userhome"}`);
        })
        .catch((error) => {
          // Do not save data or navigate on error
          alert(`Error while Registering`);
        });
    } else {
      alert("All the fields are required !");
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "400px",
          bgcolor: "background.paper",
          mx: "auto",
          mt: 5,
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center", // Center-align the text
        }}
      >
        {/* Register Title */}
        <Typography variant="h5" gutterBottom>
          REGISTER
        </Typography>
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Customer" />
            <Tab label="Seller" />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {/* Customer Registration Form */}
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={formData.email}
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
            Register
          </Button>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {/* Seller Registration Form */}
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={formData.email}
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
            Register
          </Button>
        </CustomTabPanel>
      </Box>
    </>
  );
}

export default RegisterPage;
