"use client"
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { GoPaperAirplane } from "react-icons/go"
import Gemma from "@/lib/Gemini"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import NavBar from "@/components/Navbar"
import Image from "next/image"

interface chatMessageTypes {
  message: string
  response: string
}

const ChatPage: React.FC = () => {
  const [input, setInput] = useState<string>("")
  const [responses, setResponses] = useState<chatMessageTypes[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const chatContainerRef = useRef<HTMLDivElement | null>(null)

  async function handleSendResponse(): Promise<void> {
    if (!input.trim()) return
    setIsLoading(true)
    setError("")

    const newMessage: chatMessageTypes = { message: input, response: "" }
    setResponses((prev) => [...prev, newMessage])
    const responseIndex: number = responses.length

    try {
      let completeResponse = ""
      await Gemma.ask(input, (chunk: string | undefined) => {
        completeResponse += chunk
        setResponses((prev) =>
          prev.map((msg, i) => (i === responseIndex ? { ...msg, response: completeResponse } : msg)),
        )
      })
    } catch (err) {
      console.error("Error fetching response:", err)
      setError("Failed to fetch response. Please try again.")
    } finally {
      setIsLoading(false)
      setInput("")
    }
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [responses])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      event.preventDefault()
      handleSendResponse()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-100">
      <header className="border-b bg-white shadow-sm">
        <NavBar />
      </header>

      <main className="flex-1 flex justify-center items-center p-4 md:p-8 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl bg-white rounded-xl shadow-xl flex flex-col h-[85vh]"
        >
          {/* Chat header */}
          <div className="p-4 border-b flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-xl">
            <Image
              src="/images/logo.png"
              alt="Dronacharya AI Logo"
              width={40}
              height={40}
              className="rounded-full border-2 border-white"
              unoptimized
              loading="lazy"
            />
            <div>
              <h1 className="font-bold text-xl">Dronacharya AI Assistant</h1>
              <p className="text-sm text-blue-100">Your 24/7 College Information Guide</p>
            </div>
          </div>

          {/* Chat messages area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#CBD5E0 #EDF2F7",
            }}
          >
            {responses.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center gap-4 text-center p-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <Image
                    src="/images/logo.png"
                    alt="Dronacharya AI Logo"
                    width={50}
                    height={50}
                    unoptimized
                    loading="lazy"
                  />
                </motion.div>
                <h2 className="font-bold text-2xl text-gray-700">Welcome to Dronacharya AI</h2>
                <p className="text-gray-500 max-w-md">
                  Ask me anything about Dronacharya P.G. College of Education - admissions, courses, events, or general
                  information.
                </p>

                <div className="flex gap-2">
                {['about college', 'courses', 'events'].map((input, index)  => {
                  return (
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setInput(input)} key={index}>{input}</Button>
                  )
                })}
                </div>
              </div>
            ) : (
              responses.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm">
                      <p>{item.message}</p>
                    </div>
                  </div>

                  {/* AI response */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden mt-1">
                      <Image
                        src="images/logo.png"
                        alt="Dronacharya AI"
                        width={32}
                        height={32}
                        unoptimized
                        loading="lazy"
                      />
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-200 max-w-[80%]">
                      <div className="font-medium text-blue-700 mb-1">Dronacharya AI</div>
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {item.response || "..."}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Input area */}
          <div className="p-4 border-t bg-white rounded-b-xl">
            <div className="flex gap-2 items-center">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={handleKeyDown}
                className="flex-1 bg-gray-100 border-0 focus-visible:ring-blue-500 rounded-full py-6 px-4 text-gray-800"
              />
              <Button
                onClick={handleSendResponse}
                disabled={isLoading || !input.trim()}
                className={`rounded-full p-3 h-auto w-12 flex items-center justify-center ${input.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300"
                  }`}
                aria-label="Send message"
              >
                <GoPaperAirplane className="h-5 w-5" />
              </Button>
            </div>
            <div className="text-xs text-center text-gray-400 mt-2">Powered by Gemini AI • Built by Sujan Thapa</div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default ChatPage
