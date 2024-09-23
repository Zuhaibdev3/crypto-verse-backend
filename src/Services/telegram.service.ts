
import { bot } from "../utils/telegram";
import { telegram_config } from '../config/globals'

interface ISendPost {
  telegram_id: string,
  content: any
}

export function whiteListMember({ userId }: { userId: number }) {
  // return bot.telegram.approveChatJoinRequest('@Kingchart_test', userId)
  return bot.telegram.exportChatInviteLink(telegram_config.chatId)
}

export function sendPost({ content }: ISendPost) {
  return bot.telegram.sendMessage(telegram_config.chatId, content)
}

export function sendGroupInvite(chatId: string) {
  return bot.telegram.sendMessage(chatId, `Wellcome, Join Group! ${telegram_config.inviteLink}`)
}

export function leaveChat({ telegram_id }: { telegram_id: number }) {
  // return bot.telegram.leaveChat(telegram_id)
  // return bot.telegram.kickChatMember('Kingchart_bot', telegram_id)
  return bot.telegram.banChatMember(telegram_config.chatId, telegram_id)
}


//TODO remove the banned members from the group. Figure out how to add them again. 
