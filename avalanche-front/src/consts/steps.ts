import { BlockType } from "@/types/steps";

export const steps = [
    {
      substeps: [
        {
          name: "Create a Subnet",
          blocks: [
            {
              type: BlockType.INPUT,
              heading: "Subnet Owner",
              placeholder: "P-avax16g4racxztww72ac5t2h5x5ywzf20jrcgvr8haw"
            },
            {
              type: BlockType.BUTTON,
              name: "Generate Subnet",
              value: "GENERATE_SUBNET"
            }
          ]
        },
        {
          name: "Create a Chain",
          blocks: [
            {
              type: BlockType.INPUT,
              heading: "Subnet ID",
              placeholder: "Create a Subnet in Step 1 or enter a SubnetID"
            },
            {
              type: BlockType.INPUT,
              heading: "Chain Name",
              placeholder: "Enter chain name"
            },
            {
              type: BlockType.INPUT,
              heading: "VM ID",
              placeholder: "srEXiWaHuhNyGwPUi444Tu47ZEDwxTWrbQiuD7FmgSAQ6X7Dy",
              description: "For an L1 with an uncustomized EVM use srEXiWaHuhNyGwPUi444Tu47ZEDwxTWrbQiuD7FmgSAQ6X7Dy",
              canAskAI: true
            },
            {
              type: BlockType.BUTTON,
              name: "Create Chain",
              value: "CREATE_CHAIN"
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
              placeholder: "34257"
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
              placeholder: "10000"
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
              placeholder: "15000000"
            },
            {
              type: BlockType.INPUT,
              heading: "Target Block Rate (seconds)",
              placeholder: "2"
            },
            {
              type: BlockType.INPUT,
              heading: "Min Base Fee (gwei)",
              placeholder: "25"
            },
            {
              type: BlockType.INPUT,
              heading: "Base Fee Change Denominator",
              placeholder: "48"
            },
            {
              type: BlockType.INPUT,
              heading: "Min Block Gas Cost",
              placeholder: "0"
            },
            {
              type: BlockType.INPUT,
              heading: "Max Block Gas Cost",
              placeholder: "1000000"
            },
            {
              type: BlockType.INPUT,
              heading: "Block Gas Cost Step",
              placeholder: "200000"
            },
            {
              type: BlockType.INPUT,
              heading: "Target Gas",
              placeholder: "15000000"
            },
          ]
        },
      ]
    },
  ];