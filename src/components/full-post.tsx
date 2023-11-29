import { api } from "@/utils/api";
import {
    AvatarProps,
    Button,
    Link as NextUILink,
    Textarea,
    User,
    cn,
} from "@nextui-org/react";
import { Heart, MessageCircle, MoreHorizontal, PenSquare } from "lucide-react";
import { Session } from "next-auth";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type PostProps = {
    refetchPosts: () => Promise<void>
    user: Session["user"] | undefined;
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
    };
};

const FullPost = ({ post, user, refetchPosts }: PostProps) => {
    const { theme } = useTheme()
    const [newComment, setNewComment] = useState('')
    const [myLike, setMyLike] = useState<{
        id: string;
        postId: number;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }>();

    console.log(post);
    const likeMutation = api.post.likePost.useMutation();
    const removeLikeMutation = api.post.remoteLikePost.useMutation();
    const postMutation = api.post.create.useMutation({
        onSuccess: () => {
            setNewComment('')
            toast.success('Comment Successfully Created', {
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

    const isLiked = Boolean(myLike);
    useEffect(() => {
        setMyLike(
            user
                ? post.PostLikes.find((datum) => datum.userId === user.id)
                : undefined,
        );
    }, [user, post]);

    const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (!isLiked) {
            const newLike = (await likeMutation.mutateAsync({
                postId: post.id,
            })) as typeof myLike;
            console.log("Created new like:", newLike);
            setMyLike(newLike);
        } else if (myLike) {
            removeLikeMutation.mutate({
                likeId: myLike.id,
            });
            console.log("Removed like");
            setMyLike(undefined);
        } else {
            console.error("A user cannot remove a post that is not theirs");
        }
    };

    const handleNewCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await postMutation.mutateAsync({
            name: newComment,
            parentPostId: post.id
        })
        await refetchPosts()
    }

    const href = "/post/" + post.id
    return (
        <div
            key={post.id}
            className="flex w-full flex-col border-b border-divider p-4 hover:bg-content1/50"
        >
            <div className="flex items-center justify-between">
                <User
                    name={post.createdBy.name}
                    description={
                        <NextUILink
                            href="https://twitter.com/jrgarciadev"
                            size="sm"
                            isExternal
                        >
                            @{post.createdBy.email?.split("@").at(0) ?? "someuser"}
                        </NextUILink>
                    }
                    avatarProps={
                        {
                            src: post.createdBy.image ?? undefined,
                            name: post.createdBy.name
                                ?.split(" ")
                                .map((val) => val[0])
                                .join(""),
                        } as AvatarProps
                    }
                />
                <Button
                    color="default"
                    className="rounded-full"
                    variant="light"
                    startContent={<MoreHorizontal />}
                    isIconOnly
                />
            </div>
            <div className="ml-12 text-xl font-semibold">{post.name}</div>
            <div className="mt-2 flex items-center justify-between mx-4 border-y border-divider">
                <Button
                    as={Link}
                    href={href}
                    color="primary"
                    className="rounded-full saturate-0 hover:saturate-100"
                    variant="light"
                    isIconOnly
                    startContent={<MessageCircle />}
                ></Button>
                <Button
                    disabled={!user}
                    onClick={handleLike}
                    color="danger"
                    className={cn(
                        "rounded-full",
                        isLiked ? "" : "saturate-0 hover:saturate-100",
                    )}
                    variant="light"
                    isIconOnly
                    startContent={<Heart className={cn("fill-red-500")} />}
                />
            </div>

            <form className="mt-2 mx-4" onSubmit={handleNewCommentSubmit}>
                <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="text-8xl"
                    size="lg"
                    placeholder="What are you thinking about?"
                    variant='underlined'
                />
                <div className="flex items-center justify-end mt-2">
                    <Button
                        isLoading={postMutation.isLoading}
                        type='submit'
                        color="primary"
                        startContent={<PenSquare className="h-5" />}
                    >
                        Post
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FullPost;
