import Navbar from '../../components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import { Offline } from 'react-detect-offline';

export default function MainLayout() {
  return (
    <>
      <Offline>
        <p className="w-fit font-bold bg-red-500 rounded-lg text-white text-center p-2 fixed bottom-5 right-5 z-10">
          You are offline
        </p>
      </Offline>
      <Navbar />
      <main className="mt-[87px]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
