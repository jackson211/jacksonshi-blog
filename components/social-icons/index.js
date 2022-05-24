import { FaFacebook, FaGithub, FaYoutube, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa'
import { HiMail } from 'react-icons/hi'

const components = {
  mail: HiMail,
  github: FaGithub,
  facebook: FaFacebook,
  youtube: FaYoutube,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  instagram: FaInstagram,
}

const SocialIcon = ({ kind, href, size = 8 }) => {
  if (!href || (kind === 'mail' && !/^mailto:\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(href)))
    return null

  const SocialSvg = components[kind]

  return (
    <a
      className="text-3xl text-gray-500 transition hover:text-gray-600"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      <span className="sr-only">{kind}</span>
      <SocialSvg
        className={`fill-current text-gray-700 hover:text-indigo-500 dark:text-gray-200 dark:hover:text-indigo-400 h-${size} w-${size}`}
      />
    </a>
  )
}

export default SocialIcon
