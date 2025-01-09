import CreateForm from '@/components/Main/CreateForm';
import { currentUser } from '@clerk/nextjs/server';
import Post from '../Post';
import { userFromClerk } from '@/actions/user';
import { getPosts } from '@/actions/post';

export default async function Main() {
  const user = await currentUser();
  const dbUser = user ? await userFromClerk(user.id) : null;
  const posts = await getPosts();
  return (
    <main className='w-full'>
      {user && <CreateForm />}
      <ul className='mt-5 md:mt-12 gap-3 flex flex-col'>
        {posts.map((post) => (
          <span key={post.id} className='w-full block min-h-fit'>
            <Post post={post} dbUser={dbUser} />
          </span>
        ))}
      </ul>
    </main>
  );
}
