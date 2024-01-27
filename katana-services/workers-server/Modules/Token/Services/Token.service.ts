import TokenModel, { IToken } from '../Models/Token.model';
import { ModelInterface } from '../../../Interfaces/Model.interface';

export class TokenService extends ModelInterface<IToken> {
  constructor() {
    super(TokenModel);
  }
}
