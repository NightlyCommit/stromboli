export class StromboliBinary {
  _name: string;
  _data: Buffer;
  _map: Buffer;

  /**
   * @param name {string}
   * @param data {Buffer}
   * @param map {Buffer}
   */
  constructor(name: string, data: Buffer, map: Buffer = null) {
    this._name = name;
    this._data = data;
    this._map = map;
  }

  /**
   * @return {string}
   */
  get name(): string {
    return this._name;
  }

  /**
   * @return {Buffer}
   */
  get data(): Buffer {
    return this._data;
  }

  /**
   * @return {Buffer}
   */
  get map(): Buffer {
    return this._map;
  }
}