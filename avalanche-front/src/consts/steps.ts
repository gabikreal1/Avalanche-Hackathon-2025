import { ButtonAction } from "@/contexts/ButtonHandlerContext";
import { BlockType, Step } from "@/types/steps";

export const steps: Step[] = [
    {
      substeps: [
        {
          name: "Create a Subnet",
          blocks: [
            {
              type: BlockType.INPUT,
              heading: "Subnet Owner",
              placeholder: "P-avax16g4racxztww72ac5t2h5x5ywzf20jrcgvr8haw",
              key: "subnetOwner",
            },
            {
              type: BlockType.BUTTON,
              name: "Generate Subnet",
              value: ButtonAction.GENERATE_SUBNET,
            }
          ]
        },
        {
          name: "Create a Chain",
          blocks: [
            {
              type: BlockType.INPUT,
              heading: "Subnet ID",
              placeholder: "Create a Subnet in Step 1 or enter a SubnetID",
              key: "subnetId",
            },
            {
              type: BlockType.INPUT,
              heading: "Chain Name",
              placeholder: "Enter chain name",
              key: "chainName",
            },
            {
              type: BlockType.INPUT,
              heading: "VM ID",
              placeholder: "srEXiWaHuhNyGwPUi444Tu47ZEDwxTWrbQiuD7FmgSAQ6X7Dy",
              description: "For an L1 with an uncustomized EVM use srEXiWaHuhNyGwPUi444Tu47ZEDwxTWrbQiuD7FmgSAQ6X7Dy",
              canAskAI: true,
              key: "vmId",
            },
            {
              type: BlockType.BUTTON,
              name: "Create Chain",
              value: ButtonAction.CREATE_CHAIN,
            }
          ]
        }
      ]
    },
    {
      substeps: [
        {
          name: "Chain Parameters",
          blocks: [
            {
              type: BlockType.INPUT,
              heading: "EVM Chain ID",
              placeholder: "34257",
              key: "evmChainId",
            },
            {
              type: BlockType.BUTTON,
              name: "Validate Parameters",
              value: "VALIDATE_PARAMETERS"
            }
          ]
        },
      ]
    },
    {
      substeps: [
        {
          name: "Permissions",
          blocks: [
            {
              type: BlockType.RADIO,
              options: ["Anyone can deploy contracts.", "Only approved addresses can deploy contracts."],
              key: "permissions",
              subfields: [
                {
                  name: "Admin Addresses",
                  field: "admins" 
                },
                {
                  name: "Manager Addresses",
                  field: "members" 
                },
                {
                  name: "Enabled Addresses",
                  field: "enabledAddresses"
                }
              ]
            },
          ]
        },
      ]
    },
    {
      substeps: [
        {
          name: "Tokenomics",
          blocks: [
            {
              type: BlockType.INPUT,
              heading: "Amount",
              placeholder: "10000",
              key: "tokenAllocations",
            },
          ]
        },
      ]
    },
    {
      substeps: [
        {
          name: "Transaction Fees & Gas",
          blocks: [
            {
              type: BlockType.INPUT,
              heading: "Gas Limit",
              placeholder: "15000000",
              key: "gasLimit",
            },
            {
              type: BlockType.INPUT,
              heading: "Target Block Rate (seconds)",
              placeholder: "2",
              key: "targetBlockRate",
            },
            {
              type: BlockType.INPUT,
              heading: "Min Base Fee (gwei)",
              placeholder: "25",
              key: "minBaseFee",
            },
            {
              type: BlockType.INPUT,
              heading: "Base Fee Change Denominator",
              placeholder: "48",
              key: "baseFeeChangeDenominator",
            },
            {
              type: BlockType.INPUT,
              heading: "Min Block Gas Cost",
              placeholder: "0",
              key: "minBlockGasCost",
            },
            {
              type: BlockType.INPUT,
              heading: "Max Block Gas Cost",
              placeholder: "1000000",
              key: "maxBlockGasCost",
            },
            {
              type: BlockType.INPUT,
              heading: "Block Gas Cost Step",
              placeholder: "200000",
              key: "blockGasCostStep",
            },
            {
              type: BlockType.INPUT,
              heading: "Target Gas",
              placeholder: "15000000",
              key: "targetGas",
            },
          ]
        },
      ]
    },
  ];


export const steps2: Step[] = [
    {
      substeps: [
        {
          name: "Deploy Validator Manager contracts",
          blocks: [
            {
              type: BlockType.CODE,
              name:"",
              text: ["git clone git@github.com:suzaku-network/suzaku-deployer.git && suzaku-deployer", "forge install"],
            },
            {
              type: BlockType.CODE,
              name:"Create the following JSON file at <configs/mySuzakuL1.json>:",
              text: [
                "{",
                ` "proxyAddress": "0x0000000000000000000000000000000000000000",`,
                ` "validatorManagerOwnerAddress": "0x0000000000000000000000000000000000000000",`,
                ` "initialSecurityModuleMaxWeight": 0,`,
                ` "migratedValidations": [],`,
                ` "l1ID": "0x3cb97014ff27381387d35fbea2522ac5dfb4b5315f77a14fc2900f74e3207b8f",`,
                ` "churnPeriodSeconds": 3600,`,
                ` "maximumChurnPercentage": 20`,
                "}"
              ],
            },
            {
              type: BlockType.CODE,
              name:[
                `<l1ID> is the Chain ID from previous step, in can be converted form CB58 to Hex in the L1 Toolbox.`,
                `Only <l1ID>, <churnPeriodSeconds> and <maximumChurnPercentage> are used in this step.`],
              text: [
                `export PK=0x...`,
`export FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc`,
`export VERIFY_URL=https://api-testnet.snowscan.xyz/api`,
`export ETHERSCAN_API_KEY=your_snowscan_key...`,
`forge script script/l1/DeployPoAValidatorManager.s.sol --sig "run(string, uint256, uint256)" configs/mySuzakuL1.json $PK $PK --rpc-url fuji --broadcast --verify $VERIFY_URL --etherscan-api-key $ETHERSCAN_API_KEY`,
              ],
            },
            {
              type: BlockType.CODE,
              name:"<--verify> and <etherscan-api-key> can be omitted.",
              text: [
                "== Logs ==",
                " Deployed PoA proxy at: 0xfC39EeA8Bf30de48B0Ff9AB60799CAA555a6e3ab"
              ],
            },
          ]
        },
      ]
    },
  ];