import CreateForm from '@/components/CreatePost/CreateForm';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

export default async function Main() {
  const user = await currentUser();
  const posts = await prisma.post.findMany({
    take: 6,
  });
  return (
    <main className='w-full'>
      {user && <CreateForm />}
      <ul>
        {posts.map((post) => (
          <li key={post.id} className='bg-fuchsia-500 mt-3 min-w-fit w-20'>
            <p>{post.content}</p>
            <h5>{post.createdAt.toDateString()}</h5>
          </li>
        ))}
      </ul>
    </main>
  );
}
