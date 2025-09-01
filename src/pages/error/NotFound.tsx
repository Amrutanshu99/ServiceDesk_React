import fileSearchingIcon from "../../assets/icons/file-searching.svg";
import { useNavigate } from "react-router-dom"; 
import "./error.css"
const NotFound = () => {
    const navigate = useNavigate();  // ✅ Initialize navigation
    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
        <div className="row justify-content-center">
          <div className="col-lg-4">
            <div className="text-center">
              <img
                src={fileSearchingIcon}
                height="90"
                alt="File not found"
                className="mb-3"
              />
              <h1 className="text-error mt-4">404</h1>
              <h4 className="text-uppercase text-danger mt-3">Page Not Found</h4>
              <p className="text-muted mt-3">
                It's looking like you may have taken a wrong turn. Don't worry... it
                happens to the best of us. Here's a little tip that might help you get back on track.
              </p>
  
              <button
                className="btn btn-info mt-3"
                onClick={() => navigate("/")}
              >
                <i className="mdi mdi-reply"></i> Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default NotFound;