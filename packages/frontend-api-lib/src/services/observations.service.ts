import {AxiosResponse} from "axios";
import {GET} from "./http.service";

export async function openObservations(params: Object
): Promise<AxiosResponse | unknown> {
  try {
    return (await GET('safety-observations?s={ "$and": [{"closingSignature": { "$isnull": true }}' + params + ']}'))
  } catch (e) {
    return e;
  }
}
