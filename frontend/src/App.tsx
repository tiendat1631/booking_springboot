import Welcome from './pages/Welcome';

export default function App() {
  return (
    <div className='flex flex-col min-h-screen'>
      <main className='grow bg-background'>
        <Welcome />
      </main>
    </div>
  );
}
