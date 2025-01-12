import CreateForm from '@/components/Main/CreateForm';
import { currentUser } from '@clerk/nextjs/server';
import Post from '../Post';
import { getUserId } from '@/actions/user';
import { getPosts } from '@/actions/post';
import { cn } from '@/lib/utils';

export default async function Main() {
  const user = await currentUser();
  const posts = await getPosts();
  const dbUser = await getUserId();
  return (
    <main className='w-full'>
      {user && <CreateForm />}
      <section
        className={cn([!user && '!mt-0'], 'mt-5 md:mt-12 gap-3 flex flex-col')}
      >
        {posts.map((post) => (
          <span key={post.id} className='w-full block min-h-fit'>
            <Post post={post} dbUserId={dbUser} />
          </span>
        ))}
      </section>
    </main>
  );
}
