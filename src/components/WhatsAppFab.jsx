import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";

export default function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/62882007294047"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5"
    >
      <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
      <span className="hidden sm:inline text-sm font-medium">WhatsApp</span>
    </a>
  );
}
