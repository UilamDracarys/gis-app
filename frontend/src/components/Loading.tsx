import logo from "../assets/logo.png";

const Loading = () => {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
        <img src={logo} className="w-48 animate-bounce" alt="Loading..." />
    </div>
  )
}

export default Loading;