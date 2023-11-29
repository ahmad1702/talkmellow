import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), parentPostId: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      const parentComment = input.parentPostId
      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
          parentComment: {
            connect: {
              id: parentComment
            }
          },
        },
      });
    }),

  getOne: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    return ctx.db.post.findFirst({
      where: {
        id: input.id
      },
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: true,
        PostLikes: true,
        comments: {
          include: {
            createdBy: true,
            PostLikes: true,
          }
        },
      }
    });
  }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: true,
        PostLikes: true,
      }
    });
  }),
  likePost: protectedProcedure.input(z.object({ postId: z.number() })).mutation(({ ctx, input }) => {
    const postId = input.postId
    const userId = ctx.session.user.id

    // For some reason vscode lint is not reading types directly here and just assuming its 'any'
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return ctx.db.postLikes.create({
      data: {
        postId,
        userId,
      }
    })
  }),
  remoteLikePost: protectedProcedure.input(z.object({ likeId: z.string() })).mutation(({ ctx, input }) => {
    // For some reason vscode lint is not reading types directly here and just assuming its 'any'
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return ctx.db.postLikes.delete({
      where: {
        id: input.likeId
      }
    })
  }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
