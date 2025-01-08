import Sidebar from '@/components/Sidebar/Sidebar';
import Main from '@/components/CreatePost/Main';
import WhoToFollow from '@/components/WhoToFollow/WhoToFollow';
export default function Home() {
  return (
    <main className='py-12 2xl:max-w-[80%] bg-background w-full mx-auto md:grid grid-cols-4 gap-4 '>
      <section className='hidden md:block'>
        <Sidebar />
      </section>
      <section className='col-span-2'>
        <Main />
      </section>
      <section className='hidden md:block col-start-4'>
        <WhoToFollow />
      </section>
    </main>
  );
}
