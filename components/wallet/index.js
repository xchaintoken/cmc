import { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import _ from 'lodash'
import Web3Modal from 'web3modal'
import { providers, utils } from 'ethers'

import chains from '../../config/chains'
import { WALLET_DATA, WALLET_RESET } from '../../reducers/types'

const providerOptions = {}

const getNetwork = chain_id => {
  return {
    1: 'mainnet',
    10: 'optimism',
    56: 'binance',
    137: 'matic',
    250: 'fantom',
    1284: 'moonbeam',
    42161: 'arbitrum',
    43114: 'avalanche-mainnet',
    1313161554: 'aurora',
    5: 'goerli',
    43113: 'avalanche-fuji-testnet',
    80001: 'mumbai',
    421611: 'arbitrum-rinkeby',
  }[chain_id]
}

let web3Modal

export default ({
  environment = 'testnet',
  mainController = false,
  hidden = false,
  disabled = false, 
  connectChainId,
  onSwitch,
  children,
  className = '',
}) => {
  const dispatch = useDispatch()
  const {
    preferences,
    wallet,
  } = useSelector(state =>
    (
      {
        preferences: state.preferences,
        wallet: state.wallet,
      }
    ),
    shallowEqual,
  )
  const {
    theme,
  } = { ...preferences }
  const {
    wallet_data,
  } = { ...wallet }
  const {
    chain_id,
    provider,
    web3_provider,
  } = { ...wallet_data }

  const evm_chains_data =
    chains[environment]?.evm ||
    []

  const [defaultChainId, setDefaultChainId] = useState(null)

  useEffect(() => {
    if (
      connectChainId &&
      connectChainId !== defaultChainId
    ) {
      setDefaultChainId(connectChainId)
    }
  }, [connectChainId])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (web3_provider) {
        dispatch(
          {
            type: WALLET_DATA,
            value: {
              default_chain_id: defaultChainId,
            },
          }
        )
      }

      web3Modal = new Web3Modal(
        {
          network:
            getNetwork(
              defaultChainId ||
              (environment === 'testnet' ?
                5 :
                1
              )
            ),
          cacheProvider: true,
          providerOptions,
        }
      )
    }
  }, [defaultChainId])

  useEffect(() => {
    if (web3Modal?.cachedProvider) {
      connect()
    }
  }, [web3Modal])

  useEffect(() => {
    const update = async () => {
      if (web3Modal) {
        await web3Modal.updateTheme(theme)
      }
    }

    update()
  }, [theme])

  const connect = useCallback(
    async () => {
      const provider = await web3Modal.connect()
      const web3Provider = new providers.Web3Provider(provider)
      const network = await web3Provider.getNetwork()
      const signer = web3Provider.getSigner()
      const address = await signer.getAddress()

      const {
        chainId,
      } = { ...network }

      dispatch(
        {
          type: WALLET_DATA,
          value: {
            chain_id: chainId,
            provider,
            web3_provider: web3Provider,
            address,
            signer,
          },
        }
      )
    },
    [web3Modal],
  )

  const disconnect = useCallback(
    async (
      e,
      is_reestablish,
    ) => {
      if (
        web3Modal &&
        !is_reestablish
      ) {
        await web3Modal.clearCachedProvider()
      }

      if (
        provider?.disconnect &&
        typeof provider.disconnect === 'function'
      ) {
        await provider.disconnect()
      }

      dispatch(
        {
          type: WALLET_RESET,
        }
      )
    },
    [web3Modal, provider],
  )

  const switchChain = async () => {
    if (
      connectChainId &&
      connectChainId !== chain_id &&
      provider
    ) {
      try {
        await provider.request(
          {
            method: 'wallet_switchEthereumChain',
            params: [
              {
                chainId: utils.hexValue(connectChainId),
              },
            ],
          },
        )
      } catch (error) {
        const {
          code,
        } = { ...error }

        if (code === 4902) {
          try {
            const {
              provider_params,
            } = {
              ...evm_chains_data.find(c =>
                c.chain_id === connectChainId
              ),
            }

            await provider.request(
              {
                method: 'wallet_addEthereumChain',
                params: provider_params,
              },
            )
          } catch (error) {}
        }
      }
    }
  }

  useEffect(() => {
    if (provider?.on) {
      const handleChainChanged = chainId => {
        if (!chainId) {
          disconnect()
        }
        else {
          connect()
        }
      }

      const handleAccountsChanged = accounts => {
        if (!_.head(accounts)) {
          disconnect()
        }
        else {
          dispatch(
            {
              type: WALLET_DATA,
              value: {
                address: _.head(accounts),
              },
            }
          )
        }
      }

      const handleDisconnect = e => {
        const {
          code,
        } = { ...e }

        disconnect(
          e,
          code === 1013,
        )

        if (code === 1013) {
          connect()
        }
      }

      provider.on(
        'chainChanged',
        handleChainChanged,
      )
      provider.on(
        'accountsChanged',
        handleAccountsChanged,
      )
      provider.on(
        'disconnect',
        handleDisconnect,
      )

      return () => {
        if (provider.removeListener) {
          provider.removeListener(
            'chainChanged',
            handleChainChanged,
          )
          provider.removeListener(
            'accountsChanged',
            handleAccountsChanged,
          )
          provider.removeListener(
            'disconnect',
            handleDisconnect,
          )
        }
      }
    }
  }, [provider, disconnect])

  return !hidden && (
    <>
      {web3_provider ?
        !mainController &&
        connectChainId &&
        connectChainId !== chain_id ?
          <button
            disabled={disabled}
            onClick={() => {
              switchChain()

              if (onSwitch) {
                onSwitch()
              }
            }}
            className={className}
          >
            {
              children ||
              (
                <div className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-2xl whitespace-nowrap uppercase text-slate-600 dark:text-slate-200 text-xs font-medium py-1.5 px-3">
                  Switch Network
                </div>
              )
            }
          </button> :
          <button
            disabled={disabled}
            onClick={disconnect}
            className={className}
          >
            {
              children ||
              (
                <div className="bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 rounded-2xl whitespace-nowrap uppercase text-red-500 dark:text-red-500 text-xs font-medium py-1.5 px-3">
                  Disconnect
                </div>
              )
            }
          </button> :
        <button
          disabled={disabled}
          onClick={connect}
          className={className}
        >
          {
            children ||
            (
              <div className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-2xl whitespace-nowrap uppercase text-white text-xs font-medium py-1.5 px-3">
                Connect Wallet
              </div>
            )
          }
        </button>
      }
    </>
  )
}