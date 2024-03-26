import IntercomIcon from './assets/intercom.svg?react';
import CloseIcon from './assets/close.svg?react';
import ReplyIcon from './assets/reply.svg?react';
import defaultBotAvatar from './assets/bot.svg';
import ArrowDownIcon from './assets/arrow-down.svg?react';
import LoadingIcon from './assets/loading.svg?react';
import clsx from 'clsx';
import { FC, KeyboardEvent, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { produce } from 'immer'

type MessageItem = {
  id: string;
  message: string | symbol;
  needAppend?: boolean;
  isMe?: boolean;
}

const loadingSymbol = Symbol('loading')

const MockAppendMessage: FC<{ message: string; needAppend?: boolean }> = ({ message, needAppend }) => {
  const [s, set] = useState('')

  useEffect(() => {
    if (!needAppend) {
      return
    }

    const msgList = message.split(' ')

    // init
    set(msgList.shift() || '')

    const interval = setInterval(() => {
      if (msgList.length === 0) {
        clearInterval(interval)
        return
      }

      const val = msgList.shift()
      set((prev) => {
        return `${prev} ${val}`
      })
    }, 500)

    return () => clearInterval(interval)
  }, [message, needAppend])

  return needAppend ? s : message;
}


const ChatItem: FC<MessageItem> = ({ message, isMe, needAppend }) => {
  return (
    <div className={clsx('flex text-xs leading-5 font-normal font-[Montserrat] space-x-2', isMe ? 'justify-end' : 'justify-start')}>
      {
        !isMe && <img className="w-7 h-7 rounded-full" src={defaultBotAvatar} />
      }
      <p
        className={clsx(
          'px-4 py-2 whitespace-pre-line rounded-sm border border-[#EAECEF]',
          isMe ? 'bg-[#D4DADF] max-w-[260px]' : 'bg-[#FFFFFE] max-w-[350px]')
        }
      >
        {
          typeof message === 'string' && <MockAppendMessage message={message} needAppend={needAppend} />
        }
        {
          message === loadingSymbol && <LoadingIcon height={20} />
        }
      </p>
    </div>
  )
}

const ChatBox: FC<{ onCancel?(): void }> = ({ onCancel }) => {
  const [input, setInput] = useState('');
  const [msgList, setMsgList] = useState<MessageItem[]>([{ id: nanoid(), message: 'Greetings!', isMe: false }]);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.target instanceof HTMLInputElement && e.key === 'Enter' && e.target.value.trim() !== '') {
      // reset input
      setInput('')
      // set response
      const loadingMsgId = nanoid();
      const message = e.target.value.trim();
      setMsgList(produce(d => d.concat([{ id: nanoid(), message, isMe: true }, { id: loadingMsgId, message: loadingSymbol, isMe: false, needAppend: true }])))

      // mock response
      setTimeout(() => {
        setMsgList(produce(d => {
          const idx = d.findIndex(i => i.id === loadingMsgId)
          if (idx >= 0) {
            d[idx].message = `response test: ${loadingMsgId}\nIndex: ${idx}`
          }
        }))
      }, 1000)
    }
  }

  return (
    <section className="w-[520px] rounded-[18px] border border-[#D4DADF] bg-white shadow-2xl">
      <header className="flex items-center p-5">
        <IntercomIcon />
        <span className="ml-2">John</span>
        <div className="flex-1 text-right">
          <CloseIcon className="inline-block cursor-pointer" onClick={() => onCancel?.()} />
        </div>
      </header>
      <main className="h-[500px] overflow-y-auto bg-[#F8F8F8] space-y-4 p-5 border-b border-t border-[#D4DADF]">
        {msgList.map((m) => (
          <ChatItem key={m.id} {...m} />
        ))}
      </main>
      <footer className="flex items-center p-5">
        <input className="flex-1 outline-none" placeholder="Type a reply..." onKeyDown={handleKeyDown} value={input} onChange={e => setInput(e.target.value)} />
        <ReplyIcon className="inline-block ml-1" />
      </footer>
    </section>
  )
}

const ChatBot = () => {
  const [show, setShow] = useState(false);

  return (
    <div style={{ display: 'none' }} className="!block fixed bottom-8 right-8 space-y-8">
      <div className={clsx('transition-all ease-in duration-200', show ? 'opacity-100' : 'opacity-0 translate-y-6')}>
        <ChatBox onCancel={() => setShow(false)} />
      </div>
      <div className="flex justify-end">
        <div className="w-16 h-16 bg-[#3F5870] rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg" onClick={() => setShow(v => !v)}>
          <ArrowDownIcon className={clsx('transition-all ease-in duration-200', !show && 'rotate-180')} />
        </div>
      </div>
    </div>
  )
}

export default ChatBot
