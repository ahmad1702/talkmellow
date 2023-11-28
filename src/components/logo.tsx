import LogoSVG from '@/assets/logo.svg'
import { cn } from '@nextui-org/react'
import Image, { ImageProps } from "next/image"

const Logo = (props: Partial<ImageProps>) => <Image src={LogoSVG} width={800} height={800} alt="logo" className={cn('dark:invert w-10 h-10', props.className)} />
export default Logo