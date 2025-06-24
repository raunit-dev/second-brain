import { Signin } from "./pages/Signin"; // Importing the Signin page component
import { Signup } from "./pages/Signup"; // Importing the Signup page component
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Importing Router components from react-router-dom for routing
import { Dashboard } from "./pages/dashboard"; // Importing the Dashboard page component
import { Landing } from "./pages/Landing";

// App component to define the routing structure of the application
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/signin" element={<Signin />} /> 
        <Route path="/dashboard" element={<Dashboard />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App; // Exporting the App component as the default export