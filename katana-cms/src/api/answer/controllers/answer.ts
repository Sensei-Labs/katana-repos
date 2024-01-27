'use strict';

/**
 * answer controller
 */

import { factories } from '@strapi/strapi';

const { createCoreController } = factories;

export default createCoreController('api::answer.answer', () => ({
  async create(ctx) {
    const user = ctx.state?.user;
    const { data: payload } = ctx.request.body;
    if (!user) return ctx.badRequest('Please insert a token');

    payload.by = user?.id;

    const newAnswer = await strapi.entityService.create('api::answer.answer', {
      data: payload,
      populate: {
        question: {
          populate: {
            treasury: true
          }
        },
        by: true
      }
    });

    const question = newAnswer?.question;
    try {
      const project = await strapi.entityService.findOne('api::treasury.treasury', question?.treasury.id, {
        populate: {
          canBeWrite: true,
          creator: true
        }
      });

      newAnswer.question.treasury = project;

      try {
        const allUsersIds = [];

        if (question.by.id !== user.id) {
          allUsersIds.push(question.by.id);
        }

        // add id from creator
        if (project?.creator) {
          if (!allUsersIds.includes(project.creator.id) && project.creator.id !== user.id) {
            allUsersIds.push(project.creator.id);
          }
        }

        // add id from admins
        project.canBeWrite.forEach((admin) => {
          if (!allUsersIds.includes(admin.id) && admin.id !== user.id) {
            allUsersIds.push(admin.id);
          }
        });

        try {
          const payloadForNotification = {
            title: `Has anyone responded to ${question?.title}`,
            body: newAnswer.content,
            date: newAnswer.createdAt,
            users: allUsersIds,
            question: payload?.question?.id,
            treasury: project?.id,
            type: 'answer'
          };
          await strapi.entityService.create('api::push-notification.push-notification', {
            data: payloadForNotification
          });
        } catch (err) {
          console.log(`Error create notification`, err);
        }
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log('Error in get treasury', e);
    }

    newAnswer.by = {
      walletAddress: newAnswer?.by?.walletAddress || ''
    };
    return newAnswer;
  }
}));
