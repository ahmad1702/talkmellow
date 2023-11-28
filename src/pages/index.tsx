import { signIn, useSession } from "next-auth/react";
import Head from "next/head";

import Logo from "@/components/logo";
import MainLayout from "@/components/main-layout";
import Post from "@/components/post";
import { api } from "@/utils/api";
import { Button, CircularProgress, Textarea, User } from "@nextui-org/react";
import { PenSquare } from "lucide-react";
import { useTheme } from "next-themes";
import { ComponentProps, useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const session = useSession()
  const user = session.data?.user
  const { theme } = useTheme()
  const [newPostContent, setNewPostContent] = useState('')

  // const fetchEnabled = session.status === 'authenticated'
  const posts = api.post.getAll.useQuery(undefined, {
    // enabled: fetchEnabled,
    refetchOnWindowFocus: false,
  })

  const postMutation = api.post.create.useMutation({
    onSuccess: () => {
      setNewPostContent('')
      toast.success('Post Created', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === 'dark' ? 'dark' : 'light',
      })
    }
  })

  const handleNewPostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await postMutation.mutateAsync({
      name: newPostContent
    })
    await posts.refetch()
  }

  let endMsg = 'You reached the end. Time to touch some grass! �'

  if (session.status === 'unauthenticated') {
    endMsg = 'Looks like you are not signed in. Please sign in to create posts'
  }

  return (
    <>
      <Head>
        <title>Home | Talkmellow</title>
        <meta name="description" content="TalkMello" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout>
        <div className="mx-auto w-full h-full max-w-5xl border-x border-divider">
          {user && (
            <div className="border-b border-divider flex p-4">
              <div className="">
                <User
                  avatarProps={{
                    src: user.image ?? undefined,
                    name: user.name?.split(' ').map(val => val[0]).join('')
                  } as unknown as ComponentProps<typeof User>['avatarProps']}
                  name={undefined}
                />
              </div>
              <form onSubmit={handleNewPostSubmit} className="flex-1">
                <Textarea value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} className="text-8xl" size="lg" placeholder="What are you thinking about?" variant='underlined' />
                <div className="flex items-center justify-end mt-2">
                  <Button isLoading={postMutation.isLoading} type='submit' color="primary" startContent={<PenSquare className="h-5" />}>Post</Button>
                </div>
              </form>
            </div>
          )}
          {posts.isLoading && (
            <div className="border-b border-divider h-32 w-full flex items-center justify-center">
              <CircularProgress color='primary' size="lg" className="ml-2" />
            </div>
          )}

          {/* Array of posts are here */}
          {!!posts.data && posts.data.map((post) => <Post key={post.id} post={post} user={user} />)}

          <div className="p-4 py-10 flex items-center justify-center flex-col gap-2">
            <div className="flex items-center justify-center">
              <Logo className="scale-150 mr-4" />
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                Talk<span className="text-primary">mellow</span>
              </h1>
            </div>
            <div>{endMsg}</div>
            {session.status === 'unauthenticated' && (
              <Button color='primary' onPress={() => signIn()}>Login / Register</Button>
            )}
          </div>
        </div>
      </MainLayout>
    </>
  );
}