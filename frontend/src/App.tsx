import NavBar from './components/NavBar';
import Welcome from './pages/Welcome';

export default function App() {
  return (
    <div className='flex flex-col min-h-screen'>
      <NavBar />
      <main className='grow flex'>
        <Welcome />
      </main>
    </div>
  );
}
