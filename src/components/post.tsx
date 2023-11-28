
import { api } from "@/utils/api";
import { AvatarProps, Button, Link, User, cn } from "@nextui-org/react";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { Session } from "next-auth";
import { useEffect, useState } from "react";

type PostProps = {
    user: Session['user'] | undefined
    post: {
        createdBy: {
            id: string;
            name: string | null;
            email: string | null;
            emailVerified: Date | null;
            image: string | null;
        };
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        PostLikes: {
            id: string;
            postId: number;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }
}

const Post = ({ post, user }: PostProps) => {
    const [myLike, setMyLike] = useState<{ id: string; postId: number; userId: string; createdAt: Date; updatedAt: Date; }>()

    console.log(post)
    const likeMutation = api.post.likePost.useMutation()
    const removeLikeMutation = api.post.remoteLikePost.useMutation()

    const isLiked = Boolean(myLike)
    useEffect(() => {
        setMyLike(user ? post.PostLikes.find(datum => datum.userId === user.id) : undefined)
    }, [user, post])

    const handleLike = async () => {
        if (!isLiked) {
            const newLike = await likeMutation.mutateAsync({
                postId: post.id
            }) as typeof myLike
            console.log('Created new like:', newLike)
            setMyLike(newLike)
        } else if (myLike) {
            removeLikeMutation.mutate({
                likeId: myLike.id
            })
            console.log('Removed like')
            setMyLike(undefined)
        } else {
            console.error('A user cannot remove a post that is not theirs')
        }
    }

    return (
        <div key={post.id} className="border-b border-divider w-full p-4">
            <div className="flex items-center justify-between">
                <User
                    name={post.createdBy.name}
                    description={(
                        <Link href="https://twitter.com/jrgarciadev" size="sm" isExternal>
                            @{post.createdBy.email?.split('@').at(0) ?? 'someuser'}
                        </Link>
                    )}
                    avatarProps={{
                        src: post.createdBy.image ?? undefined,
                        name: post.createdBy.name?.split(' ').map(val => val[0]).join('')
                    } as AvatarProps}
                />
                <Button color='default' className="rounded-full" variant="light" startContent={<MoreHorizontal />} isIconOnly />
            </div>
            <div className="text-xl font-semibold ml-12">{post.name}</div>
            <div className="flex items-center justify-between mt-2">
                <Button color='primary' className="rounded-full saturate-0 hover:saturate-100" variant="light" isIconOnly startContent={<MessageCircle />}></Button>
                <Button disabled={!user} onClick={handleLike} color='danger' className={cn("rounded-full", isLiked ? '' : 'saturate-0 hover:saturate-100')} variant="light" isIconOnly startContent={<Heart className={cn('fill-red-500')} />}></Button>
            </div>
        </div>
    )
}

export default Post