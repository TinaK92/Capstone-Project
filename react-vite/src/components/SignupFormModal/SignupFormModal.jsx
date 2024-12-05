import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import { useNavigate } from "react-router-dom";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState({
    username: [],
    email: [],
  });
  const { closeModal } = useModal();
  console.log("THIS IS SERVER ERRORS", serverErrors);

  const validateInputs = () => {
    const newErrors = {};
    if (firstName.length < 2)
      newErrors.firstName = "First name must have 2-15 characters";
    if (lastName.length < 2)
      newErrors.lastName = "Last name must have 2-15 characters";
    if (!email.includes("@")) newErrors.email = "Please enter a valid email.";
    if (username.trim().length < 3)
      newErrors.username = "Username must be at least 3 characters.";
    if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (password !== confirmPassword)
      newErrors.confirmPassword =
        "Confirm Password field must match the Password field.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateInputs();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const serverResponse = await dispatch(
        thunkSignup({
          first_name: firstName,
          last_name: lastName,
          email,
          username,
          password,
        })
      );
      navigate("/");
      closeModal();
    } catch (e) {
      console.log("E=========", e)
    }
    if (serverResponse.errors) {
      console.log("THIS IS THE SERVER RESONSE ERROR", serverResponse);
      setServerErrors(serverResponse.errors);
    } 
  };

  return (
    <div className="sign-up-div">
      <h1 className="signup-title">Sign Up</h1>
      {serverErrors.username && <p>{serverErrors.username[0]}</p>}
      {serverErrors.email && <p>{serverErrors.email[1]}</p>}
      <div className="signup-inputs">
        <form className="signup-form" onSubmit={handleSubmit}>
          <label>First Name</label>
          <input
            className="input-field"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {errors.firstName && <p>{errors.firstName}</p>}
          <label>Last Name</label>
          <input
            className="input-field"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {errors.lastName && <p>{errors.lastName}</p>}
          <label>Email</label>
          <input
            className="input-field"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p>{errors.email}</p>}
          <label>Username</label>
          <input
            className="input-field"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {errors.username && <p>{errors.username}</p>}
          <label>Password</label>
          <input
            className="input-field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p>{errors.password}</p>}
          <label>Confirm Password</label>
          <input
            className="input-field"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        </form>
        <button className="sign-button" onClick={handleSubmit} type="submit">
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default SignupFormModal;
