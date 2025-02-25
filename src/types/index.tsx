export type ResourceType = "wood" | "stone" | "food" | "ducats";
export type User = {
  id: string;
  name: string;
  imageUrl: string;
};
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
