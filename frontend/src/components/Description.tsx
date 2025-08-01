import assets from "../assets/assets"
import {motion} from 'framer-motion'
const Description = () => {
  return (
    <motion.div 
    initial={{opacity:0.2 , y : 100}}
    transition={{duration : 1}}
    whileInView={{opacity : 1 ,  y : 0}}
    viewport={{once : true}}
    
    className="flex flex-col items-center justify-center my-24 p-6 md:px-28">
       <h1 className="text-3xl sm:text-4xl font-semibold bm-2">Create AI Images</h1>
       <p className="text-gray-500 mb-8 text-xl">Turn your imagination into visual art in seconds</p>


       <div className="flex flex-col gap-5 md:gap-14 md:flex-row items-center">
        <img src={assets.sample_img_1} alt=""  className="w-80 xl:w-96 rounded-lg"/>

        <div>
            <h2 className="text-3xl font-medium max-w-lg mb-4 ">Introducing the Future of Image Creation</h2>
            <p className="text-gray-600 mb-5">Unleash your imagination like never before with the power of AI. Whether you're dreaming up fantasy worlds, futuristic cities, or surreal concepts, our AI transforms your words into stunning visual art within seconds. No design skills needed — just type your idea, and watch as creativity meets technology to bring your vision to life </p>

            <p className="text-gray-600">From playful sketches to breathtaking masterpieces, your imagination is the only limit. Let your thoughts take form and experience the magic of instant artistic expression.</p>
        </div>
       </div>
    </motion.div>
  )
}

export default Description
