import CoffeeForm from "./Components/CoffeeForm";
import Hero from "./Components/Hero";
import History from "./Components/History";
import Layout from "./Components/Layout"
import Stats from "./Components/Stats";
import { useAuth } from "./Context/AuthContext";


function App() {
  const {globalUser, globalData} =useAuth();
  const isAuthenticated = globalUser;

  const isData= globalData && !!Object.keys(globalData || {}).length;//double exclamation to force it to be a boolean
  const AuthenticatedContent = (
    <>
      <History />
      <Stats />
    </>
  )

  return (
      <Layout>
        <Hero />
        <CoffeeForm isAuthenticated={isAuthenticated}/>
        {(isAuthenticated && isData) && (AuthenticatedContent)}
      </Layout>
      
  )
}

export default App
