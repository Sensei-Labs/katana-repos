import mongoose from 'mongoose';

export abstract class ModelInterface<Model = any> {
  private _model: mongoose.Model<Model>;

  protected constructor(model: mongoose.Model<Model>) {
    this._model = model;
  }

  public async findById(id: string) {
    return this._model.findById(id);
  }

  public async findOne<F = Partial<Model>>(filters: F) {
    return this._model.findOne(filters);
  }

  public async findAll<F>(filters: F) {
    return this._model.find(filters);
  }

  public async create<Payload>(payload: Payload) {
    return this._model.create(payload);
  }

  public async updateById<Payload>(id: string, payload: Payload) {
    return this._model.findByIdAndUpdate(id, payload, { new: true });
  }

  public async updateOne<Filter, Payload>(filter: Filter, payload: Payload) {
    return this._model.findOneAndUpdate(filter, payload, { new: true });
  }

  public async deleteById(id: string) {
    return this._model.findByIdAndDelete(id);
  }

  public async deleteOne<Filter>(filter: Filter) {
    return this._model.findOneAndDelete(filter);
  }
}
