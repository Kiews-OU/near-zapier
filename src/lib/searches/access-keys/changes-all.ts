import { providers } from "near-api-js";
import { ChangeResult } from "near-api-js/lib/providers/provider";
import { Bundle, ZObject } from "zapier-platform-core";

import { OutputItem, createSearch } from "../../../types";
import {
  NetworkSelectField,
  WithNetworkSelection,
  getNetwork,
  WithBlockIDOrFinality,
  getBlockIDOrFinality,
  BlockIDOrFinalityField,
  WithAccountIdArray,
  AccountIdArrayField,
} from "../../common";

export interface ViewAccessKeysChangesInput
  extends WithNetworkSelection,
    WithAccountIdArray,
    WithBlockIDOrFinality {}

export interface ViewAccessKeysChangesResult extends ChangeResult, OutputItem {}

export const perform = async (
  z: ZObject,
  { inputData }: Bundle<ViewAccessKeysChangesInput>
): Promise<Array<ViewAccessKeysChangesResult>> => {
  const rpc = new providers.JsonRpcProvider({ url: getNetwork(inputData) });

  z.console.log(
    `Getting access keys' changes with input data: ${JSON.stringify(inputData)}`
  );

  const accessKeysChanges = await rpc.accessKeyChanges(
    inputData.accountIds,
    getBlockIDOrFinality(inputData)
  );

  z.console.log("Got access keys' changes successfully");

  return [{ id: new Date().toISOString(), ...accessKeysChanges }];
};

export default createSearch<
  ViewAccessKeysChangesInput,
  ViewAccessKeysChangesResult
>({
  key: "viewAccessKeyChangesAll",
  noun: "Access Key Changes (All)",
  display: {
    label: "View access key changes (all)",
    description:
      "Returns changes to all access keys of a specific block. Multiple accounts can be quereied by passing an array of account_ids.",
  },
  operation: {
    perform,
    inputFields: [
      NetworkSelectField,
      BlockIDOrFinalityField,
      AccountIdArrayField,
    ],
    sample: {
      id: "1",
      block_hash: "4kvqE1PsA6ic1LG7S5SqymSEhvjqGqumKjAxnVdNN3ZH",
      changes: [
        {
          cause: {
            type: "transaction_processing",
            tx_hash: "HshPyqddLxsganFxHHeH9LtkGekXDCuAt6axVgJLboXV",
          },
          type: "access_key_update",
          change: {
            account_id: "example-acct.testnet",
            public_key: "ed25519:25KEc7t7MQohAJ4EDThd2vkksKkwangnuJFzcoiXj9oM",
            access_key: {
              nonce: 1,
              permission: "FullAccess",
            },
          },
        },
        {
          cause: {
            type: "receipt_processing",
            receipt_hash: "CetXstu7bdqyUyweRqpY9op5U1Kqzd8pq8T1kqfcgBv2",
          },
          type: "access_key_update",
          change: {
            account_id: "example-acct.testnet",
            public_key: "ed25519:96pj2aVJH9njmAxakjvUMnNvdB3YUeSAMjbz9aRNU6XY",
            access_key: {
              nonce: 0,
              permission: "FullAccess",
            },
          },
        },
      ],
    },
  },
});