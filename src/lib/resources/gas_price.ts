import { providers } from "near-api-js";
import { Bundle, ZObject } from "zapier-platform-core";

import { createResource } from "../../types/resource";
import { OutputItem } from "../../types/operation";

export type BlockId = Parameters<providers.JsonRpcProvider["gasPrice"]>[0];

export interface GetGasPrice {
  block_id?: BlockId;
}

export interface GasPriceResult extends OutputItem {
  gas_price: string;
}

export async function performGet(
  z: ZObject,
  { inputData }: Bundle<GetGasPrice>
): Promise<GasPriceResult> {
  const rpc = new providers.JsonRpcProvider({
    url: "https://rpc.testnet.near.org",
  });

  z.console.log(
    `Getting gas price with input data: ${JSON.stringify(inputData)}`
  );

  const { gas_price } = await rpc.gasPrice(inputData.block_id || null);

  z.console.log(`Got gas price successfully`);

  return { id: new Date().toISOString(), gas_price };
}

export default createResource<GasPriceResult>({
  key: "gas_price",
  noun: "Gas Price",

  get: {
    display: {
      label: "Gas Price",
      description: "Gets gas price by block ID.",
    },
    operation: {
      inputFields: [{ key: "block_id" }],
      perform: performGet,
      sample: {
        id: "0",
        gas_price: "1",
      },
    },
  },
});