import Description from "../components/Description"
import GenerateBtn from "../components/GenerateBtn"
import Header from "../components/Header"
import Steps from "../components/Steps"
import Testinomials from "../components/Testinomials"


const Home = () => {
  return (
    <div>
       <Header/>
       <Steps/>
       <Description/>
       <Testinomials/>
       <GenerateBtn/>
    </div>
  )
}

export default Home
