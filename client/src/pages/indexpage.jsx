import { Link } from "react-router-dom";

export default function IndexPage(){


return(
  <div className="min-h-screen flex flex-col justify-start items-center py-8 ">
  <h1 className="text-3xl font-bold mb-4 text-center">Welcome to our Quiz app</h1>
  <div className="mb-2">
    <Link to ={'/login'} className="border border-purple-600
       text-purple-600 bg-white px-6 py-2 rounded-md 
       font-semibold shadow-md transition duration-300 hover:bg-purple-600
        hover:text-white hover:shadow-lg"
    >
      Login
    </Link>
    <Link to ={'/register'} className="border border-purple-600
       text-purple-600 bg-white px-6 py-2 rounded-md 
       font-semibold shadow-md transition duration-300 hover:bg-purple-600
        hover:text-white hover:shadow-lg"
    >
      Sign up
    </Link>
  </div>
</div>

)

}