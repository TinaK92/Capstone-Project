import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import "./LoginFormModal.css";

function LoginFormModal() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
      navigate('/')
    }
  };

  const handleLoginDemo = (e) => {
    e.preventDefault();
    return dispatch(
      thunkLogin({
        email: "demo@aa.io",
        password: "password",
      })
    ).then(closeModal);
  };

  return (
    <div className="login-mod">
      <h1 className="title">Log In</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email 
            <input
              className="email-input"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        {errors.email && <p>{errors.email}</p>}
        <div>
          <label>
            Password 
            <input
              className="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        {errors.password && <p>{errors.password}</p>}
        <div className="button-div">
          <button className="login-btn" type="submit">
            Log In
          </button>
          <button className="login-btn" onClick={handleLoginDemo}>
            Login as Demo User
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
