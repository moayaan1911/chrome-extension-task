import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { FaRedo } from "react-icons/fa"
import { ImCross } from "react-icons/im"
import { IoMdArrowDown } from "react-icons/io"
import { MdKeyboardDoubleArrowRight } from "react-icons/md"

import "./style.css"

const Modal = ({ onClose }) => {
  const [inputValue, setInputValue] = useState("")
  const [prompts, setPrompts] = useState<string[]>([])

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setPrompts((prev) => [...prev, inputValue])
      setInputValue("")
    }
  }

  const handleInsert = () => {
    const messageInput = document.querySelector(
      "div.msg-form__contenteditable"
    ) as HTMLElement
    if (messageInput) {
      const staticText = "Thank you for your prompt!"

      messageInput.focus()
      document.execCommand("insertText", false, staticText)

      const event = new Event("input", { bubbles: true })
      messageInput.dispatchEvent(event)
      onClose()
    }
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-10 shadow-lg w-[600px] relative z-60 max-h-96 overflow-y-auto rounded-md">
        {prompts.length === 0 ? (
          <>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Your prompt here"
              className="w-full p-4 border rounded-md-md mb-4"
            />
            <div className="flex justify-between items-center">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2 border-2 border-gray-800 p-2">
                <ImCross />
                Close
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center justify-center gap-2">
                <MdKeyboardDoubleArrowRight />
                Generate
              </button>
            </div>
          </>
        ) : (
          <>
            {prompts.map((prompt, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-end">
                  <div className="bg-gray-200 p-2 rounded-md">{prompt}</div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-blue-200 p-2 rounded-md">
                    Thank you for your prompt!
                  </div>
                </div>
              </div>
            ))}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Your prompt here"
              className="w-full p-2 border rounded-md mb-4"
            />
            <div className="flex justify-between items-center">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2 border-2 border-gray-800 p-2">
                <ImCross />
                Close
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={handleInsert}
                  className="text-blue-500 p-2 rounded-md hover:text-blue-700 flex items-center justify-center gap-2">
                  <IoMdArrowDown />
                  Insert
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center justify-between gap-2">
                  <FaRedo />
                  Regenerate
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}

const IconButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClick = () => {
    setIsModalOpen(true)
  }

  return (
    <div>
      <span onClick={handleClick} className="cursor-pointer text-4xl">
        ✨
      </span>
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}

function injectIcon() {
  const messageInput = document.querySelector("div.msg-form__contenteditable")
  if (messageInput) {
    const iconContainer = document.createElement("div")
    iconContainer.className = "icon-button relative inline-block ml-2"

    messageInput.parentNode.insertBefore(
      iconContainer,
      messageInput.nextSibling
    )
    ReactDOM.render(<IconButton />, iconContainer)
  }
}

function Content() {
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          const messageInput = document.querySelector(
            "div.msg-form__contenteditable"
          )
          if (messageInput) {
            messageInput.addEventListener("focus", injectIcon, { once: true })
          }
        }
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}

export default Content
