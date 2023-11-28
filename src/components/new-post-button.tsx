import { api } from "@/utils/api";
import { Button, Textarea, useDisclosure } from "@nextui-org/react";

import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { Plus } from "lucide-react";
import { useTheme } from "next-themes";
import { FormEvent, useEffect, useState } from "react";
import { toast } from 'react-toastify';

const NewPostButton = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [content, setContent] = useState<string>('')
  const [submitted, setSubmitted] = useState(false)
  const { theme } = useTheme()

  const postMutation = api.post.create.useMutation({
    onSuccess: () => {
      toast.success('Post Created', {
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
  const { isLoading, error } = postMutation

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await postMutation.mutateAsync({
      name: content
    })
    setSubmitted(true)
  }

  useEffect(() => {
    if (isOpen) return;

    setContent('')
    setSubmitted(false)
  }, [isOpen])

  return (
    <>
      <Button onClick={onOpen} color="primary" startContent={<Plus />}>
        New Post
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} onAnimationEnd={() => console.log('hi')}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">Create Post </ModalHeader>
              <ModalBody>
                <Textarea disabled={isLoading} placeholder="What do you want to talk about? (Max 256 Characters)" name='content' value={content} onChange={(e) => setContent(e.target.value)} />
                <div>Content state is: {content}</div>
                <div>{submitted ? 'Submitted' : 'Finish yo sentence boi'}</div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button disabled={isLoading} isLoading={isLoading} type='submit' color="primary" >
                  Create
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
export default NewPostButton
