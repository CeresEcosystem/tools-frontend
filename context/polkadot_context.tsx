/* eslint-disable no-unused-vars */
import { APP_NAME, POLKADOT_ACCOUNT, SORA_API } from '@constants/index';
import { ApiPromise, Keyring } from '@polkadot/api';
import { ApiOptions } from '@polkadot/api/types';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { WsProvider } from '@polkadot/rpc-provider/ws';
import { options } from '@sora-substrate/api';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface PolkadotContextType {
  api: ApiPromise | null;
  keyring: Keyring | null;
  loading: boolean;
  accounts: InjectedAccountWithMeta[] | null;
  selectedAccount: InjectedAccountWithMeta | null;
  saveSelectedAccount: (account: InjectedAccountWithMeta) => void;
  disconnect: () => void;
}

const PolkadotContext = createContext<PolkadotContextType | null>(null);

const PolkadotProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[] | null>(
    null
  );
  const [selectedAccount, setSelectedAccount] =
    useState<InjectedAccountWithMeta | null>(null);

  const api = useRef<ApiPromise | null>(null);
  const keyring = useRef<Keyring | null>(null);

  const saveSelectedAccount = useCallback(
    async (account: InjectedAccountWithMeta) => {
      if (account !== selectedAccount) {
        const acc = account as InjectedAccountWithMeta;
        localStorage.setItem(POLKADOT_ACCOUNT, JSON.stringify(account));
        setSelectedAccount(acc);
      }
    },
    [selectedAccount]
  );

  const setApi = useCallback(async () => {
    /** Connect to Sora network **/
    const provider = new WsProvider(SORA_API);

    const soraOptions = options({ provider });
    const apiOptions = new (soraOptions.constructor as {
      new (): ApiOptions;
    })();

    Object.assign(apiOptions, soraOptions);

    const soraAPI = new ApiPromise(apiOptions);

    await soraAPI.isReady;
    api.current = soraAPI;
  }, []);

  const connectToPolkadotExtension = useCallback(async () => {
    const accountJSON = localStorage.getItem(POLKADOT_ACCOUNT);
    const account = accountJSON ? JSON.parse(accountJSON) : null;

    // this call fires up the authorization popup
    const extensions = await web3Enable(APP_NAME);

    if (extensions.length !== 0) {
      // we are now informed that the user has at least one extension and that we
      // will be able to show and use accounts
      const allAccounts = await web3Accounts();

      if (allAccounts !== null && allAccounts.length > 0) {
        setAccounts(allAccounts);

        if (account !== null) {
          const accountsFiltered = allAccounts.filter(
            (acc) => acc?.meta?.name === account?.meta?.name
          );
          if (accountsFiltered.length > 0) {
            setSelectedAccount(account);
          }
        }
      }
    }
  }, []);

  const setKeyring = useCallback(async () => {
    keyring.current = new Keyring();
  }, []);

  const init = useCallback(async () => {
    await setApi();
    await connectToPolkadotExtension();
    await setKeyring();
    setLoading(false);
  }, [setApi, connectToPolkadotExtension, setKeyring]);

  const disconnect = useCallback(() => {
    localStorage.removeItem(POLKADOT_ACCOUNT);
    setSelectedAccount(null);
  }, []);

  useEffect(() => {
    init();

    return () => {
      api.current?.disconnect();
      api.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PolkadotContext.Provider
      value={{
        api: api.current,
        keyring: keyring.current,
        loading,
        accounts,
        selectedAccount,
        saveSelectedAccount,
        disconnect,
      }}
    >
      {children}
    </PolkadotContext.Provider>
  );
};

export default PolkadotProvider;

export const usePolkadot = () => useContext(PolkadotContext);
