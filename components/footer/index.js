import { useSelector, shallowEqual } from 'react-redux'
import moment from 'moment'
import { FaHeart, FaDiscord } from 'react-icons/fa'
import { BsTwitter, BsTelegram, BsGithub } from 'react-icons/bs'

import Image from '../image'

export default () => {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { theme } = { ...preferences }

  return (
    <div className={`footer flex flex-col md:flex-row items-center text-xs space-y-2 sm:space-y-0 p-3 ${theme}`}>
      <div className="w-full md:w-1/2 lg:w-1/3 min-w-max flex items-center justify-center md:justify-start font-medium space-x-1.5">
        <span>
          Data from
        </span>
        <a
          href="https://coingecko.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/logos/externals/coingecko.png"
            alt=""
            width={20}
            height={20}
          />
        </a>
        <a
          href="https://alternative.me/crypto"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/logos/externals/alternative.png"
            alt=""
            width={20}
            height={20}
          />
        </a>
        <a
          href="https://whale-alert.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/logos/externals/whalealert.png"
            alt=""
            width={20}
            height={20}
          />
        </a>
        <a
          href="https://cryptopanic.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/logos/externals/cryptopanic.png"
            alt=""
            width={20}
            height={20}
          />
        </a>
      </div>
      <div className="hidden lg:flex w-full lg:w-1/3 flex-wrap items-center justify-center space-x-2">
        {process.env.NEXT_PUBLIC_TWITTER_USERNAME && (
          <a
            href={`https://twitter.com/${process.env.NEXT_PUBLIC_TWITTER_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsTwitter size={20} className="text-blue-400 dark:text-white" />
          </a>
        )}
        {process.env.NEXT_PUBLIC_TELEGRAM_USERNAME && (
          <a
            href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsTelegram size={20} className="text-blue-500 dark:text-white" />
          </a>
        )}
        {process.env.NEXT_PUBLIC_DISCORD_URL && (
          <a
            href={process.env.NEXT_PUBLIC_DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDiscord size={20} className="text-blue-600 dark:text-white" />
          </a>
        )}
        {process.env.NEXT_PUBLIC_GITHUB_URL && (
          <a
            href={process.env.NEXT_PUBLIC_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsGithub size={20} className="text-black dark:text-white" />
          </a>
        )}
        {process.env.NEXT_PUBLIC_ENS_NAME && (
          <a
            href={`https://app.ens.domains/name/${process.env.NEXT_PUBLIC_ENS_NAME}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="min-w-max">
              <div className="flex items-center">
                <Image
                  src="/logos/externals/ens.png"
                  alt=""
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </a>
        )}
      </div>
      <div className="w-full md:w-1/2 lg:w-1/3 min-w-max flex items-center justify-center md:justify-end text-slate-400 dark:text-white space-x-1">
        <span>© {moment().format('YYYY')} made with</span>
        <FaHeart className="text-red-400 text-xl pr-0.5" />
        <span>
          {"by "}
          <a
            href={process.env.NEXT_PUBLIC_TEAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 dark:text-white font-semibold"
          >
            {process.env.NEXT_PUBLIC_TEAM_NAME}
          </a>
          {" team."}
        </span>
      </div>
    </div>
  )
}