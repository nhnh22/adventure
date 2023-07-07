// import {
//   Connection,
//   PublicKey,
//   SendOptions,
//   Signer,
//   Transaction,
//   TransactionSignature,
//   VersionedTransaction,
// } from '@solana/web3.js'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { decode, encode } from 'bs58'

// original code by nelsontky
// https://github.com/nelsontky/web3-plays-pokemon/blob/main/others/xnft/src/contexts/XnftProvider.tsx

interface BackpackWallet {
  isBackpack?: boolean
  publicKey: any
  isConnected: boolean
  signTransaction(transaction: any, publicKey?: any): Promise<any>
  signAllTransactions(transactions: any, publicKey?: any): Promise<any>
  send(transaction: any, signers?: any, options?: any, connection?: any, publicKey?: any): Promise<any>
  signMessage(message: Uint8Array, publicKey?: any | null): Promise<Uint8Array>
  connect(): Promise<void>
  disconnect(): Promise<void>
}

interface XnftContextState {
  backpack: BackpackWallet
  setAppIframeElement: React.Dispatch<React.SetStateAction<HTMLIFrameElement | undefined>>
}

const XnftContext = createContext<XnftContextState>({} as XnftContextState)

interface XnftContextProviderProps {
  children: ReactNode
}

export const IFRAME_ORIGIN = 'http://localhost:9000'

export default function XnftContextProvider({ children }: XnftContextProviderProps) {
  const [backpack, setBackpack] = useState<BackpackWallet | undefined>()
  const [appIframeElement, setAppIframeElement] = useState<HTMLIFrameElement>()

  useEffect(function pollXnft() {
    function checkXnft() {
      const solana = window.xnft?.solana
      if (solana?.publicKey) {
        setBackpack(solana)
        return
      } else {
        setTimeout(checkXnft, 100)
      }
    }
    checkXnft()
  }, [])

  useEffect(() => {
    const contentWindow = appIframeElement?.contentWindow

    const listener = async (event: MessageEvent<any>) => {
      // if (event.origin !== IFRAME_ORIGIN) {
      //   throw new Error(`Invalid origin ${event.origin}, expecting ${IFRAME_ORIGIN}`)
      // }

      if (!backpack || !contentWindow) return
      const { action, payload } = JSON.parse(event.data)

      switch (action) {
        case 'publicKey':
          {
            contentWindow.postMessage(
              JSON.stringify({
                success: true,
                payload: backpack.publicKey.toBase58(),
              }),
              IFRAME_ORIGIN,
            )
          }
          break
        case 'signMessage':
          try {
            const signedMessage = await backpack.signMessage(decode(payload))
            contentWindow.postMessage(
              JSON.stringify({
                success: true,
                payload: encode(signedMessage),
              }),
              IFRAME_ORIGIN,
            )
          } catch (e) {
            if (e instanceof Error) {
              contentWindow.postMessage(
                JSON.stringify({
                  success: false,
                  payload: e.message, // 'An error has occurred. Please try again.',
                }),
                IFRAME_ORIGIN,
              )
            }
          }
          break
        // case 'signTransaction':
        //   try {
        //     const signedTransaction = await backpack.signTransaction(Transaction.from(decode(payload)))
        //     contentWindow.postMessage(
        //       JSON.stringify({
        //         success: true,
        //         payload: encode(Uint8Array.from(signedTransaction.serialize())),
        //       }),
        //       IFRAME_ORIGIN,
        //     )
        //   } catch (e) {
        //     if (e instanceof Error) {
        //       contentWindow.postMessage(
        //         JSON.stringify({
        //           success: false,
        //           payload: /*e.message*/ 'An error has occurred. Please try again.',
        //         }),
        //         IFRAME_ORIGIN,
        //       )
        //     }
        //   }
        //   break
      }
    }
    window.addEventListener('message', listener)

    return () => {
      window.removeEventListener('message', listener)
    }
  }, [backpack, appIframeElement])

  if (!backpack) {
    return null
  }

  return (
    <XnftContext.Provider
      value={{
        backpack,
        setAppIframeElement,
      }}>
      {children}
    </XnftContext.Provider>
  )
}

export const useXnft = () => useContext(XnftContext)
