import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useWallet } from "@meshsdk/react";
import { CardanoWallet } from "@meshsdk/react";

const Home: NextPage = () => {
  const { connected, wallet } = useWallet();
  const [tokenName, setTokenName] = useState<null | any>(null);
  const [policyID, setPolicyID] = useState<null | any>(null);
  const [message, setMessage] = useState<null | any>(null);
  const [colorMessage, setColorMessage] = useState<boolean>(true);

  async function searchToken() {
    if (connected) {
      try {
        const _assets = await wallet.getAssets();
        console.log(_assets);

        const filteredAsset = _assets.filter(
          (asset: { assetName: string; policyId: string }) =>
            asset.assetName === tokenName && asset.policyId === policyID
        );

        if (filteredAsset.length === 0) {
          setMessage("Token doesn't exist!");
          setColorMessage(false);
          return;
        } else {
          setMessage("Token found!");
          setColorMessage(true);
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
        setMessage("Error when connect wallet!");
        setColorMessage(false);
      }
    }
  }

  function handleTokenNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    const getTokenName = event.target.value;
    setTokenName(getTokenName);
  }

  function handlePolicyIDChange(event: React.ChangeEvent<HTMLInputElement>) {
    const getPolicyID = event.target.value;
    setPolicyID(getPolicyID);
  }

  useEffect(() => {
    setMessage(null);
  }, [connected]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border border-white rounded-2xl w-120">
        <h1 className="text-center font-bold text-3xl mt-4">Search Token</h1>
        {connected ? (
          <p className="text-center h-10 mt-2 text-green-500">
            Wallet connected
          </p>
        ) : (
          <p className="text-center h-10 mt-2 text-red-500">
            Please connect your wallet
          </p>
        )}
        {colorMessage ? (
          <p className="text-center h-10 text-green-500">{message}</p>
        ) : (
          <p className="text-center h-10 text-red-500">{message}</p>
        )}
        <div className="flex justify-center item-center mb-8">
          <CardanoWallet />
        </div>
        <div className="flex justify-center items-center mb-4">
          <label className="w-28">Token Name :</label>
          <input
            type="text"
            id="tokenName"
            name="tokenName"
            required
            className="pl-2 bg-gray-600"
            onChange={handleTokenNameChange}
          />
        </div>
        <div className="flex justify-center items-center mb-8">
          <label className="w-28">Policy ID :</label>
          <input
            type="text"
            id="policyID"
            name="policyID"
            required
            className="pl-2 bg-gray-600"
            onChange={handlePolicyIDChange}
          />
        </div>
        <div className="flex justify-center items-center mb-6">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-xl w-64 h-10"
            onClick={searchToken}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
