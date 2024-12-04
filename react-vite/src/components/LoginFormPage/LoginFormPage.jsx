import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loading state for buttons
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    setLoading(false);

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
      navigate('/');
    }
  };

  const handleLoginDemo = async (e) => {
    e.preventDefault();
    setLoading(true);

    await dispatch(
      thunkLogin({
        email: "demo@aa.io",
        password: "password",
      })
    );

    setLoading(false);
    closeModal();
    navigate('/');
  };

  return (
    <div className="login-page">
      <h1 className="title">Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="email-input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
        </div>
        <div className="button-group">
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Log In"}
          </button>
          <button
            className="login-btn demo-login-btn"
            onClick={handleLoginDemo}
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login as Demo User"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
