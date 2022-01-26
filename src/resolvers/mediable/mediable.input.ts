import { registerEnumType } from "type-graphql";

export enum MediableType {
  Collection = "Collection",
  Look = "Look",
  Material = "Material",
}

registerEnumType(MediableType, {
  name: "MediableType", // this one is mandatory
  description: "List of mediable types", // this one is optional
});
