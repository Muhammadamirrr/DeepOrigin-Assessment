import { Link } from "react-router-dom"

export const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-dark">
            <Link className="p-2" to='/'>Home</Link>
            <Link className="p-2" to='/ExecutedTaskList'>Executed Tasks</Link>
        </nav>
    )
}

export default Navbar