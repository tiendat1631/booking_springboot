import Homepage from './pages/Homepage';

export default function App() {
  return (
    <div className='flex flex-col min-h-screen'>
      <main className='grow bg-background'>
        <Homepage />
      </main>
    </div>
  );
}
