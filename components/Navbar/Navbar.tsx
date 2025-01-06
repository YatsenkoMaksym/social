import ThemeToggle from '../ThemeToggle';
import Desctop from './Desctop';
import Mobile from './Mobile';
function Navbar() {
  return (
    <header className='sticky top-10'>
      <nav className='gap-4 flex flex-row px-6 items-center p-5 '>
        <div className='mr-auto'>Icon`n`stuff</div>
        <ThemeToggle />
        <Desctop />
        <Mobile />
      </nav>
    </header>
  );
}

export default Navbar;
