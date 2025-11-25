"use client"
import useToggle from "@/core/hooks/use-toggle"
import type { User } from "@/core/types/types"
import { Modal, Tag, Tooltip } from "antd"
import { Copy, CopyIcon, CheckCircle2 } from "lucide-react"
import { useState } from "react"

const CopyToken = ({ user }: { user: User }) => {
  const [isOpen, toggle] = useToggle()
  const [copied, setCopied] = useState(false)

  const copyAction = async () => {
    await navigator.clipboard.writeText(user.accountInfo.apiToken)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Tooltip title={copied ? "کپی شد!" : "کلیک برای کپی"}>
        <Tag className="text-sm! cursor-pointer" onClick={toggle} color={copied ? "green" : "blue"}>
          {copied ? <CheckCircle2 className="size-4" /> : <CopyIcon className="size-4" />}
          <span>{copied ? "کپی شد" : "کپی"}</span>
        </Tag>
      </Tooltip>
      <Modal open={isOpen} onCancel={toggle} title="توکن API" footer={null}>
        <Tooltip title={copied ? "کپی شد!" : "کلیک برای کپی"}>
          <div
            onClick={copyAction}
            className="p-4 my-6 w-full cursor-pointer bg-neutral-100 hover:bg-neutral-200 transition-colors border border-neutral-200 rounded-lg select-none inline-flex gap-4 items-center break-all"
          >
            {copied ? <CheckCircle2 className="text-green-600" /> : <Copy />}
            <span className="text-sm font-mono">{user.accountInfo.apiToken}</span>
          </div>
        </Tooltip>
        <p className="text-xs text-neutral-500 text-center">روی توکن کلیک کنید تا کپی شود</p>
      </Modal>
    </>
  )
}

export default CopyToken
