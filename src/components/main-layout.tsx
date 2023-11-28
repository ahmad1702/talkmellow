import { cn } from "@nextui-org/react"
import MainNav from "./main-nav"

type Props = React.ComponentPropsWithoutRef<'div'> & {
  containerProps?: React.ComponentPropsWithoutRef<'div'>
}

const MainLayout = ({ containerProps, ...props }: Props) => {
  return (
    <div {...containerProps} className={cn('h-screen flex flex-col', containerProps?.className)}>
      <MainNav />
      <main {...props} className={cn('flex-1', props.className)} />
    </div>
  )
}

export default MainLayout
