/* eslint-disable @typescript-eslint/no-unsafe-call */
import FullPost from '@/components/full-post'
import MainLayout from '@/components/main-layout'
import PostComponent from '@/components/post'
import { api } from '@/utils/api'
import { CircularProgress } from '@nextui-org/react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'

export const getServerSideProps = (async ({ query }) => {
    const id = query.id as string
    return { props: { id } }
}) satisfies GetServerSideProps<{
    id: string
}>


const PostPage = ({
    id: idString,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const queryId = parseInt(idString)
    const session = useSession()
    const user = session.data?.user
    const postQuery = api.post.getOne.useQuery({ id: queryId })
    const post = postQuery.data
    const comments = post?.comments ?? []
    return (
        <>
            <Head>
                <title>Talkmellow</title>
                <meta name="description" content="TalkMello" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MainLayout>
                <div className="mx-auto w-full h-full max-w-5xl border-x border-divider">
                    {postQuery.isLoading && (
                        <div className="border-b border-divider h-32 w-full flex items-center justify-center">
                            <CircularProgress color='primary' size="lg" className="ml-2" />
                        </div>
                    )}
                    {post && (
                        <FullPost post={post} user={user} refetchPosts={async () => { await postQuery.refetch() }} />
                    )}
                    {comments.map((post) => <PostComponent key={post.id} post={post} user={user} />)}
                </div>
            </MainLayout>
        </>
    )
}

export default PostPage