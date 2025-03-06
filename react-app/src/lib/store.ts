import { create } from "zustand"

interface ChatStore {
  isChatOpen: boolean
  toggleChat: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  isChatOpen: false,
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
}))

