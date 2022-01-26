import { Inject, Service } from "typedi";
import { MyContext } from "src/types";

@Service()
export class MediableService {
  @Inject("context")
  private readonly context: MyContext;

  init() {
    console.log(this.context);
  }
}
