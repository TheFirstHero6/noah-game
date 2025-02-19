export type ResourceType = "wood" | "stone" | "food" | "ducats";

export interface ResourceUpdate {
  userId: string;
  resource: ResourceType;
  amount: number;
}

export interface TransferRequest {
  receiverId: string;
  resource: ResourceType;
  amount: number;
}
