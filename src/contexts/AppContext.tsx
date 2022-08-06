import { HashConnectSigner } from "hashconnect/dist/provider/signer";
import React, { createContext, ReactNode, SetStateAction, useState } from "react";
import { AppCtxType, UserDataType } from "../types";

const initContext: AppCtxType = {
  userData: {
    userAcc: "",
    hbarBal: "",
    tokenBal: 0,
  },
  setUserData: (uData: SetStateAction<UserDataType>) => {},
  HPsigner: null,
  setHPsigner: (sig: SetStateAction<HashConnectSigner | null>) => {},
  isMobileLink: false,
  setIsMobileLink: (isLinked: SetStateAction<boolean>) => {},
};

export const AppCxt = createContext<AppCtxType>(initContext);

interface AppContextProps {
  children: ReactNode;
}

const AppContext = ({ children }: AppContextProps) => {
  const [userData, setUserData] = useState<UserDataType>(initContext.userData);
  const [HPsigner, setHPsigner] = useState<HashConnectSigner | null>(null);
  const [isMobileLink, setIsMobileLink] = useState(false);

  return (
    <AppCxt.Provider value={{ userData, setUserData, HPsigner, setHPsigner, isMobileLink, setIsMobileLink }}>
      {children}
    </AppCxt.Provider>
  );
};

export default AppContext;
