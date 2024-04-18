export namespace CommandResponse {
  export type Insert = {
    readonly insertedIDNumber: number[];
    readonly insertedIDText: string[];
  };

  export type Update = {
    readonly modifiedCount: number;
  };

  export type Delete = {
    readonly deletedCount: number;
  };

  export type All = Insert & Update & Delete;
}
